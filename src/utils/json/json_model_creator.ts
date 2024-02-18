import {SocketModel} from "../../models/socket_model";

export class JsonModelCreator {

    /**
     *
     * Generate a JSON model that contains the attacker's socket id
     * and the victim's socket id using the input params
     *
     * @param attackerSocketId
     * @param victimSocketId
     */
    static attackerAndVictimSocketIds(attackerSocketId: string, victimSocketId: string): JSON {
        return <JSON><any>{
            "attackerId": attackerSocketId,
            "victimId": victimSocketId,
        };
    }

    /**
     *
     * Generate a JSON model that contains only the socket id
     *
     * @param socketId
     */
    static socketId(socketId: string): JSON {
        return <JSON><any>{
            "socketId": socketId,
        };
    }

    /**
     *
     * Generate a JSON model that contains the model of a Lobby
     * It contains the lobby (or room) id and the list of sockets
     * that is inside it
     *
     * @param lobbyId
     * @param sockets
     */
    static lobbyInformation(lobbyId: string, sockets: SocketModel[]): JSON {
        return <JSON><any>{
            "lobbyId": lobbyId,
            "sockets": sockets.map(
                (socketModel: SocketModel) => socketModel.toJson()
            ),
        };
    }

}