# Roadmap MVP

## Phase 1 : Fondations & Modèle de Données
- [ ] Initialiser le projet Electron + Vite + React + TS.
- [ ] Configurer ESLint, Prettier et Husky (Git Hooks).
- [ ] Mettre en place Prisma avec SQLite.
- [ ] Créer le schéma de base : `Asset`, `AssetValue` (historique), `Settings` (Objectif).

## Phase 2 : Gestion de l'Inventaire (CRUD)
- [ ] Page "Paramètres" : Définir l'objectif (Montant / Date).
- [ ] Page "Actifs" : Ajouter / Modifier / Supprimer un actif (avec son ROI espéré).
- [ ] Page "Saisie" : Formulaire pour entrer les valeurs du mois courant.

## Phase 3 : Moteur de Calcul
- [ ] Implémenter le service de calcul du ROI Pondéré.
- [ ] Implémenter la projection des intérêts composés.
- [ ] Implémenter le calcul de la mensualité requise (PMT).

## Phase 4 : Dashboard & UI
- [ ] Créer le composant graphique (Chart.js ou Recharts) pour la courbe "Road to 1M".
- [ ] Créer la "Jauge" d'avancement.
- [ ] Intégrer le message du "Conseiller" sur la page d'accueil.

## Phase 5 : Packaging
- [ ] Configurer Electron Builder.
- [ ] Tester l'installateur (.exe / .dmg).
