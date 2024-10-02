import { Socket } from "socket.io";

export class EventModel {

    lobbyId: string | undefined;
    socket: Socket;

    constructor(lobbyId: string | undefined, socket: Socket) {
        this.lobbyId = lobbyId;
        this.socket = socket;
    }

    toJson(): JSON {
        return <JSON><any>{
            "lobbyId": this.lobbyId,
            "socket": this.socket,
        };
    }

}