# Repository Guidelines

## Project Structure & Module Organization
This repository is organized as a monorepo-style root with the backend app in `PGA-Backend/`.

- `PGA-Backend/src/`: NestJS source code (`modules/`, `common/`, `config/`, `main.ts`).
- `PGA-Backend/prisma/`: Prisma schema and migrations.
- `PGA-Backend/test/`: end-to-end tests (`*.e2e-spec.ts`) and Jest e2e config.
- `PGA-Backend/dist/`: compiled output (generated).
- Root docs: `README.md`, `CHANGELOG.md`.

Prefer feature modules under `src/modules/<feature>/` with `controller`, `service`, `repository`, `dto`, and `entities` files co-located.

## Build, Test, and Development Commands
Run commands from `PGA-Backend/`.

- `npm install`: install dependencies.
- `npm run start:dev`: run API in watch mode.
- `npm run build`: compile to `dist/`.
- `npm run start:prod`: run compiled app.
- `npm run lint`: run ESLint with auto-fix.
- `npm run format`: format `src/` and `test/` with Prettier.
- `npm run test`, `npm run test:e2e`, `npm run test:cov`: unit, e2e, and coverage runs.
- `npm run migrate`: apply Prisma dev migrations.
- `npm run docker:up` / `npm run docker:down`: start/stop local stack with Docker Compose.

## Coding Style & Naming Conventions
TypeScript + NestJS conventions are required.

- Formatting: Prettier (`singleQuote: true`, `trailingComma: all`).
- Linting: ESLint (`eslint.config.mjs`) with TypeScript rules.
- Use 2-space indentation and explicit DTO/entity types.
- File naming follows existing module patterns, e.g. `create-user.dto.ts`, `user.controller.ts`, `find-all-course.service.ts`.
- Keep class names PascalCase; variables/functions camelCase.

## Testing Guidelines
Jest is used for unit tests (`src/**/*.spec.ts`) and e2e tests (`test/*.e2e-spec.ts`).

- Add or update tests for every behavior change.
- Keep tests near the module being validated or in `test/` for e2e flows.
- Run `npm run test` and `npm run test:e2e` before opening a PR.
- No strict coverage gate is configured; maintain or improve coverage for touched modules.

## Commit & Pull Request Guidelines
Follow the project’s commit style seen in history: Conventional Commit-like prefixes such as `feat:`, `fix:`, `chore:`, and `breakchange:`.

- Keep commits focused and descriptive.
- PRs should include: objective, main changes, migration/env impacts, and test evidence.
- Link related issue(s) when available.
- For API changes, include updated Swagger route behavior and example request/response when relevant.
