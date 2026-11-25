# Bilan — Semaine 10 : Tests end-to-end avec Playwright

## 1. Scénarios de tests end-to-end
- **Fichier des scénarios :** [e2e/recherche-offres/scenarios.md](../e2e/recherche-offres/scenarios.md)
- **Justification des deux cas :**
  - **Scénario 1 (cas nominal) :** Vérifie qu'une recherche insensible à la casse (`"api"`) filtre correctement la liste pour n'afficher que l'offre publiée correspondante, tout en masquant les autres offres publiées (*« Application React de gestion de flotte »*) et les offres non publiées.
  - **Scénario 2 (cas limite) :** Vérifie qu'une recherche ne correspondant à aucune offre affiche un tableau vide (`0` ligne) et le message explicite *« Aucune offre ne correspond à votre recherche. »*.

## 2. Exploration avec Playwright MCP
*(Non réalisée dans cette séance : passage direct à la génération des tests automatisés Playwright Test.)*

## 3. Tests automatisés avec Playwright Test
- **Fichiers créés :**
  - `playwright.config.ts` (configuration avec `testDir: './e2e'` et `baseURL` pointant vers le frontend local)
  - `e2e/recherche-offres/recherche-offres.spec.ts`
- **Principales assertions :**
  - Vérification de la visibilité de l'offre correspondante (`getByRole("cell", ...).toBeVisible()`).
  - Vérification de l'absence des offres non correspondantes et non publiées (`toHaveCount(0)`).
  - Vérification du compteur de résultats (`getByText("1 offre")`) et du nombre de lignes du tableau (`getByRole("row").toHaveCount(2)` puis `0`).
  - Vérification du message dédié lorsqu'aucun résultat n'est trouvé.
- **Exécutions successives (`npx playwright test`) :**
  - Exécution 1 : `6 passed` (Scénarios 1 et 2 sur Chromium, Firefox et WebKit).
  - Exécution 2 : `6 passed` (résultats identiques et reproductibles).
- **Contrôles du projet (`npm run check`) :** Tous les contrôles existants (lint, build, tests unitaires/intégration) passent sans erreur.

## 4. Vérification de la qualité des tests (injection de défaut)
- **Défaut temporaire introduit :** Désactivation du filtre par titre dans `offers.repository.ts` en forçant `titlePattern: null` dans `findAll`.
- **Échec constaté :** Les 6 exécutions (`npx playwright test`) ont échoué sur les assertions métier :
  - *Scénario 1 :* `expect(locator).toHaveCount(0)` a échoué (`Received: 1`) car l'offre *« Application React de gestion de flotte »* restait visible.
  - *Scénario 2 :* `expect(locator).toBeVisible()` a échoué car le message *« Aucune offre ne correspond à votre recherche. »* n'apparaissait pas.
- **Restauration :** Après restauration de `offers.repository.ts`, les 6 tests sont repassés au vert.

## 5. Comparaison : Playwright MCP vs Playwright Test
1. **Rôle de Playwright MCP :** Playwright MCP expose les actions d'un navigateur (`browser_navigate`, `browser_snapshot`, `browser_type`, `browser_click`) comme des outils appelables directement par l'agent Copilot dans VS Code, lui permettant de piloter l'interface et d'observer le DOM/arbre d'accessibilité en direct.
2. **Apport des scripts Playwright Test :** Contrairement à une vérification interactive menée par un LLM (probabiliste et dépendante de l'agent), les fichiers `.spec.ts` sont versionnés dans Git, déterministes, rapides et exécutables automatiquement sans IA (en local ou dans une pipeline CI/CD).
3. **Choix selon le contexte :**
   - **Playwright MCP** est idéal pour explorer une fonctionnalité, reproduire visuellement un bug ou diagnostiquer un comportement sur une page sans écrire de code au préalable.
   - **Playwright Test** est indispensable pour verrouiller les parcours critiques, prévenir les régressions et valider automatiquement chaque Pull Request.