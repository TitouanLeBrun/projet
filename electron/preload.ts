import { contextBridge, ipcRenderer } from 'electron'

console.log('[Preload] Script de preload chargé');

// API exposée au renderer process (React)
contextBridge.exposeInMainWorld('electronAPI', {  // UC-01: Objectif Patrimonial
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
    // UC-02: Gestion des Actifs
  asset: {
    create: (data: { name: string; category: string; expectedRoi: number }) => {
      console.log('[Preload] Appel asset:create', data);
      return ipcRenderer.invoke('asset:create', data);
    },
    list: () => {
      console.log('[Preload] Appel asset:list');
      return ipcRenderer.invoke('asset:list');
    },
    get: (id: string) => {
      console.log('[Preload] Appel asset:get', id);
      return ipcRenderer.invoke('asset:get', id);
    },
    update: (id: string, data: { name: string; category: string; expectedRoi: number }) => {
      console.log('[Preload] Appel asset:update', { id, data });
      return ipcRenderer.invoke('asset:update', { id, data });
    },
    delete: (id: string) => {
      console.log('[Preload] Appel asset:delete', id);
      return ipcRenderer.invoke('asset:delete', id);
    },
  },
  
  // UC-03: Snapshots (Points de Valeur)
  snapshot: {
    createBatch: (snapshots: Array<{ assetId: number; value: number }>) => {
      console.log('[Preload] Appel snapshot:createBatch', snapshots);
      return ipcRenderer.invoke('snapshot:createBatch', snapshots);
    },
    create: (data: { assetId: number; value: number; date?: Date }) => {
      console.log('[Preload] Appel snapshot:create', data);
      return ipcRenderer.invoke('snapshot:create', data);
    },
    getByAsset: (assetId: number) => {
      console.log('[Preload] Appel snapshot:getByAsset', assetId);
      return ipcRenderer.invoke('snapshot:getByAsset', assetId);
    },
    getLatest: () => {
      console.log('[Preload] Appel snapshot:getLatest');
      return ipcRenderer.invoke('snapshot:getLatest');
    },
    getTotalValue: (date?: Date) => {
      console.log('[Preload] Appel snapshot:getTotalValue', date);
      return ipcRenderer.invoke('snapshot:getTotalValue', date);
    },
    getHistory: () => {
      console.log('[Preload] Appel snapshot:getHistory');
      return ipcRenderer.invoke('snapshot:getHistory');
    },
  },
});

console.log('[Preload] electronAPI exposé sur window');
