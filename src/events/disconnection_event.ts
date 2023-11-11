import { EventBaseInterface } from "../interfaces/event_base_interface";
import { LoggerUtils, LogTypes } from "../utils/loggerUtils";
import {Server, Socket} from "socket.io";
import {Events} from "../utils/events";

export class DisconnectionEvent implements EventBaseInterface {

    io: Server;
    socket: Socket;

    constructor(io: Server, socket: Socket) {
        this.io = io;
        this.socket = socket;
    }

    manageEvent(): void {

        LoggerUtils.log(LogTypes.INFO, `Socket disconnected (${this.socket.id})`);

        // Get the list of rooms that the socket is inside
        const rooms = this.socket.rooms;
        rooms.forEach((room: string): void => {

            // Need to check if the value is a number,
            // the given set also contains the socket id, so we need to sanitize it
            if (!isNaN(Number(room))) {

                // Generate the response in a json format
                const jsonResponseToRoom: JSON = <JSON><any>{
                    "quittedSocket": this.socket.id
                };

                // Emit the successfully quit event to the lobby
                this.io.to(room).emit(Events.QUIT_LOBBY_RESPONSE_SUCCESS, jsonResponseToRoom);
            }

        });

    }

}