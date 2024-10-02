import express from "express";
import http from "http";
import {Server, Socket} from "socket.io";
import { CustomEvents } from "./enums/custom_events";
import {CustomLogger, LogType} from "./utils/custom_logger";
import {ServerSingleton} from "./singletons/server_singleton";
import {DisconnectionEvent} from "./events/disconnection_event";
import {EventModel} from "./models/event_model";

const serverPort = 3000;
const app = express();

const server = http.createServer(app);

const serverSession: ServerSingleton = ServerSingleton.instance;
serverSession.io = new Server(server);

serverSession.io.on(CustomEvents.CONNECTION, socket => {
    CustomLogger.log(LogType.INFO, `Socket connected (${socket.id})`);
    eventHandling(socket);
});

function eventHandling(socket: Socket) {

    const eventHandlers = {

        // Core events
        [CustomEvents.DISCONNECT]: () => new DisconnectionEvent(new EventModel(undefined, socket)).manageEvent(),

        /*[Events.JOIN_LOBBY_REQUEST]: (lobbyId: string) => new JoinLobbyEvent(lobbyId, socket, io),
        [Events.QUIT_LOBBY_REQUEST]: (lobbyId: string) => new QuitLobbyEvent(lobbyId, socket, io),
        [Events.PLAYER_CHANGE_READY_STATUS]: (lobbyId: string) => new PlayerChangeReadyStatusEvent(lobbyId, socket, io),
        [Events.START_LOBBY_REQUEST]: (lobbyId: string) => new StartLobbyEvent(lobbyId, socket, io)*/
    };

    // Loop for listening all the events
    Object.keys(eventHandlers).forEach((event) => {
        socket.on(event, (...args) => {

            const handler = eventHandlers[event](...args);
            if (!handler || !handler.manageEvent) {
                return;
            }

            handler.manageEvent();
        });
    });

}

server.listen(serverPort);
CustomLogger.log(LogType.INFO, `Server listening on port ${serverPort}`);