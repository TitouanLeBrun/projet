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

  // Maximiser la fenêtre au démarrage
  mainWindow.maximize()

  // In production, load the index.html of the app.
  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  } else {
    // In development, load the vite dev server
    mainWindow.loadURL('http://localhost:5173')
    //mainWindow.webContents.openDevTools()
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

// IPC Handlers pour UC-02 : Gestion des Actifs
ipcMain.handle('asset:create', async (_event, data) => {
  try {
    const prisma = await getPrismaClient();
    
    const asset = await prisma.asset.create({
      data: {
        name: data.name,
        category: data.category,
        expectedRoi: parseFloat(data.expectedRoi),
      },
    });
    
    return { success: true, data: asset };
  } catch (error) {
    console.error('Erreur lors de la création de l\'actif:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
});

ipcMain.handle('asset:list', async () => {
  try {
    const prisma = await getPrismaClient();
    const assets = await prisma.asset.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    
    return { success: true, data: assets };
  } catch (error) {
    console.error('Erreur lors de la récupération des actifs:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
});

ipcMain.handle('asset:get', async (_event, id) => {
  try {
    const prisma = await getPrismaClient();
    const asset = await prisma.asset.findUnique({
      where: { id: parseInt(id) },
    });
    
    return { success: true, data: asset };
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'actif:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
});

ipcMain.handle('asset:update', async (_event, { id, data }) => {
  try {
    const prisma = await getPrismaClient();
    
    const asset = await prisma.asset.update({
      where: { id: parseInt(id) },
      data: {
        name: data.name,
        category: data.category,
        expectedRoi: parseFloat(data.expectedRoi),
      },
    });
    
    return { success: true, data: asset };
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'actif:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
});

ipcMain.handle('asset:delete', async (_event, id) => {
  try {
    const prisma = await getPrismaClient();
    
    // Soft delete: marquer comme inactif
    const asset = await prisma.asset.update({
      where: { id: parseInt(id) },
      data: { isActive: false },
    });
    
    return { success: true, data: asset };
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'actif:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
});

// IPC Handlers pour UC-03 : Snapshots (Points de Valeur)
ipcMain.handle('snapshot:createBatch', async (_event, snapshots) => {
  try {
    const prisma = await getPrismaClient();
    
    // Créer tous les snapshots en une transaction
    const createdSnapshots = await prisma.$transaction(
      snapshots.map((snapshot: { assetId: number; value: number }) =>
        prisma.snapshot.create({
          data: {
            assetId: snapshot.assetId,
            value: parseFloat(snapshot.value.toString()),
            date: new Date(),
          },
        })
      )
    );
    
    return { success: true, data: createdSnapshots };
  } catch (error) {
    console.error('Erreur lors de la création des snapshots:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
});

ipcMain.handle('snapshot:create', async (_event, data) => {
  try {
    const prisma = await getPrismaClient();
    
    const snapshot = await prisma.snapshot.create({
      data: {
        assetId: parseInt(data.assetId),
        value: parseFloat(data.value),
        date: data.date ? new Date(data.date) : new Date(),
      },
    });
    
    return { success: true, data: snapshot };
  } catch (error) {
    console.error('Erreur lors de la création du snapshot:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
});

ipcMain.handle('snapshot:getByAsset', async (_event, assetId) => {
  try {
    const prisma = await getPrismaClient();
    const snapshots = await prisma.snapshot.findMany({
      where: { assetId: parseInt(assetId) },
      orderBy: { date: 'desc' },
      include: { asset: true },
    });
    
    return { success: true, data: snapshots };
  } catch (error) {
    console.error('Erreur lors de la récupération des snapshots:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
});

ipcMain.handle('snapshot:getLatest', async () => {
  try {
    const prisma = await getPrismaClient();
    
    // Récupérer tous les actifs actifs
    const assets = await prisma.asset.findMany({
      where: { isActive: true },
    });
    
    // Pour chaque actif, récupérer le dernier snapshot
    const latestSnapshots = await Promise.all(
      assets.map(async (asset) => {
        const snapshot = await prisma.snapshot.findFirst({
          where: { assetId: asset.id },
          orderBy: { date: 'desc' },
        });
        
        return {
          asset,
          snapshot,
        };
      })
    );
    
    return { success: true, data: latestSnapshots };
  } catch (error) {
    console.error('Erreur lors de la récupération des derniers snapshots:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
});

ipcMain.handle('snapshot:getTotalValue', async (_event, date) => {
  try {
    const prisma = await getPrismaClient();
    
    const targetDate = date ? new Date(date) : new Date();
    
    // Récupérer tous les actifs actifs
    const assets = await prisma.asset.findMany({
      where: { isActive: true },
    });
    
    // Pour chaque actif, récupérer le snapshot le plus proche de la date
    let totalValue = 0;
    
    for (const asset of assets) {
      const snapshot = await prisma.snapshot.findFirst({
        where: {
          assetId: asset.id,
          date: { lte: targetDate },
        },
        orderBy: { date: 'desc' },
      });
      
      if (snapshot) {
        totalValue += snapshot.value;
      }
    }
    
    return { success: true, data: { totalValue, date: targetDate } };
  } catch (error) {
    console.error('Erreur lors du calcul de la valeur totale:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
});

ipcMain.handle('snapshot:getHistory', async () => {
  try {
    const prisma = await getPrismaClient();
    
    const snapshots = await prisma.snapshot.findMany({
      include: { asset: true },
      orderBy: { date: 'asc' },
    });
    
    // Grouper par date et calculer le total par date
    const groupedByDate = snapshots.reduce((acc, snapshot) => {
      const dateKey = snapshot.date.toISOString().split('T')[0];
      
      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: snapshot.date,
          snapshots: [],
          total: 0,
        };
      }
      
      acc[dateKey].snapshots.push(snapshot);
      acc[dateKey].total += snapshot.value;
      
      return acc;
    }, {} as Record<string, { date: Date; snapshots: any[]; total: number }>);
    
    return { success: true, data: Object.values(groupedByDate) };
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique:', error);
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
