export enum Events {

    // Core socket events
    CONNECTION = "connection",
    DISCONNECT = "disconnecting",

    // Lobby creation events
    CREATE_LOBBY_REQUEST = "CREATE_LOBBY_REQUEST",
    CREATE_LOBBY_RESPONSE_SUCCESS = "CREATE_LOBBY_RESPONSE_SUCCESS",
    CREATE_LOBBY_RESPONSE_FAIL = "CREATE_LOBBY_RESPONSE_FAIL",

    // Lobby join events
    JOIN_LOBBY_REQUEST = "JOIN_LOBBY_REQUEST",
    JOIN_LOBBY_RESPONSE_SUCCESS = "JOIN_LOBBY_RESPONSE_SUCCESS",
    JOIN_LOBBY_RESPONSE_FAIL = "JOIN_LOBBY_RESPONSE_FAIL",

    // Lobby quit events
    QUIT_LOBBY_REQUEST = "QUIT_LOBBY_REQUEST",
    QUIT_LOBBY_RESPONSE_SUCCESS = "QUIT_LOBBY_RESPONSE_SUCCESS",
    QUIT_LOBBY_RESPONSE_FAIL = "QUIT_LOBBY_RESPONSE_FAIL",

    // Lobby utils
    LEADER_LEFT_LOBBY = "LEADER_LEFT_LOBBY",
    PLAYER_CHANGE_READY_STATUS = "PLAYER_CHANGE_READY_STATUS"

}