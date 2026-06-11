# Phase 8 - Static Admin Hosting And Docker Runtime

## Goal

Package the final deliverable so the NestJS server can serve both the REST API and built admin UI static assets from a Docker runtime.

## Required Skills

Before backend/static hosting work, invoke and mention `nestjs-expert` if it is available.

Before admin build integration work, invoke and mention `react-best-practices` if it is available.

If either skill is unavailable, explicitly say so in the implementation notes and proceed using the project guardrails.

## Tasks

| ID | Task | Output | Done When | Status |
| --- | --- | --- | --- | --- |
| 8.1.1 | Define URL strategy | Decision doc | API routes and admin fallback routes do not conflict | Planned |
| 8.1.2 | Define static asset path | Docs/config | Server knows where admin build output lives | Planned |
| 8.2.1 | Add admin production build script | `apps/admin` package scripts | Static assets can be generated | Planned |
| 8.2.2 | Verify admin asset base path | Admin config | Built assets load when served by NestJS | Planned |
| 8.3.1 | Add NestJS static serving | Server module/config | Admin files are served from server runtime | Planned |
| 8.3.2 | Add frontend fallback route | Server routing | Admin deep links resolve without breaking API routes | Planned |
| 8.3.3 | Preserve health endpoint | Server route | `GET /health` still returns backend status | Planned |
| 8.4.1 | Add server Dockerfile | `apps/server/Dockerfile` | Image builds with server output | Planned |
| 8.4.2 | Include static admin assets in image | Dockerfile/build step | Image contains admin assets when admin is enabled | Planned |
| 8.4.3 | Configure runtime env | `.env.example` and docs | Database env vars are documented | Planned |
| 8.5.1 | Add compose server service | `docker-compose.yml` | Compose can run server plus PostgreSQL | Planned |
| 8.5.2 | Add healthcheck | `docker-compose.yml` | Compose can detect server health | Planned |
| 8.6.1 | Document build commands | Runtime docs | Reviewer can build image locally | Planned |
| 8.6.2 | Document runtime commands | Runtime docs | Reviewer can run container locally | Planned |
| 8.7.1 | Smoke test API route | Test notes/output | Container serves API endpoint | Planned |
| 8.7.2 | Smoke test admin route | Test notes/output | Container serves admin page if admin is enabled | Planned |

## URL Strategy Candidate

- API routes: REST endpoints at their normal paths, or under `/api` if selected before implementation.
- Health route: `GET /health`.
- Admin assets: `/admin` or `/`.
- Fallback: admin fallback must not intercept API or health routes.

## Exit Criteria

- Docker image builds.
- Container starts with environment-based database configuration.
- API works from the container.
- Admin static assets are served by NestJS when admin exists.
- Runtime packaging docs are accurate.
