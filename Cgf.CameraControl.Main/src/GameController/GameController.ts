import { ImageConnectionFactory } from '../ImageConnection/ImageConnectionFactory';
import { State } from '../State';
import { ESpecialFunctionType, IControllerConfig, ISpecialFunctionKey } from './IControllerConfig';
import { AtemConnection } from '../AtemConnection/AtemConnection';
import { IImageConnection } from '../ImageConnection/IImageConnection';
import { GamepadFactory } from './Gamepads/GamepadFactory';
import { AltKeyState, IGamePad, InputChangeDirection, SpecialFunctionKey } from './Gamepads/IGamePad';

class InternalImageConnection {
    constructor(
        public readonly connection: IImageConnection,
        public readonly connectionChangeDefinition: {
            [key in InputChangeDirection]: number;
        },
        public readonly alternateUpperKeyConnectionChangeDefinition?: {
            [key in InputChangeDirection]: number;
        },
        public readonly alternateLowerKeyConnectionChangeDefinition?: {
            [key in InputChangeDirection]: number;
        }
    ) {}
}

class SpecialFunctionKeySpec {
    constructor(
        public readonly SpecialFunctions: { [key in SpecialFunctionKey]: ISpecialFunctionKey },
        public readonly AltSpecialFunctions?: { [key in SpecialFunctionKey]: ISpecialFunctionKey },
        public readonly AltLowerSpecialFunctions?: { [key in SpecialFunctionKey]: ISpecialFunctionKey }
    ) {}
}

export class GameController {
    private _state: State;
    private readonly _imageConnections: Array<InternalImageConnection> = [];
    private _currentCameraConnection?: InternalImageConnection;
    private _atemMixEffectBlock: number;
    private _pad: IGamePad;
    private readonly _specialFunctionKeys: SpecialFunctionKeySpec;

    constructor(config: IControllerConfig, private atem: AtemConnection) {
        this._state = new State();

        this._pad = GamepadFactory.getGamepad(config);
        this.connectGamepad(config);

        config.ImageConnections.forEach((c) => {
            this._imageConnections.push(
                new InternalImageConnection(
                    ImageConnectionFactory.GetImageConnection(c),
                    c.ConnectionChangeDefinition,
                    c.AltConnectionChangeDefinition,
                    c.AltLowerConnectionChangeDefinition
                )
            );
        });

        this._specialFunctionKeys = new SpecialFunctionKeySpec(
            config.SpecialFunctions,
            config.AltSpecialFunctions,
            config.AltLowerSpecialFunctions
        );

        this._atemMixEffectBlock = config.AtemMixEffectBlock;
        this.atem
            .previewStateUpdateEmitterGet(this._atemMixEffectBlock)
            .on('previewUpdate', (preview: number, isOnAir: boolean) =>
                this.selectedConnectionChanged(preview, isOnAir)
            );
    }

    private connectGamepad(config: IControllerConfig) {
        this._pad.keypadEvents$.on('pan', (pan) => {
            this._state.pan = pan;
            this._currentCameraConnection?.connection.setState(this._state);
        });

        this._pad.keypadEvents$.on('tilt', (tilt) => {
            this._state.tilt = tilt;
            this._currentCameraConnection?.connection.setState(this._state);
        });

        this._pad.keypadEvents$.on('zoom', (zoom) => {
            this._state.zoom = zoom;
            this._currentCameraConnection?.connection.setState(this._state);
        });

        this._pad.keypadEvents$.on('focus', (focus) => {
            this._state.focus = focus;
            this._currentCameraConnection?.connection.setState(this._state);
        });

        this._pad.keypadEvents$.on('inputChange', (direction, alternation) => {
            this.changeConnection(direction, alternation);
        });

        this._pad.keypadEvents$.on('cut', () => {
            this.atem.cut(config.AtemMixEffectBlock);
        });

        this._pad.keypadEvents$.on('auto', () => {
            this.atem.auto(config.AtemMixEffectBlock);
        });

        this._pad.keypadEvents$.on('specialFunction', (key, alternation) => {
            this.processSpecialFunction(key, alternation);
        });
    }

    changeConnection(direction: InputChangeDirection, alternation: AltKeyState) {
        let next: number | undefined = undefined;
        if (this._currentCameraConnection) {
            switch (alternation) {
                case AltKeyState.altKeyUpper:
                    if (this._currentCameraConnection.alternateUpperKeyConnectionChangeDefinition) {
                        next = this._currentCameraConnection.alternateUpperKeyConnectionChangeDefinition[direction];
                    } else {
                        next = this._currentCameraConnection.connectionChangeDefinition[direction];
                    }
                    break;
                case AltKeyState.altKeyLower:
                    if (this._currentCameraConnection.alternateLowerKeyConnectionChangeDefinition) {
                        next = this._currentCameraConnection.alternateLowerKeyConnectionChangeDefinition[direction];
                    } else {
                        next = this._currentCameraConnection.connectionChangeDefinition[direction];
                    }
                    break;
                default:
                    next = this._currentCameraConnection.connectionChangeDefinition[direction];
                    break;
            }
        } else {
            // select first connection if chrrent connection is not defined
            // (used to be sure to be able to change even though the current input in not specified)
            next = this._imageConnections[0]?.connection.AtemImputNumber;
        }

        if (next) {
            this._currentCameraConnection?.connection.setState(new State());
            this.atem.changePreview(this._atemMixEffectBlock, next);
        }
    }

    processSpecialFunction(key: SpecialFunctionKey, alternation: AltKeyState) {
        let execute: ISpecialFunctionKey | undefined = undefined;
        switch (alternation) {
            case AltKeyState.altKeyUpper:
                if (this._specialFunctionKeys.AltSpecialFunctions) {
                    execute = this._specialFunctionKeys.AltSpecialFunctions[key];
                } else {
                    execute = this._specialFunctionKeys.SpecialFunctions[key];
                }
                break;
            case AltKeyState.altKeyLower:
                if (this._specialFunctionKeys.AltLowerSpecialFunctions) {
                    execute = this._specialFunctionKeys.AltLowerSpecialFunctions[key];
                } else {
                    execute = this._specialFunctionKeys.SpecialFunctions[key];
                }
                break;
            default:
                execute = this._specialFunctionKeys.SpecialFunctions[key];
                break;
        }
        if (execute) {
            switch (execute.Type) {
                case ESpecialFunctionType.key:
                    this.atem.toggleKey(execute.Index, this._atemMixEffectBlock);
                    break;
                case ESpecialFunctionType.macro:
                    this.atem.executeMacro(execute.Index);
                    break;
                default:
                    break;
            }
        }
    }

    selectedConnectionChanged(preview: number, isOnAir: boolean): void {
        if (this._currentCameraConnection !== undefined) {
            if (this._currentCameraConnection.connection.AtemImputNumber === preview) {
                return;
            }
        }

        this._currentCameraConnection = undefined;
        this._imageConnections.forEach((imageConnection) => {
            if (imageConnection.connection.AtemImputNumber === preview) {
                this._currentCameraConnection = imageConnection;
                if (isOnAir) {
                    this._pad.rumble();
                }
            }
        });
        this.printConnection(isOnAir);
    }

    printConnection(isOnAir: boolean) {
        if (this._currentCameraConnection !== undefined) {
            let additionalInfo = this._currentCameraConnection.connection.connectionAdditionalInfo();
            console.log(
                `${this._currentCameraConnection.connection.AtemImputNumber} - ${this.atem.nameGet(
                    this._currentCameraConnection.connection.AtemImputNumber
                )}${additionalInfo ? `(${additionalInfo})` : ''} ${isOnAir ? ' - onAir' : ''}`
            );
        } else {
            console.log('Input selected that is not managed with this application');
        }
    }

    mod(n: number, m: number) {
        return ((n % m) + m) % m;
    }
}
