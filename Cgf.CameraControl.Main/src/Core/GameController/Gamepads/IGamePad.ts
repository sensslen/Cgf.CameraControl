import StrictEventEmitter from 'strict-event-emitter-types';
import { EventEmitter } from 'events';

export enum InputChangeDirection {
    up = 'up',
    down = 'down',
    left = 'left',
    right = 'right',
}

export enum SpecialFunctionKey {
    a = 'A',
    b = 'B',
    x = 'X',
    y = 'Y',
}

export enum AltKeyState {
    none,
    altKeyUpper,
    altKeyLower,
}

export interface IGamepadEvents {
    pan(value: number): void;
    tilt(value: number): void;
    zoom(value: number): void;
    focus(value: number): void;
    inputChange(direction: InputChangeDirection, altKey: AltKeyState): void;
    specialFunction(keyIndex: SpecialFunctionKey, altKey: AltKeyState): void;
    cut(): void;
    auto(): void;
}

export interface IGamePad {
    dispose(): void;
    readonly keypadEvents$: StrictEventEmitter<EventEmitter, IGamepadEvents>;
    rumble(): void;
}
