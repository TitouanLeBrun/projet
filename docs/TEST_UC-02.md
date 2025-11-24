# 🧪 Guide de Test - UC-02 : Gestion des Actifs

## 📋 Prérequis
- L'application doit être lancée : `npm run dev`
- UC-01 doit être complété (un objectif doit être défini)

## ✅ Scénarios de Test

### Test 1 : Navigation entre pages
1. ✅ Vérifier que l'application s'ouvre en plein écran
2. ✅ Vérifier la présence de 2 onglets dans la navigation :
   - 🎯 Objectif
   - 📊 Actifs
3. ✅ Cliquer sur "📊 Actifs"
4. ✅ Vérifier que la page change et affiche "Mes Actifs Patrimoniaux"

### Test 2 : Créer un premier actif
1. Cliquer sur "📊 Actifs"
2. ✅ Vérifier l'affichage du message "Aucun actif pour le moment"
3. Cliquer sur "➕ Ajouter un Actif"
4. ✅ Vérifier qu'un formulaire modal s'affiche
5. Remplir le formulaire :
   - **Nom** : "Bitcoin"
   - **Catégorie** : 🟡 Crypto
   - **ROI Espéré** : 15
6. Cliquer sur "💾 Créer"
7. ✅ Vérifier que le modal se ferme
8. ✅ Vérifier qu'une carte "Bitcoin" apparaît avec :
   - Icône 🟡
   - Badge "Crypto" en jaune/or
   - ROI : 15.0%
   - Boutons "✏️ Modifier" et "🗑️ Supprimer"

### Test 3 : Créer plusieurs actifs (diversification)
Créer les actifs suivants pour tester les catégories :

1. **PEA ETF World**
   - Catégorie : 📈 Bourse
   - ROI : 8.5

2. **Appartement Paris**
   - Catégorie : 🏠 Immobilier
   - ROI : 4.5

3. **Livret A**
   - Catégorie : 💵 Cash
   - ROI : 3.0

4. **NFT Collection**
   - Catégorie : 🔷 Autre
   - ROI : 25.0

✅ Vérifier que chaque actif a une couleur différente selon sa catégorie

### Test 4 : Modifier un actif
1. Cliquer sur "✏️ Modifier" sur l'actif "Bitcoin"
2. ✅ Vérifier que le formulaire se pré-remplit avec les données actuelles
3. Modifier le ROI : 20 (au lieu de 15)
4. Cliquer sur "💾 Mettre à jour"
5. ✅ Vérifier que le ROI affiché est maintenant 20.0%

### Test 5 : Supprimer un actif
1. Cliquer sur "🗑️ Supprimer" sur l'actif "NFT Collection"
2. ✅ Vérifier qu'une confirmation s'affiche
3. Confirmer la suppression
4. ✅ Vérifier que l'actif disparaît de la liste

### Test 6 : Annuler la création
1. Cliquer sur "➕ Ajouter un Actif"
2. Commencer à remplir le formulaire
3. Cliquer sur "❌ Annuler"
4. ✅ Vérifier que le modal se ferme sans créer d'actif

### Test 7 : Validation du formulaire
1. Cliquer sur "➕ Ajouter un Actif"
2. Laisser le nom vide
3. Cliquer sur "💾 Créer"
4. ✅ Vérifier qu'une erreur s'affiche (champ requis)

### Test 8 : Persistance des données
1. Créer 2-3 actifs
2. Fermer l'application complètement
3. Relancer l'application : `npm run dev`
4. Aller sur "📊 Actifs"
5. ✅ Vérifier que tous les actifs créés sont toujours présents

### Test 9 : Interface responsive
1. ✅ Vérifier que les cartes d'actifs s'affichent en grille
2. ✅ Vérifier que l'interface est agréable et moderne
3. ✅ Vérifier les animations au survol des boutons

## 🐛 Bugs Potentiels à Vérifier

### Critiques
- [ ] Les actifs ne se créent pas
- [ ] Les actifs ne s'affichent pas
- [ ] L'application crash lors de la création
- [ ] Les données ne sont pas persistées

### Mineurs
- [ ] Les animations ne fonctionnent pas
- [ ] Les couleurs ne correspondent pas aux catégories
- [ ] Le modal ne se ferme pas correctement
- [ ] Les boutons ne réagissent pas au survol

## 📊 Base de Données

Pour vérifier directement la base de données :

```powershell
# Installer SQLite (si pas déjà fait)
# Télécharger depuis https://www.sqlite.org/download.html

# Ouvrir la base
sqlite3 prisma/dev.db

# Lister les actifs
SELECT * FROM Asset;

# Vérifier qu'un actif est bien en soft delete
SELECT * FROM Asset WHERE isActive = 0;
```

## ✅ Checklist Finale

Avant de merger UC-02 sur main, vérifier :

- [ ] Tous les tests passent
- [ ] Aucun bug critique
- [ ] Les données sont bien persistées
- [ ] L'interface est fluide
- [ ] Le code est propre (pas de console.log inutiles)
- [ ] Les types TypeScript sont corrects
- [ ] La documentation est à jour

## 🎯 Résultat Attendu

Une fois tous les tests validés, vous devriez avoir :
- ✅ Une navigation fonctionnelle entre Objectif et Actifs
- ✅ La possibilité de créer/modifier/supprimer des actifs
- ✅ Une interface moderne avec catégories colorées
- ✅ La persistance des données dans SQLite
- ✅ Un soft delete (les actifs ne sont pas réellement supprimés)

## 📝 Notes pour les Développeurs

- Les actifs utilisent des IDs auto-incrémentés (INTEGER)
- Le soft delete utilise le flag `isActive`
- Les catégories sont stockées en tant que STRING (pas d'ENUM en SQLite)
- Le ROI est stocké en FLOAT (8.5 = 8.5%, pas 0.085)

---

**Prochaine étape** : Si tous les tests passent → Merger sur main et commencer UC-03 (Snapshots)
