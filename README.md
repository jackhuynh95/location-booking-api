# location-booking-api

RESTful API backend for managing hierarchical building locations and room bookings, built with NestJS, TypeScript, TypeORM, and PostgreSQL.

## Project Status

This repository has the NestJS server foundation, location domain, booking persistence, booking validation rules, reviewer admin UI, and Docker runtime packaging in place.

## Assignment Scope

The system manages:

- A hierarchical location tree such as `Building > Floor > Room`.
- CRUD operations for locations.
- Room booking requests.
- Booking validation by department, capacity, and open time.

## Required Stack

- Node.js
- NestJS
- TypeScript
- TypeORM
- PostgreSQL

## Working Docs

- [Assignment Brief](docs/specs/assignment-brief.md)
- [Functional Specification](docs/specs/functional-spec.md)
- [Architecture Notes](docs/architecture/architecture-notes.md)
- [Development Guardrails](docs/guardrails/development-guardrails.md)
- [Project Structure](docs/development/project-structure.md)
- [Local Development Harness](docs/development/local-development-harness.md)
- [Docker Compose Notes](docs/operations/docker-compose.md)
- [Runtime Packaging](docs/operations/runtime-packaging.md)
- [Implementation Roadmap](docs/roadmap/IMPLEMENTATION_ROADMAP.md)
- [Epic Vision](docs/roadmap/EPIC.md)
- [Locations API](docs/api/locations.md)
- [Bookings API](docs/api/bookings.md)
- [Location Database Design](docs/database/location-design.md)
- [Booking Database Design](docs/database/booking-design.md)

## Repository Shape

```text
location-booking-api/
|-- apps/
|   |-- server/             # NestJS REST API
|   `-- admin/              # Vite React reviewer admin
|-- docs/                   # Specs, architecture, operations, guardrails
|-- docker-compose.yml      # Local infrastructure harness
`-- AGENTS.md               # Agent instructions and project guardrails
```

## Local Setup

From repository root:

```bash
docker compose up -d postgres
```

From `apps/server`:

```bash
npm install
npm run migration:run
npm run seed:locations
npm run start:dev
```

The seed command loads the original assignment sample locations and is safe to rerun. Seeded rows appear through `GET /locations` and `GET /locations/tree`.

Booking examples are documented in [Bookings API](docs/api/bookings.md). Use `GET /locations` after seeding to copy a room `id`, then create bookings against that `locationId`.

## Admin UI

From `apps/admin`:

```bash
npm install
VITE_API_BASE_URL=http://localhost:3000 npm run dev
```

Open `http://localhost:5173/admin/`. The admin reads `GET /locations/tree`, shows seeded assignment rows, includes no-seed guidance, supports location create/update, and includes a booking validation form.

Production admin assets are built with:

```bash
npm run build
```

## Verification

From `apps/server`:

```bash
npm run lint
npm test -- --runInBand
npm run test:e2e -- --runInBand
npm run build
```

From `apps/admin`:

```bash
npm run build
```

## Docker Runtime

The final runtime image serves both REST API routes and the built admin UI at `/admin`.

```bash
docker compose up --build server
```

Then open:

- API health: `http://localhost:3000/health`
- Admin: `http://localhost:3000/admin`

PostgreSQL remains a separate Compose service. The server image reads `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`, `DB_SSL`, `DB_SYNCHRONIZE`, and `DB_LOGGING` from environment variables.

## Delivery Intent

The final deliverable is source code uploaded to a personal GitHub account with clean documentation, exception handling, logging, system design notes, and database design notes.
