import express from "express";
import http from "http";
import {Server} from "socket.io";
import { LoggerUtils, LogTypes } from "./utils/loggerUtils";
import { Events } from "./utils/events";

import { DisconnectionEvent } from "./events/disconnection_event";
import { CreateLobbyEvent } from "./events/lobby/create_lobby_event";

import connectDB from './db/connectDB'
import {JoinLobbyEvent} from "./events/lobby/join_lobby_event";
import {QuitLobbyEvent} from "./events/lobby/quit_lobby_event";


const serverPort = 3000;
const app = express();

const server = http.createServer(app);
const io = new Server(server);

connectDB();

io.on(Events.CONNECTION, socket => {

    LoggerUtils.log(LogTypes.INFO, `Socket connected (${socket.id})`);

    // Core events
    socket.on(Events.DISCONNECT, () => new DisconnectionEvent(io, socket).manageEvent());

    // Lobby management requests
    socket.on(Events.CREATE_LOBBY_REQUEST, () => new CreateLobbyEvent(socket, io).manageEvent());
    socket.on(Events.JOIN_LOBBY_REQUEST, (lobbyId: string) => new JoinLobbyEvent(lobbyId, socket, io).manageEvent());
    socket.on(Events.QUIT_LOBBY_REQUEST, (lobbyId: string) => new QuitLobbyEvent(lobbyId, socket, io).manageEvent());

});

server.listen(serverPort);
LoggerUtils.log(LogTypes.INFO, `Server listening on port ${serverPort}`);