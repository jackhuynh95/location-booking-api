# 0004 - Admin And Runtime Packaging

## Status

Accepted

## Context

The optional admin reviewer scope is approved for this goal. The admin must read seeded assignment data from the backend, expose a useful no-seed state, and package into the final NestJS runtime.

Required skill preflight:

- `react-best-practices`: advertised in the active environment, but no readable `SKILL.md` file was found under the advertised or discovered skill paths. Work continued with `AGENTS.md` and frontend guardrails.
- `nestjs-expert`: available and read before NestJS static hosting and Docker runtime work.

## Decision

- Build `apps/admin` with Vite, React, TypeScript, plain CSS, and `lucide-react`.
- Keep `apps/admin` as an independent app root with its own `package.json` and lockfile.
- Use `VITE_API_BASE_URL` only for local dev; production uses same-origin API calls.
- Build admin with Vite base path `/admin/`.
- Serve admin assets from NestJS only at `/admin`.
- Keep REST routes at `/locations` and `/bookings`; keep health at `/health`.
- Package one production `server` image that contains compiled NestJS output and built admin static assets.
- Keep PostgreSQL external to the server image.

## Consequences

- Reviewers can run the backend and admin from one container.
- API routes are not moved under `/api`, preserving existing docs and tests.
- Frontend fallback cannot swallow `/health`, `/locations`, or `/bookings` because fallback routing is scoped to `/admin`.
- Local frontend development still uses Vite dev server on port `5173`.
