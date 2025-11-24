"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const database_1 = require("./database");
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    electron_1.app.quit();
}
// Initialiser la base de données au démarrage
async function initializeApp() {
    try {
        console.log('[App] Initialisation de l\'application...');
        await (0, database_1.getPrismaClient)(); // Ceci créera les tables si nécessaire
        console.log('[App] ✅ Application initialisée');
    }
    catch (error) {
        console.error('[App] Erreur lors de l\'initialisation:', error);
    }
}
const createWindow = () => {
    // Create the browser window.
    const mainWindow = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path_1.default.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });
    // Maximiser la fenêtre au démarrage
    mainWindow.maximize();
    // In production, load the index.html of the app.
    if (electron_1.app.isPackaged) {
        mainWindow.loadFile(path_1.default.join(__dirname, '../dist/index.html'));
    }
    else {
        // In development, load the vite dev server
        mainWindow.loadURL('http://localhost:5173');
        //mainWindow.webContents.openDevTools()
    }
};
// IPC Handlers pour UC-01 : Objectif Patrimonial
electron_1.ipcMain.handle('goal:save', async (_event, { targetAmount, targetDate }) => {
    try {
        const prisma = await (0, database_1.getPrismaClient)();
        // Supprimer l'ancien objectif s'il existe (on ne garde qu'un seul objectif)
        await prisma.goal.deleteMany();
        // Créer le nouvel objectif
        const goal = await prisma.goal.create({
            data: {
                targetAmount: parseFloat(targetAmount),
                targetDate: new Date(targetDate),
            },
        });
        return { success: true, data: goal };
    }
    catch (error) {
        console.error('Erreur lors de la sauvegarde de l\'objectif:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
});
electron_1.ipcMain.handle('goal:get', async () => {
    try {
        const prisma = await (0, database_1.getPrismaClient)();
        const goal = await prisma.goal.findFirst({
            orderBy: { createdAt: 'desc' },
        });
        return { success: true, data: goal };
    }
    catch (error) {
        console.error('Erreur lors de la récupération de l\'objectif:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
});
// IPC Handlers pour UC-02 : Gestion des Actifs
electron_1.ipcMain.handle('asset:create', async (_event, data) => {
    try {
        const prisma = await (0, database_1.getPrismaClient)();
        const asset = await prisma.asset.create({
            data: {
                name: data.name,
                category: data.category,
                expectedRoi: parseFloat(data.expectedRoi),
            },
        });
        return { success: true, data: asset };
    }
    catch (error) {
        console.error('Erreur lors de la création de l\'actif:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
});
electron_1.ipcMain.handle('asset:list', async () => {
    try {
        const prisma = await (0, database_1.getPrismaClient)();
        const assets = await prisma.asset.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' },
        });
        return { success: true, data: assets };
    }
    catch (error) {
        console.error('Erreur lors de la récupération des actifs:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
});
electron_1.ipcMain.handle('asset:get', async (_event, id) => {
    try {
        const prisma = await (0, database_1.getPrismaClient)();
        const asset = await prisma.asset.findUnique({
            where: { id: parseInt(id) },
        });
        return { success: true, data: asset };
    }
    catch (error) {
        console.error('Erreur lors de la récupération de l\'actif:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
});
electron_1.ipcMain.handle('asset:update', async (_event, { id, data }) => {
    try {
        const prisma = await (0, database_1.getPrismaClient)();
        const asset = await prisma.asset.update({
            where: { id: parseInt(id) },
            data: {
                name: data.name,
                category: data.category,
                expectedRoi: parseFloat(data.expectedRoi),
            },
        });
        return { success: true, data: asset };
    }
    catch (error) {
        console.error('Erreur lors de la mise à jour de l\'actif:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
});
electron_1.ipcMain.handle('asset:delete', async (_event, id) => {
    try {
        const prisma = await (0, database_1.getPrismaClient)();
        // Soft delete: marquer comme inactif
        const asset = await prisma.asset.update({
            where: { id: parseInt(id) },
            data: { isActive: false },
        });
        return { success: true, data: asset };
    }
    catch (error) {
        console.error('Erreur lors de la suppression de l\'actif:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
});
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
electron_1.app.on('ready', async () => {
    await initializeApp();
    createWindow();
});
// Quit when all windows are closed, except on macOS.
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
// Cleanup Prisma on quit
electron_1.app.on('before-quit', async () => {
    await (0, database_1.disconnectPrisma)();
});
