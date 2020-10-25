import { GameController } from './GameController/GameController';
import { ControllerConfig } from './GameController/ControllerConfig';
import { AtemConnection } from './AtemConnection/AtemConnection';
import * as fs from 'fs';
import Dictionary from './Dictionary/Dictionary';
import yargs = require('yargs/yargs');
import { AtemConnectionConfig } from './AtemConnection/AtemConnectionConfig';

interface IInternalGameControllerConfig {
    ControllerConfig: ControllerConfig;
    AtemConnection: string;
}

interface IConfigFile {
    Gamepads: Array<IInternalGameControllerConfig>;
    AtemConnections: Array<AtemConnectionConfig>;
}

const argv = yargs(process.argv.slice(2)).options({
    config: { type: 'string', default: 'config.json' },
}).argv;

let config: IConfigFile = JSON.parse(fs.readFileSync(argv.config).toString());

let atemInstances = new Dictionary<AtemConnection>();
config.AtemConnections.forEach((c) => {
    atemInstances.add(c.identifier, new AtemConnection(c));
});

config.Gamepads.forEach((c) => {
    new GameController(c.ControllerConfig, atemInstances.getItem(c.AtemConnection));
});
