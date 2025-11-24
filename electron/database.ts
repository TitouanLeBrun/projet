// Prisma Client Database Manager for Electron
import { PrismaClient } from '@prisma/client';
import path from 'path';
import { app } from 'electron';
import fs from 'fs';

let prisma: PrismaClient | null = null;

export async function getPrismaClient(): Promise<PrismaClient> {
  if (!prisma) {
    // Déterminer le chemin de la base de données
    const isDev = process.env.NODE_ENV === 'development';
    const dbDir = isDev
      ? path.join(process.cwd(), 'prisma')
      : path.join(app.getPath('userData'));
    
    const dbPath = path.join(dbDir, 'dev.db');
    
    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    
    // Définir l'URL de la base de données via variable d'environnement
    process.env.DATABASE_URL = `file:${dbPath}`;
    
    console.log('[Database] Initialisation de Prisma...');
    console.log('[Database] Chemin BDD:', dbPath);
    
    prisma = new PrismaClient({
      log: isDev ? ['query', 'error', 'warn'] : ['error'],
    });
    
    // Créer les tables si elles n'existent pas
    await initializeDatabase();
  }
  
  return prisma;
}

async function initializeDatabase() {
  if (!prisma) return;
  
  try {
    console.log('[Database] Vérification/Création des tables...');
    
    // Exécuter du SQL brut pour créer les tables
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS Goal (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        targetAmount REAL NOT NULL,
        targetDate DATETIME NOT NULL,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS Asset (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        expectedRoi REAL NOT NULL,
        isActive INTEGER NOT NULL DEFAULT 1,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS Snapshot (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        assetId INTEGER NOT NULL,
        value REAL NOT NULL,
        date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (assetId) REFERENCES Asset(id) ON DELETE CASCADE
      )
    `);
    
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS idx_snapshot_asset_date ON Snapshot(assetId, date)
    `);
    
    console.log('[Database] ✅ Base de données initialisée avec succès');
  } catch (error) {
    console.error('[Database] Erreur lors de l\'initialisation:', error);
    throw error;
  }
}

export async function disconnectPrisma() {
  if (prisma) {
    await prisma.$disconnect();
    prisma = null;
    console.log('[Database] Déconnexion de Prisma');
  }
}
