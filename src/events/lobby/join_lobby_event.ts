import { EventBaseInterface } from "../../interfaces/event_base_interface";
import { LoggerUtils, LogTypes } from "../../utils/loggerUtils";
import {Server, Socket} from "socket.io";
import { Events } from "../../utils/events";
import {RoomModel, RoomUtils} from "../../utils/roomUtils";
import {SocketModel} from "../../models/socket_model";
import { Messages } from "../../utils/messages";
import {JsonModelCreator} from "../../utils/json/json_model_creator";

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
        const roomExist: boolean = await RoomUtils.doesRoomExists(this.lobbyId);

        // If a lobby with the given id doesn't exist,
        // notify the socket that the lobby hasn't been found
        if (!roomExist) {

            // Emit the fail joining event to the socket
            const jsonResponse: JSON = Messages.generateErrorJson(Messages.lobbyNotFoundErrorMessage);
            this.socket.emit(Events.JOIN_LOBBY_RESPONSE_FAIL, jsonResponse);

            return;
        }

        // Make the socket join the lobby
        await this.socket.join(this.lobbyId);
        LoggerUtils.log(LogTypes.INFO, `${this.socket.id} joined lobby ${this.lobbyId}`);

        // Get lobby from the database
        const lobby: RoomModel = await RoomUtils.getLobbyFromId(this.lobbyId);

        // Creation of the leader and guest socket models
        const leaderSocketModel: SocketModel = new SocketModel(lobby.leaderSocketId, true, 0);
        const guestSocketModel: SocketModel = new SocketModel(this.socket.id, false, 1);

        // Emit the SUCCESS event
        const jsonResponse: JSON = JsonModelCreator.lobbyInformation(this.lobbyId, [ leaderSocketModel, guestSocketModel ]);
        this.io.to(this.lobbyId).emit(Events.JOIN_LOBBY_RESPONSE_SUCCESS, jsonResponse);

    }

}