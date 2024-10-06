import { ClientEvents } from "../enums/client_events";

export enum LogType {
    INFO = "INFO",
    WARNING = "WARNING",
    ERROR = "ERROR"
}

export class CustomLogger {

    static log(logType: LogType, value: string): void {
        console.log(`${logType.valueOf()} ${value}`);
    }

    static logEvent(logType: LogType, event: ClientEvents, value: string): void {
        console.log(`${logType.valueOf()} | EVENT: ${event.valueOf()} | ${value}`);
    }

}