# Phase 4 - Booking Domain

## Goal

Implement booking persistence and validation rules.

## Tasks

| ID | Task | Output | Done When | Status |
| --- | --- | --- | --- | --- |
| 4.1.1 | Define booking schema | Database design doc | Fields, indexes, and relation to location are documented | Planned |
| 4.1.2 | Decide overlap policy | Decision doc | Same-room overlapping booking behavior is explicit | Planned |
| 4.1.3 | Decide booking lifecycle | Decision doc | Status values and delete/cancel behavior are explicit | Planned |
| 4.2.1 | Add booking entity | TypeORM entity | Booking maps to location relation | Planned |
| 4.2.2 | Add booking migration | Migration file | Schema can be applied to PostgreSQL | Planned |
| 4.3.1 | Define bookable-location rule | Service/helper | Non-bookable locations are rejected | Planned |
| 4.4.1 | Implement department check | Booking validator | Department mismatch returns clear error | Planned |
| 4.5.1 | Implement capacity check | Booking validator | Attendee count above capacity returns clear error | Planned |
| 4.6.1 | Parse open-time values | Schedule helper | Assignment examples can be interpreted | Planned |
| 4.6.2 | Implement open-time check | Booking validator | Weekend/out-of-hours requests are rejected | Planned |
| 4.7.1 | Add create booking DTO | DTO file | Payload validates location, department, attendee count, start/end | Planned |
| 4.7.2 | Add create booking service | Booking service | All validation runs before save | Planned |
| 4.7.3 | Add create booking route | `POST /bookings` | Valid booking persists | Planned |
| 4.8.1 | Add booking detail route | `GET /bookings/:id` | Booking can be fetched | Planned |
| 4.8.2 | Add booking list route | `GET /bookings` | Bookings can be listed | Planned |
| 4.9.1 | Add update/cancel policy | Decision doc | Scope is agreed | Planned |
| 4.9.2 | Add update/delete route if approved | API route | Behavior follows policy | Planned |
| 4.10.1 | Test department mismatch | Unit/integration tests | Mismatch case fails | Planned |
| 4.10.2 | Test capacity overflow | Unit/integration tests | Overflow case fails | Planned |
| 4.10.3 | Test outside open time | Unit/integration tests | Closed-time case fails | Planned |
| 4.10.4 | Test valid booking | Unit/integration tests | Valid case succeeds | Planned |

## Open-Time Examples To Support

- `Always open`
- `Mon to Fri (9AM to 6PM)`
- `Mon to Sat (9AM to 6PM)`
- `Mon to Sun (9AM to 6PM)`

## Exit Criteria

- Booking creation is implemented.
- Invalid bookings fail for the right reason.
- Valid bookings persist.
- Core validation rules are tested.
