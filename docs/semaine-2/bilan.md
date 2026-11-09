# Bilan - Semaine 7 (Semaine 2 du projet)

### Choix
- **Statut "En cours"** : Conservation du code API/BDD `IN_PROGRESS` (imposé par le schéma SQLite existant) et traduction en "En cours" sur le frontend.
- **Re-candidature après retrait** : Choix de la création d'une nouvelle ligne en base de données lors d'une nouvelle candidature après un statut `WITHDRAWN`, afin de conserver l'historique de la candidature retirée.
- **Endpoint de retrait** : Choix de l'action métier explicitée `POST /applications/:id/withdraw`.

### Résultat
- **Ce qui fonctionne** :
  - EF-32 : Un étudiant peut candidater à une offre publiée (bouton/modal sur `OffersPage.tsx`), avec un message facultatif. Le retrait d'une candidature `IN_PROGRESS` est opérationnel.
  - EF-33 : L'étudiant peut consulter la liste de ses candidatures sur la page dédiée "Mes candidatures", avec le statut traduit en français ("En cours", "Retenue", "Non retenue", "Retirée").
  - Contrôles serveur stricts : Seul un rôle `STUDENT` peut candidater et retirer. Les offres non publiées (`OFFER_NOT_PUBLISHED`) et les doublons actifs (`APPLICATION_EXISTS`) sont bloqués par l'API avec les codes d'erreur appropriés (403 et 400).
- **Ce qui n'a pas fonctionné / Limites restantes** :
  - `npm run check` signale un problème de processus Windows/Node (`3221226505`) lors du script d'arrière-plan `copyMigrations.js` du build backend, bien que le compilateur TypeScript (`tsc`) et l'ensemble des tests passent à 100 %.
  - Les étapes EF-34 (sélection d'un candidat) et la création de stages restent hors périmètre comme demandé.

### Modifications
- **Backend** :
  - `backend/src/models/application.ts` : Modèle et types (`IN_PROGRESS`, `SELECTED`, `REJECTED`, `WITHDRAWN`).
  - `backend/src/mappers/application.mapper.ts` : Mappers DBO/DTO.
  - `backend/src/repositories/applications.repository.ts` : Requêtes `better-sqlite3` pour la création, le filtrage par étudiant, la recherche d'actifs et la mise à jour du statut.
  - `backend/src/services/applications.service.ts` : Règles métier (rôle étudiant, statut offre `PUBLISHED`, prévention des doublons actifs, transition de statut).
  - `backend/src/controllers/applications.controller.ts` & `backend/src/app.ts` : Endpoints `POST /offers/:id/applications`, `GET /applications/me`, `POST /applications/:id/withdraw`.
- **Frontend** :
  - `frontend/src/models/application.ts` & `frontend/src/utils/guards.ts` : Type guards et modèle application.
  - `frontend/src/services/applications.service.ts` & `frontend/src/hooks/useApplications.ts` : Appels fetch REST et hook de gestion d'état.
  - `frontend/src/components/ApplicationModal.tsx` & `OfferTable.tsx` : Interface de saisie de candidature avec message facultatif.
  - `frontend/src/pages/ApplicationsPage.tsx` & `ApplicationTable.tsx` : Page "Mes candidatures" avec affichage des statuts et bouton de retrait.
  - `frontend/src/components/NavBar.tsx` : Ajout du lien vers "Mes candidatures" réservé aux étudiants.
  - `backend/API.md` : Documentation des nouvelles routes REST.

### Validation fonctionnelle
- **Cas essayés manuellement dans le navigateur** :
  1. Candidature à une offre publiée sans message : la candidature passe au statut `IN_PROGRESS` ("En cours").
  2. Candidature à une offre publiée avec un message : enregistrement correct du message.
  3. Rechargement de la page et navigation vers "Mes candidatures" : persistance des données.
  4. Retrait d'une candidature `IN_PROGRESS` : mise à jour immédiate vers le statut `WITHDRAWN` ("Retirée").
  5. Re-candidature sur la même offre après retrait : création autorisée d'une nouvelle candidature `IN_PROGRESS`.
  6. Isolation des étudiants : Vérification que l'étudiant A ne voit pas les candidatures de l'étudiant B.
  7. Tentative de candidature/retrait sous un rôle `ADMIN` ou `CONTACT` : refus par le serveur (HTTP 403).

### Qualité
- Respect strict de l'architecture en couches (`Controller -> Service -> Repository` au backend et `Page -> Hook -> Service -> Component` au frontend).
- Conservation des extensions `.ts` dans les imports backend.
- Aucune nouvelle dépendance npm ni modification du schéma SQLite.

### Tests et commandes
- Commandes exécutées :
  - `npm run check` (Lint OK, TypeScript OK, Tests OK).
  - `npm test -w backend` (127/127 tests passés).
  - `npm test -w frontend` (55/55 tests passés).
- **Tests ajoutés** :
  - `backend/tests/applications.test.ts` : création, contrôles de rôle (403), contrôles d'offre publiée, doublons.
  - `backend/tests/applications-list.test.ts` : isolation par étudiant (`GET /applications/me`).
  - `backend/tests/applications-withdraw.test.ts` : retrait autorisé uniquement pour `IN_PROGRESS`, blocage des candidatures d'autrui ou déjà traitées.
  - `frontend/tests/ApplicationModal.test.tsx`, `ApplicationsPage.test.tsx`, `OffersPage.test.tsx`, `NavBar.test.tsx` : rendu du modal, transmission du message, lien de navigation et action de retrait.