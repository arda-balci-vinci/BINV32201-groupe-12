# Les deux matrices de traçabilité — Semaine 3

Ce document regroupe les deux analyses réalisées avec GitHub Copilot et retravaillées après vérification : **(1) guides / senseurs et bonnes pratiques Web 2** et **(2) exigences EF-32 / EF-33 et couverture des tests**.

Les noms de tests et les assertions sont repris de l'analyse de Copilot ; les modifications des trois tests backend doivent être confrontées au diff de la branche locale avant la remise. Les exécutions de `npm run check`, communiquées depuis le terminal, ont bien abouti à 184 tests réussis.

## 1. Matrice des guides et senseurs
# Les deux matrices de traçabilité — Semaine 3

Ce document regroupe les deux analyses réalisées avec GitHub Copilot et retravaillées après vérification : **(1) guides / senseurs et bonnes pratiques Web 2** et **(2) exigences EF-32 / EF-33 et couverture des tests**.

Les noms de tests et les assertions sont repris de l'analyse de Copilot ; les modifications des trois tests backend doivent être confrontées au diff de la branche locale avant la remise. Les exécutions de `npm run check`, communiquées depuis le terminal, ont bien abouti à 184 tests réussis.

## 1. Matrice des guides et senseurs


Selon la théorie du cours (Böckeler, *Harness engineering for coding agent users*, 2026), les **guides** orientent l'agent avant ou pendant son action (*feedforward*) ; les **senseurs** observent les résultats pour permettre une correction (*feedback*). Les mécanismes **inférentiels** s'appuient sur une interprétation par IA, tandis que les mécanismes **computationnels** utilisent des règles ou programmes exécutables.

| Quadrant | Mécanisme observé | Emplacement / outil | Rôle et exemple concret | Vérification pendant cette séance |
|---|---|---|---|---|
| Guide inférentiel | Instructions persistantes de Copilot | `.github/copilot-instructions.md` | Demande une architecture `controllers → services → repositories`, SQL dans les repositories, usage de `HttpError` et des permissions nommées. | Fichier lu et comparé au contenu publié sur `main` ; la conformité du code aux règles reste distincte de la présence des instructions. |
| Guide computationnel (contrôle opérationnel) | Permissions et sandbox de l'agent | `.vscode/settings.json` | Définit des règles d'approbation et bloque le réseau externe. Guide les **actions autorisées** de l'agent, non la qualité sémantique du code. | Sandbox vérifiée via `/sandbox policy` lors de la préparation du projet ; pas de nouvelle décision d'approbation documentée pendant cette séance. |
| Guide computationnel au sens large | Préparation de l'environnement | `backend/scripts/setupEnv.js`, scripts `setup` dans les `package.json` | Prépare les fichiers et l'environnement local de façon déterministe. | Présents selon l'analyse de Copilot ; non exécutés pendant cette séance. |
| Guide computationnel au sens large | Initialisation des données | `backend/src/db/scripts/init.ts`, script `db:init` | Applique migrations et données initiales. | Présent/configuré ; non exécuté pendant cette séance. |
| Guide computationnel au sens large | Copie des migrations compilées | `backend/scripts/copyMigrations.js` | Copie les migrations lors du build backend. | Exécuté indirectement lors du `npm run check` final : build backend réussi. |
| Senseur inférentiel | Revue sémantique IA formelle | Aucun mécanisme dédié identifié | Une revue IA du diff ou des exigences fournirait une appréciation sémantique après modification. | Quadrant volontairement laissé vide dans l'inventaire initial : aucune revue IA formalisée démontrée. |
| Senseur computationnel | Oxlint | Scripts `lint`, `.oxlintrc.json` backend/frontend | Repère les violations de règles statiques. | **Exécuté** : zéro avertissement, zéro erreur côté backend et frontend. |
| Senseur computationnel | TypeScript | Scripts `typecheck`, `tsconfig` backend/frontend | Repère les erreurs de typage et autres diagnostics configurés. | **Exécuté** : vérifications backend et frontend réussies. |
| Senseur computationnel | Vitest backend et frontend | `backend/tests/`, `frontend/tests/` | Compare résultats du code et attentes exprimées par les assertions. | **Exécuté** : 129 tests backend et 55 frontend réussis après changements. |
| Senseur computationnel | Build backend/frontend | Scripts `build` | Vérifie la capacité à compiler/produire les artefacts. | **Exécuté** : builds réussis. |
| Senseur computationnel (orchestrateur) | `npm run check` | `package.json` racine | Lance lint, typecheck, tests puis builds. | **Exécuté** avant et après les modifications des tests. |

**Nuances de classement.** Les scripts `setup` et `db:init` sont principalement des mécanismes de préparation déterministe, pas des guides sémantiques destinés à l'IA. Les fichiers `tsconfig`, `.oxlintrc` et `vitest.config` **configurent** des senseurs ; ils ne sont pas comptés une seconde fois comme senseurs autonomes. Aucun `AGENTS.md` ni fichier LSP propre au dépôt n’a été identifié par Copilot ; une absence d’identification n’est pas une preuve universelle d’absence. La sandbox a été vérifiée lors de la configuration initiale, et non réexécutée pendant cette séance.

## 2. Audit des guides par rapport à Web 2


**Référentiel consulté :** [BINV2150-A — JavaScript avancé (Web 2)](https://e-vinci.github.io/BINV2150A-slides/), séances 02, 03, 04, 12 et 13. La comparaison porte sur **les instructions fournies à Copilot** (`.github/copilot-instructions.md`, texte examiné pendant la séance), pas sur une certification de conformité du code. « Non » signifie qu'une consigne explicite n'a pas été trouvée dans ce guide, pas que l'application enfreint la bonne pratique.

| Attente Web 2 et source | Passage correspondant dans les guides Gesta | Correspondance | Écart observé ou recommandation |
|---|---|---|---|
| **HTTP et REST** : verbes, chemins, paramètres, en-têtes, codes 200/201/400/401/403/404 et documentation de l'API ([Web 2 séance 02](https://e-vinci.github.io/BINV2150A-slides/seance-02/)) | « Controllers parse and validate HTTP input and map service results to response DTOs » ; « For API errors, throw `new HttpError(status, code, message)` » ; « Update `backend/API.md` when an endpoint contract changes » | **Partielle** | Les principes de validation, de réponse et de documentation sont présents ; le guide ne détaille pas explicitement la correspondance entre statuts HTTP, méthodes et cas d'erreur. Proposer un rappel de ces conventions et des exemples HTTP dans `backend/http/`. |
| **Authentification vs autorisation** : déterminer qui est l'utilisateur, puis ce qu'il a le droit de faire ([Web 2 séance 03](https://e-vinci.github.io/BINV2150A-slides/seance-03/)) | « Protected requests flow through authentication and authorization middleware » ; « Reuse named permission predicates and `authorize(...)` » ; « The backend remains the source of truth for visibility » | **Oui (principe explicitement couvert)** | Garder cette séparation ; prévoir des tests de refus pour les routes sensibles. Cela ne prouve pas que chaque endpoint est parfaitement protégé. |
| **Protection des mots de passe** : ne pas stocker de mots de passe en clair, conserver un hash ([Web 2 séance 04](https://e-vinci.github.io/BINV2150A-slides/seance-04/)) | « Demo login is local-development-only » ; « Do not treat demo login as real authentication » | **Non (règle de hachage non explicite)** | Le guide avertit sur le caractère fictif de l'authentification de démonstration, mais ne donne pas de règle de hachage. Ajouter une consigne **conditionnelle à une authentification réelle future**, sans prétendre que Gesta stocke aujourd'hui des mots de passe en clair. |
| **Formulaires React** : événements JSX `onChange`, `onSubmit`, etc., et gestion des entrées utilisateur ([Web 2 séance 12](https://e-vinci.github.io/BINV2150A-slides/seance-12/)) | « pages → hooks → services/utils → models » ; « Hooks handle loading/error state » ; composants réutilisables dans `frontend/src/components` | **Partielle** | Les responsabilités sont organisées, mais les règles concrètes de formulaires et d'affichage des erreurs ne sont pas détaillées dans les instructions. Proposer de documenter validation côté interface et retours à l'utilisateur, sans confondre avec la validation obligatoire côté API. |
| **Immuabilité des états React** : remplacer un tableau/objet plutôt que le muter (`map`, `filter`, spread) ([Web 2 séance 13](https://e-vinci.github.io/BINV2150A-slides/seance-13/)) | « Hooks handle loading/error state » ; aucune instruction explicite sur la mutation des états dans le guide transmis | **Non (dans le guide)** | Ajouter dans les instructions frontend : ne pas muter directement l'état React ; utiliser des mises à jour immuables (`setState`, `map`, `filter`, spread). Vérifier séparément si le code le respecte déjà. |

### Synthèse de l'audit

Les instructions Gesta couvrent nettement **la séparation authentification/autorisation** et comportent des principes compatibles avec les **conventions HTTP/REST**. Les consignes plus fines de **formulaires React** sont seulement partielles ; l'**immuabilité des états** et le **hachage des mots de passe** ne sont pas des règles explicitement formulées dans le guide examiné. Concernant le hachage, la connexion Gesta est décrite comme une démonstration : une recommandation relative à une véritable authentification ne doit pas être présentée comme une faille avérée.

**Preuves et limites :** les séances 02, 03, 04, 12 et 13 ont été consultées sur le site officiel et correspondent bien aux notions citées (HTTP/REST, authentification/autorisation, hachage, événements/formulaires, immuabilité des collections). Le guide `.github/copilot-instructions.md` a été comparé à la version publiée sur la branche `main` du dépôt GitHub. Les liens renvoient aux séances sans numéro de diapositive ; les appréciations portent sur **le texte du guide**, et non sur un audit ligne par ligne du code en fonctionnement. Il s’agit de recommandations, pas de modifications des guides.

## 3. Matrice de traçabilité EF-32 / EF-33


Référence métier : `docs/cdc_gesta_developpement.md`, **EF-32** (candidater à une offre publiée avec un message facultatif ; retrait avant traitement) et **EF-33** (consulter ses candidatures et leurs statuts). L’inventaire a été effectué par Copilot en inspectant les tests ; les chemins et assertions ci-dessous sont les éléments remontés pendant la séance. Les **trois fichiers de tests de la branche `semaine-3` ne sont pas accessibles dans cette copie du rapport** : les ajouts doivent donc être contrôlés une dernière fois dans VS Code avant le commit.

Une couverture est dite « Couvert » uniquement pour le comportement démontré par les assertions citées, et non pour toute la fonctionnalité.

### EF-32 — Candidater et retirer sa candidature

| Exigence | Cas et résultat attendu | Test existant (fichier et nom signalé) | Assertions utiles rapportées | Couverture après travail |
|---|---|---|---|---|
| EF-32 | Offre publiée, message présent → création 201, attributs et statut `IN_PROGRESS` | `backend/tests/applications.test.ts` — `crée une candidature avec un message facultatif` | `response.status` vaut `201` ; `toMatchObject({ offerId, studentId, message, status: "IN_PROGRESS" })` | **Couvert** pour le scénario testé |
| EF-32 | Offre publiée, message omis → message `null` | `backend/tests/applications.test.ts` — test de création sans message renforcé (intitulé exact à confirmer) | `expect(response.body.message).toBeNull()` | **Couvert** pour la réponse API après modification |
| EF-32 | Non-étudiant → refus 403 | `backend/tests/applications.test.ts` — `refuse les rôles autres qu'étudiant` | HTTP `403` et `error.code === "FORBIDDEN"` | **Couvert** |
| EF-32 | Offre non publiée → refus 400 | `backend/tests/applications.test.ts` — `refuse une offre qui n'est pas publiée` | HTTP `400` et `error.code === "OFFER_NOT_PUBLISHED"` | **Couvert** |
| EF-32 | Deuxième candidature active → refus 400 | `backend/tests/applications.test.ts` — `refuse une candidature active en doublon` | HTTP `400` et `error.code === "APPLICATION_EXISTS"` | **Couvert** |
| EF-32 | Message de mauvais type → refus 400 | `backend/tests/applications.test.ts` — `valide le corps de la requête` | `message: 42` → HTTP `400`, `INVALID_BODY` | **Couvert** pour cette entrée invalide |
| EF-32 | Retirer sa candidature en cours → 200, `WITHDRAWN` | `backend/tests/applications-withdraw.test.ts` — `retire une candidature en cours appartenant à l'étudiant` | HTTP `200` et `body.status === "WITHDRAWN"` | **Couvert** |
| EF-32 | Refuser le retrait des statuts `SELECTED`, `REJECTED`, `WITHDRAWN` | `backend/tests/applications-withdraw.test.ts` — cas paramétrés `refuse le retrait d'une candidature %s` | HTTP `400` et `APPLICATION_NOT_WITHDRAWABLE` dans les trois cas | **Couvert** |
| EF-32 | Candidature d’autrui → 404 sans divulgation | `backend/tests/applications-withdraw.test.ts` — `refuse la candidature d'un autre étudiant sans révéler la ressource` | HTTP `404` et `NOT_FOUND` | **Couvert** |
| EF-32 | Compte non étudiant retire → refus 403 | `backend/tests/applications-withdraw.test.ts` — `refuse les comptes non étudiants` | HTTP `403` ; code d’erreur non asserté | **Partiel** (statut seul) |
| EF-32 | Candidater à nouveau après retrait → 201, nouvel ID | `backend/tests/applications-withdraw.test.ts` — `permet une nouvelle candidature après retrait` | Retrait `200`, création `201`, ID différent, `IN_PROGRESS` | **Couvert** |
| EF-32 | Candidater sans session → 401 | `backend/tests/applications.test.ts` — `refuse une candidature sans session` (**ajouté**) | POST sans `Authorization` → HTTP `401`, `UNAUTHENTICATED` | **Couvert** après modification |
| EF-32 | Retirer sans session → 401 | `backend/tests/applications-withdraw.test.ts` — `refuse un retrait sans session` (**ajouté**) | POST sans `Authorization` → HTTP `401`, `UNAUTHENTICATED` | **Couvert** après modification |
| EF-32 | Offre inexistante / ID invalide → refus contrôlé | Aucun test direct identifié par Copilot | Aucune assertion spécifique retrouvée dans l’inventaire | **Absent dans l’inventaire** |
| EF-32 | Refus métier 400/404 affiché après retrait | `frontend/tests/ApplicationsPage.test.tsx` — test spécifique non identifié | Aucune assertion sur le message d’erreur métier | **Absent dans l’inventaire** |

### EF-33 — Consulter ses candidatures et leur statut

| Exigence | Cas et résultat attendu | Test existant (fichier et nom signalé) | Assertions utiles rapportées | Couverture après travail |
|---|---|---|---|---|
| EF-33 | Ne récupérer que les candidatures de l’étudiant connecté | `backend/tests/applications-list.test.ts` — `retourne uniquement les candidatures de l'étudiant connecté` | Égalité de la liste d’IDs avec ceux attendus | **Couvert** pour les données de test |
| EF-33 | Exclure les candidatures des autres étudiants | Même test | Égalité exacte des IDs, donc exclusion indirecte | **Couvert**, preuve indirecte |
| EF-33 | Afficher les informations de l’offre (titre, entreprise, statut) | Même test | `toMatchObject({ offerTitle, companyShortName, status: "IN_PROGRESS" })` | **Couvert** pour ces champs |
| EF-33 | L’API retourne les quatre codes de statut | `backend/tests/applications-list.test.ts` — `expose les quatre statuts dans une liste étudiant` (**renforcé**) | Quatre candidatures dans SQLite de test ; longueur `4` et `expect.arrayContaining(["IN_PROGRESS", "SELECTED", "REJECTED", "WITHDRAWN"])` sur les statuts | **Couvert** pour l’API après modification, sous réserve de vérification du diff |
| EF-33 | Montrer « En cours » dans l’interface | `frontend/tests/ApplicationsPage.test.tsx` — `affiche les candidatures et leurs libellés français` | `findByText("En cours")` | **Couvert** |
| EF-33 | Montrer « Retenue » et « Non retenue » dans l’interface | Aucun test d’affichage explicite identifié | Pas d’assertion sur ces deux libellés | **Absent dans l’inventaire** |
| EF-33 | Montrer « Retirée » pour une candidature déjà retirée au chargement | `frontend/tests/ApplicationsPage.test.tsx` — `retire une candidature en cours` | `findByText("Retirée")` après POST, pas au chargement initial | **Partiel** |
| EF-33 | Afficher une liste vide | `frontend/tests/ApplicationsPage.test.tsx` — `affiche l'état vide` | `findByText("Aucune candidature à afficher.")` | **Couvert** côté UI |
| EF-33 | Refuser un compte non étudiant | `backend/tests/applications-list.test.ts` — `refuse les comptes non étudiants` | HTTP `403` | **Couvert** pour le statut |
| EF-33 | Refuser une session absente | `backend/tests/applications-list.test.ts` — `refuse une session absente` | HTTP `401` | **Couvert** pour le statut |
| EF-33 | Réagir à une session expirée | `frontend/tests/ApplicationsPage.test.tsx` — `signale une session expirée` | `expect(onUnauthorized).toHaveBeenCalled()` | **Couvert** |
| EF-33 | Cacher « Retirer » quand le statut n’est pas `IN_PROGRESS` | Condition dans `frontend/src/components/ApplicationTable.tsx`, sans test dédié identifié | Absence d’assertion frontend de non-affichage | **Absent dans l’inventaire** |

**Tests non attribués artificiellement** : `permissions.test.ts` (visibilité des offres), `offers.test.ts` (catalogue), `auth.test.ts` (authentification générale) et `NavBar.test.tsx` (présence du lien « Mes candidatures ») ne démontrent pas, à eux seuls, les scénarios EF-32 / EF-33. `ApplicationModal.test.tsx` vérifie l’envoi d’un message vide, mais pas la persistance backend.

**Manques restants, par priorité** : (1) assertions frontend sur « Retenue » et « Non retenue » et chargement initial « Retirée » ; (2) refus métier visible dans l’interface et retrait impossible selon le statut ; (3) identifiants invalides / offres inexistantes. Ces manques sont **signalés et non présentés comme corrigés**.

## 4. Conclusion

Les mécanismes de vérification présents dans Gesta (Oxlint, TypeScript, Vitest et builds) ont été exécutés avec succès, mais leurs résultats ne démontrent pas à eux seuls une couverture métier complète. L'analyse de traçabilité a permis de renforcer les cas portant sur l'authentification et les quatre statuts des candidatures. Des manques restent identifiés côté interface. L'audit Web 2 propose des améliorations des instructions Copilot, sans présenter l'absence d'une consigne comme une faille confirmée du code.


Selon la théorie du cours (Böckeler, *Harness engineering for coding agent users*, 2026), les **guides** orientent l'agent avant ou pendant son action (*feedforward*) ; les **senseurs** observent les résultats pour permettre une correction (*feedback*). Les mécanismes **inférentiels** s'appuient sur une interprétation par IA, tandis que les mécanismes **computationnels** utilisent des règles ou programmes exécutables.

| Quadrant | Mécanisme observé | Emplacement / outil | Rôle et exemple concret | Vérification pendant cette séance |
|---|---|---|---|---|
| Guide inférentiel | Instructions persistantes de Copilot | `.github/copilot-instructions.md` | Demande une architecture `controllers → services → repositories`, SQL dans les repositories, usage de `HttpError` et des permissions nommées. | Fichier lu et comparé au contenu publié sur `main` ; la conformité du code aux règles reste distincte de la présence des instructions. |
| Guide computationnel (contrôle opérationnel) | Permissions et sandbox de l'agent | `.vscode/settings.json` | Définit des règles d'approbation et bloque le réseau externe. Guide les **actions autorisées** de l'agent, non la qualité sémantique du code. | Sandbox vérifiée via `/sandbox policy` lors de la préparation du projet ; pas de nouvelle décision d'approbation documentée pendant cette séance. |
| Guide computationnel au sens large | Préparation de l'environnement | `backend/scripts/setupEnv.js`, scripts `setup` dans les `package.json` | Prépare les fichiers et l'environnement local de façon déterministe. | Présents selon l'analyse de Copilot ; non exécutés pendant cette séance. |
| Guide computationnel au sens large | Initialisation des données | `backend/src/db/scripts/init.ts`, script `db:init` | Applique migrations et données initiales. | Présent/configuré ; non exécuté pendant cette séance. |
| Guide computationnel au sens large | Copie des migrations compilées | `backend/scripts/copyMigrations.js` | Copie les migrations lors du build backend. | Exécuté indirectement lors du `npm run check` final : build backend réussi. |
| Senseur inférentiel | Revue sémantique IA formelle | Aucun mécanisme dédié identifié | Une revue IA du diff ou des exigences fournirait une appréciation sémantique après modification. | Quadrant volontairement laissé vide dans l'inventaire initial : aucune revue IA formalisée démontrée. |
| Senseur computationnel | Oxlint | Scripts `lint`, `.oxlintrc.json` backend/frontend | Repère les violations de règles statiques. | **Exécuté** : zéro avertissement, zéro erreur côté backend et frontend. |
| Senseur computationnel | TypeScript | Scripts `typecheck`, `tsconfig` backend/frontend | Repère les erreurs de typage et autres diagnostics configurés. | **Exécuté** : vérifications backend et frontend réussies. |
| Senseur computationnel | Vitest backend et frontend | `backend/tests/`, `frontend/tests/` | Compare résultats du code et attentes exprimées par les assertions. | **Exécuté** : 129 tests backend et 55 frontend réussis après changements. |
| Senseur computationnel | Build backend/frontend | Scripts `build` | Vérifie la capacité à compiler/produire les artefacts. | **Exécuté** : builds réussis. |
| Senseur computationnel (orchestrateur) | `npm run check` | `package.json` racine | Lance lint, typecheck, tests puis builds. | **Exécuté** avant et après les modifications des tests. |

**Nuances de classement.** Les scripts `setup` et `db:init` sont principalement des mécanismes de préparation déterministe, pas des guides sémantiques destinés à l'IA. Les fichiers `tsconfig`, `.oxlintrc` et `vitest.config` **configurent** des senseurs ; ils ne sont pas comptés une seconde fois comme senseurs autonomes. Aucun `AGENTS.md` ni fichier LSP propre au dépôt n’a été identifié par Copilot ; une absence d’identification n’est pas une preuve universelle d’absence. La sandbox a été vérifiée lors de la configuration initiale, et non réexécutée pendant cette séance.

## 2. Audit des guides par rapport à Web 2


**Référentiel consulté :** [BINV2150-A — JavaScript avancé (Web 2)](https://e-vinci.github.io/BINV2150A-slides/), séances 02, 03, 04, 12 et 13. La comparaison porte sur **les instructions fournies à Copilot** (`.github/copilot-instructions.md`, texte examiné pendant la séance), pas sur une certification de conformité du code. « Non » signifie qu'une consigne explicite n'a pas été trouvée dans ce guide, pas que l'application enfreint la bonne pratique.

| Attente Web 2 et source | Passage correspondant dans les guides Gesta | Correspondance | Écart observé ou recommandation |
|---|---|---|---|
| **HTTP et REST** : verbes, chemins, paramètres, en-têtes, codes 200/201/400/401/403/404 et documentation de l'API ([Web 2 séance 02](https://e-vinci.github.io/BINV2150A-slides/seance-02/)) | « Controllers parse and validate HTTP input and map service results to response DTOs » ; « For API errors, throw `new HttpError(status, code, message)` » ; « Update `backend/API.md` when an endpoint contract changes » | **Partielle** | Les principes de validation, de réponse et de documentation sont présents ; le guide ne détaille pas explicitement la correspondance entre statuts HTTP, méthodes et cas d'erreur. Proposer un rappel de ces conventions et des exemples HTTP dans `backend/http/`. |
| **Authentification vs autorisation** : déterminer qui est l'utilisateur, puis ce qu'il a le droit de faire ([Web 2 séance 03](https://e-vinci.github.io/BINV2150A-slides/seance-03/)) | « Protected requests flow through authentication and authorization middleware » ; « Reuse named permission predicates and `authorize(...)` » ; « The backend remains the source of truth for visibility » | **Oui (principe explicitement couvert)** | Garder cette séparation ; prévoir des tests de refus pour les routes sensibles. Cela ne prouve pas que chaque endpoint est parfaitement protégé. |
| **Protection des mots de passe** : ne pas stocker de mots de passe en clair, conserver un hash ([Web 2 séance 04](https://e-vinci.github.io/BINV2150A-slides/seance-04/)) | « Demo login is local-development-only » ; « Do not treat demo login as real authentication » | **Non (règle de hachage non explicite)** | Le guide avertit sur le caractère fictif de l'authentification de démonstration, mais ne donne pas de règle de hachage. Ajouter une consigne **conditionnelle à une authentification réelle future**, sans prétendre que Gesta stocke aujourd'hui des mots de passe en clair. |
| **Formulaires React** : événements JSX `onChange`, `onSubmit`, etc., et gestion des entrées utilisateur ([Web 2 séance 12](https://e-vinci.github.io/BINV2150A-slides/seance-12/)) | « pages → hooks → services/utils → models » ; « Hooks handle loading/error state » ; composants réutilisables dans `frontend/src/components` | **Partielle** | Les responsabilités sont organisées, mais les règles concrètes de formulaires et d'affichage des erreurs ne sont pas détaillées dans les instructions. Proposer de documenter validation côté interface et retours à l'utilisateur, sans confondre avec la validation obligatoire côté API. |
| **Immuabilité des états React** : remplacer un tableau/objet plutôt que le muter (`map`, `filter`, spread) ([Web 2 séance 13](https://e-vinci.github.io/BINV2150A-slides/seance-13/)) | « Hooks handle loading/error state » ; aucune instruction explicite sur la mutation des états dans le guide transmis | **Non (dans le guide)** | Ajouter dans les instructions frontend : ne pas muter directement l'état React ; utiliser des mises à jour immuables (`setState`, `map`, `filter`, spread). Vérifier séparément si le code le respecte déjà. |

### Synthèse de l'audit

Les instructions Gesta couvrent nettement **la séparation authentification/autorisation** et comportent des principes compatibles avec les **conventions HTTP/REST**. Les consignes plus fines de **formulaires React** sont seulement partielles ; l'**immuabilité des états** et le **hachage des mots de passe** ne sont pas des règles explicitement formulées dans le guide examiné. Concernant le hachage, la connexion Gesta est décrite comme une démonstration : une recommandation relative à une véritable authentification ne doit pas être présentée comme une faille avérée.

**Preuves et limites :** les séances 02, 03, 04, 12 et 13 ont été consultées sur le site officiel et correspondent bien aux notions citées (HTTP/REST, authentification/autorisation, hachage, événements/formulaires, immuabilité des collections). Le guide `.github/copilot-instructions.md` a été comparé à la version publiée sur la branche `main` du dépôt GitHub. Les liens renvoient aux séances sans numéro de diapositive ; les appréciations portent sur **le texte du guide**, et non sur un audit ligne par ligne du code en fonctionnement. Il s’agit de recommandations, pas de modifications des guides.

## 3. Matrice de traçabilité EF-32 / EF-33


Référence métier : `docs/cdc_gesta_developpement.md`, **EF-32** (candidater à une offre publiée avec un message facultatif ; retrait avant traitement) et **EF-33** (consulter ses candidatures et leurs statuts). L’inventaire a été effectué par Copilot en inspectant les tests ; les chemins et assertions ci-dessous sont les éléments remontés pendant la séance. Les **trois fichiers de tests de la branche `semaine-3` ne sont pas accessibles dans cette copie du rapport** : les ajouts doivent donc être contrôlés une dernière fois dans VS Code avant le commit.

Une couverture est dite « Couvert » uniquement pour le comportement démontré par les assertions citées, et non pour toute la fonctionnalité.

### EF-32 — Candidater et retirer sa candidature

| Exigence | Cas et résultat attendu | Test existant (fichier et nom signalé) | Assertions utiles rapportées | Couverture après travail |
|---|---|---|---|---|
| EF-32 | Offre publiée, message présent → création 201, attributs et statut `IN_PROGRESS` | `backend/tests/applications.test.ts` — `crée une candidature avec un message facultatif` | `response.status` vaut `201` ; `toMatchObject({ offerId, studentId, message, status: "IN_PROGRESS" })` | **Couvert** pour le scénario testé |
| EF-32 | Offre publiée, message omis → message `null` | `backend/tests/applications.test.ts` — test de création sans message renforcé (intitulé exact à confirmer) | `expect(response.body.message).toBeNull()` | **Couvert** pour la réponse API après modification |
| EF-32 | Non-étudiant → refus 403 | `backend/tests/applications.test.ts` — `refuse les rôles autres qu'étudiant` | HTTP `403` et `error.code === "FORBIDDEN"` | **Couvert** |
| EF-32 | Offre non publiée → refus 400 | `backend/tests/applications.test.ts` — `refuse une offre qui n'est pas publiée` | HTTP `400` et `error.code === "OFFER_NOT_PUBLISHED"` | **Couvert** |
| EF-32 | Deuxième candidature active → refus 400 | `backend/tests/applications.test.ts` — `refuse une candidature active en doublon` | HTTP `400` et `error.code === "APPLICATION_EXISTS"` | **Couvert** |
| EF-32 | Message de mauvais type → refus 400 | `backend/tests/applications.test.ts` — `valide le corps de la requête` | `message: 42` → HTTP `400`, `INVALID_BODY` | **Couvert** pour cette entrée invalide |
| EF-32 | Retirer sa candidature en cours → 200, `WITHDRAWN` | `backend/tests/applications-withdraw.test.ts` — `retire une candidature en cours appartenant à l'étudiant` | HTTP `200` et `body.status === "WITHDRAWN"` | **Couvert** |
| EF-32 | Refuser le retrait des statuts `SELECTED`, `REJECTED`, `WITHDRAWN` | `backend/tests/applications-withdraw.test.ts` — cas paramétrés `refuse le retrait d'une candidature %s` | HTTP `400` et `APPLICATION_NOT_WITHDRAWABLE` dans les trois cas | **Couvert** |
| EF-32 | Candidature d’autrui → 404 sans divulgation | `backend/tests/applications-withdraw.test.ts` — `refuse la candidature d'un autre étudiant sans révéler la ressource` | HTTP `404` et `NOT_FOUND` | **Couvert** |
| EF-32 | Compte non étudiant retire → refus 403 | `backend/tests/applications-withdraw.test.ts` — `refuse les comptes non étudiants` | HTTP `403` ; code d’erreur non asserté | **Partiel** (statut seul) |
| EF-32 | Candidater à nouveau après retrait → 201, nouvel ID | `backend/tests/applications-withdraw.test.ts` — `permet une nouvelle candidature après retrait` | Retrait `200`, création `201`, ID différent, `IN_PROGRESS` | **Couvert** |
| EF-32 | Candidater sans session → 401 | `backend/tests/applications.test.ts` — `refuse une candidature sans session` (**ajouté**) | POST sans `Authorization` → HTTP `401`, `UNAUTHENTICATED` | **Couvert** après modification |
| EF-32 | Retirer sans session → 401 | `backend/tests/applications-withdraw.test.ts` — `refuse un retrait sans session` (**ajouté**) | POST sans `Authorization` → HTTP `401`, `UNAUTHENTICATED` | **Couvert** après modification |
| EF-32 | Offre inexistante / ID invalide → refus contrôlé | Aucun test direct identifié par Copilot | Aucune assertion spécifique retrouvée dans l’inventaire | **Absent dans l’inventaire** |
| EF-32 | Refus métier 400/404 affiché après retrait | `frontend/tests/ApplicationsPage.test.tsx` — test spécifique non identifié | Aucune assertion sur le message d’erreur métier | **Absent dans l’inventaire** |

### EF-33 — Consulter ses candidatures et leur statut

| Exigence | Cas et résultat attendu | Test existant (fichier et nom signalé) | Assertions utiles rapportées | Couverture après travail |
|---|---|---|---|---|
| EF-33 | Ne récupérer que les candidatures de l’étudiant connecté | `backend/tests/applications-list.test.ts` — `retourne uniquement les candidatures de l'étudiant connecté` | Égalité de la liste d’IDs avec ceux attendus | **Couvert** pour les données de test |
| EF-33 | Exclure les candidatures des autres étudiants | Même test | Égalité exacte des IDs, donc exclusion indirecte | **Couvert**, preuve indirecte |
| EF-33 | Afficher les informations de l’offre (titre, entreprise, statut) | Même test | `toMatchObject({ offerTitle, companyShortName, status: "IN_PROGRESS" })` | **Couvert** pour ces champs |
| EF-33 | L’API retourne les quatre codes de statut | `backend/tests/applications-list.test.ts` — `expose les quatre statuts dans une liste étudiant` (**renforcé**) | Quatre candidatures dans SQLite de test ; longueur `4` et `expect.arrayContaining(["IN_PROGRESS", "SELECTED", "REJECTED", "WITHDRAWN"])` sur les statuts | **Couvert** pour l’API après modification, sous réserve de vérification du diff |
| EF-33 | Montrer « En cours » dans l’interface | `frontend/tests/ApplicationsPage.test.tsx` — `affiche les candidatures et leurs libellés français` | `findByText("En cours")` | **Couvert** |
| EF-33 | Montrer « Retenue » et « Non retenue » dans l’interface | Aucun test d’affichage explicite identifié | Pas d’assertion sur ces deux libellés | **Absent dans l’inventaire** |
| EF-33 | Montrer « Retirée » pour une candidature déjà retirée au chargement | `frontend/tests/ApplicationsPage.test.tsx` — `retire une candidature en cours` | `findByText("Retirée")` après POST, pas au chargement initial | **Partiel** |
| EF-33 | Afficher une liste vide | `frontend/tests/ApplicationsPage.test.tsx` — `affiche l'état vide` | `findByText("Aucune candidature à afficher.")` | **Couvert** côté UI |
| EF-33 | Refuser un compte non étudiant | `backend/tests/applications-list.test.ts` — `refuse les comptes non étudiants` | HTTP `403` | **Couvert** pour le statut |
| EF-33 | Refuser une session absente | `backend/tests/applications-list.test.ts` — `refuse une session absente` | HTTP `401` | **Couvert** pour le statut |
| EF-33 | Réagir à une session expirée | `frontend/tests/ApplicationsPage.test.tsx` — `signale une session expirée` | `expect(onUnauthorized).toHaveBeenCalled()` | **Couvert** |
| EF-33 | Cacher « Retirer » quand le statut n’est pas `IN_PROGRESS` | Condition dans `frontend/src/components/ApplicationTable.tsx`, sans test dédié identifié | Absence d’assertion frontend de non-affichage | **Absent dans l’inventaire** |

**Tests non attribués artificiellement** : `permissions.test.ts` (visibilité des offres), `offers.test.ts` (catalogue), `auth.test.ts` (authentification générale) et `NavBar.test.tsx` (présence du lien « Mes candidatures ») ne démontrent pas, à eux seuls, les scénarios EF-32 / EF-33. `ApplicationModal.test.tsx` vérifie l’envoi d’un message vide, mais pas la persistance backend.

**Manques restants, par priorité** : (1) assertions frontend sur « Retenue » et « Non retenue » et chargement initial « Retirée » ; (2) refus métier visible dans l’interface et retrait impossible selon le statut ; (3) identifiants invalides / offres inexistantes. Ces manques sont **signalés et non présentés comme corrigés**.

## 4. Conclusion

Les mécanismes de vérification présents dans Gesta (Oxlint, TypeScript, Vitest et builds) ont été exécutés avec succès, mais leurs résultats ne démontrent pas à eux seuls une couverture métier complète. L'analyse de traçabilité a permis de renforcer les cas portant sur l'authentification et les quatre statuts des candidatures. Des manques restent identifiés côté interface. L'audit Web 2 propose des améliorations des instructions Copilot, sans présenter l'absence d'une consigne comme une faille confirmée du code.
