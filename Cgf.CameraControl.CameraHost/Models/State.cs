using System;

namespace CGF.CameraControl.CameraHost.Models
{
    public class State
    {
        private int _pan = 0;
        public int Pan { get => _pan; set => _pan = Math.Max(-255, Math.Min(255, value)); }
        private int _tilt = 0;
        public int Tilt { get => _tilt; set => _tilt = Math.Max(-255, Math.Min(255, value)); }
        private int _zoom = 0;
        public int Zoom { get => _zoom; set => _zoom = Math.Max(-8, Math.Min(8, value)); }
        private int _focus = 0;
        public int Focus { get => _focus; set => _focus = Math.Max(-1, Math.Min(1, value)); }

        public override string ToString() => $"{Pan},{Tilt},{Zoom},{Focus}";
    }
}
