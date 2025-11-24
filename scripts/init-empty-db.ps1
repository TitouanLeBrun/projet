# Script PowerShell simple pour créer une base de données SQLite vide
# Usage: .\scripts\init-empty-db.ps1

Write-Host ""
Write-Host "Création de la base de données SQLite vide..." -ForegroundColor Green
Write-Host ""

$dbDir = "prisma"
$dbPath = "$dbDir\dev.db"

# Créer le dossier prisma s'il n'existe pas
if (-not (Test-Path $dbDir)) {
    New-Item -ItemType Directory -Path $dbDir | Out-Null
    Write-Host "Dossier prisma créé" -ForegroundColor Cyan
}

# Supprimer l'ancienne base si elle existe
if (Test-Path $dbPath) {
    Write-Host "Suppression de l'ancienne base de données..." -ForegroundColor Yellow
    Remove-Item $dbPath
}

# Créer un fichier vide pour la base de données
New-Item -ItemType File -Path $dbPath -Force | Out-Null

if (Test-Path $dbPath) {
    Write-Host ""
    Write-Host "Base de données créée avec succès!" -ForegroundColor Green
    Write-Host "Emplacement: $dbPath" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Les tables seront créées automatiquement au démarrage de l'application." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Vous pouvez maintenant lancer l'application avec 'npm run dev'" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "Erreur lors de la création de la base de données" -ForegroundColor Red
    Write-Host ""
}
