# Cgf.CameraControl.CameraHost

C# Application that receives commands (e.g. from [Cgf.CameraControl.Main](../Cgf.CameraControl.Main)) throuth a web interface (either a REST API or a Websocket) and provides them via a serial port (to be used by [Cgf.CameraControl.CameraController](../Cgf.CameraControl.CameraController)).

## Quick start

This application is designed to run on a small lingle board computer (tested on [Raspberry Pi](https://www.raspberrypi.org/)).
Following steps are used to execute this application as a service on a Raspberry Pi:

- build [CGF.CameraControl.CameraHost.sln](./CGF.CameraControl.CameraHost.sln) for the desired platform (use [`build.sh path/to/CGF.CameraControl.CameraHost.sln`](../AptPackage/CameraHost/build.sh) for Raspberry Pi)
- install the application on the target system. For Raspberry Pi follow these steps:
  - create a installable package for Raspberry Pi OS by calling [`createPackage.sh -s path/to/compiled/app -v version.number [-d path/to/destination/folder]`](../AptPackage/CameraHost/createPackage.sh)
  - transfer the newly created package to the Raspberry Pi
  - install the package using `apt install path/to/package.deb`
  - remember the IP Address of the device on which the package was installed (it's best to chose a fixed IP Address) so that it can be entered in the configuration file of [Cgf.CameraControl.Main](../Cgf.CameraControl.Main)

## Troubleshooting

Should it be necessary to restart the CGF.CameraControl.CameraHost application, please use `systemctl restart cgf-cameracontrol-camerahost.service`
