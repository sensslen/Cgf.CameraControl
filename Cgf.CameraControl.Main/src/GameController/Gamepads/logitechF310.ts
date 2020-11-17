import { JoyStickValue } from './JoyStickValue';
import { IGamePad, IGamepadEvents } from './IGamePad';
import { EventEmitter } from 'events';
import StrictEventEmitter from 'strict-event-emitter-types';
import { GamepadHelper } from './GamepadHelper';

const Gamepad = require('node-gamepad');

export class logitechF310 implements IGamePad {
    private pad: any;

    keypadEvents$: StrictEventEmitter<EventEmitter, IGamepadEvents> = new EventEmitter();

    constructor(padSerialNumber?: string) {
        this.pad = new Gamepad('logitech/gamepadf310', { serialNumber: padSerialNumber });

        let gamepadWrapper = new GamepadHelper(this.keypadEvents$);

        this.pad.on('left:move', (value: JoyStickValue) => gamepadWrapper.leftJoystickMove(value));
        this.pad.on('right:move', (value: JoyStickValue) => gamepadWrapper.rightJoystickMove(value));

        this.pad.on('dpadLeft:press', () => gamepadWrapper.leftKeyPress());
        this.pad.on('dpadUp:press', () => gamepadWrapper.upKeyPress());
        this.pad.on('dpadRight:press', () => gamepadWrapper.rightKeyPress());
        this.pad.on('dpadDown:press', () => gamepadWrapper.downkeypress());

        this.pad.on('RB:press', () => gamepadWrapper.cutKeyPress());
        this.pad.on('RT:press', () => gamepadWrapper.autoKeyPress());

        this.pad.on('LB:press', () => gamepadWrapper.altUpperKeyPress());
        this.pad.on('LB:release', () => gamepadWrapper.altUpperKeyRelease());
        this.pad.on('LT:press', () => gamepadWrapper.altLowerKeyPress());
        this.pad.on('LT:release', () => gamepadWrapper.altLowerKeyRelease());

        this.pad.on('A:press', () => gamepadWrapper.aKeyPress());
        this.pad.on('B:press', () => gamepadWrapper.bKeyPress());

        this.pad.connect();
    }

    rumble(): void {
        // This Gamepad does not provide rumbling - hence left empty
    }
}
