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

        // Check if a lobby with the given id exists
        const roomExist: boolean = RoomsUtils.checkIfRoomExists(this.io, this.lobbyId);

        // If a lobby with the given id doesn't exist,
        // notify the socket that the lobby hasn't been found
        if (!roomExist) {

            // Generate the response in a json format
            const jsonResponse: JSON = <JSON><any>{
                "error": "Lobby not found",
            };

            // Emit the fail joining event to the socket
            this.socket.emit(Events.JOIN_LOBBY_RESPONSE_FAIL, jsonResponse);

            return;
        }

        // Make the socket join the lobby
        await this.socket.join(this.lobbyId);
        LoggerUtils.log(LogTypes.INFO, `${this.socket.id} joined lobby ${this.lobbyId}`);

        // Todo: Register socket join in the database

        // Get the list of sockets inside the given lobby
        const socketsList = await this.io.in(this.lobbyId).fetchSockets();

        // Get the ids from the list of sockets inside the lobby
        const socketsIdsList: string[] = [];
        socketsList.forEach((socket): void => {
            socketsIdsList.push(socket.id);
        });

        // Generate the response in a json format
        const jsonResponse: JSON = <JSON><any>{
            "lobbyId": this.lobbyId,
            "sockets": socketsIdsList,
        };

        // Emit the success join event to the lobby
        this.io.to(this.lobbyId).emit(Events.JOIN_LOBBY_RESPONSE_SUCCESS, jsonResponse);

    }

}