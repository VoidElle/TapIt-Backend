import { EventBaseInterface } from "../../interfaces/event_base_interface";
import { LoggerUtils, LogTypes } from "../../utils/loggerUtils";
import {Server, Socket} from "socket.io";
import {Events} from "../../utils/events";
import { JsonModelCreator } from "../../utils/json/json_model_creator";

export class GameWinEvent implements EventBaseInterface {

    lobbyId: string;
    socket: Socket;
    io: Server;

    constructor(lobbyId: string, socket: Socket, io: Server) {
        this.lobbyId = lobbyId;
        this.socket = socket;
        this.io = io;
    }

    async manageEvent(): Promise<void> {

        LoggerUtils.log(LogTypes.INFO, `Game win event triggered from socket ${this.socket.id}`);

        // Send the SUCCESS event
        const jsonResponse: JSON = JsonModelCreator.socketId(this.socket.id);
        this.io.to(this.lobbyId).emit(Events.GAME_WIN_RESPONSE_SUCCESS, jsonResponse);

    }

}