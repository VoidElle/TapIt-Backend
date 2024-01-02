import { EventBaseInterface } from "../../interfaces/event_base_interface";
import { LoggerUtils, LogTypes } from "../../utils/loggerUtils";
import {Server, Socket} from "socket.io";
import {Events} from "../../utils/events";

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

        // Generate the response in a json format
        const jsonResponse: JSON = <JSON><any>{
            "socketId": this.socket.id,
        }

        this.io.to(this.lobbyId).emit(Events.GAME_WIN_RESPONSE_SUCCESS, jsonResponse);

    }

}