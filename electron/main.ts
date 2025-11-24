import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { getPrismaClient, disconnectPrisma } from './database'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit()
}

// Initialiser la base de données au démarrage
async function initializeApp() {
  try {
    console.log('[App] Initialisation de l\'application...');
    await getPrismaClient(); // Ceci créera les tables si nécessaire
    console.log('[App] ✅ Application initialisée');
  } catch (error) {
    console.error('[App] Erreur lors de l\'initialisation:', error);
  }
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  // In production, load the index.html of the app.
  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  } else {
    // In development, load the vite dev server
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  }
}

// IPC Handlers pour UC-01 : Objectif Patrimonial
ipcMain.handle('goal:save', async (_event, { targetAmount, targetDate }) => {
  try {
    const prisma = await getPrismaClient();
    
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
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de l\'objectif:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
});

ipcMain.handle('goal:get', async () => {
  try {
    const prisma = await getPrismaClient();
    const goal = await prisma.goal.findFirst({
      orderBy: { createdAt: 'desc' },
    });
    
    return { success: true, data: goal };
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'objectif:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', async () => {
  await initializeApp();
  createWindow();
});

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// Cleanup Prisma on quit
app.on('before-quit', async () => {
  await disconnectPrisma();
});
