# Phase 1 - Repository And Local Infrastructure

## Goal

Prepare the repo shape and local infrastructure needed before generating server code.

## Tasks

| ID    | Task                      | Output                                                    | Done When                                        | Status |
| ----- | ------------------------- | --------------------------------------------------------- | ------------------------------------------------ | ------ |
| 1.1.1 | Create `apps` root        | `apps/README.md`                                          | App boundary is documented                       | Done   |
| 1.1.2 | Create server placeholder | `apps/server/README.md`                                   | Backend responsibilities are documented          | Done   |
| 1.1.3 | Create admin placeholder  | `apps/admin/README.md`                                    | Optional admin scope is documented               | Done   |
| 1.2.1 | Add PostgreSQL service    | `docker-compose.yml`                                      | Compose config validates                         | Done   |
| 1.2.2 | Document compose usage    | `docs/operations/docker-compose.md`                       | Local DB commands and credentials are documented | Done   |
| 1.3.1 | Choose scaffold command   | `docs/decisions/0001-phase-1-implementation-readiness.md` | Exact NestJS scaffold approach is recorded       | Done   |
| 1.3.2 | Choose source layout      | `docs/decisions/0001-phase-1-implementation-readiness.md` | `src` layout is agreed before generation         | Done   |
| 1.4.1 | Define env variables      | `.env.example`                                            | Database and server env names are documented     | Done   |
| 1.5.1 | Choose package manager    | `docs/decisions/0001-phase-1-implementation-readiness.md` | npm, pnpm, or yarn choice is recorded            | Done   |

## Decisions Recorded

- Package manager: `npm`.
- Workspace model: app-local `apps/server` package for Phase 2, no root workspace yet.
- Root package: defer until shared scripts or approved admin scope require it.
- Scaffold command and source layout: recorded in [Decision 0001](../../decisions/0001-phase-1-implementation-readiness.md).
- Environment contract: recorded in `.env.example` and [Decision 0001](../../decisions/0001-phase-1-implementation-readiness.md).

## Exit Criteria

- Repo layout is stable.
- Local database can start.
- App generation choices are documented.
- No unresolved Phase 1 planning tasks remain.
