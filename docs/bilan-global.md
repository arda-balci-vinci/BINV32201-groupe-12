# Bilan global du projet

## Ce que nous avons appris sur l'ensemble du projet

### 1. Développement assisté par l'IA et ingénierie du harnais (*Harness Engineering*)
- **Cadrage des prompts et du contexte :** Nous avons appris à guider Copilot avec des consignes précises, une architecture documentée et des contraintes de validation pour obtenir des résultats plus fiables.
- **Contrôle critique du code généré :** Nous avons compris l'importance de vérifier les diffs, d'identifier les erreurs ou les raccourcis de l'IA et de demander des corrections ciblées avant de valider.
- **Guides, senseurs et Skills :** Nous avons appris à distinguer les mécanismes *feedforward* et *feedback*, à utiliser des Skills pour encadrer le travail de Copilot et à combiner les contrôles automatiques avec la validation humaine.

### 2. Stratégie de tests et qualité logicielle (TDD & Pyramide des tests)
- **Approche TDD (*Test-Driven Development*) :** Nous avons appris à écrire les tests avant l'implémentation, notamment pour la recherche d'offres par titre (`EF-30`), en appliquant le cycle rouge → vert.
- **Couverture des exigences :** Nous avons construit des matrices de traçabilité pour identifier les fonctionnalités réellement testées, les manques de couverture et les assertions à renforcer.
- **Complémentarité des niveaux de tests :** Nous avons utilisé Vitest, Supertest et Testing Library pour vérifier les comportements du backend, les API et les composants React.
- **Détection des régressions :** Nous avons compris qu'un test réussi ne garantit pas une couverture complète et appris à améliorer les tests pour détecter des défauts auparavant non vérifiés.

### 3. Architecture Fullstack et workflow Git collaboratif
- **Architecture TypeScript fullstack :** Nous avons approfondi la séparation entre le frontend React, le backend Express, les *controllers*, *services*, *repositories* SQLite et les données initiales (*seed*).
- **Bonnes pratiques Web 2 :** Nous avons appliqué les principes des API REST, de validation des données, de gestion des erreurs et des permissions utilisateurs.
- **Discipline Git et Pull Requests :** Nous avons appris à travailler sur des branches dédiées, à examiner les diffs, à exécuter les contrôles avec `npm run check` et à documenter les réussites comme les erreurs rencontrées avant de fusionner nos Pull Requests.

---

## Ce que nous n'avons pas appris mais aurions aimé approfondir

- **Intégration continue (CI/CD) avec GitHub Actions :** Automatiser les tests et les builds à chaque Pull Request, avec des rapports d'exécution.
- **MCP et Skills personnalisés :** Développer nos propres outils et instructions réutilisables pour guider les agents IA.
- **Tests de performance et de charge :** Mesurer les temps de réponse et la stabilité de l'application lorsque le nombre d'utilisateurs augmente.
- **Sécurité avancée :** Approfondir les contrôles d'accès par rôle (RBAC), la prévention des injections et la gestion sécurisée des sessions.