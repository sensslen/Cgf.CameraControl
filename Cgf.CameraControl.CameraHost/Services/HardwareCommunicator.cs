using CGF.CameraControl.CameraHost.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Ports;
using System.Linq;
using System.Threading.Tasks;

namespace CGF.CameraControl.CameraHost.Services
{
    public class HardwareCommunicator : IHardwareCommunicator, IDisposable
    {
        SerialPort _communicationPort;
        string _receptionData = "";
        bool _toggleAutofocus = false;

        public HardwareCommunicator()
        {
            State = new State();
            _communicationPort = new SerialPort();

            _communicationPort.BaudRate = 500000;
            _communicationPort.DataReceived += SerialDataReceived;
            if (SerialPort.GetPortNames().Length == 1)
            {
                try
                {
                    StartSerialCommunication(SerialPort.GetPortNames().FirstOrDefault());
                }
                catch (Exception)
                {
                    // we don't want the constructor to throw
                }
            }
        }

        private void SerialDataReceived(object sender, SerialDataReceivedEventArgs e)
        {
            var port = (SerialPort)sender;
            IEnumerable<string> received;
            lock (this)
            {
                _receptionData += port.ReadExisting();
                var allReceived = _receptionData.Split('\n');
                _receptionData = allReceived.Last();
                received = allReceived.Take(allReceived.Length - 1);
            }
            foreach (var element in received)
            {
                switch (element.Trim())
                {
                    case "v1":
                        port.Write($"?{GetArduinoCommand(1)}\n");
                        break;
                    default:
                        Console.WriteLine(element);
                        break;
                }
            }
        }

        public State State { get; set; }

        public string[] AvailableConnections => SerialPort.GetPortNames();

        public CurrentConnection CurrentConnection
        {
            get => new CurrentConnection
            {
                ConnectionName = _communicationPort.PortName,
                Connected = _communicationPort.IsOpen
            };
            set
            {
                if (value.Connected)
                {
                    StartSerialCommunication(value.ConnectionName);
                }
            }
        }

        private void StartSerialCommunication(string portname = null)
        {
            lock (this)
            {
                CloseConnection();
                if (portname != null)
                {
                    _communicationPort.PortName = portname;
                }
                _communicationPort.Open();
            }
        }

        private void CloseConnection()
        {
            lock (this)
            {
                if (_communicationPort.IsOpen)
                {
                    _communicationPort.Close();
                }
            }
        }

        public void Dispose() => _communicationPort.Dispose();

        public Task<bool> UploadFirmware(Stream firmwareFile)
        {
            return Task.Run(() =>
            {
                lock (this)
                {
                    CloseConnection();
                    var success = Task.Run(() => FirmwareUploader.DoUpload(firmwareFile, _communicationPort.PortName));
                    StartSerialCommunication();
                    return success;
                }
            }
            );
        }

        public void ToggleAutofocus()
        {
            _toggleAutofocus = true;
        }

        private string GetArduinoCommand(int version)
        {
            switch (version)
            {
                case 1:
                    return $"{PanTiltToString(State.Pan)}{PanTiltToString(State.Tilt)}" +
                        $"{ZoomString(State.Zoom)}{FocusString(State.Focus, _toggleAutofocus)}";
                default:
                    return "";
            }
        }

        private static string PanTiltToString(int value)
        {
            char lowByte = (char)((Math.Abs(value) % 32) + '@');
            char highByte = (char)((Math.Abs(value) / 32) + ((value < 0) ? (1 << 4) : 0) + '@');
            return $"{highByte}{lowByte}";
        }

        private static string ZoomString(int value)
        {
            char charValue = (char)(Math.Abs(value) + ((value < 0) ? (1 << 4) : 0) + '@');
            return $"{charValue}";
        }

        private static string FocusString(int value, bool toggleAutofocus)
        {
            char charValue = (char)(((value != 0) ? 1 : 0) 
                + (toggleAutofocus ? (1 << 1) : 0)
                +  ((value < 0) ? (1 << 4) : 0) + '@');
            return $"{charValue}";
        }
    }
}
