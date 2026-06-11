# Development Guardrails

## Phase Guardrail

This repository is not ready for generated application code until the user approves the implementation phase.

Current allowed work:

- Requirements clarification.
- Architecture notes.
- Database design notes.
- API contract drafts.
- Docker Swarm planning.
- Local infrastructure compose planning.
- Agent, Codex, Claude, and skill guardrails.
- Documentation harness setup.
- Empty app-root scaffolding with README files.

Current blocked work without explicit approval:

- NestJS scaffold generation.
- Entity/service/controller implementation.
- Application Dockerfile generation.
- CI pipeline generation.
- Test suite generation.

## Coding Principles

When implementation begins:

- Invoke and mention `nestjs-expert` before backend work in `apps/server`, if that skill is available.
- If `nestjs-expert` is unavailable, record that in the work summary and continue using the local NestJS guardrails.
- Invoke and mention `react-best-practices` before admin UI work in `apps/admin`, if that skill is available.
- If `react-best-practices` is unavailable, record that in the work summary and continue using the local frontend guardrails.
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

## Reference Project Policy

The user referenced `/Users/jackhuynh/Documents/Projects/medusa-hub-consolidated` as a harness example.

Allowed to borrow:

- Monorepo organization ideas.
- Clear app ownership boundaries.
- Docs-first development workflow.
- Local infrastructure compose style.
- Agent guidance patterns.

Do not borrow:

- Medusa-specific services or modules.
- E-commerce domain logic.
- Credentials, secrets, or deployment targets.
- Large framework scaffolds unrelated to this assignment.
