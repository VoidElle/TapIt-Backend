import { EventBaseInterface } from "../interfaces/event_base_interface";
import { LoggerUtils, LogTypes } from "../utils/loggerUtils";
import {Server, Socket} from "socket.io";
import {Events} from "../utils/events";
import {JsonModelCreator} from "../utils/json/json_model_creator";

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

                // Make the socket leave the lobby
                await this.socket.leave(room);
                LoggerUtils.log(LogTypes.INFO, `Socket ${this.socket.id} left lobby ${room}`);

                // Emit the SUCCESS event
                const jsonResponse: JSON = JsonModelCreator.socketId(this.socket.id);
                this.io.to(room).emit(Events.QUIT_LOBBY_RESPONSE_SUCCESS, jsonResponse);

            }

        }

    }

}