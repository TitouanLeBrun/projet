-- WealthTracker Database Schema
-- SQLite Database Initialization

-- UC-01: Objectif Patrimonial
CREATE TABLE IF NOT EXISTS Goal (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    targetAmount REAL NOT NULL,
    targetDate DATETIME NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- UC-02: Actifs (Assets)
CREATE TABLE IF NOT EXISTS Asset (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    expectedRoi REAL NOT NULL,
    isActive INTEGER NOT NULL DEFAULT 1,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- UC-03: Snapshots (Points de Valeur)
CREATE TABLE IF NOT EXISTS Snapshot (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    assetId INTEGER NOT NULL,
    value REAL NOT NULL,
    date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assetId) REFERENCES Asset(id) ON DELETE CASCADE
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_snapshot_asset_date ON Snapshot(assetId, date);

-- Trigger pour auto-update du updatedAt
CREATE TRIGGER IF NOT EXISTS update_goal_timestamp 
AFTER UPDATE ON Goal
BEGIN
    UPDATE Goal SET updatedAt = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_asset_timestamp 
AFTER UPDATE ON Asset
BEGIN
    UPDATE Asset SET updatedAt = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
