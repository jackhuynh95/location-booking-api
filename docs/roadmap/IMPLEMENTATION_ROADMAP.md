# Implementation Roadmap

Source project: `location-booking-api`. Build clean from assignment specs using the app harness in `apps/server`, optional `apps/admin`, and documentation-first guardrails.

Status values:

- `Planned`: not started.
- `Ready`: can start after user approval.
- `In Progress`: actively being worked.
- `Done`: implemented and verified.
- `Blocked`: waiting on a decision.

## Epic Traceability

The roadmap decomposes [EPIC.md](EPIC.md) into phases and task files. Each phase table below lists the larger work packages; the linked phase files break those packages into the smallest tracked tasks.

| Epic outcome                                          | Roadmap coverage | Proof target                                                                                |
| ----------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------- |
| Assignment scope is captured before implementation    | Phase 0          | Specs, architecture notes, guardrails, and roadmap exist before app code                    |
| Local repo and database harness exist                 | Phase 1          | App roots and PostgreSQL compose harness are documented and ready                           |
| NestJS REST API foundation exists                     | Phase 2          | Server boots with health, config, database, validation, errors, and logging                 |
| Hierarchical locations are managed                    | Phase 3          | Location CRUD and tree endpoint support the assignment hierarchy                            |
| Bookings enforce assignment rules                     | Phase 4          | Booking endpoints reject department, capacity, open-time, and non-bookable violations       |
| Reviewer can seed and exercise assignment data        | Phase 5          | Original assignment rows load through an idempotent seed command and appear in API examples |
| Deliverable is verified for submission                | Phase 6          | Tests, lint/format, setup docs, and repository readiness checks pass                        |
| Optional admin shows seeded assignment data           | Phase 7          | Admin tree/list loads the seeded assignment locations through normal API endpoints          |
| Final runtime is one NestJS container plus PostgreSQL | Phase 8          | NestJS serves API and built React admin static assets from one Docker image                 |

## Phase 0 - Specification Foundation

Everything else depends on these. Do first.

| #   | Issue | Title                          | Depends on    | Status |
| --- | ----- | ------------------------------ | ------------- | ------ |
| 0.1 | local | Assignment brief captured      | none          | Done   |
| 0.2 | local | Functional spec drafted        | 0.1           | Done   |
| 0.3 | local | Architecture notes drafted     | 0.1           | Done   |
| 0.4 | local | Development guardrails drafted | 0.1           | Done   |
| 0.5 | local | Roadmap development pack       | 0.1, 0.2, 0.3 | Done   |

Milestone: The repo explains what was planned before implementation started.

Detailed tasks: [Phase 0](phases/phase-00-specification-foundation.md)

## Phase 1 - Repository And Local Infrastructure

Prepare the app roots and local runtime foundation.

| #   | Issue | Title                         | Depends on | Status |
| --- | ----- | ----------------------------- | ---------- | ------ |
| 1.1 | local | Monorepo app roots            | 0.5        | Done   |
| 1.2 | local | PostgreSQL compose harness    | 1.1        | Done   |
| 1.3 | local | Server scaffold plan          | 1.1        | Done   |
| 1.4 | local | Environment variable contract | 1.2        | Done   |
| 1.5 | local | Package manager decision      | 1.3        | Done   |

Milestone: A developer can understand where app code belongs, start local database infrastructure, and generate `apps/server` in Phase 2 without guessing.

Detailed tasks: [Phase 1](phases/phase-01-repository-and-local-infrastructure.md)

## Phase 2 - NestJS Server Baseline

Create the backend skeleton without domain complexity.

| #   | Issue | Title                                | Depends on | Status |
| --- | ----- | ------------------------------------ | ---------- | ------ |
| 2.1 | local | NestJS app scaffold in `apps/server` | 1.3, 1.5   | Done   |
| 2.2 | local | Health endpoint                      | 2.1        | Done   |
| 2.3 | local | Config module and validation         | 2.1, 1.4   | Done   |
| 2.4 | local | TypeORM PostgreSQL connection        | 2.3, 1.2   | Done   |
| 2.5 | local | Global validation pipe               | 2.1        | Done   |
| 2.6 | local | Global exception response shape      | 2.1        | Done   |
| 2.7 | local | Structured logging baseline          | 2.1        | Done   |

Milestone: The API boots, connects to PostgreSQL, reports health, validates DTOs, logs requests, and returns consistent errors.

Detailed tasks: [Phase 2](phases/phase-02-nestjs-server-baseline.md)

## Phase 3 - Location Domain

Implement the location tree as the core domain model.

| #   | Issue | Title                               | Depends on    | Status |
| --- | ----- | ----------------------------------- | ------------- | ------ |
| 3.1 | local | Location database design            | 2.4           | Done   |
| 3.2 | local | Location entity and migration       | 3.1           | Done   |
| 3.3 | local | Create location endpoint            | 3.2           | Done   |
| 3.4 | local | Read location detail endpoint       | 3.2           | Done   |
| 3.5 | local | List locations endpoint             | 3.2           | Done   |
| 3.6 | local | Location tree endpoint              | 3.2           | Done   |
| 3.7 | local | Update location endpoint            | 3.2           | Done   |
| 3.8 | local | Delete location policy and endpoint | 3.1, 3.2      | Done   |
| 3.9 | local | Location rule tests                 | 3.3, 3.6, 3.8 | Done   |

Milestone: The API can manage hierarchical locations and return a tree.

Detailed tasks: [Phase 3](phases/phase-03-location-domain.md)

## Phase 4 - Booking Domain

Implement booking creation and assignment validation rules.

| #    | Issue | Title                        | Depends on         | Status |
| ---- | ----- | ---------------------------- | ------------------ | ------ |
| 4.1  | local | Booking database design      | 3.2                | Done   |
| 4.2  | local | Booking entity and migration | 4.1                | Done   |
| 4.3  | local | Bookable-location policy     | 3.1, 4.1           | Done   |
| 4.4  | local | Department validation        | 4.2, 4.3           | Done   |
| 4.5  | local | Capacity validation          | 4.2, 4.3           | Done   |
| 4.6  | local | Open-time validation         | 4.2, 4.3           | Done   |
| 4.7  | local | Create booking endpoint      | 4.4, 4.5, 4.6      | Done   |
| 4.8  | local | Booking read/list endpoints  | 4.2                | Done   |
| 4.9  | local | Booking update/delete policy | 4.2                | Done   |
| 4.10 | local | Booking validation tests     | 4.4, 4.5, 4.6, 4.7 | Done   |

Milestone: The API accepts valid bookings and rejects invalid ones with clear errors.

Detailed tasks: [Phase 4](phases/phase-04-booking-domain.md)

## Phase 5 - API Documentation And Seed Data

Make the API easy to review.

| #   | Issue | Title                         | Depends on    | Status |
| --- | ----- | ----------------------------- | ------------- | ------ |
| 5.1 | local | Sample location seed data     | 3.2           | Done   |
| 5.2 | local | API endpoint documentation    | 3.3, 4.7      | Done   |
| 5.3 | local | Error response documentation  | 2.6, 4.7      | Done   |
| 5.4 | local | Postman or HTTP examples      | 5.2           | Done   |
| 5.5 | local | Database design documentation | 3.1, 4.1      | Done   |
| 5.6 | local | System design documentation   | 2.1, 3.1, 4.1 | Done   |

Milestone: A reviewer can seed the assignment data, run the API, and manually exercise the project without reading source code first.

Detailed tasks: [Phase 5](phases/phase-05-api-documentation-and-seed-data.md)

## Phase 6 - Verification And Delivery Polish

Validate the assignment deliverable end to end.

| #   | Issue | Title                       | Depends on    | Status |
| --- | ----- | --------------------------- | ------------- | ------ |
| 6.1 | local | Unit test pass              | 3.9, 4.10     | Done   |
| 6.2 | local | Integration test pass       | 3.3, 4.7      | Done   |
| 6.3 | local | Lint and format pass        | 2.1           | Done   |
| 6.4 | local | Fresh clone setup check     | 5.2, 5.5      | Done   |
| 6.5 | local | README final review         | 5.2, 6.1      | Done   |
| 6.6 | local | GitHub repository readiness | 6.1, 6.2, 6.5 | Done   |

Milestone: The repository is ready to submit.

Detailed tasks: [Phase 6](phases/phase-06-verification-and-delivery-polish.md)

## Phase 7 - Admin App

Reviewer admin scope was approved and implemented.

| #   | Issue | Title                                 | Depends on    | Status |
| --- | ----- | ------------------------------------- | ------------- | ------ |
| 7.1 | local | Admin app scope decision              | 6.6           | Done   |
| 7.2 | local | Admin framework choice                | 7.1           | Done   |
| 7.3 | local | Location tree UI                      | 7.2, 3.6      | Done   |
| 7.4 | local | Booking validation demo UI            | 7.2, 4.7      | Done   |
| 7.5 | local | Assignment seed data visible in admin | 5.1, 7.3      | Done   |
| 7.6 | local | Admin app docs                        | 7.3, 7.4, 7.5 | Done   |

Milestone: Optional visual reviewer experience exists, and it opens against the original assignment seed data.

Detailed tasks: [Phase 7](phases/phase-07-optional-admin-app.md)

## Phase 8 - Static Admin Hosting And Docker Runtime

Wrap the approved backend/admin deliverable into the final runtime shape.

| #   | Issue | Title                         | Depends on | Status |
| --- | ----- | ----------------------------- | ---------- | ------ |
| 8.1 | local | Static hosting strategy       | 2.1, 7.2   | Done   |
| 8.2 | local | Admin production build output | 7.3, 7.4   | Done   |
| 8.3 | local | NestJS static asset serving   | 8.1, 8.2   | Done   |
| 8.4 | local | Server Dockerfile             | 2.1, 8.3   | Done   |
| 8.5 | local | Compose server runtime        | 1.2, 8.4   | Done   |
| 8.6 | local | Runtime documentation         | 8.3, 8.5   | Done   |
| 8.7 | local | Container smoke test          | 8.5        | Done   |

Milestone: One Dockerized NestJS runtime serves the API and the built admin UI.

Detailed tasks: [Phase 8](phases/phase-08-static-admin-hosting-and-docker-runtime.md)
