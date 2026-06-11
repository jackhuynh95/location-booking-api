# Development Guardrails

## Phase Guardrail

This repository is not ready for generated application code until the user approves the implementation phase.

Current allowed work:

- Requirements clarification.
- Architecture notes.
- Database design notes.
- API contract drafts.
- Docker Swarm planning.
- Agent, Codex, Claude, and skill guardrails.
- Documentation harness setup.

Current blocked work without explicit approval:

- NestJS scaffold generation.
- Entity/service/controller implementation.
- Docker file generation.
- CI pipeline generation.
- Test suite generation.

## Coding Principles

When implementation begins:

- Keep controllers thin.
- Put business rules in services or domain helpers.
- Validate DTOs at the API boundary.
- Use TypeORM migrations for schema changes.
- Use structured logging.
- Return consistent error responses.
- Cover booking validation rules with tests.

## Assumption Policy

When the assignment does not specify behavior:

- Record the assumption in documentation.
- Prefer the simplest behavior that can be explained.
- Avoid adding hidden product scope.
- Ask before implementing high-impact choices such as authentication, soft deletes, recurrence, or Docker Swarm topology.

## Future Harness Areas

Planned areas for user-guided expansion:

- Project structure.
- Docker Swarm deployment model.
- Codex skills.
- Claude skills.
- Documentation guardrails.
- Architecture decision records.
- API contract and examples.
