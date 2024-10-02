import {Server} from "socket.io";

export class ServerSingleton {

    static #instance: ServerSingleton;

    private constructor() {}

    public static get instance(): ServerSingleton {

        if (!ServerSingleton.#instance) {
            ServerSingleton.#instance = new ServerSingleton();
        }

        return ServerSingleton.#instance;
    }

    public io: Server;

}