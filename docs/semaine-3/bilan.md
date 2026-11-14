# Bilan

### 1. Qu'est-ce que Copilot vous a aidés à faire ?
Copilot nous a aidés à identifier et classifier les guides et senseurs du projet Gesta, à construire les matrices de traçabilité et à repérer les manques dans les tests des exigences EF-32 et EF-33. Il nous a également aidés à renforcer trois fichiers de tests backend.

### 2. Qu'avez-vous vérifié ou corrigé vous-mêmes ?
Nous avons revu les classifications proposées par Copilot et comparé les guides aux bonnes pratiques du cours de Web 2. Nous avons également exécuté `npm run check` après les modifications : les 184 tests ont réussi, ainsi que les vérifications Oxlint, TypeScript et les builds.

### 3. Quelle difficulté ou limite avez-vous rencontrée ?
Nous avons constaté qu'un test pouvait réussir sans vérifier complètement l'exigence annoncée. Par exemple, le test des quatre statuts de candidature ne vérifiait initialement qu'un seul statut. Nous avons renforcé ce test, mais certains scénarios d'interface restent insuffisamment couverts.

### 4. Combien de crédits IA avez-vous consommés ?
- Membre 1 : [17.4]
- Membre 2 : [7.4]