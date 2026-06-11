# Docker Compose Notes

## Purpose

`docker-compose.yml` currently starts local PostgreSQL only.

This mirrors the reference-project pattern of using Docker Compose as a local development harness, but keeps the scope aligned with the assignment.

## Services

| Service | Purpose | Port |
| --- | --- | --- |
| `postgres` | Local PostgreSQL database | `5432` |

## Credentials

Local-only defaults:

- User: `location_booking`
- Password: `location_booking`
- Database: `location_booking`

Do not reuse these values for production.

## Commands

```bash
docker compose up -d postgres
docker compose ps
docker compose down
```

Run commands through `rtk` when using the Codex shell.

## Future Expansion

Add app containers only after the app scaffolds exist:

- `server` from `apps/server`.
- The admin app should not need a separate production container if approved; build `apps/admin` into static assets and serve them from NestJS.
- Test profiles for repeatable validation.

See [Runtime Packaging](runtime-packaging.md) for the eventual build/runtime shape.
