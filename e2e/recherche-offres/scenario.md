# Scénarios de tests end-to-end — Recherche d'offres (EF-30)

## État initial commun
- **Rôle utilisé :** Utilisateur consultant la liste des offres (ex. étudiant / visiteur authentifié selon les règles de `docs/semaine-4.md`).
- **Données présentes en base :**
  - Offre A : titre `"Stage Développement Fullstack"`, statut **publiée / visible**.
  - Offre B : titre `"Stage Data Science"`, statut **publiée / visible**.
  - Offre C : titre `"Stage Fullstack Confidentiel"`, statut **brouillon / non publiée** (non visible).
- **Page de départ :** Page de consultation des offres (`/offers`), champ de recherche vide, les offres publiées (A et B) sont affichées, l'offre non publiée (C) n'est pas affichée.

---

## Scénario 1 : Recherche nominale avec résultat (insensible à la casse)
- **Actions dans l'interface :**
  1. Ouvrir la page des offres.
  2. Saisir `"fullstack"` dans le champ de recherche par titre.
  3. Déclencher la recherche (ou attendre la mise à jour de la liste).
- **Résultat observable attendu :**
  - Seule l'offre `"Stage Développement Fullstack"` (publiée et correspondant au mot-clé) est affichée dans la liste.
  - L'offre `"Stage Data Science"` (ne correspondant pas au titre) et l'offre `"Stage Fullstack Confidentiel"` (non publiée) ne sont pas affichées.

---

## Scénario 2 : Recherche sans résultat (cas limite)
- **Actions dans l'interface :**
  1. Ouvrir la page des offres.
  2. Saisir `"IntrouvableXYZ"` dans le champ de recherche par titre.
  3. Déclencher la recherche (ou attendre la mise à jour de la liste).
- **Résultat observable attendu :**
  - Aucune carte/ligne d'offre n'est affichée dans la liste.
  - Un message explicite indiquant qu'aucune offre ne correspond à la recherche est visible à l'écran (sans erreur technique).