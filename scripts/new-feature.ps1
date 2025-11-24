# Script PowerShell pour créer une nouvelle feature branch
# Usage: .\scripts\new-feature.ps1 -ucNumber "01" -description "objectif-patrimonial"

param(
    [Parameter(Mandatory=$true)]
    [string]$ucNumber,
    
    [Parameter(Mandatory=$true)]
    [string]$description
)

$branchName = "feature/uc-$ucNumber-$description"

Write-Host ""
Write-Host "🌿 Création de la feature branch pour UC-$ucNumber" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

# Vérifier si on est dans un repo Git
if (-not (Test-Path ".git")) {
    Write-Host "❌ Erreur: Pas de dépôt Git trouvé dans ce répertoire" -ForegroundColor Red
    exit 1
}

# Se positionner sur main
Write-Host "📍 Basculement sur la branche main..." -ForegroundColor Cyan
git checkout main

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors du checkout de main" -ForegroundColor Red
    exit 1
}

# Mettre à jour main
Write-Host "🔄 Synchronisation avec origin/main..." -ForegroundColor Cyan
git pull origin main

# Créer la nouvelle branche
Write-Host "🆕 Création de la branche: $branchName" -ForegroundColor Cyan
git checkout -b $branchName

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Branche créée et activée avec succès!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Vous pouvez maintenant développer UC-$ucNumber" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "💡 Prochaines étapes:" -ForegroundColor Magenta
    Write-Host "   1. Développez votre feature" -ForegroundColor White
    Write-Host "   2. Faites des commits réguliers: git commit -m 'feat(uc-$ucNumber): description'" -ForegroundColor White
    Write-Host "   3. Poussez la branche: git push -u origin $branchName" -ForegroundColor White
    Write-Host "   4. Quand terminé, mergez sur main (voir docs/GIT_WORKFLOW.md)" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "❌ Erreur lors de la création de la branche" -ForegroundColor Red
    exit 1
}
