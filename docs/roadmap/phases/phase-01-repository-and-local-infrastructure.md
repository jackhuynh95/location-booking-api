# Phase 1 - Repository And Local Infrastructure

## Goal

Prepare the repo shape and local infrastructure needed before generating server code.

## Tasks

| ID | Task | Output | Done When | Status |
| --- | --- | --- | --- | --- |
| 1.1.1 | Create `apps` root | `apps/README.md` | App boundary is documented | Done |
| 1.1.2 | Create server placeholder | `apps/server/README.md` | Backend responsibilities are documented | Done |
| 1.1.3 | Create admin placeholder | `apps/admin/README.md` | Optional admin scope is documented | Done |
| 1.2.1 | Add PostgreSQL service | `docker-compose.yml` | Compose config validates | Done |
| 1.2.2 | Document compose usage | `docs/operations/docker-compose.md` | Local DB commands and credentials are documented | Done |
| 1.3.1 | Choose scaffold command | Roadmap or decision doc | Exact NestJS scaffold approach is recorded | Planned |
| 1.3.2 | Choose source layout | Roadmap or decision doc | `src` layout is agreed before generation | Planned |
| 1.4.1 | Define env variables | `.env.example` or docs | Database and server env names are documented | Planned |
| 1.5.1 | Choose package manager | Decision doc | npm, pnpm, or yarn choice is recorded | Planned |

## Decisions Needed

- Package manager.
- Whether `apps/server` owns its own lockfile or a root workspace owns all apps.
- Whether to add root `package.json` now or wait until app scaffolding.

## Exit Criteria

- Repo layout is stable.
- Local database can start.
- App generation choices are documented.
