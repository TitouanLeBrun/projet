"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrismaClient = getPrismaClient;
exports.disconnectPrisma = disconnectPrisma;
// Prisma Client Database Manager for Electron
const client_1 = require("@prisma/client");
let prisma = null;
function getPrismaClient() {
    if (!prisma) {
        prisma = new client_1.PrismaClient();
    }
    return prisma;
}
async function disconnectPrisma() {
    if (prisma) {
        await prisma.$disconnect();
        prisma = null;
    }
}
