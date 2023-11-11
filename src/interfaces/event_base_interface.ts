import {Server, Socket} from "socket.io";

export interface EventBaseInterface {
    socket: Socket,
    manageEvent: () => void,
    io: Server,
}