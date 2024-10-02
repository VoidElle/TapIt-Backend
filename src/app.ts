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

    // Core events
    socket.on(CustomEvents.DISCONNECT, () => new DisconnectionEvent(new EventModel(undefined, socket)).manageEvent());


}

server.listen(serverPort);
CustomLogger.log(LogType.INFO, `Server listening on port ${serverPort}`);