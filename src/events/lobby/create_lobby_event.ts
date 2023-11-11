import { EventBaseInterface } from "../../interfaces/event_base_interface";
import { LoggerUtils, LogTypes } from "../../utils/loggerUtils";
import {Server, Socket} from "socket.io";
import { Events } from "../../utils/events";
import {RoomsUtils} from "../../utils/roomsUtils";

export class CreateLobbyEvent implements EventBaseInterface {

    socket: Socket;
    io: Server;

    constructor(socket: Socket, io: Server) {
        this.socket = socket;
        this.io = io;
    }

    async manageEvent(): Promise<void> {

        LoggerUtils.log(LogTypes.INFO, `Create lobby event triggered from socket ${this.socket.id}`);

        // Generate the room code
        let roomCode: string = this.generateSixDigitsRoomCode();

        // Prevent multiples lobbies with the same room code
        while (RoomsUtils.checkIfRoomExists(this.io, roomCode)) {
            roomCode = this.generateSixDigitsRoomCode();
        }

        // Socket joins the room
        await this.socket.join(roomCode);
        LoggerUtils.log(LogTypes.INFO, `Socket ${this.socket.id} joined room ${roomCode}`);

        // Todo: Save lobby data in the database

        // Generate the response in a json format
        const jsonResponse: JSON = <JSON><any>{
            "lobbyId": roomCode,
            "sockets": [this.socket.id]
        }

        // Emit the success event
        this.socket.emit(Events.CREATE_LOBBY_RESPONSE_SUCCESS, jsonResponse);
    }

    // Function to generate a six-digit code that will
    // represent the lobby's identifier
    generateSixDigitsRoomCode(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

}