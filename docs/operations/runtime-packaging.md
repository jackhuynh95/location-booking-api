# Runtime Packaging

## Target Shape

The eventual deployable artifact should be one application container plus an external PostgreSQL service:

- NestJS serves the REST API.
- React admin builds to static files.
- NestJS serves the built admin static files from the same server runtime.
- PostgreSQL runs as a separate service.

This keeps the assignment easy to run and review while still supporting both backend and admin UI work.

## Build Flow

Expected final build flow:

```text
apps/admin source
  -> build static assets
  -> copy assets into apps/server public/static directory
  -> build NestJS server
  -> create Docker image containing server dist + static admin assets
```

## Runtime Flow

Expected final runtime flow:

```text
browser
  -> NestJS container
      |-- /api or REST routes
      `-- admin static assets
  -> PostgreSQL container or managed PostgreSQL
```

## NestJS Static Hosting Notes

When implementation reaches this phase:

- Use the NestJS static serving module or equivalent Express static setup.
- Keep API routes separate from frontend fallback routes.
- Preserve `GET /health` as a plain backend health endpoint.
- Serve admin assets only after the admin app is approved and built.
- Make the static output path explicit in documentation and Dockerfile steps.

## Docker Runtime Notes

The production image should:

- Install only production dependencies needed at runtime.
- Include compiled NestJS output.
- Include built admin static assets when admin is enabled.
- Start with a single server command.
- Read database connection values from environment variables.
- Not bake secrets into the image.

Do not add a separate production admin container unless the user explicitly changes the runtime direction.

## Docker Compose Role

For local full-stack runtime, Compose can eventually run:

- `postgres`
- `server`

The `server` container should serve both API and admin static assets. A separate `admin` container is useful only for local frontend development before static packaging.
