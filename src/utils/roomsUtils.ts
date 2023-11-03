import { Server } from "socket.io";

export class RoomsUtils {

    static checkIfRoomExists(io: Server, roomCode: string): boolean {
        return io.sockets.adapter.rooms.get(roomCode) != undefined;
    }

}