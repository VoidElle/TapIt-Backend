export class SocketModel {

    socketId: string;
    isLeader: boolean;

    constructor(socketId: string, isLeader: boolean) {
        this.socketId = socketId;
        this.isLeader = isLeader;
    }

    toJson(): JSON {
        return <JSON><any>{
            "socketId": this.socketId,
            "isLeader": this.isLeader,
        };
    }

}