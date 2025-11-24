import { contextBridge, ipcRenderer } from 'electron'

// API exposée au renderer process (React)
contextBridge.exposeInMainWorld('electronAPI', {
  // UC-01: Objectif Patrimonial
  goal: {
    save: (targetAmount: number, targetDate: Date) =>
      ipcRenderer.invoke('goal:save', { targetAmount, targetDate }),
    get: () => ipcRenderer.invoke('goal:get'),
  },
  
  // UC-02: Assets (à venir)
  // asset: { ... },
  
  // UC-03: Snapshots (à venir)
  // snapshot: { ... },
})
