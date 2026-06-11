# Local Development Harness

## Current Phase

The local harness is intentionally minimal. It provides infrastructure before application code.

Current local service:

- PostgreSQL through `docker-compose.yml`.

Future local services may include:

- `apps/server` container.
- `apps/admin` container.
- Test runner profiles.
- Docker Swarm deployment descriptors.

## Intended Flow After Implementation Starts

Expected backend flow:

```bash
docker compose up -d postgres
cd apps/server
npm install
npm run start:dev
```

The exact package manager and scripts should be decided when the NestJS scaffold is created.

## Ports

Reserved local ports:

- `5432`: PostgreSQL.
- `3000`: future server API candidate.
- `5173`: future admin dev server candidate.

These are placeholders, not implemented services.
