# Phase 3 - Location Domain

## Goal

Implement hierarchical location management.

## Tasks

| ID | Task | Output | Done When | Status |
| --- | --- | --- | --- | --- |
| 3.1.1 | Define location schema | Database design doc | Fields, indexes, and constraints are documented | Planned |
| 3.1.2 | Decide tree strategy | Decision doc | Adjacency list or TypeORM tree entity is selected | Planned |
| 3.1.3 | Decide delete policy | Decision doc | Child-delete behavior is explicit | Planned |
| 3.2.1 | Add location entity | TypeORM entity | Entity maps all required fields | Planned |
| 3.2.2 | Add location migration | Migration file | Schema can be applied to PostgreSQL | Planned |
| 3.3.1 | Add create DTO | DTO file | Required fields and optional fields validate | Planned |
| 3.3.2 | Add create service method | Location service | Parent existence and cycle rules are checked | Planned |
| 3.3.3 | Add create controller route | `POST /locations` | Valid location can be created | Planned |
| 3.4.1 | Add detail query | Location service | Location can be loaded by ID | Planned |
| 3.4.2 | Add detail route | `GET /locations/:id` | Missing ID returns 404 | Planned |
| 3.5.1 | Add list query | Location service | Locations can be listed | Planned |
| 3.5.2 | Add list route | `GET /locations` | List response is stable | Planned |
| 3.6.1 | Add tree builder | Location service/helper | Flat rows convert into nested tree | Planned |
| 3.6.2 | Add tree route | `GET /locations/tree` | Tree response matches hierarchy | Planned |
| 3.7.1 | Add update DTO | DTO file | Partial updates validate | Planned |
| 3.7.2 | Add update route | `PATCH /locations/:id` | Fields can be modified safely | Planned |
| 3.8.1 | Add delete behavior | Location service | Delete follows documented policy | Planned |
| 3.8.2 | Add delete route | `DELETE /locations/:id` | Deletion returns expected status | Planned |
| 3.9.1 | Test parent rules | Unit tests | Missing parent and valid parent cases are covered | Planned |
| 3.9.2 | Test tree response | Unit/integration tests | Nested output is covered | Planned |
| 3.9.3 | Test delete policy | Unit/integration tests | Child location behavior is covered | Planned |

## Candidate Location Fields

- `id`: UUID primary key.
- `building`: string.
- `name`: string.
- `number`: unique location number such as `A-01-01`.
- `department`: nullable string.
- `capacity`: nullable positive integer.
- `openTime`: nullable string or structured schedule field.
- `isBookable`: boolean.
- `parentId`: nullable UUID.
- `createdAt`: timestamp.
- `updatedAt`: timestamp.

## Exit Criteria

- Location CRUD works.
- Tree retrieval works.
- Location tests cover hierarchy behavior.
