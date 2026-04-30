# codegrep

AI chat application for exploring GitHub code. SvelteKit web app and an Elysia API, packaged as a Bun + Turborepo monorepo.

## Stack

- **Web** (`apps/web`): SvelteKit 5 (runes), Tailwind CSS v4, Bits UI, Better Auth client, AI SDK (`@ai-sdk/svelte`). Deployed to Vercel.
- **API** (`apps/api`): Elysia on the Bun runtime, Better Auth (anonymous + GitHub OAuth), Drizzle ORM on Postgres, Vercel AI SDK with Groq.
- **Shared packages** (`packages/*`): consumed via `workspace:*` under the `@workspace/*` namespace.
- **Tooling**: Bun, Turborepo, TypeScript 5.9 (strict), ESLint flat config, Prettier, Vitest (browser mode), Lefthook.

## Repository layout

```
apps/
  api/   Elysia API (auth, chat, DB, Drizzle migrations)
  web/   SvelteKit app (routes, components, server hooks)
packages/
  shared/            Generic helpers
  ui/                Bits UI based primitives + tailwind-variants
  ai-elements/       Chat UI building blocks
  stick-to-bottom/   Svelte 5 port of stick-to-bottom
  headers/           HTTP header helpers
  fetch-proxy/       Cookie/header forwarding fetch wrapper
  workflows/         Shared workflow utilities
```

See [`AGENTS.md`](./AGENTS.md) for the full architecture and conventions.

## Prerequisites

- [Bun](https://bun.sh) `>=1.3.12` (matches the `packageManager` field in `package.json`)
- A Postgres database for the API
- A [Groq](https://console.groq.com) API key
- A GitHub OAuth app (client id / secret) for sign-in

## Quickstart

```bash
git clone https://github.com/<your-fork>/codegrep.git
cd codegrep
bun install

cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
# fill in DATABASE_URL, GROQ_API_KEY, BETTER_AUTH_SECRET, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET

bun --cwd apps/api run db:push
bun run dev
```

The web app runs at http://localhost:5173 and the API at http://localhost:3000.

## Environment variables

Defined in `turbo.json#globalEnv`. Copy each app's `.env.example` to `.env` and fill in the blanks. Files matching `.env*` are gitignored except the examples.

**API** (`apps/api/.env`):

| Variable               | Purpose                           |
| ---------------------- | --------------------------------- |
| `WEB_URL`              | Base URL of the web app           |
| `API_URL`              | Base URL of the API               |
| `DATABASE_URL`         | Postgres connection string        |
| `GROQ_API_KEY`         | Groq LLM API key                  |
| `BETTER_AUTH_SECRET`   | Random secret for session signing |
| `BETTER_AUTH_BASE_URL` | Defaults to `$API_URL`            |
| `GITHUB_CLIENT_ID`     | GitHub OAuth client id            |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret        |

**Web** (`apps/web/.env`):

| Variable         | Purpose                               |
| ---------------- | ------------------------------------- |
| `API_URL`        | Server-side base URL of the API       |
| `PUBLIC_WEB_URL` | Public-facing base URL of the web app |

## Scripts

Run from the repo root unless noted.

| Task                     | Command                                          |
| ------------------------ | ------------------------------------------------ |
| Install deps             | `bun install`                                    |
| Dev (all apps via Turbo) | `bun run dev`                                    |
| Build all                | `bun run build`                                  |
| Type-check all           | `bun run type:check`                             |
| Lint                     | `bun run lint` (fix: `bun run lint:fix`)         |
| Format                   | `bun run format` (check: `bun run format:check`) |
| Run tests once           | `bun run test:run`                               |
| Watch tests              | `bun run test`                                   |
| Full pre-commit gate     | `bun run check`                                  |
| Auto-fix everything      | `bun run fix`                                    |

Database scripts (run inside `apps/api`):

| Task               | Command               |
| ------------------ | --------------------- |
| Apply schema (dev) | `bun run db:push`     |
| Generate migration | `bun run db:generate` |
| Apply migrations   | `bun run db:migrate`  |
| Drizzle Studio     | `bun run db:studio`   |

## Continuous integration

`.github/workflows/check.yaml` runs `bun run check` (format check, lint, type-check, tests) on every push to `main` and on pull requests. The Lefthook `pre-commit` hook mirrors this locally on staged files.

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for development setup, coding standards, and the pull request workflow.
