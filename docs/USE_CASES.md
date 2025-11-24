# Cas d'Utilisation (Use Cases)

Ce document décrit les interactions de l'utilisateur avec WealthTracker. Il sert de référence pour le développement et les tests.

## 👤 Acteur Principal
**L'Investisseur** : Utilisateur unique de l'application (Desktop), soucieux de sa vie privée et orienté vers un objectif long terme.

---

## 📦 Pilier 1 : L'Inventaire Valorisé

### UC-01 : Définir l'Objectif Patrimonial
*   **But** : Initialiser la cible du "Road to 1M".
*   **Flux** :
    1.  L'utilisateur saisit un Montant Cible (ex: 1 000 000 €).
    2.  L'utilisateur saisit une Date Cible (ex: 01/01/2035).
    3.  Le système enregistre ces constantes globales.

### UC-02 : Créer un Actif (Asset)
*   **But** : Ajouter une nouvelle ligne d'investissement.
*   **Données requises** :
    *   Nom (ex: "Bitcoin", "PEA ETF World").
    *   Catégorie (Crypto, Bourse, Immo, Cash).
    *   **ROI Espéré (%)** : Le rendement annuel moyen attendu pour cet actif spécifique.
*   **Règle** : Le ROI est subjectif et défini par l'utilisateur (c'est une projection).

### UC-03 : Saisir un Point de Valeur (Snapshot)
*   **But** : Mettre à jour la valeur actuelle du patrimoine.
*   **Fréquence** : Généralement mensuelle.
*   **Flux** :
    1.  L'utilisateur ouvre l'écran "Saisie".
    2.  Le système liste tous les actifs actifs.
    3.  L'utilisateur entre la valeur *actuelle* manuellement pour chaque actif.
    4.  Le système sauvegarde le snapshot avec la date du jour.

---

## 📊 Pilier 2 : Le Dashboard "Road to 1M"

### UC-04 : Visualiser la Trajectoire
*   **But** : Comparer la réalité vs la théorie.
*   **Affichage** :
    *   **Courbe Théorique** : Une exponentielle partant du premier point jusqu'à 1M€ à la date cible.
    *   **Courbe Réelle** : L'historique des saisies (Snapshots).
    *   **Le Gap** : Différence visuelle entre les deux courbes à l'instant T.

### UC-05 : Consulter la Jauge Globale
*   **But** : Voir le % d'avancement immédiat.
*   **Affichage** : "Vous êtes à 12% de votre objectif de 1M€".

---

## 🧠 Pilier 3 : Le Conseiller Algorithmique

### UC-06 : Obtenir la Recommandation Mensuelle
*   **But** : Savoir combien investir *maintenant*.
*   **Déclencheur** : Après une saisie de valeurs (UC-03).
*   **Flux** :
    1.  Le système calcule le montant total actuel.
    2.  Le système projette ce montant à la date cible en utilisant le ROI moyen pondéré du portefeuille.
    3.  Le système détecte le manque à gagner (Shortfall) à la date cible.
    4.  Le système rétro-calcule la mensualité nécessaire pour combler ce manque.
    5.  **Affichage** : *"Pour atteindre votre but, investissez **1 250 €** ce mois-ci."*
