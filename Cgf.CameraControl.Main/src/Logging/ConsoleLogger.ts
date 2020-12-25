import { ILogger } from './ILogger';

export class ConsoleLogger implements ILogger {
    Error(toLog: string): void {
        console.error(toLog);
    }
    Log(toLog: string): void {
        console.log(toLog);
    }
}
