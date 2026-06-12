# location-booking-api

RESTful location and room-booking system for the SJ Assignment 2026 brief.

The project manages hierarchical building locations, loads the original assignment sample data, validates room bookings by department/capacity/open time, and includes a reviewer admin UI served by the NestJS runtime.

## Status

Submission-ready implementation is in place:

- NestJS API in `apps/server`.
- Vite React admin in `apps/admin`.
- PostgreSQL persistence through TypeORM.
- Idempotent assignment seed data.
- Docker runtime serving both API and built admin assets from one NestJS container.
- Documentation for API, database design, architecture, roadmap, and operations.

## Features

- Location CRUD.
- Hierarchical location tree retrieval.
- Assignment sample data seeding.
- Booking creation with validation rules:
  - department must match the room department;
  - attendee count must not exceed room capacity;
  - booking time must fit the room open-time window;
  - overlapping bookings are rejected;
  - non-bookable locations are rejected.
- Reviewer admin UI:
  - shows seeded assignment locations;
  - includes no-seed guidance;
  - supports location create/update flows;
  - includes booking validation demo form.

## Stack

- Node.js
- NestJS
- TypeScript
- TypeORM
- PostgreSQL
- React
- Vite
- Docker Compose

## Repository Shape

```text
location-booking-api/
|-- apps/
|   |-- server/             # NestJS REST API and static admin host
|   `-- admin/              # Vite React reviewer admin
|-- docs/                   # Specs, API docs, architecture, operations, roadmap
|-- docker-compose.yml      # PostgreSQL + server runtime
|-- .env.example            # Safe local environment template
`-- AGENTS.md               # Agent instructions and guardrails
```

## Quick Start

From the repository root:

```bash
cp .env.example .env
docker compose up -d postgres
cd apps/server
npm ci
npm run migration:run
npm run seed:locations
npm run start:dev
```

Useful URLs:

- API health: `http://localhost:3000/health`
- Locations tree: `http://localhost:3000/locations/tree`
- Admin GUI: `http://localhost:3000/admin/` when using Docker runtime, or `http://localhost:5173/admin/` in admin dev mode

The seed command loads 13 assignment locations and is safe to rerun.

For a reviewer-friendly step-by-step guide, see [Reviewer Local Runbook](docs/submission/reviewer-local-runbook.md).

## Admin Development

Start the API first, then run:

```bash
cd apps/admin
npm ci
VITE_API_BASE_URL=http://localhost:3000 npm run dev
```

Open `http://localhost:5173/admin/`.

The admin reads location data from the backend API. After seeding, the assignment locations are visible in the tree/list view.

## Docker Runtime

The production-style runtime serves both REST API routes and built admin assets from the NestJS server container.

```bash
cp .env.example .env
docker compose up --build -d server
docker compose exec server npm run seed:locations:prod
```

Then open:

- API health: `http://localhost:3000/health`
- Admin: `http://localhost:3000/admin/`

PostgreSQL remains an external Compose service. Runtime database values come from environment variables in `docker-compose.yml` or `.env`.

## Verification

Latest readiness pass:

- Server `npm ci`: pass, 0 vulnerabilities.
- Admin `npm ci`: pass, 0 vulnerabilities.
- Unit tests: 4 suites, 17 tests pass.
- E2E tests: 2 suites, 6 tests pass.
- ESLint: pass.
- TypeScript format check: pass.
- Markdown/docs format check: pass.
- Server production build: pass.
- Admin production build: pass.
- Docker runtime: `docker compose up --build -d server` pass, server healthy.
- Runtime smoke: `/health`, `/admin/`, admin JS/CSS, and admin deep-link fallback all return 200.
- Clean DB rehearsal: migrations pass, seed inserts 13 assignment locations.
- Runtime seed: idempotent, 0 inserted, 13 updated, 13 total.
- API docs checked against live responses: location tree/list, booking success 201, validation 400, overlap 409.
- Admin docs match runtime: Vite app is served at `/admin/`, assets copied into the NestJS image.

Manual screenshot evidence can be collected in [Manual Test Evidence](docs/evidence/manual-test-evidence.md).

Run locally:

```bash
cd apps/server
npm run lint
npm test -- --runInBand
npm run test:e2e -- --runInBand
npm run build

cd ../admin
npm run build
```

## Documentation

- [Assignment Brief](docs/specs/assignment-brief.md)
- [Functional Specification](docs/specs/functional-spec.md)
- [Locations API](docs/api/locations.md)
- [Bookings API](docs/api/bookings.md)
- [Location Database Design](docs/database/location-design.md)
- [Booking Database Design](docs/database/booking-design.md)
- [Architecture Notes](docs/architecture/architecture-notes.md)
- [Runtime Packaging](docs/operations/runtime-packaging.md)
- [Docker Compose Notes](docs/operations/docker-compose.md)
- [Manual Test Evidence](docs/evidence/manual-test-evidence.md)
- [Reviewer Local Runbook](docs/submission/reviewer-local-runbook.md)
- [Implementation Roadmap](docs/roadmap/IMPLEMENTATION_ROADMAP.md)
- [Epic Vision](docs/roadmap/EPIC.md)

## Submission Notes

This repository is ready for GitHub submission as a complete assignment deliverable with source code, documentation, seed data, validation tests, admin reviewer experience, Docker runtime packaging, and screenshot evidence.

Repository: [jackhuynh95/location-booking-api](https://github.com/jackhuynh95/location-booking-api)
