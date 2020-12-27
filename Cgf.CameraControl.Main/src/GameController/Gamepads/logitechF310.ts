import { JoyStickValue } from './JoyStickValue';
import { IGamePad, IGamepadEvents } from './IGamePad';
import { EventEmitter } from 'events';
import StrictEventEmitter from 'strict-event-emitter-types';
import { GamepadHelper } from './GamepadHelper';

const Gamepad = require('node-gamepad');

export class logitechF310 implements IGamePad {
    keypadEvents$: StrictEventEmitter<EventEmitter, IGamepadEvents> = new EventEmitter();

    constructor(padSerialNumber?: string) {
        let pad = new Gamepad('logitech/gamepadf310', { serialNumber: padSerialNumber });

        let gamepadWrapper = new GamepadHelper(this.keypadEvents$);

        pad.on('left:move', (value: JoyStickValue) => gamepadWrapper.leftJoystickMove(value));
        pad.on('right:move', (value: JoyStickValue) => gamepadWrapper.rightJoystickMove(value));

        pad.on('dpadLeft:press', () => gamepadWrapper.leftKeyPress());
        pad.on('dpadUp:press', () => gamepadWrapper.upKeyPress());
        pad.on('dpadRight:press', () => gamepadWrapper.rightKeyPress());
        pad.on('dpadDown:press', () => gamepadWrapper.downkeypress());

        pad.on('RB:press', () => gamepadWrapper.cutKeyPress());
        pad.on('RT:press', () => gamepadWrapper.autoKeyPress());

        pad.on('LB:press', () => gamepadWrapper.altUpperKeyPress());
        pad.on('LB:release', () => gamepadWrapper.altUpperKeyRelease());
        pad.on('LT:press', () => gamepadWrapper.altLowerKeyPress());
        pad.on('LT:release', () => gamepadWrapper.altLowerKeyRelease());

        pad.on('A:press', () => gamepadWrapper.specialFunctionDownKeyPress());
        pad.on('B:press', () => gamepadWrapper.specialFunctionRightKeyPress());
        pad.on('X:press', () => gamepadWrapper.specialFunctionLeftKeyPress());
        pad.on('Y:press', () => gamepadWrapper.specialFunctionUpKeyPress());

        pad.connect();
    }

    rumble(): void {
        // This Gamepad does not provide rumbling - hence left empty
    }
}
