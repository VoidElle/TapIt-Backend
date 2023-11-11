import { createServer } from "node:http";
import { type AddressInfo } from "node:net";
import { io as ioc, type Socket as ClientSocket } from "socket.io-client";
import { Server, type Socket as ServerSocket } from "socket.io";
import { assert } from "chai";
import { Events } from "../src/utils/events";

function generateSixDigitsRoomCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

describe("Lobby creation / destruction tests", () => {

    let io: Server;

    let serverSocket: ServerSocket;
    let clientSocket: ClientSocket;

    // Function to create the server and initialize the socket
    before((done) => {
        const httpServer = createServer();
        io = new Server(httpServer);
        httpServer.listen(() => {
            const port = (httpServer.address() as AddressInfo).port;
            clientSocket = ioc(`http://localhost:${port}`);
            io.on("connection", (socket) => {
                serverSocket = socket;
            });
            clientSocket.on("connect", done);
        });
    });

    // Function to dispose the server and the socket
    after(() => {
        io.close();
        clientSocket.disconnect();
    });

    it("Create a lobby", (done) => {

        const lobbyId = generateSixDigitsRoomCode();

        clientSocket.on(Events.JOIN_LOBBY_RESPONSE_SUCCESS, (arg) => {

            assert.equal(arg["lobbyId"], lobbyId);
            assert.equal(arg["sockets"][0], clientSocket.id);

            done();
        });

        const jsonResponse: JSON = <JSON><any>{
            "lobbyId": lobbyId,
            "sockets": [clientSocket.id]
        }

        serverSocket.emit(Events.JOIN_LOBBY_RESPONSE_SUCCESS, jsonResponse);
    });

});