import { IConfigFile } from './IConfigFile';
import * as fs from 'fs';
import * as IConfigFileSchema from '../TypeValidation/IConfigFile.json';
import Ajv from 'ajv';

export class ConfigParser {
    private _ajv = new Ajv();

    constructor(private _path: string) {}

    parse(): IConfigFile | undefined {
        let config = JSON.parse(fs.readFileSync(this._path).toString());
        if (this._ajv.validate(IConfigFileSchema, config)) {
            return config as IConfigFile;
        } else {
            return undefined;
        }
    }

    errorGet(): string {
        return this._ajv.errorsText();
    }
}
