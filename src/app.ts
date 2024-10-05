import express, { Express } from "express";
import http from "http";
import { Server } from "socket.io";
import { ClientEvents } from "./enums/client_events";
import { CustomLogger, LogType } from "./utils/custom_logger";
import { ServerSingleton } from "./singletons/server_singleton";
import eventsHandling from "./utils/events_handler";

const serverPort = 3000;
const app: Express = express();

const server: http.Server = http.createServer(app);

const serverSession: ServerSingleton = ServerSingleton.instance;
serverSession.io = new Server(server);

serverSession.io.on(ClientEvents.CONNECTION, socket => {
    CustomLogger.log(LogType.INFO, `Socket connected (${socket.id})`);
    eventsHandling(socket);
});

server.listen(serverPort);
CustomLogger.log(LogType.INFO, `Server listening on port ${serverPort}`);