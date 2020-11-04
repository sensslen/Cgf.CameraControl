import { ImageConnectionConfig } from '../ImageConnection/ImageConnectionConfig';

export interface IControllerConfig {
    ControllerType: string;
    AtemMixEffectBlock: number;
    AtemToggleKeyIndexes: Array<number>;
    ImageConnections: Array<ImageConnectionConfig>;
}
