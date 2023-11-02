import express from "express";
import http from "http";
import { Server } from "socket.io";
import {LoggerUtils, LogTypes} from "./utils/loggerUtils";

const serverPort = 3000;
const app = express();

const server = http.createServer(app);
const io = new Server(server);

io.on("connection", socket => {

    LoggerUtils.log(LogTypes.INFO, `Socket connected (${socket.id})`);

    socket.on('disconnect', () => {
        LoggerUtils.log(LogTypes.INFO, `Socket disconnected (${socket.id})`);
    });

});

server.listen(serverPort);
LoggerUtils.log(LogTypes.INFO, `Server listening on port ${serverPort}`);