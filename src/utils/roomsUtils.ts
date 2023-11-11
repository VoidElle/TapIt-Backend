import { Server } from "socket.io";

export class RoomsUtils {

    // Function to check if a room exists
    static checkIfRoomExists(io: Server, roomCode: string): boolean {
        return io.sockets.adapter.rooms.get(roomCode) != undefined;
    }

}