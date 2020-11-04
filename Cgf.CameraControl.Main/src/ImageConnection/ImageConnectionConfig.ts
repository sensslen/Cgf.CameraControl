import { InputChangeDirection } from '../GameController/Gamepads/IGamePad';

export interface ImageConnectionConfig {
    AtemInputNumber: number;
    ConnectionChangeDefinition: { [key in InputChangeDirection]: number };
    AltConnectionChangeDefinition?: { [key in InputChangeDirection]: number };
}
