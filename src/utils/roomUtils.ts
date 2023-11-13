import {PrismaClient} from "@prisma/client";
import {Server} from "socket.io";

export interface RoomModel {
    id: number,
    roomId: string,
    leaderSocketId: string,
    createdAt: Date,
    updatedAt: Date
}

export class RoomUtils {

    static async createLobby(prisma: PrismaClient, lobbyId: string, leaderSocketId: string): Promise<RoomModel> {
        return prisma.lobby.create({
            data: {
                roomId: lobbyId,
                leaderSocketId: leaderSocketId
            }
        });
    }

    static async getLobbyFromId(prisma: PrismaClient, lobbyId: string): Promise<RoomModel> {
        return prisma.lobby.findUnique({
            where: {
                roomId: lobbyId,
            }
        });
    }

    static async wasSocketTheLeader(prisma: PrismaClient, socketId: string): Promise<boolean> {

        const lobby: RoomModel = await prisma.lobby.findUnique({
            where: {
                leaderSocketId: socketId
            }
        });

        return lobby != undefined;
    }

    static async deleteLobby(io: Server, prisma: PrismaClient, lobbyId: string): Promise<void> {

        // Make all sockets leave the room
        io.socketsLeave(lobbyId);

        // Delete the lobby from the database
        await prisma.lobby.delete({
            where: {
                roomId: lobbyId
            }
        });

    }

    static async getSocketsInsideLobby(io: Server, lobbyId: string): Promise<string[]> {

        // Initialize the socket ids list
        const socketsIdsList: string[] = [];

        // Get the sockets object from the room
        const socketsList = await io.in(lobbyId).fetchSockets();

        // For every socket inside the room, add the id to the socket ids list
        socketsList.forEach((socket): void => {
            socketsIdsList.push(socket.id);
        });

        return socketsIdsList;
    }

    static async doesRoomExists(prisma: PrismaClient, lobbyId: string): Promise<boolean> {

        // Find the lobby with the ORM using the lobby id
        const lobby: RoomModel = await prisma.lobby.findUnique({
            where: {
                roomId: lobbyId,
            }
        });

        // If the lobby is found, return true
        // if not, return false
        return lobby != undefined;
    }

    static async generateUniqueLobbyId(prisma: PrismaClient): Promise<string> {

        let roomCode: string = this.generateLobbyCode();
        while (await RoomUtils.doesRoomExists(prisma, roomCode)) {
            roomCode = this.generateLobbyCode();
        }

        return roomCode;
    }

    private static generateLobbyCode(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

}