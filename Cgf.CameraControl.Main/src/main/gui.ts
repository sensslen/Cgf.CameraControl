import { app, BrowserWindow, dialog, ipcMain, ipcRenderer, Menu } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { AtemConnection } from '_/Core/AtemConnection/AtemConnection';
import { ConfigParser } from '_/Core/Configuration/ConfigParser';
import Dictionary from '_/Core/Dictionary/Dictionary';
import { GameController } from '_/Core/GameController/GameController';
import { ILogger } from '_/Core/Logging/ILogger';

export class Gui {
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

    public start() {
        // This method will be called when Electron has finished
        // initialization and is ready to create browser windows.
        // Some APIs can only be used after this event occurs.
        app.on('ready', () => {
            this.createWindow();
        });

        // Quit when all windows are closed.
        app.on('window-all-closed', () => {
            // On OS X it is common for applications and their menu bar
            // to stay active until the user quits explicitly with Cmd + Q
            if (process.platform !== 'darwin') {
                app.quit();
            }
        });

        app.on('activate', () => {
            // On OS X it"s common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            if (this.mainWindow === undefined) {
                this.createWindow();
            }
        });
    }

    private createWindow() {
        // Create the browser window.
        this.mainWindow = new BrowserWindow({
            height: 600,
            width: 800,
            webPreferences: {
                webSecurity: false,
                devTools: process.env.NODE_ENV !== 'production',
                nodeIntegration: true,
            },
        });

        // and load the index.html of the app.
        this.mainWindow
            .loadURL(
                url.format({
                    pathname: path.join(__dirname, './index.html'),
                    protocol: 'file:',
                    slashes: true,
                })
            )
            .finally(() => {
                /* no action */
            });

        // Emitted when the window is closed.
        this.mainWindow.on('closed', () => {
            // Dereference the window object, usually you would store windows
            // in an array if your app supports multi windows, this is the time
            // when you should delete the corresponding element.
            this.mainWindow = undefined;
        });

        this.mainWindow.setMenu(this.createMenu());
        this.mainWindow.webContents.openDevTools();
    }

    private createMenu(): Menu {
        return Menu.buildFromTemplate([
            {
                label: 'File',
                submenu: [
                    {
                        label: 'Load Configuration',
                        click: () => {
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
                        },
                    },
                    {
                        label: 'Reload',
                        visible: process.env.NODE_ENV !== 'production',
                        click: () => {
                            this.mainWindow?.reload();
                        },
                    },
                    {
                        label: 'Exit',
                        click() {
                            app.quit();
                        },
                    },
                ],
            },
        ]);
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
