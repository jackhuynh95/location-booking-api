# Reviewer Local Runbook

This guide explains how to run the assignment locally and open the admin GUI.

Repository:

[https://github.com/jackhuynh95/location-booking-api](https://github.com/jackhuynh95/location-booking-api)

## Prerequisites

- Node.js 20 or newer.
- npm.
- Docker Desktop or Docker Engine with Docker Compose.
- Port `3000` available for the server.
- Port `5432` available for PostgreSQL.
- Optional for admin development mode: port `5173`.

## Option A - Recommended Docker Runtime

This option builds the server image, includes the built admin UI, starts PostgreSQL, and serves everything from one NestJS runtime.

From the repository root:

```bash
cp .env.example .env
docker compose up --build -d server
```

Check services:

```bash
docker compose ps
```

Open:

- Admin GUI: `http://localhost:3000/admin/`
- Health check: `http://localhost:3000/health`
- Location tree API: `http://localhost:3000/locations/tree`

Seed the assignment data inside the running server container:

```bash
docker compose exec server npm run seed:locations:prod
```

The seed is idempotent. Running it again updates existing assignment rows instead of duplicating them.

## Option B - Local Development Mode

Use this when you want to run the server and admin separately.

Start PostgreSQL:

```bash
cp .env.example .env
docker compose up -d postgres
```

Start the server:

```bash
cd apps/server
npm ci
npm run migration:run
npm run seed:locations
npm run start:dev
```

In another terminal, start the admin GUI:

```bash
cd apps/admin
npm ci
VITE_API_BASE_URL=http://localhost:3000 npm run dev
```

Open:

- Admin GUI: `http://localhost:5173/admin/`
- Server health: `http://localhost:3000/health`

## What To Verify

### Location Management

Use the admin GUI to verify:

- Read: seeded location tree is visible.
- Create: add a new location node under an existing parent.
- Update: select a location, unlock editing, and modify capacity or open time.
- Delete: remove a leaf location after confirmation.

### Booking Management

Use the booking form to verify:

- Valid booking succeeds.
- Wrong department is rejected.
- Attendee count above capacity is rejected.
- Booking outside the room open time is rejected.
- Overlapping booking is rejected or shown as unavailable before submit.

### Calendar / Timeline

Open the calendar or timeline view to inspect existing reservations and room availability.

## Manual Evidence

Screenshot evidence is available in:

[Manual Test Evidence](../evidence/manual-test-evidence.md)

The evidence maps the original functional requirements to screenshots.

## Useful Commands

Run backend checks:

```bash
cd apps/server
npm run lint
npm test -- --runInBand
npm run test:e2e -- --runInBand
npm run build
```

Run admin build:

```bash
cd apps/admin
npm run build
```

Stop Docker services:

```bash
docker compose down
```

Reset local Docker database:

```bash
docker compose down -v
```

Then rerun Option A or Option B.
