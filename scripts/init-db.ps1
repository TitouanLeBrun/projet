# Script PowerShell pour initialiser la base de données Prisma
# Usage: .\scripts\init-db.ps1

Write-Host ""
Write-Host "Initialisation de la base de données..." -ForegroundColor Green
Write-Host ""

# Vérifier si Prisma est installé
if (-not (Test-Path "node_modules\.bin\prisma.cmd")) {
    Write-Host "Prisma n'est pas installé. Installation des dépendances..." -ForegroundColor Yellow
    npm install
}

# Générer le client Prisma
Write-Host "Génération du client Prisma..." -ForegroundColor Cyan
npx prisma generate

if ($LASTEXITCODE -eq 0) {
    Write-Host "Client Prisma généré avec succès!" -ForegroundColor Green
} else {
    Write-Host "Erreur lors de la génération du client Prisma" -ForegroundColor Red
    exit 1
}

# Créer/Mettre à jour la base de données
Write-Host "Création/Mise à jour de la base de données..." -ForegroundColor Cyan
npx prisma db push

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Base de données prête!" -ForegroundColor Green
    Write-Host "Vous pouvez maintenant lancer l'application avec 'npm run dev'" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host "Erreur lors de la création de la base de données" -ForegroundColor Red
    exit 1
}
