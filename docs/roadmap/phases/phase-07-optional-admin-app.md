# Phase 7 - Optional Admin App

## Goal

Add a small admin UI only if it improves the assignment submission and the user approves the scope.

If approved, the admin app must make the assignment seed data visible through the API as part of the first reviewer experience.

## Required Skill

Before starting this phase, invoke and mention `react-best-practices` if it is available in the active agent environment.

If `react-best-practices` is unavailable, explicitly say so in the implementation notes and proceed using the project guardrails in `AGENTS.md` and `docs/guardrails/development-guardrails.md`.

## Tasks

| ID    | Task                                          | Output                   | Done When                                                                            | Status |
| ----- | --------------------------------------------- | ------------------------ | ------------------------------------------------------------------------------------ | ------ |
| 7.1.1 | Confirm admin scope                           | User decision            | User approves or rejects frontend work                                               | Done   |
| 7.2.1 | Choose frontend stack                         | Decision doc             | Framework, package manager, and UI library are selected                              | Done   |
| 7.2.2 | Scaffold admin app                            | `apps/admin`             | App boots locally                                                                    | Done   |
| 7.3.1 | Build location tree view                      | Admin UI                 | Reviewer can inspect hierarchy                                                       | Done   |
| 7.3.2 | Load initial assignment seed data through API | Admin UI                 | First admin view shows seeded assignment locations when the database has been seeded | Done   |
| 7.3.3 | Build location form                           | Admin UI                 | Reviewer can create/update locations                                                 | Done   |
| 7.4.1 | Build booking form                            | Admin UI                 | Reviewer can submit valid and invalid bookings                                       | Done   |
| 7.4.2 | Show validation errors                        | Admin UI                 | API errors are visible and readable                                                  | Done   |
| 7.5.1 | Add seeded-data empty state guidance          | Admin UI                 | If no locations exist, admin points reviewer to run the seed command                 | Done   |
| 7.5.2 | Verify assignment rows in admin               | Test or manual checklist | Assignment sample locations are visible in tree/list views                           | Done   |
| 7.6.1 | Document admin usage                          | Docs                     | Admin setup, seed, dev run, and production build instructions exist                  | Done   |
| 7.6.2 | Confirm static output path                    | Admin build config       | Phase 8 can copy or mount admin static assets into NestJS                            | Done   |

## Guardrail

This phase should remain blocked unless the backend assignment is already healthy or the user explicitly prioritizes the admin UI.

## Exit Criteria

- Admin app demonstrates the backend clearly.
- Admin displays original assignment seed data after initial setup.
- Admin reads seeded locations from backend endpoints instead of bundling its own copy.
- Admin has a helpful path when seed data has not been loaded yet.
- Admin docs exist.
- Admin can produce static production assets.
- Backend assignment quality is not reduced by frontend scope.
