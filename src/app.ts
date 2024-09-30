import express from "express";
import http from "http";
import {Server} from "socket.io";
import { LoggerUtils, LogTypes } from "./utils/loggerUtils";
import { Events } from "./utils/events";

import { DisconnectionEvent } from "./events/disconnection_event";
import { CreateLobbyEvent } from "./events/lobby/create_lobby_event";

import {JoinLobbyEvent} from "./events/lobby/join_lobby_event";
import {QuitLobbyEvent} from "./events/lobby/quit_lobby_event";
import {PlayerChangeReadyStatusEvent} from "./events/lobby/player_change_ready_status";
import {StartLobbyEvent} from "./events/lobby/start_lobby_event";
import {GameScoreEvent} from "./events/game/game_score_event";
import {GameWinEvent} from "./events/game/game_win_event";
import connectDB from "./db/connectDB";


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
    socket.on(Events.PLAYER_CHANGE_READY_STATUS, (lobbyId: string) => new PlayerChangeReadyStatusEvent(lobbyId, socket, io).manageEvent());
    socket.on(Events.START_LOBBY_REQUEST, (lobbyId: string) => new StartLobbyEvent(lobbyId, socket, io).manageEvent());

    // Game management requests
    socket.on(Events.GAME_SCORE_REQUEST, (lobbyId: string) => new GameScoreEvent(lobbyId, socket, io).manageEvent());
    socket.on(Events.GAME_WIN_REQUEST, (lobbyId: string) => new GameWinEvent(lobbyId, socket, io).manageEvent());

});

server.listen(serverPort);
LoggerUtils.log(LogTypes.INFO, `Server listening on port ${serverPort}`);