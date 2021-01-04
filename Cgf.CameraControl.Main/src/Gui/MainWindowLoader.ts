import { BrowserWindow, dialog, Menu } from 'electron';
import { AtemConnection } from '../Core/AtemConnection/AtemConnection';
import { ConfigParser } from '../Core/Configuration/ConfigParser';
import Dictionary from '../Core/Dictionary/Dictionary';
import { GameController } from '../Core/GameController/GameController';
import { ILogger } from '../Core/Logging/ILogger';
import * as path from 'path';

export class MainWindowLoader {
    private mainWindow?: Electron.BrowserWindow;
    private controllers: Array<GameController> = [];
    private readonly logger: ILogger = {
        Log(toLog: string): void {
            console.log(toLog);
        },
        Error(toLog: string): void {
            console.error(toLog);
        },
    };

    constructor(private _preloadLocation: any) {}

    public createWindow(mainWindowLocation: any) {
        // Create the browser window.
        this.mainWindow = new BrowserWindow({
            height: 600,
            width: 800,
            webPreferences: {
                contextIsolation: true,
                preload: this._preloadLocation,
            },
        });

        // and load the index.html of the app.
        this.mainWindow.loadURL(mainWindowLocation);

        // Emitted when the window is closed.
        this.mainWindow.on('closed', () => {
            // Dereference the window object, usually you would store windows
            // in an array if your app supports multi windows, this is the time
            // when you should delete the corresponding element.
            this.mainWindow = undefined;
        });

        this.mainWindow.setMenu(this.createMenu());
    }

    private createMenu(): Menu {
        return Menu.buildFromTemplate([
            {
                label: 'File',
                submenu: [
                    {
                        label: 'Load Configuration',
                        click: () => this.showLoadConfigDialog(),
                    },
                    { role: 'forceReload' },
                    { role: 'toggleDevTools' },
                    { role: 'quit' },
                ],
            },
        ]);
    }

    private showLoadConfigDialog() {
        let newConfig = dialog.showOpenDialog(this.mainWindow as BrowserWindow, {
            properties: ['openFile'],
            filters: [{ name: 'JSON Files', extensions: ['json'] }],
        });
        newConfig
            .then((openComplete) => {
                if (!openComplete.canceled) {
                    this.loadConfig(openComplete.filePaths[0]);
                }
            })
            .catch((reason) => console.error(reason));
    }

    private loadConfig(filepath: string): void {
        this.mainWindow?.webContents.send('connected', false);
        this.controllers.forEach((controller) => controller.dispose());
        this.controllers = [];

        const parser = new ConfigParser(filepath);
        const config = parser.parse();
        if (config === undefined) {
            dialog.showErrorBox('Unable to parse configuration', parser.errorGet());
        } else {
            let atemInstances = new Dictionary<AtemConnection>();
            config.AtemConnections.forEach((c) => {
                atemInstances.add(c.identifier, new AtemConnection(c, this.logger));
            });

            config.Controllers.forEach((c) => {
                this.controllers.push(new GameController(c, atemInstances.getItem(c.AtemConnection), this.logger));
            });

            this.mainWindow?.webContents.send('connected', true);
        }
    }
}
