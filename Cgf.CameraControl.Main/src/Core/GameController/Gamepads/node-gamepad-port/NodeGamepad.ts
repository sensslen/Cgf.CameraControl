import { EventEmitter } from 'events';
import { devices, HID } from 'node-hid';
import { startMonitoring, on, Device, stopMonitoring, find } from 'usb-detection';
import { INodeGamepadLog } from './INodeGamepadLog';
import { JoyStickValue } from './JoyStickValue';

interface IDeviceSpec {
    vendorID: number;
    productID: number;
    serialNumber?: string;
}

export interface INodeGamepadConfig extends IDeviceSpec {
    joysticks?: { name: string; x: { pin: number }; y: { pin: number } }[];
    buttons?: { value: number; pin: number; name: string }[];
    status?: { name: string; pin: number; states: { value: number; state: string }[] }[];
}

export class NodeGamepad extends EventEmitter {
    private _usb?: HID;
    private _joystickStates: { [key: string]: JoyStickValue };
    private _buttonStates: { [key: string]: number };

    constructor(private config: INodeGamepadConfig, private logger?: INodeGamepadLog) {
        super();
    }

    public start() {
        this.log(`Starting connection procedure to device:${JSON.stringify(this.toIDeviceSpec(this.config))}`);

        startMonitoring();
        find(this.config.vendorID, this.config.productID)
            .then((devices) => {
                for (let device of devices) {
                    this.connectIfMatching(device);
                }
            })
            .catch((error) => this.log(`usb device find error:${JSON.stringify(error)}`));

        on(`add:${this.config.vendorID}:${this.config.productID}`, (device) => this.connectIfMatching(device));
    }

    public stop() {
        if (this._usb) {
            this._usb.close();
        }
        stopMonitoring();
    }

    public rumble() {
        // do nothing here intentionally. gamepads supporting rumbling do need to override this method
    }

    private connect(device: Device) {
        if (this._usb) {
            return;
        }
        this.log(`Connecting to:${JSON.stringify(device)}`);
        let devicesMatchingVidAndPid = devices(device.vendorId, device.productId);
        let matchingDevices = devicesMatchingVidAndPid.filter((d) => d.serialNumber === device.serialNumber);
        if (matchingDevices.length < 1 || !matchingDevices[0].path) {
            this.log('Failed to connect. Maybe the device is in use.');
        } else {
            this._usb = new HID(matchingDevices[0].path);
            this._usb.on('data', (data: number[]) => this.onControllerFrame(data));
            this._usb.on('error', (error) => {
                this.log(`Error occurred:${JSON.stringify(error)}`);
                this._usb?.close();
                this._usb = undefined;
            });
        }
    }

    private log(toLog: string) {
        if (this.logger) {
            this.logger.Log(`NodeGamepad:${toLog}`);
        }
    }

    private toIDeviceSpec(spec: IDeviceSpec): IDeviceSpec {
        return { vendorID: spec.vendorID, productID: spec.productID, serialNumber: spec.serialNumber };
    }

    private connectIfMatching(device: Device): void {
        if (this.deviceIsMatch(device)) {
            this.connect(device);
        }
    }

    private deviceIsMatch(device: Device): boolean {
        let match = true;
        if (this.config.serialNumber) {
            match &&= this.config.serialNumber === device.serialNumber;
        }
        match &&= this.config.productID === device.productId;
        match &&= this.config.vendorID === device.vendorId;
        return match;
    }

    private onControllerFrame(data: number[]): void {
        this.processJoysticks(data);
        this.processButtons(data);
        this.processStatus(data);
    }

    private processJoysticks(data: number[]) {
        this.config.joysticks?.forEach((joystick) => {
            const oldState = this._joystickStates[joystick.name];
            const newState = {
                x: data[joystick.x.pin],
                y: data[joystick.y.pin],
            };
            if (oldState && (oldState.x !== newState.x || oldState.y !== newState.y)) {
                this.emit(joystick.name + ':move', oldState);
            }
            this._joystickStates[joystick.name] = newState;
        });
    }

    private processButtons(data: number[]) {
        this.config.buttons?.forEach((button) => {
            const oldState = this._buttonStates[button.name];
            const newState = data[button.pin] & 0xff;
            const isPressed = newState >= button.value;
            if (oldState) {
                if (oldState !== newState) {
                    this.emit(button.name + ':change', oldState);
                    const oldPressed = oldState >= button.value;
                    if (oldPressed != isPressed) {
                        isPressed ? this.emit(button.name + ':press') : this.emit(button.name + ':release');
                    }
                }
            } else if (isPressed) {
                this.emit(button.name + ':press');
            }
            this._buttonStates[button.name] = newState;
        });
    }

    private processStatus(data: number[]) {
        this.config.status?.forEach((status) => {
            const oldState = this._buttonStates[status.name];
            const newState = data[status.pin] & 0xff;
            if (!oldState || oldState != newState) {
                this.emit(status.name + ':change', this.getStateName(status.states, newState));
            }
            this._buttonStates[status.name] = newState;
        });
    }

    private getStateName(states: { value: number; state: string }[], value: number): string {
        for (let state of states) {
            if (state.value === value) {
                return state.state;
            }
        }
        return `unknown state:${value}`;
    }
}
