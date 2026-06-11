# location-booking-api

RESTful API backend for managing hierarchical building locations and room bookings, built with NestJS, TypeScript, TypeORM, and PostgreSQL.

## Project Status

This repository has the NestJS server foundation and location domain in place. Booking validation and optional admin UI remain planned follow-up phases.

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

## Repository Shape

```text
location-booking-api/
|-- apps/
|   |-- server/             # NestJS REST API
|   `-- admin/              # Future admin client, if approved
|-- docs/                   # Specs, architecture, operations, guardrails
|-- docker-compose.yml      # Local infrastructure harness
`-- AGENTS.md               # Agent instructions and project guardrails
```

## Local Server Setup

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

## Delivery Intent

The final deliverable is source code uploaded to a personal GitHub account with clean documentation, exception handling, logging, system design notes, and database design notes.
