import { EventBaseInterface } from "../../interfaces/event_base_interface";
import { LoggerUtils, LogTypes } from "../../utils/loggerUtils";
import {Server, Socket} from "socket.io";
import { Events } from "../../utils/events";
import {RoomsUtils} from "../../utils/roomsUtils";

export class JoinLobbyEvent implements EventBaseInterface {

    lobbyId: string;
    socket: Socket;
    io: Server;

    constructor(lobbyId: string, socket: Socket, io: Server) {
        this.lobbyId = lobbyId;
        this.socket = socket;
        this.io = io;
    }

    async manageEvent(): Promise<void> {

        LoggerUtils.log(LogTypes.INFO, `Join lobby event triggered from socket ${this.socket.id}`);

        const roomExist: boolean = RoomsUtils.checkIfRoomExists(this.io, this.lobbyId);
        if (!roomExist) {

            const jsonResponse: JSON = <JSON><any>{
                "error": "Lobby not found",
            };

            this.socket.emit(Events.JOIN_LOBBY_RESPONSE_FAIL, jsonResponse);
            return;
        }

        await this.socket.join(this.lobbyId);
        LoggerUtils.log(LogTypes.INFO, `${this.socket.id} joined lobby ${this.lobbyId}`);

        // Todo: Register socket join in the database

        const socketsList = await this.io.in(this.lobbyId).fetchSockets();
        const socketsIdsList: string[] = [];

        socketsList.forEach((socket): void => {
            socketsIdsList.push(socket.id);
        });

        const jsonResponse: JSON = <JSON><any>{
            "lobbyId": this.lobbyId,
            "sockets": socketsIdsList,
        };

        this.io.to(this.lobbyId).emit(Events.JOIN_LOBBY_RESPONSE_SUCCESS, jsonResponse);

    }

}