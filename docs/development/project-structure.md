# Project Structure

This project uses a small monorepo-style harness.

```text
location-booking-api/
|-- apps/
|   |-- server/
|   `-- admin/
|-- docs/
|   |-- architecture/
|   |-- decisions/
|   |-- development/
|   |-- guardrails/
|   |-- operations/
|   `-- specs/
|-- docker-compose.yml
|-- AGENTS.md
|-- LICENSE
`-- README.md
```

## App Boundaries

### `apps/server`

The server app will own the API, domain rules, database entities, migrations, logging, and exception handling.

Phase 2 source layout after NestJS scaffold cleanup:

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
```

The app was generated in Phase 2 with an app-local npm project:

```bash
mv apps/server/README.md apps/server-readme.pre-scaffold.md
rmdir apps/server
npx @nestjs/cli new server --directory apps/server --package-manager npm --skip-git --strict
mv apps/server-readme.pre-scaffold.md apps/server/README.project.md
```

Do not add a root workspace yet. Revisit workspace tooling only if shared packages or approved admin implementation need it.

### `apps/admin`

The admin app is optional. It exists as a planned app root so future UI work has a clear home without disturbing the backend.

Do not add frontend dependencies until the admin scope is confirmed.

## Docs Boundaries

- `docs/specs`: assignment and functional requirements.
- `docs/architecture`: system design and technical direction.
- `docs/development`: local workflow and project structure.
- `docs/operations`: Docker, deployment, and runtime notes.
- `docs/guardrails`: development constraints for humans and agents.
- `docs/decisions`: future architecture decision records.
