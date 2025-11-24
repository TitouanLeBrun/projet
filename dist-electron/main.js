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
    // In production, load the index.html of the app.
    if (electron_1.app.isPackaged) {
        mainWindow.loadFile(path_1.default.join(__dirname, '../dist/index.html'));
    }
    else {
        // In development, load the vite dev server
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    }
};
// IPC Handlers pour UC-01 : Objectif Patrimonial
electron_1.ipcMain.handle('goal:save', async (_event, { targetAmount, targetDate }) => {
    try {
        const prisma = (0, database_1.getPrismaClient)();
        // Supprimer l'ancien objectif s'il existe (on ne garde qu'un seul objectif)
        await prisma.goal.deleteMany();
        // Créer le nouvel objectif
        const goal = await prisma.goal.create({
            data: {
                targetAmount: parseFloat(targetAmount),
                targetDate: new Date(targetDate),
            },
        });
        return { success: true, goal };
    }
    catch (error) {
        console.error('Erreur lors de la sauvegarde de l\'objectif:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
});
electron_1.ipcMain.handle('goal:get', async () => {
    try {
        const prisma = (0, database_1.getPrismaClient)();
        const goal = await prisma.goal.findFirst({
            orderBy: { createdAt: 'desc' },
        });
        return { success: true, goal };
    }
    catch (error) {
        console.error('Erreur lors de la récupération de l\'objectif:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
});
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
electron_1.app.on('ready', createWindow);
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
