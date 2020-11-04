# Cgf.CameraControl

This project consists of the components that can be used to control Cameras and a Video mixer using a gamepad in order to allow one operator for the whole System.

## Components

The System consists of different components that do each fulfill a dedicated purpose.
| Component | Purpose |
|-----------|---------|
| [Cgf.CameraControl.Main](Cgf.CameraControl.Main) | Software application that takes input form Gamepad(s) and allows to control Video Switchers and Cameras by sending the appropriate commands to each of these units. |
| [CGF.CameraControl.CameraHost](CGF.CameraControl.CameraHost) | Software application that provides a Rest API and a Websocket Api in order to receive commands for a video camera to execute. |
| [Cgf.CameraControl.CameraController](Cgf.CameraControl.CameraController) | Software application that asks an instance of [CGF.CameraControl.CameraHost](CGF.CameraControl.CameraHost) what should be executed next and does all the heavy realtime lifting to move the camera to the desired state. |
