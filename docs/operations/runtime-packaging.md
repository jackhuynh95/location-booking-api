# Runtime Packaging

## Target Shape

The deployable artifact is one application container plus an external PostgreSQL service:

- NestJS serves the REST API.
- React admin builds to static files.
- NestJS serves the built admin static files from the same server runtime.
- PostgreSQL runs as a separate service.

This keeps the assignment easy to run and review while still supporting both backend and admin UI work.

## Build Flow

Current build flow:

```text
apps/admin source
  -> build static assets
  -> copy assets into runtime public/admin directory
  -> build NestJS server
  -> create Docker image containing server dist + static admin assets
```

Implemented by [apps/server/Dockerfile](../../apps/server/Dockerfile).

## Runtime Flow

Current runtime flow:

```text
browser
  -> NestJS container
      |-- /health
      |-- /locations
      |-- /bookings
      `-- /admin static assets
  -> PostgreSQL container or managed PostgreSQL
```

## NestJS Static Hosting Notes

- `apps/server/src/main.ts` serves static files from `public/admin` when that directory exists.
- Admin assets are mounted at `/admin`.
- Fallback routing is limited to `/admin` and `/admin/*path`.
- API routes and `GET /health` remain backend routes and are not swallowed by the frontend fallback.
- Vite builds with base path `/admin/`.

## Docker Runtime Notes

The production image should:

- Install only production dependencies needed at runtime.
- Include compiled NestJS output.
- Include built admin static assets when admin is enabled.
- Start with a single server command.
- Read database connection values from environment variables.
- Not bake secrets into the image.

The production image does this with multi-stage builds:

- `admin-deps` and `admin-build` install/build `apps/admin`.
- `server-deps` and `server-build` install/build `apps/server`.
- `runtime` installs only server production dependencies, copies `dist`, and copies admin static assets to `public/admin`.

Do not add a separate production admin container unless the runtime direction changes.

## Docker Compose Role

For local full-stack runtime, Compose runs:

- `postgres`
- `server`

The `server` container serves both API and admin static assets. A separate `admin` container is useful only for local frontend development before static packaging.

## Commands

Build and run:

```bash
docker compose up --build server
```

Seed in the running server container after database schema exists:

```bash
docker compose exec server npm run seed:locations:prod
```

Smoke checks:

```bash
curl http://localhost:3000/health
curl http://localhost:3000/locations/tree
curl http://localhost:3000/admin
```
