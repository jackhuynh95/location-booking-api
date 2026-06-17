# Bookings API

Base path: `/bookings`

Booking creation validates the target location before persistence. A location is bookable only when `isBookable` is `true`, and its `department`, `capacity`, and `openTime` support the request.

## Policy Decisions

- Lifecycle: new bookings are created with `status: "confirmed"`.
- Overlap: confirmed bookings cannot overlap for the same `locationId`.
- Boundary: back-to-back bookings are valid when one booking ends exactly when another starts.
- Invalid interval: `endAt` must be strictly after `startAt`.
- Cancellation: `cancelled` is reserved in the database enum, but no cancel endpoint is exposed yet.
- Open-time validation: supported assignment values are `Always open`, `Mon to Fri (9AM to 6PM)`, `Mon to Sat (9AM to 6PM)`, and `Mon to Sun (9AM to 6PM)`.
- Timestamp rule: the open-time check uses the wall-clock date and time supplied in each ISO 8601 timestamp. The server does not convert these wall-clock fields to its own timezone before checking room hours.
- Unknown fields are rejected by the global validation pipe.

## Create Booking

`POST /bookings`

Required fields: `locationId`, `department`, `attendeeCount`, `startAt`, `endAt`.

Example valid request for seeded `A-01-01` after looking up its `id` from `GET /locations`:

```bash
curl -X POST http://localhost:3000/bookings \
  -H 'Content-Type: application/json' \
  -d '{
    "locationId": "<A-01-01 id>",
    "department": "EFM",
    "attendeeCount": 4,
    "startAt": "2026-06-12T10:00:00.000Z",
    "endAt": "2026-06-12T11:00:00.000Z"
  }'
```

Example success response:

```json
{
  "id": "11111111-1111-4111-8111-111111111111",
  "locationId": "22222222-2222-4222-8222-222222222222",
  "department": "EFM",
  "attendeeCount": 4,
  "startAt": "2026-06-12T10:00:00.000Z",
  "endAt": "2026-06-12T11:00:00.000Z",
  "status": "confirmed",
  "createdAt": "2026-06-11T00:00:00.000Z",
  "updatedAt": "2026-06-11T00:00:00.000Z"
}
```

## List Bookings

`GET /bookings`

Returns bookings ordered by `startAt`, then `createdAt`.

```bash
curl http://localhost:3000/bookings
```

## Booking Detail

`GET /bookings/:id`

Returns `404 Not Found` when the booking does not exist.

```bash
curl http://localhost:3000/bookings/11111111-1111-4111-8111-111111111111
```

## Invalid Examples

Department mismatch:

```json
{
  "locationId": "<A-01-01 id>",
  "department": "FSS",
  "attendeeCount": 4,
  "startAt": "2026-06-12T10:00:00.000Z",
  "endAt": "2026-06-12T11:00:00.000Z"
}
```

Response:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Booking department does not match location department",
  "timestamp": "2026-06-11T00:00:00.000Z",
  "path": "/bookings"
}
```

Capacity overflow:

```json
{
  "locationId": "<A-01-03 id>",
  "department": "AVS",
  "attendeeCount": 6,
  "startAt": "2026-06-12T10:00:00.000Z",
  "endAt": "2026-06-12T11:00:00.000Z"
}
```

Response message: `Booking attendee count exceeds location capacity`.

Closed-time booking:

```json
{
  "locationId": "<A-01-01 id>",
  "department": "EFM",
  "attendeeCount": 4,
  "startAt": "2026-06-14T10:00:00.000Z",
  "endAt": "2026-06-14T11:00:00.000Z"
}
```

Response message: `Booking time is outside location open time`.

Non-bookable location:

```json
{
  "locationId": "<A-01 id>",
  "department": "EFM",
  "attendeeCount": 4,
  "startAt": "2026-06-12T10:00:00.000Z",
  "endAt": "2026-06-12T11:00:00.000Z"
}
```

Response message: `Target location is not bookable`.

Overlap:

Response status: `409 Conflict`.

Response message: `Booking overlaps an existing booking for this location`.

Invalid interval:

Response status: `400 Bad Request`.

Response message: `Booking endAt must be after startAt`.

Unsupported stored open time:

Response status: `400 Bad Request`.

Response message prefix: `Unsupported open time format`.

Invalid UUID:

Response status: `400 Bad Request`.

Missing booking:

Response status: `404 Not Found`.
