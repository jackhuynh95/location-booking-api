# Location Booking API Server

NestJS backend for hierarchical building locations and booking validation.

## Baseline

Phase 2 foundation is implemented:

- `GET /health`
- Environment validation with `@nestjs/config` and Joi
- PostgreSQL connection through TypeORM
- Global validation pipe
- Shared exception response shape
- Structured request logging middleware
- TypeORM migration scripts

No location or booking domain logic exists yet.

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
```
