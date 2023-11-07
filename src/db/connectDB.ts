import { PrismaClient } from '@prisma/client';
import {LoggerUtils, LogTypes} from "../utils/loggerUtils";

declare global {
    var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient({ log: ['info'] });

if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma;
}

async function connectDB(): Promise<void> {
    try {
        await prisma.$connect();
        LoggerUtils.log(LogTypes.INFO, `Database connected successfully`);
    } catch (error) {
        LoggerUtils.log(LogTypes.ERROR, error);
        await prisma.$disconnect();
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

export default connectDB;