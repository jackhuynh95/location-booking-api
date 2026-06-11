# Local Development Harness

## Current Phase

The local harness includes PostgreSQL infrastructure, the NestJS API, the Vite admin UI, and Docker runtime packaging.

Current local services:

- PostgreSQL through `docker-compose.yml`.
- NestJS API in `apps/server`.
- Vite React admin in `apps/admin`.

Future local services may include:

- Test runner profiles.
- Docker Swarm deployment descriptors.

## Backend Flow

Expected backend flow:

```bash
docker compose up -d postgres
cd apps/server
npm install
npm run start:dev
```

Package manager: `npm`.

Phase 2 scaffold command used:

```bash
mv apps/server/README.md apps/server-readme.pre-scaffold.md
rmdir apps/server
npx @nestjs/cli new server --directory apps/server --package-manager npm --skip-git --strict
mv apps/server-readme.pre-scaffold.md apps/server/README.project.md
```

`apps/server` owns its `package.json` and `package-lock.json`. The repository does not use a root workspace yet.

Local server/database settings are documented in root `.env.example`. Copy those values into either repository-root `.env` or `apps/server/.env` for local server boot.

Migration commands run from `apps/server`:

```bash
npm run migration:generate -- src/database/migrations/<MigrationName>
npm run migration:run
npm run migration:revert
```

## Ports

Reserved local ports:

- `5432`: PostgreSQL.
- `3000`: server API.
- `5173`: admin dev server.

The production Docker runtime serves the API and built admin assets from the NestJS server on port `3000`.
