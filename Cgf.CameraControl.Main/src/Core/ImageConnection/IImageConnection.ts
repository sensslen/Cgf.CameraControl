import { State } from './State';

export interface IImageConnection {
    setState(state: State): void;
    connectionAdditionalInfo(): string;

    readonly AtemImputNumber: number;
}
