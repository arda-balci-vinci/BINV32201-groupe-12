# Gesta project guidelines

## Build and test

- Use Node.js `>=22.14.0` (Node 24 LTS is recommended).
- From the repository root, install and initialize a local development environment with:
  `npm ci`, then `npm run setup`.
- Run the application with `npm run dev`. The API listens on port 3000 and the Vite frontend on port 5173. The frontend calls `/api/...`; Vite proxies those requests to the API and removes `/api`.
- Run the complete validation with `npm run check`. This runs, in order, linting (Oxlint), TypeScript checks, all Vitest tests, and both builds.
- Individual root commands are:
  - `npm run lint`
  - `npm run typecheck`
  - `npm test`
  - `npm run build`
- Run backend-only or frontend-only commands with npm workspaces, for example:
  - `npm run test -w backend`
  - `npm run test -w frontend`
  - `npm run lint -w backend`
  - `npm run typecheck -w frontend`
- Run one test file with Vitest:
  - `npm run test -w backend -- tests/offers.test.ts`
  - `npm run test -w frontend -- tests/OffersPage.test.tsx`
- Run one named test with `-t`, for example:
  `npm run test -w backend -- tests/offers.test.ts -t "montre toutes les offres"`.
- Backend tests use an in-memory SQLite database through `backend/tests/helpers/testApp.ts`; do not use `backend/data/gesta.db` for tests. Frontend tests use jsdom and Testing Library with fetch stubs.
- Use `npm run db:init` to apply migrations and seed an empty database. Use `npm run db:reset` only after stopping the dev server.

## Architecture

Gesta is an npm-workspaces monorepo with a React/Vite frontend and an Express/SQLite backend. See `docs/architecture.md` for the fuller request and data-flow diagrams, and `backend/API.md` for the public API contract.

### Backend flow

`backend/src/main.ts` loads configuration, initializes the database, and starts the server. `backend/src/app.ts` assembles the Express application and dependency-injected routers.

Protected requests flow through authentication and authorization middleware, then through:

`controllers -> services -> repositories -> SQLite`

- Controllers parse and validate HTTP input and map service results to response DTOs.
- Services contain business rules and must not depend on Express `Request` or `Response`.
- Repositories contain SQL queries (`better-sqlite3`) and return database-row (DBO) shapes.
- Models describe DBOs, domain objects, and API DTOs; mappers convert between those shapes.
- `services/permissions.ts` contains named access rules used by `authorize`.
- `errorHandler` converts thrown `HttpError` instances to the standard `{ "error": { "code", "message" } }` response.

### Frontend flow

The frontend follows the course's MVVM-like flow:

`pages -> hooks -> services/utils -> models`

Reusable presentational components are below `frontend/src/components`. `App.tsx` is the sole caller of `useAuth`; it passes the session and logout callback down to pages. Hooks handle loading/error state, abort requests on cleanup, and invoke `onUnauthorized` for 401 responses.

### Database and authentication

- SQLite schema changes are additive migration files in `backend/src/db/migrations/`, applied once in filename order. Add a new numbered migration; do not edit an applied migration.
- Database constraints enforce structural validity; services enforce business rules and permission/status transitions.
- Status values are stored as English codes (for example `PUBLISHED`) and translated to French labels in the frontend.
- Demo login is local-development-only. The token carries only `kind` and `id`; authentication reloads the account, roles, and companies from the database on every request. Do not treat demo login as real authentication.

## Repository-specific conventions

- Backend relative imports include the `.ts` extension (e.g., `import { ... } from './service.ts'`). Frontend imports follow standard Vite/TypeScript conventions.
- Send the session token directly in the `Authorization` header; this API does not use the `Bearer` prefix (`Authorization: <token>`).
- Configure the API port with `API_PORT`, not `PORT`.
- Keep dependency construction in factory functions such as `createOffersRepository(db)` and `createOffersService(repository)` for testability.
- Keep SQL in repositories and return DBOs from them; convert DBOs to domain objects in services and to public DTOs at the controller boundary.
- Reuse named permission predicates and `authorize(...)` rather than duplicating role checks. The backend remains the source of truth for visibility.
- For API errors, throw `new HttpError(status, code, message)` and let the central error middleware format the response.
- When adding query parameters (such as `period` for offers filtering), pass them optionally to the repository layer without breaking role-based visibility.
- Keep user-facing status and period labels localized in French in the frontend (e.g., "Toutes les périodes", "P1", "P2", "Autre"); preserve storage/API codes.
- REST Client request examples belong in `backend/http/`. Update `backend/API.md` when an endpoint contract changes.
- Preserve the seed identifiers in `backend/src/db/seed/seedIds.ts` when writing tests.

## Project references

- `README.md`: setup, commands, prerequisites, demo mode, and troubleshooting.
- `docs/architecture.md`: layer responsibilities, reference feature flows, and test strategy.
- `docs/cdc_gesta_developpement.md`: business requirements.
- `docs/seed.md`: demo data and users.