import { EventBaseInterface } from "../../interfaces/event_base_interface";
import { LoggerUtils, LogTypes } from "../../utils/loggerUtils";
import {Server, Socket} from "socket.io";
import { Events } from "../../utils/events";

export class QuitLobbyEvent implements EventBaseInterface {

    lobbyId: string;
    socket: Socket;
    io: Server;

    constructor(lobbyId: string, socket: Socket, io: Server) {
        this.lobbyId = lobbyId;
        this.socket = socket;
        this.io = io;
    }

    async manageEvent(): Promise<void> {

        LoggerUtils.log(LogTypes.INFO, `Quit lobby event triggered from socket ${this.socket.id}`);

        await this.socket.leave(this.lobbyId);
        LoggerUtils.log(LogTypes.INFO, `Socket ${this.socket.id} left lobby ${this.lobbyId}`);

        const jsonResponseToRoom: JSON = <JSON><any>{
            "quittedSocket": this.socket.id
        };

        this.io.to(this.lobbyId).emit(Events.QUIT_LOBBY_RESPONSE_SUCCESS, jsonResponseToRoom);
    }

}