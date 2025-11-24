"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
console.log('[Preload] Script de preload chargé');
// API exposée au renderer process (React)
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    // UC-01: Objectif Patrimonial
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
    // UC-02: Assets (à venir)
    // asset: { ... },
    // UC-03: Snapshots (à venir)
    // snapshot: { ... },
});
console.log('[Preload] electronAPI exposé sur window');
