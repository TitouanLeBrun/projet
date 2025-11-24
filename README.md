# WealthTracker 🚀

> **Le Cockpit de Pilotage Patrimonial Prévisionnel.**

WealthTracker est une application de bureau conçue pour répondre à une seule question : **"Quelles actions d'investissement dois-je prendre aujourd'hui pour garantir que j'atteindrai 1 Million d'Euros à ma date cible ?"**

Contrairement aux agrégateurs classiques qui constatent le passé, WealthTracker calcule l'effort futur nécessaire.

## 🎯 Objectifs Stratégiques

1.  **Pilotage par le ROI** : Distinction de la performance des actifs (ex: Bitcoin 15% vs Livret A 3%).
2.  **Calculateur d'Effort Dynamique** : Ajustement mensuel de l'épargne requise pour combler le "Gap" avec l'objectif.
3.  **Souveraineté des Données** : 
    *   Zéro connexion bancaire (Pas d'API).
    *   Stockage local (SQLite).
    *   Saisie manuelle pour la conscience de la valeur.

## 🛠 Stack Technique

*   **Core** : Electron + React + TypeScript.
*   **Database** : SQLite + Prisma (Local & Type-safe).
*   **Qualité** : Pipeline CI strict (Linting, Type checking).

## 📂 Documentation

*   [Cas d'Utilisation (Use Cases)](./docs/USE_CASES.md) : Description fonctionnelle détaillée.
*   [Logique Algorithmique](./docs/ALGORITHM.md) : Explication du calcul de l'effort dynamique.
*   [Roadmap](./docs/ROADMAP.md) : Plan de développement du MVP.

---

## 🌿 Git Workflow

Ce projet utilise un **Feature Branch Workflow** avec une branche par Use Case.

### Créer une nouvelle feature

```powershell
# Méthode 1 : Script automatique
.\scripts\new-feature.ps1 -ucNumber "01" -description "objectif-patrimonial"

# Méthode 2 : Manuellement
git checkout main
git pull origin main
git checkout -b feature/uc-XX-description
```

### Développer et commiter

```powershell
# Commits réguliers avec convention
git add .
git commit -m "feat(uc-01): ajouter formulaire objectif"
git push -u origin feature/uc-01-objectif-patrimonial
```

### Merger sur main (après validation)

```powershell
# Méthode 1 : Script automatique
.\scripts\merge-feature.ps1 -ucNumber "01"

# Méthode 2 : Manuellement
git checkout main
git pull origin main
git merge --no-ff feature/uc-01-objectif-patrimonial
git push origin main
```

📚 **Documentation complète** : Consultez [docs/GIT_WORKFLOW.md](docs/GIT_WORKFLOW.md)

---
