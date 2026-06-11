# Phase 5 - API Documentation And Seed Data

## Goal

Make the project easy to review and manually test using the original assignment sample data.

Seed data is required, not optional. The source values are the table in `docs/specs/assignment-brief.md`, and the seed fixture must preserve those values without inventing hidden business data.

## Tasks

| ID    | Task                                  | Output                        | Done When                                                                                       | Status |
| ----- | ------------------------------------- | ----------------------------- | ----------------------------------------------------------------------------------------------- | ------ |
| 5.1.1 | Convert assignment table to seed data | Seed file                     | Example locations can be loaded                                                                 | Done   |
| 5.1.2 | Add seed command                      | Package script                | Reviewer can seed local DB                                                                      | Done   |
| 5.1.3 | Make seed idempotent                  | Seed script                   | Running seed more than once does not duplicate locations                                        | Done   |
| 5.1.4 | Preserve assignment values            | Seed fixtures                 | Building, location name, number, department, capacity, and open time match the assignment table | Done   |
| 5.1.5 | Verify seeded tree response           | Test or HTTP example          | `GET /locations/tree` includes the seeded Building A and Building B examples                    | Done   |
| 5.2.1 | Document location endpoints           | API docs                      | Request/response examples exist                                                                 | Done   |
| 5.2.2 | Document booking endpoints            | API docs                      | Valid and invalid booking examples exist                                                        | Done   |
| 5.3.1 | Document errors                       | API docs                      | Common validation and 404 errors are described                                                  | Done   |
| 5.4.1 | Add HTTP examples                     | `.http` or Postman collection | Reviewer can execute sample calls                                                               | Done   |
| 5.5.1 | Document location table               | Database design doc           | Columns and constraints are explained                                                           | Done   |
| 5.5.2 | Document booking table                | Database design doc           | Columns and constraints are explained                                                           | Done   |
| 5.5.3 | Add ER diagram                        | Database design doc           | Location-booking relationship is visualized                                                     | Done   |
| 5.6.1 | Document module architecture          | System design doc             | Modules and request flow are explained                                                          | Done   |
| 5.6.2 | Document validation flow              | System design doc             | Booking rule order is explained                                                                 | Done   |

## Exit Criteria

- Reviewer can seed sample data.
- Seeded data comes from the original assignment table.
- Seed command is safe to run during initial setup.
- Seeded locations are available to the admin app through normal API endpoints.
- Seeded assignment locations are visible in any approved admin tree/list view without manual data entry.
- Reviewer can exercise endpoints from docs.
- Database and system design docs exist.
