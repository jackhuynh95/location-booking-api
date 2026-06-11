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

Expected future modules:

- `locations`
- `bookings`
- `database`
- `common`

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
