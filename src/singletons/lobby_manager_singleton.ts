export class LobbyManagerSingleton {

    static #instance: LobbyManagerSingleton;

    private constructor() {}

    public static get instance(): LobbyManagerSingleton {

        if (!LobbyManagerSingleton.#instance) {
            LobbyManagerSingleton.#instance = new LobbyManagerSingleton();
        }

        return LobbyManagerSingleton.#instance;
    }

    public lobbyIds: string[] = [];

}