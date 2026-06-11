# Docker Compose Notes

## Purpose

`docker-compose.yml` starts local PostgreSQL and can build/run the packaged NestJS runtime.

This mirrors the reference-project pattern of using Docker Compose as a local development harness, but keeps the scope aligned with the assignment.

## Services

| Service    | Purpose                                   | Port   |
| ---------- | ----------------------------------------- | ------ |
| `server`   | NestJS API plus built admin static assets | `3000` |
| `postgres` | Local PostgreSQL database                 | `5432` |

## Credentials

Local-only defaults:

- User: `location_booking`
- Password: `location_booking`
- Database: `location_booking`

Do not reuse these values for production.

## Commands

```bash
docker compose up -d postgres
docker compose up --build server
docker compose ps
docker compose down
```

Run commands through `rtk` when using the Codex shell.

## Runtime Notes

- `server` depends on healthy `postgres`.
- `server` uses `DB_HOST=postgres` and other local-only database defaults.
- `DB_SYNCHRONIZE=true` is enabled for this local packaged review path so the container can create schema automatically.
- `GET /health` powers the server healthcheck.
- Admin is served at `/admin`.

See [Runtime Packaging](runtime-packaging.md) for image build details.
