# Functional Specification

## Goals

Build a RESTful API backend for:

- Location management.
- Booking management.
- Booking rule validation.

## Location Management

Users must be able to create, read, update, and delete location nodes.

Initial assignment sample locations must be available as seed data so reviewers can inspect the expected hierarchy without manually entering all rows.

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

### Resolved Implementation Policies

- Confirmed bookings cannot overlap for the same room.
- Non-bookable locations reject booking requests.
- Department is supplied in the booking request payload and must match the location department.
- Error responses use the global `{ statusCode, error, message, timestamp, path }` shape.
- Location deletion is leaf-only hard delete.
- Authentication and authorization are out of scope for this assignment pass.
