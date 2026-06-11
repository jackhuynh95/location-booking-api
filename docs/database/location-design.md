# Location Database Design

## Table: `locations`

| Column        | Type                     | Notes                                                           |
| ------------- | ------------------------ | --------------------------------------------------------------- |
| `id`          | `uuid`                   | Primary key, generated with `uuid_generate_v4()`                |
| `building`    | `varchar(120)`           | Building code or name                                           |
| `name`        | `varchar(160)`           | Human-readable location name                                    |
| `number`      | `varchar(80)`            | Unique location number, for example `A-01-01`                   |
| `department`  | `varchar(80)`, nullable  | Required later for bookable rooms                               |
| `capacity`    | `integer`, nullable      | Must be positive when present                                   |
| `open_time`   | `varchar(160)`, nullable | Human-readable schedule for Phase 3; booking parser comes later |
| `is_bookable` | `boolean`                | Defaults to `false`                                             |
| `parent_id`   | `uuid`, nullable         | Self-reference to `locations.id`                                |
| `created_at`  | `timestamptz`            | Created timestamp                                               |
| `updated_at`  | `timestamptz`            | Updated timestamp                                               |

## Constraints And Indexes

- Primary key on `id`.
- Unique constraint on `number`.
- Check constraint: `capacity IS NULL OR capacity > 0`.
- Foreign key from `parent_id` to `locations.id` with `ON DELETE RESTRICT`.
- Index on `building`.
- Index on `parent_id`.

## Tree Strategy

Phase 3 uses an adjacency list. The service fetches all rows ordered by building, number, and name, then builds nested `children` arrays for `GET /locations/tree`.

## Bookable Location Policy

Assignment seed data marks a location bookable when `department`, `capacity`, and `open_time` are all present. Booking creation still trusts the explicit `is_bookable` flag as the final policy switch, so non-room locations such as floors, corridors, lobbies, and pantries are rejected even if a caller submits otherwise valid booking fields.

## Delete Policy

Deletion is leaf-only hard delete. A location with children returns `409 Conflict`; a leaf location returns `204 No Content`.
