# Architecture Notes

## Initial Direction

Use a NestJS modular backend with PostgreSQL persistence through TypeORM.

Suggested first modules after approval:

- `locations`
- `bookings`
- `database`
- `common`

## Domain Shape

### Location

Location is a tree node. The database model should support parent-child relationships without losing direct query performance for common reads.

Potential approaches:

- Adjacency list with `parentId`.
- TypeORM tree entity.

Default preference: start with an adjacency list unless requirements demand advanced tree queries.

### Booking

Booking belongs to a location. Booking creation should pass through a service-level validation flow before persistence.

Validation should be expressed as domain/service logic, not as controller-only checks.

## API Surface Draft

Location endpoints:

- `POST /locations`
- `GET /locations`
- `GET /locations/tree`
- `GET /locations/:id`
- `PATCH /locations/:id`
- `DELETE /locations/:id`

Booking endpoints:

- `POST /bookings`
- `GET /bookings`
- `GET /bookings/:id`
- `PATCH /bookings/:id`
- `DELETE /bookings/:id`

## Documentation Targets

Before final delivery, include:

- API usage documentation.
- Environment variable documentation.
- Database design notes.
- System design overview.
- Local development instructions.
- Docker or Docker Swarm instructions if selected by the user.
