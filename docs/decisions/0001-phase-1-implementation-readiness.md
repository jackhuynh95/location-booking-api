# Phase 1 Implementation Readiness

## Status

Accepted

## Context

Phase 1 must finish repository and local infrastructure planning before generating `apps/server`. The project already has app placeholders and a PostgreSQL compose service, but package management, app ownership, scaffold command, initial source layout, and environment variable names were still unresolved.

The repository is still pre-scaffold. This decision records implementation readiness only; it does not generate NestJS source code.

## Decision

Use `npm` for the initial backend app. Generate `apps/server` as an app-local NestJS project with its own `package.json` and `package-lock.json`.

Do not create a root workspace in Phase 1. Keep the root as documentation, guardrails, and local infrastructure until there is a concrete need for shared packages or coordinated multi-app scripts. Revisit a root workspace only after admin scope is approved or shared code becomes necessary.

Generate the server in Phase 2 from the repository root with:

```bash
mv apps/server/README.md apps/server-readme.pre-scaffold.md
rmdir apps/server
npx @nestjs/cli new server --directory apps/server --package-manager npm --skip-git --strict
mv apps/server-readme.pre-scaffold.md apps/server/README.project.md
```

`apps/server` already contains a placeholder `README.md`, and a Nest CLI dry run reports a merge conflict if the scaffold writes over that path. Move the placeholder before generation, then keep it as `README.project.md` or fold its project-specific notes into the generated README during scaffold cleanup.

Use this initial source layout after scaffold cleanup:

```text
apps/server/src/
|-- main.ts
|-- app.module.ts
|-- common/
|   |-- filters/
|   |-- logging/
|   `-- validation/
|-- config/
|-- database/
|   |-- migrations/
|   `-- typeorm.config.ts
|-- health/
|-- locations/
`-- bookings/
```

Environment variables are documented in root `.env.example` because local Docker and future server setup share the same PostgreSQL contract:

| Name             | Purpose                    | Local default      |
| ---------------- | -------------------------- | ------------------ |
| `NODE_ENV`       | Runtime mode               | `development`      |
| `PORT`           | HTTP server port           | `3000`             |
| `DB_HOST`        | PostgreSQL host            | `localhost`        |
| `DB_PORT`        | PostgreSQL port            | `5432`             |
| `DB_USERNAME`    | PostgreSQL username        | `location_booking` |
| `DB_PASSWORD`    | PostgreSQL password        | `location_booking` |
| `DB_DATABASE`    | PostgreSQL database        | `location_booking` |
| `DB_SSL`         | PostgreSQL SSL toggle      | `false`            |
| `DB_SYNCHRONIZE` | TypeORM schema sync toggle | `false`            |
| `DB_MIGRATIONS_RUN` | TypeORM migration run toggle | `true`         |
| `DB_LOGGING`     | TypeORM SQL logging toggle | `false`            |
| `DB_POOL_MAX` | PostgreSQL pool max connections | `10` |
| `DB_POOL_IDLE_TIMEOUT_MS` | PostgreSQL idle timeout | `30000` |
| `DB_POOL_CONNECTION_TIMEOUT_MS` | PostgreSQL connection timeout | `5000` |

## Alternatives Considered

- `pnpm` root workspace: better for mature monorepos, but adds workspace decisions before the optional admin app exists.
- Root `package.json` now: useful for shared scripts, but premature before any generated app code exists.
- Generate a NestJS monorepo with the CLI: heavier than needed for one backend app and optional future admin UI.
- Generate directly into the existing non-empty `apps/server` directory: rejected because the Nest CLI reports a `README.md` merge conflict.
- Put `.env.example` under `apps/server`: reasonable after scaffold, but root placement is clearer while compose config and app generation docs live at the root.

## Consequences

- Phase 2 can generate `apps/server` without guessing package manager or layout.
- The first lockfile will live under `apps/server`, not at the root.
- Root workspace conversion remains possible later, but will be an explicit decision.
- Local PostgreSQL defaults in `.env.example` match `docker-compose.yml`.
