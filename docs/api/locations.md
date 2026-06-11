# Locations API

Base path: `/locations`

## Create Location

`POST /locations`

Required fields: `building`, `name`, `number`.

Optional fields: `department`, `capacity`, `openTime`, `isBookable`, `parentId`.

Rules:

- `parentId` must reference an existing location when provided.
- `number` must be unique.
- `capacity` must be positive when provided.

## List Locations

`GET /locations`

Returns flat locations ordered by building, number, and name.

## Location Tree

`GET /locations/tree`

Returns root locations with recursive `children` arrays.

## Location Detail

`GET /locations/:id`

Returns `404 Not Found` when the location does not exist.

## Update Location

`PATCH /locations/:id`

Accepts partial updates for create fields. `parentId: null` moves a location to root.

Rules:

- A location cannot be its own parent.
- A location cannot move under its own descendant.
- `parentId` must reference an existing location when not null.
- `number` must remain unique.

## Delete Location

`DELETE /locations/:id`

Delete policy is leaf-only hard delete.

- Leaf location: `204 No Content`.
- Location with children: `409 Conflict`.
- Missing location: `404 Not Found`.
