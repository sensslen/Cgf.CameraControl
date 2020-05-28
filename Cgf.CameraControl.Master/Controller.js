const { logitechF310 } = require("./Controllers/logitechF310.js");
const { Connection } = require("./Connection.js");

class Controller {
  constructor(config) {
    switch (config.ControllerType) {
      case "logitech/gamepadf310":
        this.gamepad = new logitechF310();
        break;
      default:
        console.log(`${config.ControllerType} not yet supported`);
        break;
    }

    this.Connections = [];
    config.Connections.forEach((connection) => {
      this.Connections.push(new Connection(connection));
    });

    if (this.Connections.length == 0) {
      console.log("no connection configured");
    }

    this.currentConnection = 0;

    this.state = {
      pan: 0,
      tilt: 0,
      zoom: 0,
      focus: 0,
    };

    this.gamepad.onPan((pan) => {
      this.state.pan = pan;
      this.Connections[this.currentConnection].setState(this.state);
    });

    this.gamepad.onTilt((tilt) => {
      this.state.tilt = tilt;
      this.Connections[this.currentConnection].setState(this.state);
    });

    this.gamepad.onZoom((zoom) => {
      this.state.zoom = zoom;
      this.Connections[this.currentConnection].setState(this.state);
    });

    this.gamepad.onFocus((focus) => {
      this.state.focus = focus;
      this.Connections[this.currentConnection].setState(this.state);
    });
    /*
    this.gamepad.onNext(() => {
      this.currentConnection++;
      if (this.currentConnection == this.Connections.length) {
        this.currentConnection = 0;
      }
      this.Connections[this.currentConnection].setState(this.state);
    });

    this.gamepad.onPrevious(() => {
      this.currentConnection--;
      if (this.currentConnection < 0) {
        this.currentConnection = this.Connections.length - 1;
      }
      this.Connections[this.currentConnection].setState(this.state);
    });
    */
  }
}

module.exports = { Controller };
