import { GamepadConfig } from "./GamepadConfig";
import { IGamePad } from "./IGamePad";
import { logitechF310 } from "./logitechF310";

export class GamepadFactory {
  static getGamepad(config: GamepadConfig): IGamePad {
    switch (config.ControllerType) {
      case "logitech/gamepadf310":
        return new logitechF310(config.ControllerSerialNumber);
      default:
        console.log(`${config.ControllerType} not yet supported`);
        process.exit();
    }
  }
}
