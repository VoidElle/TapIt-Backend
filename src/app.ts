import express from "express";
import http from "http";
import { Server } from "socket.io";
import { LoggerUtils, LogTypes } from "./utils/loggerUtils";
import { Events } from "./utils/events";

import { DisconnectEvent } from "./events/disconnect_event";
import { CreateLobbyEvent } from "./events/lobby/create_lobby_event";

import connectDB from './db/connectDB'


const serverPort = 3000;
const app = express();

const server = http.createServer(app);
const io = new Server(server);

connectDB();

io.on(Events.CONNECTION, socket => {

    LoggerUtils.log(LogTypes.INFO, `Socket connected (${socket.id})`);

    socket.on(Events.DISCONNECT, () => new DisconnectEvent(socket).manageEvent());

    // Lobby management requests
    socket.on(Events.CREATE_LOBBY_REQUEST, () => new CreateLobbyEvent(socket, io).manageEvent());


});

server.listen(serverPort);
LoggerUtils.log(LogTypes.INFO, `Server listening on port ${serverPort}`);