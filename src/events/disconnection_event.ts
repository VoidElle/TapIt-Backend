import { EventBaseInterface } from "../interfaces/event_base_interface";
import { LoggerUtils, LogTypes } from "../utils/loggerUtils";
import {Server, Socket} from "socket.io";
import {Events} from "../utils/events";
import {RoomUtils} from "../utils/roomUtils";

export class DisconnectionEvent implements EventBaseInterface {

    io: Server;
    socket: Socket;

    constructor(io: Server, socket: Socket) {
        this.io = io;
        this.socket = socket;
    }

    async manageEvent(): Promise<void> {

        LoggerUtils.log(LogTypes.INFO, `Socket disconnected (${this.socket.id})`);

        // Get the list of rooms that the socket is inside
        const rooms: Set<string> = this.socket.rooms;
        for (const room of rooms) {

            // Considering that each socket joins a room that has his socket id,
            // we need to check to not quit that for socket.io to work
            if (room != this.socket.id) {

                // Generate the response in a json format
                const jsonResponseToRoom: JSON = <JSON><any>{
                    "quittedSocket": this.socket.id
                };

                // Emit the successfully quit event to the lobby
                this.io.to(room).emit(Events.QUIT_LOBBY_RESPONSE_SUCCESS, jsonResponseToRoom);

                const wasSocketTheLeader: boolean = await RoomUtils.isSocketLeaderOfALobby(this.socket.id);
                if (wasSocketTheLeader) {
                    await RoomUtils.deleteLobby(this.io, room);
                    this.io.to(room).emit(Events.LEADER_LEFT_LOBBY);
                }

            }

        }

    }

}