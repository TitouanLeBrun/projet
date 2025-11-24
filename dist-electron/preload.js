"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
console.log('[Preload] Script de preload chargé');
// API exposée au renderer process (React)
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    goal: {
        save: (targetAmount, targetDate) => {
            console.log('[Preload] Appel goal:save', { targetAmount, targetDate });
            return electron_1.ipcRenderer.invoke('goal:save', { targetAmount, targetDate });
        },
        get: () => {
            console.log('[Preload] Appel goal:get');
            return electron_1.ipcRenderer.invoke('goal:get');
        },
    },
    // UC-02: Gestion des Actifs
    asset: {
        create: (data) => {
            console.log('[Preload] Appel asset:create', data);
            return electron_1.ipcRenderer.invoke('asset:create', data);
        },
        list: () => {
            console.log('[Preload] Appel asset:list');
            return electron_1.ipcRenderer.invoke('asset:list');
        },
        get: (id) => {
            console.log('[Preload] Appel asset:get', id);
            return electron_1.ipcRenderer.invoke('asset:get', id);
        },
        update: (id, data) => {
            console.log('[Preload] Appel asset:update', { id, data });
            return electron_1.ipcRenderer.invoke('asset:update', { id, data });
        },
        delete: (id) => {
            console.log('[Preload] Appel asset:delete', id);
            return electron_1.ipcRenderer.invoke('asset:delete', id);
        },
    },
    // UC-03: Snapshots (Points de Valeur)
    snapshot: {
        createBatch: (snapshots) => {
            console.log('[Preload] Appel snapshot:createBatch', snapshots);
            return electron_1.ipcRenderer.invoke('snapshot:createBatch', snapshots);
        },
        create: (data) => {
            console.log('[Preload] Appel snapshot:create', data);
            return electron_1.ipcRenderer.invoke('snapshot:create', data);
        },
        getByAsset: (assetId) => {
            console.log('[Preload] Appel snapshot:getByAsset', assetId);
            return electron_1.ipcRenderer.invoke('snapshot:getByAsset', assetId);
        },
        getLatest: () => {
            console.log('[Preload] Appel snapshot:getLatest');
            return electron_1.ipcRenderer.invoke('snapshot:getLatest');
        },
        getTotalValue: (date) => {
            console.log('[Preload] Appel snapshot:getTotalValue', date);
            return electron_1.ipcRenderer.invoke('snapshot:getTotalValue', date);
        },
        getHistory: () => {
            console.log('[Preload] Appel snapshot:getHistory');
            return electron_1.ipcRenderer.invoke('snapshot:getHistory');
        },
    },
});
console.log('[Preload] electronAPI exposé sur window');
