import { EventBaseInterface } from "../interfaces/event_base_interface";
import { LoggerUtils, LogTypes } from "../utils/loggerUtils";
import { Server, Socket } from "socket.io";
import {RoomsUtils} from "../utils/roomsUtils";
import {Events} from "../utils/events";

export class JoinLobbyEvent implements EventBaseInterface {

    socket: Socket;
    roomCode: string;
    io: Server;

    constructor(socket: Socket, roomCode: string, io: Server) {
        this.socket = socket;
        this.roomCode = roomCode;
        this.io = io;
    }

    manageEvent(): void {

        LoggerUtils.log(LogTypes.INFO, `Join lobby event triggered (${this.socket.id})`);

        if (RoomsUtils.checkIfRoomExists(this.io, this.roomCode)) {
            this.socket.join(this.roomCode);
            LoggerUtils.log(LogTypes.INFO, `Socket joined room ${this.roomCode} (${this.socket.id})`);
            this.socket.emit(Events.JOIN_SUCCESS);
        } else {
            LoggerUtils.log(LogTypes.ERROR, `Tried to join a non existing room ${this.roomCode} (${this.socket.id})`);
            this.socket.emit(Events.JOIN_FAIL);
        }

    }

}