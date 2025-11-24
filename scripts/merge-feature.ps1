# Script PowerShell pour merger une feature branch sur main
# Usage: .\scripts\merge-feature.ps1 -ucNumber "01"

param(
    [Parameter(Mandatory=$true)]
    [string]$ucNumber,
    
    [Parameter(Mandatory=$false)]
    [string]$description = ""
)

# Trouver la branche feature correspondante
$branches = git branch | Select-String "feature/uc-$ucNumber"

if ($branches.Count -eq 0) {
    Write-Host "❌ Aucune branche feature/uc-$ucNumber trouvée" -ForegroundColor Red
    Write-Host "Branches disponibles:" -ForegroundColor Yellow
    git branch | Select-String "feature/"
    exit 1
}

# Extraire le nom de la branche
$featureBranch = $branches[0].ToString().Trim().Replace("* ", "")

Write-Host ""
Write-Host "🔀 Merge de la feature UC-$ucNumber vers main" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "Branche: $featureBranch" -ForegroundColor Cyan
Write-Host ""

# Vérifier qu'il n'y a pas de modifications non committées
$status = git status --porcelain
if ($status) {
    Write-Host "⚠️  Attention: Vous avez des modifications non committées" -ForegroundColor Yellow
    Write-Host $status -ForegroundColor White
    Write-Host ""
    $response = Read-Host "Voulez-vous continuer quand même? (y/N)"
    if ($response -ne "y") {
        Write-Host "Annulé." -ForegroundColor Red
        exit 1
    }
}

# Basculer sur main
Write-Host "📍 Basculement sur main..." -ForegroundColor Cyan
git checkout main

# Mettre à jour main
Write-Host "🔄 Synchronisation avec origin/main..." -ForegroundColor Cyan
git pull origin main

# Merger la feature
Write-Host "🔀 Merge de $featureBranch..." -ForegroundColor Cyan
$mergeMessage = "Merge $featureBranch`: UC-$ucNumber validé"
if ($description) {
    $mergeMessage += " - $description"
}

git merge --no-ff $featureBranch -m $mergeMessage

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Merge réussi!" -ForegroundColor Green
    Write-Host ""
    
    # Demander si on veut pousser
    $push = Read-Host "Voulez-vous pousser sur origin/main? (Y/n)"
    if ($push -ne "n") {
        Write-Host "⬆️  Push vers origin/main..." -ForegroundColor Cyan
        git push origin main
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Push réussi!" -ForegroundColor Green
        }
    }
    
    Write-Host ""
    # Demander si on veut supprimer la branche
    $delete = Read-Host "Voulez-vous supprimer la branche $featureBranch (locale et remote)? (y/N)"
    if ($delete -eq "y") {
        Write-Host "🗑️  Suppression de la branche locale..." -ForegroundColor Cyan
        git branch -d $featureBranch
        
        Write-Host "🗑️  Suppression de la branche remote..." -ForegroundColor Cyan
        git push origin --delete $featureBranch
        
        Write-Host "✅ Branche supprimée!" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "🎉 UC-$ucNumber est maintenant intégré dans main!" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Erreur lors du merge" -ForegroundColor Red
    Write-Host "Résolvez les conflits puis commitez le merge manuellement" -ForegroundColor Yellow
    exit 1
}
