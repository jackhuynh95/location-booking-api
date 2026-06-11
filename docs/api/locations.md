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

After running the assignment seed command, the tree includes:

- Building `A` root location `A-01` (`Floor 1`) with children `A-01-01`, `A-01-02`, `A-01-03`, `A-01-Corridor`, and `A-01-Lobby`.
- Building `B` root location `B-05` (`Floor 5`) with children `B-05-11`, `B-05-12`, `B-05-13`, `B-05-14`, `B-05-15`, and `B-05-Corridor`.

Seed command from `apps/server` after migrations:

```bash
npm run seed:locations
```

The command is safe to rerun. It matches existing rows by `number`, updates assignment fields, and does not create duplicate locations.

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
