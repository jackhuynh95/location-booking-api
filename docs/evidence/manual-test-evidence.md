# Manual Test Evidence

Use this page to collect screenshots from manual testing.

Recommended screenshot folder:

```text
docs/evidence/screenshots/
```

Suggested filename format:

```text
YYYY-MM-DD-XX-short-description.png
```

Example:

```text
2026-06-12-01-admin-seeded-location-tree.png
```

## Evidence Checklist

| #   | Area                   | What To Capture                              | Expected Result                                 | Screenshot                                                 | Status |
| --- | ---------------------- | -------------------------------------------- | ----------------------------------------------- | ---------------------------------------------------------- | ------ |
| 1   | Docker runtime         | `docker compose ps` or server healthy state  | `server` and `postgres` are running and healthy | `screenshots/TODO.png`                                     | TODO   |
| 2   | Health endpoint        | Browser or API client at `/health`           | HTTP 200 with healthy server response           | `screenshots/TODO.png`                                     | TODO   |
| 3   | Assignment seed        | Seed command output or `/locations` response | 13 assignment locations exist                   | `screenshots/TODO.png`                                     | TODO   |
| 4   | Location tree API      | `/locations/tree` response                   | Building/location hierarchy is visible          | `screenshots/TODO.png`                                     | TODO   |
| 5   | Admin seeded view      | `/admin/` location tree/list                 | Seeded assignment locations are visible         | `screenshots/2026-06-11-01-admin-seeded-location-tree.png` | Pass   |
| 6   | Admin no-seed guidance | Admin view against empty DB, if tested       | UI explains how to seed data                    | `screenshots/TODO.png`                                     | TODO   |
| 7   | Booking success        | Valid booking request                        | HTTP 201 or admin success state                 | `screenshots/TODO.png`                                     | TODO   |
| 8   | Booking validation     | Invalid department/capacity/time request     | HTTP 400 or clear admin validation error        | `screenshots/TODO.png`                                     | TODO   |
| 9   | Booking overlap        | Overlapping booking request                  | HTTP 409 conflict                               | `screenshots/TODO.png`                                     | TODO   |
| 10  | Admin static runtime   | `/admin/` served from Dockerized NestJS      | Admin loads from port `3000`                    | `screenshots/TODO.png`                                     | TODO   |
| 11  | Admin deep link        | Refresh a nested admin URL                   | Page still loads, API routes unaffected         | `screenshots/TODO.png`                                     | TODO   |

## Notes

- Keep screenshots small and focused.
- Prefer screenshots that show the URL, status, or command output when possible.
- Replace `TODO.png` paths with real screenshot filenames after capture.
- Leave any failed manual test in the table with `Fail` status and a short note.

## Manual Test Log

| Date       | Tester     | Environment          | Summary                                                                |
| ---------- | ---------- | -------------------- | ---------------------------------------------------------------------- |
| 2026-06-11 | Jack Huynh | Local Docker runtime | Captured admin seeded location tree at `http://localhost:3000/admin/`. |
