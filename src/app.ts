import express from "express";
import http from "http";
import {Server} from "socket.io";


const serverPort = 3000;
const app = express();

const server = http.createServer(app);
const io = new Server(server);



server.listen(serverPort);