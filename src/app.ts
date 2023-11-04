import express from "express";
import http from "http";
import { Server } from "socket.io";
import { LoggerUtils, LogTypes } from "./utils/loggerUtils";
import { Events } from "./utils/events";

import { DisconnectEvent } from "./events/disconnect_event";
import { CreateLobbyEvent } from "./events/create_lobby_event";
import { JoinLobbyEvent } from "./events/join_lobby_event";
import { ScoreEvent } from "./events/score_event";
import {GetSocketsInfoEvent} from "./events/get_sockets_info_event";
import {SetReadyStatusEvent} from "./events/set_ready_status_event";

const serverPort = 3000;
const app = express();

const server = http.createServer(app);
const io = new Server(server);

io.on(Events.CONNECTION, socket => {

    LoggerUtils.log(LogTypes.INFO, `Socket connected (${socket.id})`);

    // Managing events
    socket.on(Events.DISCONNECT, () => new DisconnectEvent(socket).manageEvent());
    socket.on(Events.CREATE_LOBBY, () => new CreateLobbyEvent(socket).manageEvent());
    socket.on(Events.JOIN_LOBBY, (roomCode: string) => new JoinLobbyEvent(socket, roomCode, io).manageEvent());
    socket.on(Events.SET_READY_STATUS, (roomCode: string) => new SetReadyStatusEvent(socket, roomCode, io).manageEvent());
    socket.on(Events.SCORE, () => new ScoreEvent(socket).manageEvent());
    socket.on(Events.GET_SOCKETS_INFO, (roomCode: string) => new GetSocketsInfoEvent(socket, roomCode, io).manageEvent());

});

server.listen(serverPort);
LoggerUtils.log(LogTypes.INFO, `Server listening on port ${serverPort}`);