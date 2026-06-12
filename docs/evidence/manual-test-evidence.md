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

## Functional Requirement Evidence

| #   | Requirement                  | What Was Captured                                     | Expected Result                                     | Screenshot                                                          | Status |
| --- | ---------------------------- | ----------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------- | ------ |
| 1   | 3.1 Read location tree       | Admin at `http://localhost:3000/admin/` location tree | Seeded building/location hierarchy is visible       | [screenshots/2026-06-12-03-location-read-tree.png](screenshots/2026-06-12-03-location-read-tree.png) | Pass   |
| 2   | 3.1 Create location          | Created temporary `EVID-*` location under `A-01`      | Success message and new tree node are visible       | [screenshots/2026-06-12-04-location-create-success.png](screenshots/2026-06-12-04-location-create-success.png) | Pass   |
| 3   | 3.1 Update location          | Updated temporary location capacity/open time         | Updated values and success message are visible      | [screenshots/2026-06-12-05-location-update-capacity-open-time.png](screenshots/2026-06-12-05-location-update-capacity-open-time.png) | Pass   |
| 4   | 3.1 Delete location          | Deleted temporary leaf location                       | Delete success message and tree after removal shown | [screenshots/2026-06-12-06-location-delete-success.png](screenshots/2026-06-12-06-location-delete-success.png) | Pass   |
| 5   | 3.2 Valid booking            | Submitted valid booking for `A-01-01`                 | Booking accepted success state is visible           | [screenshots/2026-06-12-07-booking-valid-success.png](screenshots/2026-06-12-07-booking-valid-success.png) | Pass   |
| 6   | 3.2 Department validation    | Submitted booking with wrong department               | Department mismatch validation error is visible     | [screenshots/2026-06-12-08-booking-department-validation.png](screenshots/2026-06-12-08-booking-department-validation.png) | Pass   |
| 7   | 3.2 Capacity validation      | Submitted booking over `A-01-03` capacity             | Capacity validation error is visible                | [screenshots/2026-06-12-09-booking-capacity-validation.png](screenshots/2026-06-12-09-booking-capacity-validation.png) | Pass   |
| 8   | 3.2 Open-time validation     | Submitted Sunday booking for weekday-only room        | Open-time validation error is visible               | [screenshots/2026-06-12-10-booking-open-time-validation.png](screenshots/2026-06-12-10-booking-open-time-validation.png) | Pass   |
| 9   | Optional calendar/timeline   | Calendar filtered to `A-01-01` booking date           | Reservation block and availability window shown     | [screenshots/2026-06-12-11-calendar-timeline-availability.png](screenshots/2026-06-12-11-calendar-timeline-availability.png) | Pass   |

## Notes

- Keep screenshots small and focused.
- Prefer screenshots that show the URL, status, or command output when possible.
- Replace `TODO.png` paths with real screenshot filenames after capture.
- Leave any failed manual test in the table with `Fail` status and a short note.

## Manual Test Log

| Date       | Tester     | Environment          | Summary                                                                |
| ---------- | ---------- | -------------------- | ---------------------------------------------------------------------- |
| 2026-06-11 | Jack Huynh | Local Docker runtime | Captured admin seeded location tree at `http://localhost:3000/admin/`. |
| 2026-06-12 | Codex      | Local Docker runtime | Captured final functional evidence for location CRUD and booking rules. |
