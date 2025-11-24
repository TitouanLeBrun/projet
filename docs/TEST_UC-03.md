# 🧪 Guide de Test - UC-03 : Saisie des Snapshots

## 📋 Prérequis
- L'application doit être lancée : `npm run dev`
- UC-01 : Un objectif doit être défini
- UC-02 : Au moins 2-3 actifs doivent exister

## ✅ Scénarios de Test

### Test 1 : Accès à la page Valorisation
1. Lancer l'application
2. ✅ Vérifier la présence de 3 onglets :
   - 🎯 Objectif
   - 📊 Actifs
   - 📸 Valorisation
3. Cliquer sur "📸 Valorisation"
4. ✅ Vérifier que la page change

### Test 2 : Première saisie de valeurs
**Contexte** : Aucune valeur n'a encore été saisie

1. Sur la page "📸 Valorisation"
2. ✅ Vérifier le message "Aucune valeur enregistrée pour le moment"
3. Cliquer sur "➕ Saisir les Valeurs"
4. ✅ Vérifier qu'un formulaire modal s'affiche
5. ✅ Vérifier que tous les actifs sont listés
6. ✅ Vérifier que les actifs sans valeur ont un badge "Nouveau"
7. Saisir des valeurs pour chaque actif :
   - Bitcoin : 15000
   - PEA ETF World : 25000
   - Livret A : 5000
8. ✅ Vérifier que le total se calcule en temps réel (45 000 €)
9. Cliquer sur "💾 Enregistrer les Valeurs"
10. ✅ Vérifier que le modal se ferme
11. ✅ Vérifier l'affichage de la carte "Patrimoine Total" avec 45 000 €
12. ✅ Vérifier que chaque actif affiche sa valeur

### Test 3 : Consultation des valeurs
1. Après avoir saisi des valeurs (Test 2)
2. ✅ Vérifier la présence de la carte "💰 Patrimoine Total"
3. ✅ Vérifier que le montant total est correct
4. ✅ Vérifier que la date s'affiche
5. ✅ Vérifier que chaque actif affiche :
   - Son nom
   - Sa catégorie
   - Sa dernière valeur
   - La date de dernière saisie

### Test 4 : Mise à jour mensuelle (nouveau snapshot)
**Contexte** : Des valeurs ont déjà été saisies précédemment

1. Cliquer sur "➕ Saisir les Valeurs"
2. ✅ Vérifier que le formulaire se pré-remplit avec les dernières valeurs
3. ✅ Vérifier que chaque actif affiche "Dernière valeur : XXX € (JJ/MM/AAAA)"
4. Modifier les valeurs (simuler évolution du patrimoine) :
   - Bitcoin : 18000 (+20%)
   - PEA ETF World : 26500 (+6%)
   - Livret A : 5150 (+3%)
5. ✅ Vérifier que le total s'actualise (49 650 €)
6. Enregistrer
7. ✅ Vérifier que le patrimoine total est mis à jour
8. ✅ Vérifier que les dates sont bien celle d'aujourd'hui

### Test 5 : Saisie partielle
1. Cliquer sur "➕ Saisir les Valeurs"
2. Ne remplir que 2 actifs sur 3 (laisser un champ vide)
3. Enregistrer
4. ✅ Vérifier que seuls les actifs avec valeur sont enregistrés
5. ✅ Vérifier que le total n'inclut que les valeurs saisies

### Test 6 : Validation du formulaire
1. Cliquer sur "➕ Saisir les Valeurs"
2. Laisser tous les champs vides
3. Tenter d'enregistrer
4. ✅ Vérifier qu'une erreur s'affiche

### Test 7 : Annuler la saisie
1. Cliquer sur "➕ Saisir les Valeurs"
2. Modifier quelques valeurs
3. Cliquer sur "❌ Annuler"
4. ✅ Vérifier que le modal se ferme
5. ✅ Vérifier qu'aucune modification n'est sauvegardée

### Test 8 : Persistance des données
1. Saisir plusieurs snapshots (différentes sessions)
2. Fermer complètement l'application
3. Relancer : `npm run dev`
4. Aller sur "📸 Valorisation"
5. ✅ Vérifier que la dernière valeur totale s'affiche
6. ✅ Vérifier que toutes les cartes d'actifs affichent leurs dernières valeurs

### Test 9 : Cas sans actif
1. Supprimer tous les actifs (ou utiliser une DB vide)
2. Aller sur "📸 Valorisation"
3. ✅ Vérifier l'affichage du message "Aucun actif disponible"
4. ✅ Vérifier le lien vers l'onglet Actifs

### Test 10 : Calcul du total
**Vérification mathématique**

1. Saisir des valeurs connues :
   - Actif 1 : 10 000 €
   - Actif 2 : 25 000 €
   - Actif 3 : 15 000 €
2. ✅ Vérifier que le total affiché est exactement 50 000 €
3. Modifier une valeur dans le formulaire
4. ✅ Vérifier que le total se recalcule instantanément

## 🔍 Points Spécifiques à Vérifier

### Interface
- [ ] Modal de saisie s'affiche avec animation
- [ ] Badge "Nouveau" sur actifs sans historique
- [ ] Total en temps réel dans le formulaire
- [ ] Carte patrimoine total bien visible
- [ ] Grille d'actifs responsive
- [ ] Animations au survol des cartes

### Fonctionnel
- [ ] Création de snapshots multiples en un clic
- [ ] Pré-remplissage avec dernières valeurs
- [ ] Calcul correct du total
- [ ] Date automatique (date du jour)
- [ ] Validation valeur > 0
- [ ] Persistance en base de données

### Performance
- [ ] Chargement rapide de la page
- [ ] Calcul temps réel fluide
- [ ] Pas de lag lors de la saisie
- [ ] Enregistrement rapide (< 1s)

## 📊 Vérification Base de Données

```powershell
# Ouvrir la base SQLite
sqlite3 prisma/dev.db

# Vérifier les snapshots créés
SELECT s.id, a.name, s.value, s.date 
FROM Snapshot s 
JOIN Asset a ON s.assetId = a.id 
ORDER BY s.date DESC 
LIMIT 10;

# Calculer manuellement le total
SELECT SUM(s.value) as total
FROM Snapshot s
WHERE s.date = (SELECT MAX(date) FROM Snapshot);
```

## 🐛 Bugs Potentiels

### Critiques
- [ ] Les snapshots ne se créent pas
- [ ] Le total ne se calcule pas
- [ ] Les données ne sont pas persistées
- [ ] L'application crash lors de la saisie

### Mineurs
- [ ] Affichage incorrect de la date
- [ ] Modal ne se ferme pas
- [ ] Total pas en temps réel
- [ ] Badges "Nouveau" incorrects

## ✅ Checklist Finale

Avant de merger UC-03 sur main :

- [ ] Tous les tests passent
- [ ] Le total se calcule correctement
- [ ] Les dates sont correctes
- [ ] La persistance fonctionne
- [ ] L'interface est fluide
- [ ] Pas de bugs critiques
- [ ] Code propre (pas de console.log inutiles)

## 🎯 Résultat Attendu

Une fois validé, vous devriez avoir :
- ✅ Saisie rapide de toutes les valeurs en un clic
- ✅ Calcul automatique du patrimoine total
- ✅ Historique des snapshots en base
- ✅ Interface moderne et fluide
- ✅ Badge visuel pour nouveaux actifs
- ✅ Pré-remplissage intelligent

## 📝 Notes Importantes

### Fréquence de Saisie
- **Recommandation** : Une fois par mois (ex: le 1er)
- **Minimum** : Au moins une fois pour activer les calculs UC-06
- **Liberté** : L'utilisateur peut saisir quand il veut

### Valeurs
- Toujours > 0
- En euros (€)
- 2 décimales max dans l'affichage

### Batch vs Unique
- **Batch** (recommandé) : Saisie de tous les actifs en une fois
- **Unique** : Possible via API mais pas d'UI pour le moment

---

**Prochaine étape** : Si tous les tests passent → Merger sur main et commencer UC-04 (Dashboard)
