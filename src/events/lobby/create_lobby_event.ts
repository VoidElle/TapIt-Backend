import {EventBaseInterface} from "../../interfaces/event_base_interface";
import {LoggerUtils, LogTypes} from "../../utils/loggerUtils";
import {Server, Socket} from "socket.io";
import {Events} from "../../utils/events";
import {RoomUtils, RoomModel} from "../../utils/roomUtils";
import {SocketModel} from "../../models/socket_model";
import {Messages} from "../../utils/messages";

export class CreateLobbyEvent implements EventBaseInterface {

    socket: Socket;
    io: Server;

    constructor(socket: Socket, io: Server) {
        this.socket = socket;
        this.io = io;
    }

    async manageEvent(): Promise<void> {

        LoggerUtils.log(LogTypes.INFO, `Create lobby event triggered from socket ${this.socket.id}`);

        const wasSocketTheLeader: boolean = await RoomUtils.isSocketLeaderOfALobby(this.socket.id);
        if (wasSocketTheLeader) {

            // Emit the FAIL event
            const jsonResponse: JSON = Messages.generateErrorJson(Messages.socketHasAnotherLobby);
            this.socket.emit(Events.CREATE_LOBBY_RESPONSE_FAIL, jsonResponse);

            return;
        }

        // Generate the room code
        let roomCode: string = await RoomUtils.generateUniqueLobbyId();

        // Socket joins the room
        await this.socket.join(roomCode);
        LoggerUtils.log(LogTypes.INFO, `Socket ${this.socket.id} joined room ${roomCode}`);

        // Saving lobby's data to the database
        const createdLobby: RoomModel = await RoomUtils.createLobby(roomCode, this.socket.id);

        // Creation of the leader socket model
        const leaderSocketModel: SocketModel = new SocketModel(createdLobby.leaderSocketId, true, 0);

        // Generate the response in a json format
        const jsonResponse: JSON = <JSON><any>{
            "lobbyId": createdLobby.roomId,
            "sockets": [
                leaderSocketModel.toJson()
            ]
        }

        // Emit the success event
        this.socket.emit(Events.CREATE_LOBBY_RESPONSE_SUCCESS, jsonResponse);
    }

}