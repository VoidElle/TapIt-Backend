import { EventBaseInterface } from "../interfaces/event_base_interface";
import { LoggerUtils, LogTypes } from "../utils/loggerUtils";
import {Server, Socket} from "socket.io";
import { Events } from "../utils/events";

export class SetReadyStatusEvent implements EventBaseInterface {

    socket: Socket;
    roomCode: string;
    io: Server;

    constructor(socket: Socket, roomCode: string, io: Server) {
        this.socket = socket;
        this.roomCode = roomCode;
        this.io = io;
    }

    manageEvent(): void {
        LoggerUtils.log(LogTypes.INFO, `Set ready status event triggered (${this.socket.id})`);
        this.io.to(this.roomCode).emit(Events.SET_READY_STATUS, this.socket.id);
    }

}