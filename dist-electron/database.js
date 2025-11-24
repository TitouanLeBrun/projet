"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrismaClient = getPrismaClient;
exports.disconnectPrisma = disconnectPrisma;
// Prisma Client Database Manager for Electron
const client_1 = require("@prisma/client");
const path_1 = __importDefault(require("path"));
const electron_1 = require("electron");
const fs_1 = __importDefault(require("fs"));
let prisma = null;
async function getPrismaClient() {
    if (!prisma) {
        // Déterminer le chemin de la base de données
        const isDev = process.env.NODE_ENV === 'development';
        const dbPath = isDev
            ? path_1.default.join(process.cwd(), 'prisma', 'dev.db')
            : path_1.default.join(electron_1.app.getPath('userData'), 'data.db');
        // Définir l'URL de la base de données via variable d'environnement
        process.env.DATABASE_URL = `file:${dbPath}`;
        console.log('[Database] Initialisation de Prisma...');
        console.log('[Database] Chemin BDD:', dbPath);
        console.log('[Database] DATABASE_URL:', process.env.DATABASE_URL);
        // Créer la base de données vide si elle n'existe pas
        const dbDir = path_1.default.dirname(dbPath);
        if (!fs_1.default.existsSync(dbDir)) {
            fs_1.default.mkdirSync(dbDir, { recursive: true });
        }
        if (!fs_1.default.existsSync(dbPath)) {
            fs_1.default.writeFileSync(dbPath, '');
            console.log('[Database] Fichier de base créé');
        }
        prisma = new client_1.PrismaClient({
            log: isDev ? ['error', 'warn'] : ['error'],
        });
        // Créer les tables si elles n'existent pas
        await initializeDatabase();
    }
    return prisma;
}
async function initializeDatabase() {
    if (!prisma)
        return;
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
    }
    catch (error) {
        console.error('[Database] Erreur lors de l\'initialisation:', error);
        throw error;
    }
}
async function disconnectPrisma() {
    if (prisma) {
        await prisma.$disconnect();
        prisma = null;
        console.log('[Database] Déconnexion de Prisma');
    }
}
