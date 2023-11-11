import { EventBaseInterface } from "../interfaces/event_base_interface";
import { LoggerUtils, LogTypes } from "../utils/loggerUtils";
import {Server, Socket} from "socket.io";

export class DisconnectEvent implements EventBaseInterface {

    io: Server;
    socket: Socket;

    constructor(io: Server, socket: Socket) {
        this.io = io;
        this.socket = socket;
    }

    manageEvent(): void {
        LoggerUtils.log(LogTypes.INFO, `Socket disconnected (${this.socket.id})`);
    }

}