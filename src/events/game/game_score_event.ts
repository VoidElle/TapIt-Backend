import { EventBaseInterface } from "../../interfaces/event_base_interface";
import { LoggerUtils, LogTypes } from "../../utils/loggerUtils";
import {Server, Socket} from "socket.io";
import {Events} from "../../utils/events";
import {RemoteSocket} from "socket.io/dist/broadcast-operator";
import {DefaultEventsMap} from "socket.io/dist/typed-events";

export class GameScoreEvent implements EventBaseInterface {

    lobbyId: string;
    socket: Socket;
    io: Server;

    constructor(lobbyId: string, socket: Socket, io: Server) {
        this.lobbyId = lobbyId;
        this.socket = socket;
        this.io = io;
    }

    async manageEvent(): Promise<void> {

        LoggerUtils.log(LogTypes.INFO, `Game score event triggered from socket ${this.socket.id}`);

        // Get the list of sockets connected in the lobby
        const socketsInRoom: RemoteSocket<DefaultEventsMap, any>[] = await this.io.in(this.lobbyId).fetchSockets();

        // Gather the victim's socket id
        let victimId: String;
        socketsInRoom.map((socket: RemoteSocket<DefaultEventsMap, any>): void => {
            if (socket.id != this.socket.id) {
                victimId = socket.id;
            }
        });

        // Generate the response in a json format
        const jsonResponse: JSON = <JSON><any>{
            "attackerId": this.socket.id,
            "victimId": victimId,
        }

        this.io.to(this.lobbyId).emit(Events.GAME_SCORE_RESPONSE_SUCCESS, jsonResponse);

    }

}