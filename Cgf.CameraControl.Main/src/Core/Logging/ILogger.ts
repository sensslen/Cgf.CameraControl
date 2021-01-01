export interface ILogger {
    Log(toLog: string): void;
    Error(toLog: string): void;
}
