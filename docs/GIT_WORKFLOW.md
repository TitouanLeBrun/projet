# 🌿 Git Workflow - WealthTracker

## 📋 Stratégie de Branches

Ce projet utilise un **Feature Branch Workflow** basé sur les Use Cases.

### Structure des Branches

```
main (branche principale - production ready)
  ├── feature/uc-01-objectif-patrimonial
  ├── feature/uc-02-creer-actif
  ├── feature/uc-03-saisir-snapshot
  ├── feature/uc-04-visualiser-trajectoire
  ├── feature/uc-05-jauge-globale
  └── feature/uc-06-recommandation-mensuelle
```

---

## 🔄 Workflow Standard

### 1️⃣ Créer une Nouvelle Feature Branch

```powershell
# Se positionner sur main et se synchroniser
git checkout main
git pull origin main

# Créer et basculer sur la nouvelle branche feature
git checkout -b feature/uc-01-objectif-patrimonial
```

**Convention de nommage** : `feature/uc-XX-description-courte`

### 2️⃣ Développer la Feature

```powershell
# Faire des commits réguliers et atomiques
git add .
git commit -m "feat(uc-01): ajouter formulaire objectif patrimonial"

# Exemple de messages de commit selon le type
git commit -m "feat(uc-01): implémenter logique de calcul"
git commit -m "style(uc-01): améliorer UI du formulaire"
git commit -m "fix(uc-01): corriger validation date cible"
git commit -m "test(uc-01): ajouter tests unitaires"
```

### 3️⃣ Pousser la Branche sur le Remote

```powershell
# Première fois
git push -u origin feature/uc-01-objectif-patrimonial

# Pushs suivants
git push
```

### 4️⃣ Merger sur Main (après validation)

```powershell
# Retourner sur main
git checkout main

# Mettre à jour main
git pull origin main

# Merger la feature (avec message de merge)
git merge --no-ff feature/uc-01-objectif-patrimonial -m "Merge feature/uc-01: Objectif patrimonial validé"

# Pousser main
git push origin main

# (Optionnel) Supprimer la branche feature locale et remote
git branch -d feature/uc-01-objectif-patrimonial
git push origin --delete feature/uc-01-objectif-patrimonial
```

---

## 🏷️ Convention de Commit Messages

Format : `type(scope): description`

### Types
- **feat** : Nouvelle fonctionnalité
- **fix** : Correction de bug
- **style** : Changements UI/CSS (pas de logique)
- **refactor** : Refactoring du code (pas de nouvelle feature)
- **test** : Ajout ou modification de tests
- **docs** : Documentation uniquement
- **chore** : Tâches de maintenance (deps, config, etc.)

### Exemples
```
feat(uc-02): ajouter création d'actif avec ROI
fix(uc-03): corriger sauvegarde snapshot date
style(dashboard): améliorer responsive du graphique
refactor(uc-06): extraire calcul mensualité dans service
test(uc-04): ajouter tests courbe théorique
docs(readme): mettre à jour instructions installation
chore(deps): update electron to v39.2.3
```

---

## 🛡️ Règles de Protection

### ✅ Avant de Merger sur Main
1. ✅ Le code compile sans erreur
2. ✅ Les tests passent (si applicable)
3. ✅ La feature est complète selon le Use Case
4. ✅ Le code est formaté avec Prettier
5. ✅ Pas de `console.log` oubliés en production

### 🔒 Main Branch
- `main` doit **toujours** être stable et déployable
- Jamais de commit direct sur `main` (sauf urgence absolue)
- Toujours passer par une feature branch

---

## 🚀 Scripts Utiles

### Créer une Nouvelle Feature

Copiez ce script dans `scripts/new-feature.ps1` :

```powershell
param(
    [Parameter(Mandatory=$true)]
    [string]$ucNumber,
    
    [Parameter(Mandatory=$true)]
    [string]$description
)

$branchName = "feature/uc-$ucNumber-$description"

Write-Host "🌿 Création de la branche: $branchName" -ForegroundColor Green

git checkout main
git pull origin main
git checkout -b $branchName

Write-Host "✅ Branche créée et activée!" -ForegroundColor Green
Write-Host "📝 Commencez à développer UC-$ucNumber" -ForegroundColor Cyan
```

**Usage** :
```powershell
.\scripts\new-feature.ps1 -ucNumber "01" -description "objectif-patrimonial"
```

---

## 📊 Visualiser l'Historique

```powershell
# Voir l'arbre des commits
git log --oneline --graph --all --decorate

# Voir les branches
git branch -a

# Voir les différences entre branches
git diff main..feature/uc-01-objectif-patrimonial
```

---

## 🔥 Commandes d'Urgence

### Annuler le dernier commit (pas encore pushé)
```powershell
git reset --soft HEAD~1
```

### Changer de branche avec des modifications non committées
```powershell
git stash
git checkout autre-branche
git stash pop
```

### Synchroniser une feature branch avec main
```powershell
git checkout feature/uc-01-objectif-patrimonial
git rebase main
```

---

## 📅 Timeline du Projet

| Phase | Use Cases | Statut |
|-------|-----------|--------|
| **Phase 1** | UC-01, UC-02, UC-03 | 🚧 En cours |
| **Phase 2** | UC-04, UC-05 | ⏳ À venir |
| **Phase 3** | UC-06 | ⏳ À venir |

---

## 🎯 Checklist par Use Case

### ✅ UC-01 : Objectif Patrimonial
- [ ] Interface formulaire (montant + date)
- [ ] Validation des données
- [ ] Persistence Prisma
- [ ] Tests

### ✅ UC-02 : Créer Actif
- [ ] Formulaire création actif
- [ ] Catégories prédéfinies
- [ ] ROI esperé (%)
- [ ] Persistence Prisma
- [ ] Tests

### ✅ UC-03 : Saisir Snapshot
- [ ] Écran saisie valeurs
- [ ] Liste des actifs actifs
- [ ] Snapshot avec date
- [ ] Persistence Prisma
- [ ] Tests

*(Et ainsi de suite pour chaque UC...)*

---

**Dernière mise à jour** : 24 novembre 2025
