# Cgf.CameraControl.Main

Typescript application that uses a Gamepad to control a Video mixer and multiple cameras.

## Quick start

To start using this project use the following steps:

-   install [node.js](https://nodejs.org/en/)
-   clone the repository (`git clone https://github.com/sensslen/Cgf.CameraControl.git`)
-   navigate to the [Cgf.CameraControl.Master](.) directory
-   install dependencies by calling `npm install`
-   edit [src/config.json](./src/config.json) to match your setup or just create a new configuration and run the application with the config parameter.
-   run the application using `npm start` or alternatively with a custom configuration using `npm start -- --config path/to/my/specail/config.json`

## Configuration

Configuration of the Application is storead as JSON File. There is the default configuration ([src/config.json](./src/config.json)) which is loaded when the config parameter is omitted when starting the application. Additionally the application may be started with a custom configuration that may be located anywhere on the file system.

The configuration format is basically shown in [src/config.json](./src/config.json). Please keep reading for further explanations.

### Video mixer connections

The application basically supports connections to multiple video mixers. These are configured in the AtemConnections array which is located in the root element of the configuration file directly.

```json5
    "AtemConnections": [
        {
            "identifier": "me4",
            "IP": "192.168.1.123"
        },
        {
            "identifier": "i am a string identifier",
            "IP": "192.168.1.123"
        }
    ],
```

### Gamepads

Also there are multiple gamepads supported by one instance of the application. Each gamepad connects to exactly one ME Block on the video mixer and allows to control it. Then there may be an arbitrary number of [Image Connections](#image_connections) associated with it.

> :warning: **Currently there is the unfortunate restriction to only support one gamepad per gamepad type. This is a restriction of the gamepad connection library used. This is planned to be changed in the future.**

```json5
 "Controllers": [
        {
            // Type of the gamepad to connect to
            "ControllerType": "logitech/gamepadf310",

            // Serial number of the gamepad (used to identify the exact camepad to connect to -- currently not supported)
            //"SerialNumber": 123553

            // The Atem identifier (used in the Atem Connection array) associated with the Mixing Console that should be controlled
            "AtemConnection": "me4",

            // The effective ME Block that should be controlled. Be aware that this number is zero based!
            "AtemMixEffectBlock": 2,

            // Indexes of the Keyers that should be toggled using the "A" and "B" keys on the gamepad
            "AtemToggleKeyIndexes": [0, 1],

            // Array of connections to images -- see Image Connections chapter below
            "ImageConnections": [
                //...
            ]
        }
    ]
```

#### <a name="image_connections"></a>Image Connections

The `ImageConnections` tag allows to specify an arbitrary number of Inputs to the video Mixer to be controlled via a Gamepad. This tag is structured like following:

```json5
{
    // The input number of the image (this corresponds to the physical input number on the video mixer)
    // The name of the input is taken from ATEM
    "AtemInputNumber": 1,

    // Optional section that specifies the connection to the camera control.
    // This section is required to get access to the pan/tilt and the zoom feature of a camera
    "CgfCameraConnection": {
        "ConnectionUrl": "http://localhost:5000",
        "ConnectionPort": "COM6"
    },

    // This section specifies which camera should be selected when the connection change buttons get pressed. Possible values: up, down, left, right
    "ConnectionChangeDefinition": {
        "left": 2,
        "right": 2
    },

    // Connection change definition when the "Alt" key is pressed while changing the connection.
    // This section may be omitted. If so, the values defined in ConnectionChangeDefinition are used
    "AltConnectionChangeDefinition": {
        "up": 5,
        "down": 6
    },

    // Connection change definition when the "AltLower" key is pressed while changing the connection.
    // This section may be omitted. If so, the values defined in ConnectionChangeDefinition are used
    "AltLowerConnectionChangeDefinition": {
        "up": 7,
        "down": 8
    }
}
```
