using CGF.CameraControl.CameraHost.Models;
using CGF.CameraControl.CameraHost.Services;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace CGF.CameraControl.CameraHost.Hubs
{
    public class StateHub : Hub
    {
        private readonly IHardwareCommunicator _hardwareCommunicator;

        public StateHub(IHardwareCommunicator hardwareCommunicator)
        {
            _hardwareCommunicator = hardwareCommunicator;
        }

        public async Task<bool> SetState(State state)
        {
            if (!_hardwareCommunicator.CurrentConnection.Connected)
            {
                return false;
            }
            _hardwareCommunicator.State = state;
            await Clients.All.SendAsync("NewState", state);
            return true;
        }

        public bool ToggleAutofocus()
        {
            if (!_hardwareCommunicator.CurrentConnection.Connected)
            {
                return false;
            }
            _hardwareCommunicator.ToggleAutofocus();
            return true;
        }
    }
}