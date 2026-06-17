# 0003 - Booking Policy

## Status

Accepted

## Context

The assignment requires booking validation by department, capacity, open time, and bookable target location. It leaves overlap behavior, lifecycle, and cancellation scope open.

## Decision

- A booking is created in `confirmed` status.
- Confirmed bookings cannot overlap for the same location.
- Back-to-back bookings are allowed when the first `endAt` equals the second `startAt`.
- Zero-length and negative-length bookings are rejected.
- Create requests lock the target location row inside a database transaction, then run the confirmed-overlap query and insert through the same transaction. This serializes same-room booking creation without adding assignment-heavy PostgreSQL range/exclusion schema.
- `cancelled` is included as a database status for lifecycle clarity, but update/cancel routes are not included in the current assignment scope.
- Future cancelled bookings must not participate in overlap checks. The current overlap query already filters to `confirmed`.
- A location is bookable only when `isBookable` is `true`; seeded assignment rows infer that from present `department`, `capacity`, and `openTime`.
- Open-time parsing supports only the assignment formats documented in Phase 4. Booking start/end must be on the same local calendar day and inside the same open-time window.
- ISO timestamp wall-clock fields are used for open-time checks; PostgreSQL stores the values as `timestamptz`.

## Redis, Queue, And Broker Scope

Redis, RabbitMQ, and background queues are not required for this assignment's booking correctness. Booking validation is synchronous and protected by a database transaction plus a pessimistic lock on the target location row.

Production follow-ups if scope grows:

- Transactional outbox for booking-created/cancelled events.
- Notification queue for email or chat messages.
- Audit/event stream for compliance history.
- Distributed lock only if the design moves to multi-node app-level locking instead of the current database serialization.

## Consequences

- Reviewers get deterministic booking behavior and cannot double-book the same room.
- The current API remains small: create/list/detail only.
- Future cancellation can be added without changing persisted status shape.
- Queue/cache infrastructure remains optional production enhancement, not a hidden dependency for correctness.
