// Prisma Client Database Manager for Electron
import { PrismaClient } from '@prisma/client';
import path from 'path';
import { app } from 'electron';

let prisma: PrismaClient | null = null;

export function getPrismaClient(): PrismaClient {
  if (!prisma) {
    // En développement, utiliser le dossier prisma local
    // En production, utiliser le userData d'Electron
    const dbPath = process.env.NODE_ENV === 'development'
      ? path.join(process.cwd(), 'prisma', 'dev.db')
      : path.join(app.getPath('userData'), 'data.db');

    prisma = new PrismaClient({
      datasources: {
        db: {
          url: `file:${dbPath}`
        }
      }
    });
  }
  
  return prisma;
}

export async function disconnectPrisma() {
  if (prisma) {
    await prisma.$disconnect();
    prisma = null;
  }
}
