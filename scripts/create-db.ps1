# Script PowerShell pour créer la base de données SQLite
# Usage: .\scripts\create-db.ps1

$dbPath = "prisma\dev.db"

Write-Host ""
Write-Host "Création de la base de données SQLite..." -ForegroundColor Green
Write-Host ""

# Vérifier si sqlite3 est disponible
$sqliteExists = Get-Command sqlite3 -ErrorAction SilentlyContinue

if (-not $sqliteExists) {
    Write-Host "SQLite n'est pas installé globalement." -ForegroundColor Yellow
    Write-Host "Installation de better-sqlite3 via npm..." -ForegroundColor Cyan
    npm install --save-dev better-sqlite3
}

# Créer le dossier prisma s'il n'existe pas
if (-not (Test-Path "prisma")) {
    New-Item -ItemType Directory -Path "prisma" | Out-Null
}

# Supprimer l'ancienne base si elle existe
if (Test-Path $dbPath) {
    Write-Host "Suppression de l'ancienne base de données..." -ForegroundColor Yellow
    Remove-Item $dbPath
}

# Créer la base avec Node.js et better-sqlite3
Write-Host "Création de la nouvelle base de données..." -ForegroundColor Cyan

$script = @"
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'prisma', 'dev.db');
const sqlPath = path.join(__dirname, 'prisma', 'init.sql');

// Créer la base de données
const db = new Database(dbPath);

// Lire et exécuter le script SQL
const sql = fs.readFileSync(sqlPath, 'utf-8');
db.exec(sql);

console.log('✅ Base de données créée avec succès!');
db.close();
"@

# Sauvegarder le script temporaire
$script | Out-File -FilePath "temp-init-db.js" -Encoding UTF8

# Exécuter le script
node temp-init-db.js

# Nettoyer
Remove-Item "temp-init-db.js"

if (Test-Path $dbPath) {
    Write-Host ""
    Write-Host "Base de données créée avec succès!" -ForegroundColor Green
    Write-Host "Emplacement: $dbPath" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Génération du client Prisma..." -ForegroundColor Cyan
    npx prisma generate
    Write-Host ""
    Write-Host "Tout est prêt! Lancez l'application avec 'npm run dev'" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "Erreur lors de la création de la base de données" -ForegroundColor Red
    Write-Host ""
}
