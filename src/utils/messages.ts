export class Messages {

    static lobbyNotFoundErrorMessage: string = "Lobby not found";
    static socketHasAnotherLobby: string = "You have already a match in progress!";
    
    static generateErrorJson(message: string): JSON {
        return <JSON><any>{
            "error": message,
        }
    }

}