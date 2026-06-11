# AGENTS.md

## Project Intent

This repository is for the `location-booking-api` assignment. Treat the project as a RESTful backend for hierarchical building location management and room booking validation.

## Current Phase

The project is in the specification and harness phase.

Do not generate the application codebase, NestJS scaffold, Docker files, or CI files until the user explicitly asks for that step.

## Source of Truth

Use these documents before implementation decisions:

- `docs/specs/assignment-brief.md`
- `docs/specs/functional-spec.md`
- `docs/architecture/architecture-notes.md`
- `docs/guardrails/development-guardrails.md`

## Required Stack

- Node.js
- NestJS
- TypeScript
- TypeORM
- PostgreSQL

## Implementation Guardrails

- Prefer clear module boundaries: locations, bookings, shared database configuration, logging, and exception handling.
- Keep domain rules testable outside controllers.
- Preserve the location hierarchy as a first-class model.
- Do not hard-code sample data into business logic.
- Document assumptions when assignment details are incomplete.
- Keep generated structure minimal and explainable.

## Shell Rule

Follow the global shell rule from `/Users/jackhuynh/.codex/RTK.md`: run shell commands through `rtk`.
