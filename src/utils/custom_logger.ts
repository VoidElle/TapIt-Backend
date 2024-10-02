export enum LogType {
    INFO = "INFO:",
    WARNING = "WARNING:",
    ERROR = "ERROR:"
}

export class CustomLogger {

    static log(logType: LogType, value: string): void {
        console.log(`${logType.valueOf()} ${value}`);
    }

}