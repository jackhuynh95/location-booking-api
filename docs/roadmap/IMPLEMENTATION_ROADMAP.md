# Implementation Roadmap

Source project: `location-booking-api`. Build clean from assignment specs using the app harness in `apps/server`, optional `apps/admin`, and documentation-first guardrails.

Status values:

- `Planned`: not started.
- `Ready`: can start after user approval.
- `In Progress`: actively being worked.
- `Done`: implemented and verified.
- `Blocked`: waiting on a decision.

## Phase 0 - Specification Foundation

Everything else depends on these. Do first.

| # | Issue | Title | Depends on | Status |
| --- | --- | --- | --- | --- |
| 0.1 | local | Assignment brief captured | none | Done |
| 0.2 | local | Functional spec drafted | 0.1 | Done |
| 0.3 | local | Architecture notes drafted | 0.1 | Done |
| 0.4 | local | Development guardrails drafted | 0.1 | Done |
| 0.5 | local | Roadmap development pack | 0.1, 0.2, 0.3 | Done |

Milestone: The repo explains what will be built before code generation starts.

Detailed tasks: [Phase 0](phases/phase-00-specification-foundation.md)

## Phase 1 - Repository And Local Infrastructure

Prepare the app roots and local runtime foundation.

| # | Issue | Title | Depends on | Status |
| --- | --- | --- | --- | --- |
| 1.1 | local | Monorepo app roots | 0.5 | Done |
| 1.2 | local | PostgreSQL compose harness | 1.1 | Done |
| 1.3 | local | Server scaffold plan | 1.1 | Planned |
| 1.4 | local | Environment variable contract | 1.2 | Planned |
| 1.5 | local | Package manager decision | 1.3 | Planned |

Milestone: A developer can understand where app code belongs and can start local database infrastructure.

Detailed tasks: [Phase 1](phases/phase-01-repository-and-local-infrastructure.md)

## Phase 2 - NestJS Server Baseline

Create the backend skeleton without domain complexity.

| # | Issue | Title | Depends on | Status |
| --- | --- | --- | --- | --- |
| 2.1 | local | NestJS app scaffold in `apps/server` | 1.3, 1.5 | Planned |
| 2.2 | local | Health endpoint | 2.1 | Planned |
| 2.3 | local | Config module and validation | 2.1, 1.4 | Planned |
| 2.4 | local | TypeORM PostgreSQL connection | 2.3, 1.2 | Planned |
| 2.5 | local | Global validation pipe | 2.1 | Planned |
| 2.6 | local | Global exception response shape | 2.1 | Planned |
| 2.7 | local | Structured logging baseline | 2.1 | Planned |

Milestone: The API boots, connects to PostgreSQL, reports health, validates DTOs, logs requests, and returns consistent errors.

Detailed tasks: [Phase 2](phases/phase-02-nestjs-server-baseline.md)

## Phase 3 - Location Domain

Implement the location tree as the core domain model.

| # | Issue | Title | Depends on | Status |
| --- | --- | --- | --- | --- |
| 3.1 | local | Location database design | 2.4 | Planned |
| 3.2 | local | Location entity and migration | 3.1 | Planned |
| 3.3 | local | Create location endpoint | 3.2 | Planned |
| 3.4 | local | Read location detail endpoint | 3.2 | Planned |
| 3.5 | local | List locations endpoint | 3.2 | Planned |
| 3.6 | local | Location tree endpoint | 3.2 | Planned |
| 3.7 | local | Update location endpoint | 3.2 | Planned |
| 3.8 | local | Delete location policy and endpoint | 3.1, 3.2 | Planned |
| 3.9 | local | Location rule tests | 3.3, 3.6, 3.8 | Planned |

Milestone: The API can manage hierarchical locations and return a tree.

Detailed tasks: [Phase 3](phases/phase-03-location-domain.md)

## Phase 4 - Booking Domain

Implement booking creation and assignment validation rules.

| # | Issue | Title | Depends on | Status |
| --- | --- | --- | --- | --- |
| 4.1 | local | Booking database design | 3.2 | Planned |
| 4.2 | local | Booking entity and migration | 4.1 | Planned |
| 4.3 | local | Bookable-location policy | 3.1, 4.1 | Planned |
| 4.4 | local | Department validation | 4.2, 4.3 | Planned |
| 4.5 | local | Capacity validation | 4.2, 4.3 | Planned |
| 4.6 | local | Open-time validation | 4.2, 4.3 | Planned |
| 4.7 | local | Create booking endpoint | 4.4, 4.5, 4.6 | Planned |
| 4.8 | local | Booking read/list endpoints | 4.2 | Planned |
| 4.9 | local | Booking update/delete policy | 4.2 | Planned |
| 4.10 | local | Booking validation tests | 4.4, 4.5, 4.6, 4.7 | Planned |

Milestone: The API accepts valid bookings and rejects invalid ones with clear errors.

Detailed tasks: [Phase 4](phases/phase-04-booking-domain.md)

## Phase 5 - API Documentation And Seed Data

Make the API easy to review.

| # | Issue | Title | Depends on | Status |
| --- | --- | --- | --- | --- |
| 5.1 | local | Sample location seed data | 3.2 | Planned |
| 5.2 | local | API endpoint documentation | 3.3, 4.7 | Planned |
| 5.3 | local | Error response documentation | 2.6, 4.7 | Planned |
| 5.4 | local | Postman or HTTP examples | 5.2 | Planned |
| 5.5 | local | Database design documentation | 3.1, 4.1 | Planned |
| 5.6 | local | System design documentation | 2.1, 3.1, 4.1 | Planned |

Milestone: A reviewer can run and manually exercise the project without reading source code first.

Detailed tasks: [Phase 5](phases/phase-05-api-documentation-and-seed-data.md)

## Phase 6 - Verification And Delivery Polish

Validate the assignment deliverable end to end.

| # | Issue | Title | Depends on | Status |
| --- | --- | --- | --- | --- |
| 6.1 | local | Unit test pass | 3.9, 4.10 | Planned |
| 6.2 | local | Integration test pass | 3.3, 4.7 | Planned |
| 6.3 | local | Lint and format pass | 2.1 | Planned |
| 6.4 | local | Fresh clone setup check | 5.2, 5.5 | Planned |
| 6.5 | local | README final review | 5.2, 6.1 | Planned |
| 6.6 | local | GitHub repository readiness | 6.1, 6.2, 6.5 | Planned |

Milestone: The repository is ready to submit.

Detailed tasks: [Phase 6](phases/phase-06-verification-and-delivery-polish.md)

## Phase 7 - Optional Admin App

Only do this if the user explicitly approves frontend scope.

| # | Issue | Title | Depends on | Status |
| --- | --- | --- | --- | --- |
| 7.1 | local | Admin app scope decision | 6.6 | Blocked |
| 7.2 | local | Admin framework choice | 7.1 | Planned |
| 7.3 | local | Location tree UI | 7.2, 3.6 | Planned |
| 7.4 | local | Booking validation demo UI | 7.2, 4.7 | Planned |
| 7.5 | local | Admin app docs | 7.3, 7.4 | Planned |

Milestone: Optional visual reviewer experience exists, without expanding the backend assignment unnecessarily.

Detailed tasks: [Phase 7](phases/phase-07-optional-admin-app.md)
