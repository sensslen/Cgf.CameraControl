using CGF.CameraControl.CameraHost.Models;
using CGF.CameraControl.CameraHost.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CGF.CameraControl.CameraHost.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PanTiltZoomController : ControllerBase
    {
        private readonly IHardwareCommunicator _communicator;
        public PanTiltZoomController(IHardwareCommunicator communicator)
        {
            _communicator = communicator;
        }

        [HttpGet]
        [Route("state")]
        public State GetState() => _communicator.State;

        [HttpPut]
        [Route("state")]
        public IActionResult SetCurrentState(State state)
        {
            if (!_communicator.CurrentConnection.Connected)
            {
                return BadRequest();
            }
            _communicator.State = state;
            return NoContent();
        }

        [HttpPut]
        [Route("toggleAutofocus")]
        public IActionResult ToggleAutofocus()
        {
            if (!_communicator.CurrentConnection.Connected)
            {
                return BadRequest();
            }
            _communicator.ToggleAutofocus();
            return NoContent();
        }


        [HttpGet]
        [Route("connections")]
        public IEnumerable<string> GetAvailableConnections() => _communicator.AvailableConnections;

        [HttpGet]
        [Route("connection")]
        public CurrentConnection GetCurrentConnection() => _communicator.CurrentConnection;

        [HttpPut]
        [Route("connection")]
        public IActionResult SetCurrentConnection(CurrentConnection connection)
        {
            try
            {
                _communicator.CurrentConnection = connection;
                return NoContent();
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        [HttpPost]
        [Route("firmware")]
        public async Task<IActionResult> OnPostUploadAsync(IFormFile file)
        {
            using (var stream = file.OpenReadStream())
            {
                await _communicator.UploadFirmware(stream);
            }

            return Ok(new { count = 1, file.Length });
        }
    }
}
