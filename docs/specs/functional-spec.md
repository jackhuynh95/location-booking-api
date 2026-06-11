# Functional Specification

## Goals

Build a RESTful API backend for:

- Location management.
- Booking management.
- Booking rule validation.

## Location Management

Users must be able to create, read, update, and delete location nodes.

### Location Attributes

Expected core fields:

- `id`
- `building`
- `name`
- `number`
- `department`
- `capacity`
- `openTime`
- `parentId`
- `createdAt`
- `updatedAt`

### Location Tree

The API must support retrieving locations as a hierarchy.

Important model rules:

- A location can have zero or one parent.
- A location can have zero or more children.
- Root nodes can represent buildings or top-level building locations.
- The hierarchy must not allow cycles.
- Deleting a location with children needs an explicit policy before implementation.

## Booking Management

Users must be able to create booking requests against bookable locations.

### Booking Attributes

Expected core fields:

- `id`
- `locationId`
- `department`
- `attendeeCount`
- `startAt`
- `endAt`
- `status`
- `createdAt`
- `updatedAt`

### Booking Validation Rules

The system must reject invalid bookings when:

- The request department does not match the room department.
- The attendee count is greater than room capacity.
- The requested time is outside the room open time.
- The target location is not bookable.

### Open Questions

- Whether bookings can overlap for the same room.
- Whether non-room locations can ever be booked.
- Whether department is attached to a user, request payload, or both.
- Exact response shape and pagination requirements.
- Whether delete should be soft delete or hard delete.
- Required authentication or authorization scope.

These should be resolved before code generation.
