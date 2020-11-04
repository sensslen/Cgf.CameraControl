import StrictEventEmitter from 'strict-event-emitter-types';
import { EventEmitter } from 'events';

export enum InputChangeDirection {
    up = 'up',
    down = 'down',
    left = 'left',
    right = 'right',
}

export enum AlternateInputChangeDirection {
    none,
    alt,
}

export interface IGamepadEvents {
    pan(value: number): void;
    tilt(value: number): void;
    zoom(value: number): void;
    focus(value: number): void;
    inputChange(direction: InputChangeDirection, altKey: AlternateInputChangeDirection): void;
    cut(): void;
    auto(): void;
    keyToggle(keyIndex: number): void;
}

export interface IGamePad {
    readonly keypadEvents$: StrictEventEmitter<EventEmitter, IGamepadEvents>;
    rumble(): void;
}
