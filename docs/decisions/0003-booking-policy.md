# 0003 - Booking Policy

## Status

Accepted

## Context

The assignment requires booking validation by department, capacity, open time, and bookable target location. It leaves overlap behavior, lifecycle, and cancellation scope open.

## Decision

- A booking is created in `confirmed` status.
- Confirmed bookings cannot overlap for the same location.
- Create requests lock the target location row inside a database transaction, then run the confirmed-overlap query and insert through the same transaction. This serializes same-room booking creation without adding assignment-heavy PostgreSQL range/exclusion schema.
- `cancelled` is included as a database status for lifecycle clarity, but update/cancel routes are not included in the current assignment scope.
- A location is bookable only when `isBookable` is `true`; seeded assignment rows infer that from present `department`, `capacity`, and `openTime`.
- Open-time parsing supports only the assignment formats documented in Phase 4. Booking start/end must be on the same local calendar day and inside the same open-time window.

## Consequences

- Reviewers get deterministic booking behavior and cannot double-book the same room.
- The current API remains small: create/list/detail only.
- Future cancellation can be added without changing persisted status shape.
