import { State } from './State';
import { IImageConnection } from './IImageConnection';
import { ImageConnectionConfig } from './ImageConnectionConfig';

export abstract class AbstractImageConnection implements IImageConnection {
    public abstract setState(state: State): void;
    public abstract connectionAdditionalInfo(): string;

    constructor(private config: ImageConnectionConfig) {}
    public get AtemImputNumber(): number {
        return this.config.AtemInputNumber;
    }
}
