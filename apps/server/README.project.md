# Server App

Future home of the NestJS backend API.

Expected responsibilities:

- Location CRUD.
- Location tree retrieval.
- Booking CRUD.
- Booking validation rules.
- PostgreSQL persistence through TypeORM.
- Logging and exception handling.

Phase 2 generated the NestJS baseline. Read the project specs in `../../docs/` before adding domain code.

## Phase 2 Baseline

The app was generated with npm from the repository root:

```bash
mv apps/server/README.md apps/server-readme.pre-scaffold.md
rmdir apps/server
npx @nestjs/cli new server --directory apps/server --package-manager npm --skip-git --strict
mv apps/server-readme.pre-scaffold.md apps/server/README.project.md
```

The default sample controller/service code was removed. Current baseline includes:

- `GET /health`.
- Config validation with `@nestjs/config` and Joi.
- TypeORM PostgreSQL connection.
- Global validation pipe.
- Shared exception response shape.
- Structured request logging middleware.
- TypeORM migration scripts and `src/database/migrations`.

Run locally:

```bash
docker compose up -d postgres
cd apps/server
npm install
npm run start:dev
```
