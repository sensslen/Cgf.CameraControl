import { AtemConnectionConfig } from '../AtemConnection/AtemConnectionConfig';
import { IControllerConfig } from '../GameController/IControllerConfig';

export interface IInternalGameControllerConfig extends IControllerConfig {
    AtemConnection: string;
}

export interface IConfigFile {
    Controllers: Array<IInternalGameControllerConfig>;
    AtemConnections: Array<AtemConnectionConfig>;
}
