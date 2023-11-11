import {PrismaClient} from "@prisma/client";

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