import { EventBaseInterface } from "../interfaces/event_base_interface";
import { LoggerUtils, LogTypes } from "../utils/loggerUtils";
import { Socket } from "socket.io";
import { Events } from "../utils/events";

export class CreateLobbyEvent implements EventBaseInterface {

    socket: Socket;

    constructor(socket: Socket) {
        this.socket = socket;
    }

    manageEvent(): void {

        LoggerUtils.log(LogTypes.INFO, `Create lobby event triggered (${this.socket.id})`);

        const roomCode: number = this.generateSixDigitsRoomCode();

        this.socket.join(`${roomCode}`);
        LoggerUtils.log(LogTypes.INFO, `Socket joined room ${roomCode} (${this.socket.id})`);

        this.socket.emit(Events.CREATE_LOBBY, roomCode);
    }

    generateSixDigitsRoomCode(): number {
        return Math.floor(100000 + Math.random() * 900000);
    }

}