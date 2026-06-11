# Epic Vision

## Epic

Build a clean NestJS REST API that manages hierarchical building locations and validates room bookings according to department, capacity, and open-time rules.

## Assignment Outcome

The final project should be acceptable as a personal GitHub deliverable for the SJ Assignment 2026 brief.

It must demonstrate:

- RESTful API design.
- Practical database modeling for a location tree.
- Booking validation logic.
- PostgreSQL persistence through TypeORM.
- Exception handling.
- Logging.
- Clean project structure.
- Useful documentation for setup, architecture, and database design.

## Product Story

Facility operators need to maintain a structured list of building locations such as buildings, floors, lobbies, corridors, utility rooms, and meeting rooms.

Bookable rooms have constraints:

- They can belong to a department.
- They can have a maximum capacity.
- They can have open-time rules.

When someone requests a booking, the API must check that the requested location can be booked and that the request follows the room rules.

## Primary User Journeys

### Location Manager

As a location manager, I can:

- Create a location under another location.
- View a complete tree of locations.
- View one location and its details.
- Update location metadata.
- Delete a location using a clear deletion policy.

### Booking Requester

As a booking requester, I can:

- Submit a booking request for a room.
- Receive a clear success response when the request is valid.
- Receive a clear validation error when department, capacity, or open-time rules fail.

### Reviewer

As an assignment reviewer, I can:

- Clone the repository.
- Read the documentation.
- Start PostgreSQL locally.
- Load the assignment seed data.
- Run the server.
- Open the admin app, if enabled, and see the seeded assignment locations immediately.
- Exercise the API.
- Understand the database design and system design.
- See tests proving the core rules.

## Non-Goals Unless Approved

- Authentication and authorization.
- Recurring bookings.
- Payments.
- Notifications.
- Calendar integrations.
- Multi-tenant organizations.
- Complex frontend admin workflows.
- Production Docker Swarm deployment.

## Success Criteria

The epic is done when:

- The server exposes documented REST endpoints for locations and bookings.
- Location data is persisted in PostgreSQL.
- The assignment sample data can be seeded during initial setup.
- The admin app, if enabled, displays seeded assignment locations on first review.
- The location hierarchy can be retrieved as a tree.
- Booking creation enforces department, capacity, open-time, and bookable-location checks.
- Important failure modes return consistent HTTP errors.
- Logging exists for request flow and domain failures.
- Tests cover the critical booking and location rules.
- Documentation explains setup, architecture, database design, and API usage.
