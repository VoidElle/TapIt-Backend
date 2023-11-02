export enum LogTypes {
    INFO = "INFO:",
    WARNING = "WARNING:",
    ERROR = "ERROR:"
}

export class LoggerUtils {

    static log(logType: LogTypes, value: string): void {
        console.log(`${logType.valueOf()} ${value}`);
    }

}