# Logique Algorithmique & Mathématique

Ce document détaille le moteur de calcul de WealthTracker. C'est le cœur de la différenciation du produit.

## 1. Calcul du ROI Moyen Pondéré ($ROI_{global}$)

Contrairement à une calculatrice simple, nous ne prenons pas un taux arbitraire. Le taux de projection dépend de l'allocation d'actifs de l'utilisateur.

$$
ROI_{global} = \frac{\sum (Valeur_{actif} \times ROI_{actif})}{Valeur_{totale}}
$$

*Exemple :*
*   10k€ Bitcoin à 15%
*   10k€ Livret A à 3%
*   Total = 20k€
*   $ROI_{global} = \frac{(10000 \times 0.15) + (10000 \times 0.03)}{20000} = 9\%$

## 2. Projection du Patrimoine Actuel ($Futur_{actuel}$)

Combien vaudra le patrimoine actuel à la date cible, sans aucun nouvel apport, juste avec les intérêts composés ?

$$
Futur_{actuel} = Valeur_{totale} \times (1 + ROI_{global})^{AnnéesRestantes}
$$

## 3. Calcul du "Gap" ($Manque$)

La différence entre l'objectif (1M€) et ce que le patrimoine actuel deviendra tout seul.

$$
Manque = Objectif - Futur_{actuel}
$$

## 4. L'Effort Mensuel Requis ($PMT$)

C'est la réponse du "Conseiller". Combien faut-il ajouter chaque mois, placé au taux $ROI_{global}$, pour combler le $Manque$ ?

Nous utilisons la formule de la rente (PMT) :

$$
PMT = \frac{Manque \times \frac{ROI_{global}}{12}}{(1 + \frac{ROI_{global}}{12})^{MoisRestants} - 1}
$$

---

## Exemple Concret

1.  **Objectif** : 1 000 000 € dans 10 ans (120 mois).
2.  **Actuel** : 100 000 € placés à un ROI moyen de 10%.
3.  **Projection sans effort** : Les 100k€ deviendront ~259 374 € dans 10 ans.
4.  **Manque à gagner** : 1 000 000 - 259 374 = **740 626 €**.
5.  **Effort Mensuel** : Il faut générer 740k€ via l'épargne mensuelle à 10%.
    *   Résultat algorithme : **~3 650 € / mois**.

*Note : Si l'utilisateur performe mieux que prévu (ex: le Bitcoin fait +50%), le patrimoine actuel augmente, le "Manque" diminue, et l'effort mensuel demandé baisse automatiquement le mois suivant.*
