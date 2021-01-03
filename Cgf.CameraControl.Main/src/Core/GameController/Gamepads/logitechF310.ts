import { JoyStickValue } from './node-gamepad-port/JoyStickValue';
import { AltKeyState, IGamePad, IGamepadEvents, InputChangeDirection, SpecialFunctionKey } from './IGamePad';
import { EventEmitter } from 'events';
import StrictEventEmitter from 'strict-event-emitter-types';
import * as gamepadConfig from './node-gamepad-port/controllers/logitech/gamepadf310.json';
import { INodeGamepadConfig, NodeGamepad } from './node-gamepad-port/NodeGamepad';
import { ILogger } from '../../Logging/ILogger';

const interpolate = require('everpolate').linear;

export class logitechF310 implements IGamePad {
    private readonly pad: NodeGamepad;
    private altkeyState: AltKeyState = AltKeyState.none;
    private readonly moveInterpolation: number[][] = [
        [0, 63, 31, 127, 128, 160, 172, 255],
        [255, 70, 20, 0, 0, -20, -70, -255],
    ];

    keypadEvents$: StrictEventEmitter<EventEmitter, IGamepadEvents> = new EventEmitter();

    constructor(logger?: ILogger, padSerialNumber?: string) {
        let padConfig = gamepadConfig as INodeGamepadConfig;
        if (padSerialNumber) {
            padConfig.serialNumber = padSerialNumber;
        }
        this.pad = new NodeGamepad(padConfig, logger);

        this.pad.on('left:move', (value: JoyStickValue) => {
            let pan = interpolate(value.x, this.moveInterpolation[0], this.moveInterpolation[1])[0];
            this.keypadEvents$.emit('pan', Math.round(pan));
            let tilt = -interpolate(value.y, this.moveInterpolation[0], this.moveInterpolation[1])[0];
            this.keypadEvents$.emit('tilt', Math.round(tilt));
        });

        this.pad.on('right:move', (value: JoyStickValue) => {
            this.keypadEvents$.emit('zoom', Math.round((-value.y + 127) / 16));
            this.keypadEvents$.emit('focus', Math.round((value.x - 127) / 200));
        });

        this.pad.on('dpadLeft:press', () => {
            this.keypadEvents$.emit('inputChange', InputChangeDirection.left, this.altkeyState);
        });

        this.pad.on('dpadUp:press', () => {
            this.keypadEvents$.emit('inputChange', InputChangeDirection.up, this.altkeyState);
        });

        this.pad.on('dpadRight:press', () => {
            this.keypadEvents$.emit('inputChange', InputChangeDirection.right, this.altkeyState);
        });

        this.pad.on('dpadDown:press', () => {
            this.keypadEvents$.emit('inputChange', InputChangeDirection.down, this.altkeyState);
        });

        this.pad.on('RB:press', () => {
            this.keypadEvents$.emit('cut');
        });

        this.pad.on('RT:press', () => {
            this.keypadEvents$.emit('auto');
        });

        this.pad.on('LB:press', () => {
            if (this.altkeyState == AltKeyState.none) {
                this.altkeyState = AltKeyState.altKeyUpper;
            }
        });

        this.pad.on('LB:release', () => {
            if (this.altkeyState == AltKeyState.altKeyUpper) {
                this.altkeyState = AltKeyState.none;
            }
        });

        this.pad.on('LT:press', () => {
            if (this.altkeyState == AltKeyState.none) {
                this.altkeyState = AltKeyState.altKeyLower;
            }
        });

        this.pad.on('LT:release', () => {
            if (this.altkeyState == AltKeyState.altKeyLower) {
                this.altkeyState = AltKeyState.none;
            }
        });

        this.pad.on('A:press', () => {
            this.keypadEvents$.emit('specialFunction', SpecialFunctionKey.a, this.altkeyState);
        });

        this.pad.on('B:press', () => {
            this.keypadEvents$.emit('specialFunction', SpecialFunctionKey.b, this.altkeyState);
        });

        this.pad.on('X:press', () => {
            this.keypadEvents$.emit('specialFunction', SpecialFunctionKey.x, this.altkeyState);
        });

        this.pad.on('Y:press', () => {
            this.keypadEvents$.emit('specialFunction', SpecialFunctionKey.y, this.altkeyState);
        });

        this.pad.start();
    }

    dispose() {
        this.pad.stop();
    }

    rumble(): void {
        // This Gamepad does not provide rumbling - hence left empty
    }
}
