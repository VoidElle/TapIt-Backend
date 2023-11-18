import { EventBaseInterface } from "../../interfaces/event_base_interface";
import { LoggerUtils, LogTypes } from "../../utils/loggerUtils";
import {Server, Socket} from "socket.io";
import { Events } from "../../utils/events";

export class PlayerChangeReadyStatusEvent implements EventBaseInterface {

    newReadyStatus: boolean;
    lobbyId: string;
    socket: Socket;
    io: Server;

    constructor(newReadyStatus: boolean, lobbyId: string, socket: Socket, io: Server) {
        this.newReadyStatus = newReadyStatus;
        this.lobbyId = lobbyId;
        this.socket = socket;
        this.io = io;
    }

    async manageEvent(): Promise<void> {

        LoggerUtils.log(LogTypes.INFO, `Player change ready status event triggered from socket ${this.socket.id}`);

        const jsonResponse: JSON = <JSON><any>{
            "socket": this.socket.id,
            "newReadyStatus": this.newReadyStatus,
        };

        this.io.to(this.lobbyId).emit(Events.PLAYER_CHANGE_READY_STATUS, jsonResponse);
    }

}