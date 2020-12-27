import { JoyStickValue } from './JoyStickValue';
import { IGamePad, IGamepadEvents } from './IGamePad';
import { EventEmitter } from 'events';
import StrictEventEmitter from 'strict-event-emitter-types';
import { GamepadHelper } from './GamepadHelper';

const Gamepad = require('node-gamepad');

export class dualshock4 implements IGamePad {
    private pad: any;

    keypadEvents$: StrictEventEmitter<EventEmitter, IGamepadEvents> = new EventEmitter();

    constructor(padSerialNumber?: string) {
        this.pad = new Gamepad('ps4/dualshock4', { serialNumber: padSerialNumber });

        let gamepadWrapper = new GamepadHelper(this.keypadEvents$);

        this.pad.on('left:move', (value: JoyStickValue) => gamepadWrapper.leftJoystickMove(value));
        this.pad.on('right:move', (value: JoyStickValue) => gamepadWrapper.rightJoystickMove(value));

        this.pad.on('dpadLeft:press', () => gamepadWrapper.leftKeyPress());
        this.pad.on('dpadUp:press', () => gamepadWrapper.upKeyPress());
        this.pad.on('dpadRight:press', () => gamepadWrapper.rightKeyPress());
        this.pad.on('dpadDown:press', () => gamepadWrapper.downkeypress());

        this.pad.on('r1:press', () => gamepadWrapper.cutKeyPress());
        this.pad.on('r2:press', () => gamepadWrapper.autoKeyPress());

        this.pad.on('l1:press', () => gamepadWrapper.altUpperKeyPress());
        this.pad.on('l1:release', () => gamepadWrapper.altUpperKeyRelease());
        this.pad.on('l2:press', () => gamepadWrapper.altLowerKeyPress());
        this.pad.on('l2:release', () => gamepadWrapper.altLowerKeyRelease());

        this.pad.on('x:press', () => gamepadWrapper.specialFunctionDownKeyPress());
        this.pad.on('circle:press', () => gamepadWrapper.specialFunctionRightKeyPress());
        this.pad.on('square:press', () => gamepadWrapper.specialFunctionLeftKeyPress());
        this.pad.on('triangle:press', () => gamepadWrapper.specialFunctionUpKeyPress());

        this.pad.connect();
    }

    rumble(): void {
        this.pad.rumble(200);
    }
}
