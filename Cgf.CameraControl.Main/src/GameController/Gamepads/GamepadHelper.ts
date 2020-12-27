import { JoyStickValue } from './JoyStickValue';
import { AltKeyState, IGamepadEvents, InputChangeDirection, SpecialFunctionKey } from './IGamePad';
import { EventEmitter } from 'events';
import StrictEventEmitter from 'strict-event-emitter-types';

const interpolate = require('everpolate').linear;

export class GamepadHelper {
    private altkeyState: AltKeyState = AltKeyState.none;
    private readonly moveInterpolation: number[][] = [
        [0, 63, 31, 127, 128, 160, 172, 255],
        [255, 70, 20, 0, 0, -20, -70, -255],
    ];

    constructor(private keypadEvents$: StrictEventEmitter<EventEmitter, IGamepadEvents>) {}

    public leftJoystickMove(value: JoyStickValue) {
        let pan = interpolate(value.x, this.moveInterpolation[0], this.moveInterpolation[1])[0];
        this.keypadEvents$.emit('pan', Math.round(pan));
        let tilt = -interpolate(value.y, this.moveInterpolation[0], this.moveInterpolation[1])[0];
        this.keypadEvents$.emit('tilt', Math.round(tilt));
    }

    public rightJoystickMove(value: JoyStickValue) {
        this.keypadEvents$.emit('zoom', Math.round((-value.y + 127) / 16));
        this.keypadEvents$.emit('focus', Math.round((value.x - 127) / 200));
    }

    public leftKeyPress() {
        this.keypadEvents$.emit('inputChange', InputChangeDirection.left, this.altkeyState);
    }

    public upKeyPress() {
        this.keypadEvents$.emit('inputChange', InputChangeDirection.up, this.altkeyState);
    }

    public rightKeyPress() {
        this.keypadEvents$.emit('inputChange', InputChangeDirection.right, this.altkeyState);
    }

    public downkeypress() {
        this.keypadEvents$.emit('inputChange', InputChangeDirection.down, this.altkeyState);
    }

    public cutKeyPress() {
        this.keypadEvents$.emit('cut');
    }

    public autoKeyPress() {
        this.keypadEvents$.emit('auto');
    }

    public altUpperKeyPress() {
        if (this.altkeyState == AltKeyState.none) {
            this.altkeyState = AltKeyState.altKeyUpper;
        }
    }

    public altUpperKeyRelease() {
        if (this.altkeyState == AltKeyState.altKeyUpper) {
            this.altkeyState = AltKeyState.none;
        }
    }

    public altLowerKeyPress() {
        if (this.altkeyState == AltKeyState.none) {
            this.altkeyState = AltKeyState.altKeyLower;
        }
    }

    public altLowerKeyRelease() {
        if (this.altkeyState == AltKeyState.altKeyLower) {
            this.altkeyState = AltKeyState.none;
        }
    }

    public specialFunctionDownKeyPress() {
        this.keypadEvents$.emit('specialFunction', SpecialFunctionKey.down, this.altkeyState);
    }

    public specialFunctionRightKeyPress() {
        this.keypadEvents$.emit('specialFunction', SpecialFunctionKey.right, this.altkeyState);
    }

    specialFunctionUpKeyPress() {
        this.keypadEvents$.emit('specialFunction', SpecialFunctionKey.up, this.altkeyState);
    }
    specialFunctionLeftKeyPress() {
        this.keypadEvents$.emit('specialFunction', SpecialFunctionKey.left, this.altkeyState);
    }
}
