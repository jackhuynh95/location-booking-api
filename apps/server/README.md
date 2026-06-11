# Location Booking API Server

NestJS backend for hierarchical building locations and booking validation.

## Baseline

Phase 3 location foundation is implemented:

- `GET /health`
- Environment validation with `@nestjs/config` and Joi
- PostgreSQL connection through TypeORM
- Global validation pipe
- Shared exception response shape
- Structured request logging middleware
- TypeORM migration scripts
- Location CRUD endpoints
- Location tree endpoint
- Idempotent assignment location seed command

Booking domain logic does not exist yet.

## Local Run

From repository root:

```bash
docker compose up -d postgres
```

From `apps/server`:

```bash
npm install
npm run start:dev
```

Use values from repository-root `.env.example` in either repository-root `.env` or `apps/server/.env`.

## Commands

```bash
npm run build
npm run lint
npm test
npm run migration:generate -- src/database/migrations/<MigrationName>
npm run migration:run
npm run migration:revert
npm run seed:locations
```

Run `npm run seed:locations` after `npm run migration:run` to load the original assignment sample locations. The command is idempotent: reruns update the same rows by unique location number instead of inserting duplicates.
