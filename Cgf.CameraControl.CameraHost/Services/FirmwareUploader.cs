using Microsoft.Extensions.FileProviders;
using System;
using System.Diagnostics;
using System.IO;
using System.Reflection;

namespace CGF.CameraControl.CameraHost.Services
{
    static class FirmwareUploader
    {
        public static bool DoUpload(Stream uploadContent, string comport)
        {
            bool returnvalue = false;
            var configFile = CreateAvrdudeConfig();
            var uploadFile = StreamToFile(uploadContent);

            using (var process = new Process())
            {
                process.StartInfo.FileName = "avrdude";
                process.StartInfo.Arguments = $"-C{configFile} -v -V -patmega328p -carduino -P{comport} -b115200 -D -Uflash:w:{uploadFile}:i";
                process.StartInfo.CreateNoWindow = true;
                process.StartInfo.UseShellExecute = false;
                process.StartInfo.RedirectStandardOutput = true;
                process.StartInfo.RedirectStandardError = true;

                process.OutputDataReceived += (sender, data) => Console.WriteLine(data.Data);
                process.ErrorDataReceived += (sender, data) => Console.WriteLine(data.Data);
                Console.WriteLine($"starting firmware download ({process.StartInfo.Arguments})");
                process.Start();
                process.BeginOutputReadLine();
                process.BeginErrorReadLine();
                returnvalue = process.WaitForExit(1000 * 10);     // (optional) wait up to 10 seconds
            }

            File.Delete(uploadFile);
            File.Delete(configFile);
            return returnvalue;
        }

        private static string CreateAvrdudeConfig()
        {
            var embeddedProvider = new EmbeddedFileProvider(Assembly.GetExecutingAssembly());
            using (var reader = embeddedProvider.GetFileInfo("USB-avrdude.conf").CreateReadStream())
            {
                return StreamToFile(reader);
            }
        }

        private static string StreamToFile(Stream s)
        {
            var filename = Path.Combine(Directory.GetCurrentDirectory(), Guid.NewGuid().ToString());
            using (var file = File.OpenWrite(filename))
            {
                s.CopyTo(file);
            }

            return filename;
        }
    }
}
