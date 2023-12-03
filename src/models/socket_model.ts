export class SocketModel {

    socketId: string;
    isLeader: boolean;
    order: number;

    constructor(socketId: string, isLeader: boolean, order: number) {
        this.socketId = socketId;
        this.isLeader = isLeader;
        this.order = order;
    }

    toJson(): JSON {
        return <JSON><any>{
            "socketId": this.socketId,
            "isLeader": this.isLeader,
            "order": this.order,
        };
    }

}