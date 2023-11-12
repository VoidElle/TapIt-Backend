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

        await prisma.lobby.delete({
            where: {
                roomId: lobbyId
            }
        });

    }

    static async getSocketsInsideLobby(io: Server, lobbyId: string): Promise<string[]> {

        const socketsIdsList: string[] = [];

        const socketsList = await io.in(lobbyId).fetchSockets();
        socketsList.forEach((socket): void => {
            socketsIdsList.push(socket.id);
        });

        return socketsIdsList;
    }

    static async doesRoomExists(prisma: PrismaClient, lobbyId: string): Promise<boolean> {

        const lobby: RoomModel = await prisma.lobby.findUnique({
            where: {
                roomId: lobbyId,
            }
        });

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