import { Socket } from "socket.io";

export interface EventBaseInterface {
    socket: Socket,
    manageEvent: () => void,
}