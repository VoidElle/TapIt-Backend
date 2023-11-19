import { EventBaseInterface } from "../../interfaces/event_base_interface";
import {Server, Socket} from "socket.io";
import { Events } from "../../utils/events";

export class StartLobbyEvent implements EventBaseInterface {

    lobbyId: string;
    socket: Socket;
    io: Server;

    constructor(lobbyId: string, socket: Socket, io: Server) {
        this.lobbyId = lobbyId;
        this.socket = socket;
        this.io = io;
    }

    async manageEvent(): Promise<void> {
        this.io.to(this.lobbyId).emit(Events.START_LOBBY_RESPONSE_SUCCESS);
    }

}