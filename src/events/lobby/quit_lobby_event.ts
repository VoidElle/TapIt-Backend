import { EventBaseInterface } from "../../interfaces/event_base_interface";
import { LoggerUtils, LogTypes } from "../../utils/loggerUtils";
import {Server, Socket} from "socket.io";
import { Events } from "../../utils/events";
import {JsonModelCreator} from "../../utils/json/json_model_creator";

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

        // Make the socket leave the lobby
        await this.socket.leave(this.lobbyId);
        LoggerUtils.log(LogTypes.INFO, `Socket ${this.socket.id} left lobby ${this.lobbyId}`);

        // Emit the SUCCESS event
        const jsonResponse: JSON = JsonModelCreator.socketId(this.socket.id);
        this.io.to(this.lobbyId).emit(Events.QUIT_LOBBY_RESPONSE_SUCCESS, jsonResponse);

    }

}