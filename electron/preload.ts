import { contextBridge, ipcRenderer } from 'electron'

console.log('[Preload] Script de preload chargé');

// API exposée au renderer process (React)
contextBridge.exposeInMainWorld('electronAPI', {
  // UC-01: Objectif Patrimonial
  goal: {
    save: (targetAmount: number, targetDate: Date) => {
      console.log('[Preload] Appel goal:save', { targetAmount, targetDate });
      return ipcRenderer.invoke('goal:save', { targetAmount, targetDate });
    },
    get: () => {
      console.log('[Preload] Appel goal:get');
      return ipcRenderer.invoke('goal:get');
    },
  },
  
  // UC-02: Assets (à venir)
  // asset: { ... },
  
  // UC-03: Snapshots (à venir)
  // snapshot: { ... },
});

console.log('[Preload] electronAPI exposé sur window');
