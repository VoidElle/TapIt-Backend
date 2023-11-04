import { EventBaseInterface } from "../interfaces/event_base_interface";
import { LoggerUtils, LogTypes } from "../utils/loggerUtils";
import {Server, Socket} from "socket.io";
import { Events } from "../utils/events";

export class GetSocketsInfoEvent implements EventBaseInterface {

    socket: Socket;
    roomCode: string;
    io: Server;

    constructor(socket: Socket, roomCode: string, io: Server) {
        this.socket = socket;
        this.roomCode = roomCode;
        this.io = io;
    }

    manageEvent = async (): Promise<void> => {

        LoggerUtils.log(LogTypes.INFO, `Get sockets info event triggered (${this.socket.id})`);

        const socketsInRoom = await this.io.in(this.roomCode).fetchSockets();
        const socketIds: string[] = [];

        socketsInRoom.map((socket): void => {
            socketIds.push(socket.id);
        });

        this.socket.emit(Events.GET_SOCKETS_INFO, socketIds);
    }

}