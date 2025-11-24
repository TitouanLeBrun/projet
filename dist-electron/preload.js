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
    // UC-03: Snapshots (à venir)
    // snapshot: { ... },
});
console.log('[Preload] electronAPI exposé sur window');
