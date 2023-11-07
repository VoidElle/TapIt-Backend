import { EventBaseInterface } from "../interfaces/event_base_interface";
import { LoggerUtils, LogTypes } from "../utils/loggerUtils";
import { Socket } from "socket.io";
import { Events } from "../utils/events";

export class CreateLobbyEvent implements EventBaseInterface {

    socket: Socket;

    constructor(socket: Socket) {
        this.socket = socket;
    }

    async manageEvent(): Promise<void> {

        LoggerUtils.log(LogTypes.INFO, `Create lobby event triggered (${this.socket.id})`);

        const roomCode: number = this.generateSixDigitsRoomCode();

        this.socket.join(`${roomCode}`);

        const alreadyExistingLobbies = await prisma.lobby.findMany({
            where: {
                leaderSocketId: this.socket.id,
            }
        });

        console.log(`FOUND: ${JSON.stringify(alreadyExistingLobbies, undefined, 2)}`);

        const lobby = await prisma.lobby.create({
            data: {
                roomId: `${roomCode}`,
                leaderSocketId: this.socket.id,
            }
        });

        console.log(`Socket ${this.socket.id} created and joined a new lobby: ${JSON.stringify(lobby, undefined, 2)}`);

        this.socket.emit(Events.CREATE_LOBBY, roomCode);
    }

    generateSixDigitsRoomCode(): number {
        return Math.floor(100000 + Math.random() * 900000);
    }

}