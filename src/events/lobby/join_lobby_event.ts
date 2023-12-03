import { EventBaseInterface } from "../../interfaces/event_base_interface";
import { LoggerUtils, LogTypes } from "../../utils/loggerUtils";
import {Server, Socket} from "socket.io";
import { Events } from "../../utils/events";
import {RoomModel, RoomUtils} from "../../utils/roomUtils";
import {SocketModel} from "../../models/socket_model";
import { Messages } from "../../utils/messages";

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
        const roomExist: boolean = await RoomUtils.doesRoomExists(prisma, this.lobbyId);

        // If a lobby with the given id doesn't exist,
        // notify the socket that the lobby hasn't been found
        if (!roomExist) {

            // Generate the response in a json format
            const jsonResponse: JSON = <JSON><any>{
                "error": Messages.lobbyNotFoundErrorMessage,
            };

            // Emit the fail joining event to the socket
            this.socket.emit(Events.JOIN_LOBBY_RESPONSE_FAIL, jsonResponse);

            return;
        }

        // Make the socket join the lobby
        await this.socket.join(this.lobbyId);
        LoggerUtils.log(LogTypes.INFO, `${this.socket.id} joined lobby ${this.lobbyId}`);

        // Get lobby from the database
        const lobby: RoomModel = await RoomUtils.getLobbyFromId(prisma, this.lobbyId);

        // Creation of the leader and guest socket models
        const leaderSocketModel: SocketModel = new SocketModel(lobby.leaderSocketId, true, 0);
        const guestSocketModel: SocketModel = new SocketModel(this.socket.id, false, 1);

        // Generate the response in a json format
        const jsonResponse: JSON = <JSON><any>{
            "lobbyId": this.lobbyId,
            "sockets": [
                leaderSocketModel.toJson(),
                guestSocketModel.toJson()
            ],
        };

        // Emit the success join event to the lobby
        this.io.to(this.lobbyId).emit(Events.JOIN_LOBBY_RESPONSE_SUCCESS, jsonResponse);

    }

}