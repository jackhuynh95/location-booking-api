# Phase 2 - NestJS Server Baseline

## Goal

Generate the backend foundation and establish cross-cutting behavior before adding domain features.

## Required Skill

Before starting this phase, invoke and mention `nestjs-expert` if it is available in the active agent environment.

If `nestjs-expert` is unavailable, explicitly say so in the implementation notes and proceed using the project guardrails in `AGENTS.md` and `docs/guardrails/development-guardrails.md`.

## Tasks

| ID    | Task                       | Output                | Done When                                                  | Status |
| ----- | -------------------------- | --------------------- | ---------------------------------------------------------- | ------ |
| 2.1.1 | Generate NestJS app        | `apps/server`         | App boots locally                                          | Done   |
| 2.1.2 | Remove scaffold noise      | `apps/server`         | Generated sample code is replaced or renamed intentionally | Done   |
| 2.2.1 | Add health controller      | `GET /health`         | Endpoint returns service status                            | Done   |
| 2.3.1 | Add config module          | Server config files   | Environment variables load from `.env`                     | Done   |
| 2.3.2 | Validate env values        | Config schema         | Missing database config fails fast                         | Done   |
| 2.4.1 | Add TypeORM module         | Database module       | Server connects to PostgreSQL                              | Done   |
| 2.4.2 | Add migration command      | Package scripts       | Migrations can be generated and run                        | Done   |
| 2.5.1 | Enable validation pipe     | Main bootstrap        | DTO validation is global                                   | Done   |
| 2.6.1 | Add exception filter       | Common module         | Errors share one response shape                            | Done   |
| 2.7.1 | Add request logging        | Common logging setup  | Request method, path, status, duration are logged          | Done   |
| 2.7.2 | Add domain logging pattern | Docs or common logger | Services can log validation failures consistently          | Done   |

## Baseline Error Shape

Candidate response:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Capacity exceeds room capacity",
  "timestamp": "2026-06-11T00:00:00.000Z",
  "path": "/bookings"
}
```

## Exit Criteria

- Server runs.
- Database connects.
- Health check works.
- DTO validation works.
- Errors and logs are consistent.

## Implementation Notes

- `nestjs-expert` was invoked before backend work.
- `apps/server` is an app-local npm NestJS project.
- Default sample controller/service code was removed and replaced with `health`, `config`, `database`, and `common` baseline modules.
- Runtime config loads from `apps/server/.env` or repository-root `.env`, matching `.env.example`.
- TypeORM uses PostgreSQL with migrations under `apps/server/src/database/migrations`.
- Migration scripts live in `apps/server/package.json`: `migration:generate`, `migration:run`, and `migration:revert`.
- Request logging emits structured JSON with method, path, status code, and duration.
- Global exception responses follow the baseline error shape.

## Verification

- `npm run build`
- `npm run lint`
- `npm test`
- `docker compose up -d postgres`
- `curl http://localhost:3000/health` returned `{"status":"ok","database":"up",...}`.
- `curl http://localhost:3000/missing` returned the shared error shape.
- `npm run typeorm -- migration:show`
