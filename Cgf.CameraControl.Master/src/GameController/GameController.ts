import { logitechF310 } from "./logitechF310";
import { CameraConnection } from "../CameraConnection/CameraConnection";
import { State } from "../State";
import { ControllerConfig } from "./ControllerConfig";

export class GameController {
  private state: State;
  private cameraConnections: Array<CameraConnection> = [];
  private currentConnection: number = 0;

  constructor(config: ControllerConfig) {
    this.state = new State();
    switch (config.ControllerType) {
      case "logitech/gamepadf310":
        new logitechF310(
          (pan: number) => {
            this.state.pan = pan;
            this.cameraConnections[this.currentConnection].setState(this.state);
          },
          (tilt: number) => {
            this.state.tilt = tilt;
            this.cameraConnections[this.currentConnection].setState(this.state);
          },
          (zoom: number) => {
            this.state.zoom = zoom;
            this.cameraConnections[this.currentConnection].setState(this.state);
          },
          (focus: number) => {
            this.state.focus = focus;
            this.cameraConnections[this.currentConnection].setState(this.state);
          },
          (advance: number) => {
            this.changeConnection(this.currentConnection + advance);
          },
          () => {
            this.cameraConnections[this.currentConnection].toggleAutofocus();
          }
        );
        break;
      default:
        console.log(`${config.ControllerType} not yet supported`);
        process.exit();
    }
    config.CameraConnections.forEach((c) => {
      this.cameraConnections.push(new CameraConnection(c));
    });
  }

  changeConnection(nextConnection: number) {
    nextConnection = this.mod(nextConnection, this.cameraConnections.length);

    if (this.currentConnection != nextConnection) {
      this.cameraConnections[this.currentConnection].setState(new State());
      this.currentConnection = nextConnection;
      this.cameraConnections[this.currentConnection].setState(this.state);
      this.cameraConnections[this.currentConnection].printConnection();
    }
  }

  mod(n: number, m: number) {
    return ((n % m) + m) % m;
  }
}