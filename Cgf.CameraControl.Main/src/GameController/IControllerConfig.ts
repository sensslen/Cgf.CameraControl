import { ImageConnectionConfig } from '../ImageConnection/ImageConnectionConfig';
import { SpecialFunctionKey } from './Gamepads/IGamePad';

export enum ESpecialFunctionType {
    key = 'key',
    macro = 'macro',
}

export interface ISpecialFunctionKey {
    Type: ESpecialFunctionType;
    Index: number;
}

export interface IControllerConfig {
    ControllerType: string;
    AtemMixEffectBlock: number;
    ImageConnections: Array<ImageConnectionConfig>;
    SpecialFunctions: { [key in SpecialFunctionKey]: ISpecialFunctionKey };
    AltSpecialFunctions?: { [key in SpecialFunctionKey]: ISpecialFunctionKey };
    AltLowerSpecialFunctions?: { [key in SpecialFunctionKey]: ISpecialFunctionKey };
}
