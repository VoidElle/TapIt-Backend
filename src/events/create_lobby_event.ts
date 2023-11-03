import { EventBaseInterface } from "../interfaces/event_base_interface";
import { LoggerUtils, LogTypes } from "../utils/loggerUtils";
import {Socket} from "socket.io";

export class CreateLobbyEvent implements EventBaseInterface {

    socket: Socket;

    constructor(socket: Socket) {
        this.socket = socket;
    }

    manageEvent(): void {
        LoggerUtils.log(LogTypes.INFO, `Create lobby event triggered (${this.socket.id})`);
    }

}