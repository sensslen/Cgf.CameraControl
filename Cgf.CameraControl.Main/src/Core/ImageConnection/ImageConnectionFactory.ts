import { ILogger } from '../Logging/ILogger';
import { CameraConnection } from './CameraConnection';
import { CameraConnectionConfig } from './CameraConnectionConfig';
import { IImageConnection } from './IImageConnection';
import { ImageConnection } from './ImageConnection';
import { ImageConnectionConfig } from './ImageConnectionConfig';

interface ImageConnectionConfigInternal extends ImageConnectionConfig {
    CgfCameraConnection?: CameraConnectionConfig;
}

export class ImageConnectionFactory {
    static GetImageConnection(config: ImageConnectionConfig, logger: ILogger): IImageConnection {
        let internalConfig = <ImageConnectionConfigInternal>config;
        if (internalConfig.CgfCameraConnection) {
            return new CameraConnection(config, internalConfig.CgfCameraConnection, logger);
        }
        return new ImageConnection(config);
    }
}
