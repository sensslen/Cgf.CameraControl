import { GameController } from './GameController/GameController';
import { IControllerConfig } from './GameController/IControllerConfig';
import { AtemConnection } from './AtemConnection/AtemConnection';
import * as fs from 'fs';
import * as path from 'path';
import Dictionary from './Dictionary/Dictionary';
import yargs = require('yargs/yargs');
import { AtemConnectionConfig } from './AtemConnection/AtemConnectionConfig';

interface IInternalGameControllerConfig extends IControllerConfig {
    AtemConnection: string;
}

interface IConfigFile {
    Controllers: Array<IInternalGameControllerConfig>;
    AtemConnections: Array<AtemConnectionConfig>;
}

const argv = yargs(process.argv.slice(2)).options({
    config: { type: 'string', default: path.join(__dirname, 'config.json') },
}).argv;

let config: IConfigFile = JSON.parse(fs.readFileSync(argv.config).toString());

let atemInstances = new Dictionary<AtemConnection>();
config.AtemConnections.forEach((c) => {
    atemInstances.add(c.identifier, new AtemConnection(c));
});

config.Controllers.forEach((c) => {
    new GameController(c, atemInstances.getItem(c.AtemConnection));
});
