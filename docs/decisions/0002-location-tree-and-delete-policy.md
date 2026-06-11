# 0002 - Location Tree And Delete Policy

## Status

Accepted.

## Context

The assignment requires hierarchical locations and asks for explicit delete behavior before implementation.

## Decision

Use an adjacency-list model:

- `locations.parent_id` points to `locations.id`.
- `parent_id` is nullable for root locations.
- Tree responses are built in the service layer from ordered flat rows.
- Service rules reject self-parent and descendant-parent updates to prevent cycles.

Deletion uses a conservative leaf-only hard delete policy:

- A location with child locations cannot be deleted.
- The API returns `409 Conflict` for delete attempts against non-leaf nodes.
- Leaf locations are hard-deleted.

## Rationale

Adjacency lists are simple, portable, and enough for the assignment's CRUD and tree output. Leaf-only hard delete avoids accidental subtree loss and keeps behavior easy for reviewers to verify.
