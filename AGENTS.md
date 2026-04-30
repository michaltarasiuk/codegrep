# AGENTS.md

## Project overview

`codegrep` (package name `githubgrep`) is an AI chat application for exploring GitHub code. It is a Bun + Turborepo monorepo with a SvelteKit web app and an Elysia API.

- **Frontend** (`apps/web`): SvelteKit 5 (runes), Tailwind CSS v4, Bits UI, Better Auth client, AI SDK (`@ai-sdk/svelte`), deployed to Vercel.
- **Backend** (`apps/api`): Elysia (Bun runtime), Better Auth (with anonymous + GitHub OAuth), Drizzle ORM on Postgres, Vercel AI SDK.
- **Shared packages** (`packages/*`): internal libs consumed via `workspace:*` and the `@workspace/*` namespace.

## Repository layout

```
apps/
  api/                  Elysia API (Bun) - auth, chat, DB
    src/
      app.ts            Root Elysia app, mounts auth + chat plugins under /api
      modules/
        auth/           Better Auth service + session plugin
        chat/           Chat routes, model schemas, Groq provider, service
      db/               Drizzle schema + client (Postgres)
      utils/
      errors.ts         Typed error classes (NotFoundError, UpsertFailedError)
    drizzle/            Generated migrations
  web/                  SvelteKit app
    src/
      routes/           Pages + +page.server.ts / +layout.server.ts loaders
      lib/components/   Feature components (chat-*, app-sidebar, dialogs, etc.)
      hooks.server.ts   Server hooks (auth, fetch proxy)
      styles/           global.css (Tailwind v4 entry)
packages/
  shared/               Generic helpers (e.g. is-defined)
  ui/                   Bits UI based primitives + tailwind-variants
  ai-elements/          Chat UI building blocks (messages, prompts, streaming)
  stick-to-bottom/      Svelte 5 port of stick-to-bottom
  headers/              HTTP header helpers
  fetch-proxy/          Cookie/header forwarding fetch wrapper used by SvelteKit loaders
.cursor/
  rules/code-standards.mdc   Authoritative coding rules (read it)
  skills/                    Tool-specific skills (Better Auth, Elysia, etc.)
```

Workspace internals are imported as `@workspace/<pkg>` (defined in root `package.json` `workspaces`). The dependency `catalog` in the root `package.json` pins versions for shared deps (svelte, tailwind, ai, better-auth, elysia, etc.) — add new shared versions there, not per-package.

## Toolchain

- **Package manager / runtime**: Bun `>=1.3.12` (`packageManager: bun@1.3.12`). Use `bun` and `bun x`, not `npm`/`pnpm`/`yarn`.
- **Build orchestration**: Turborepo (`turbo run <task>`).
- **Language**: TypeScript 5.9 (`strict`, `verbatimModuleSyntax`, `noUncheckedIndexedAccess`). Never weaken these flags.
- **Lint**: ESLint flat config (`eslint.config.js`) with `simple-import-sort` and `typescript-eslint`. Max warnings = 0.
- **Format**: Prettier (with `prettier-plugin-svelte` and `prettier-plugin-tailwindcss`).
- **Tests**: Vitest (browser mode via `@vitest/browser-playwright` for Svelte components).
- **Git hooks**: Lefthook runs Prettier, ESLint, and `tsc --noEmit` on staged files pre-commit.

## Commands

Run from repo root unless noted.

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

Database (run inside `apps/api`):

| Task               | Command               |
| ------------------ | --------------------- |
| Apply schema (dev) | `bun run db:push`     |
| Generate migration | `bun run db:generate` |
| Apply migrations   | `bun run db:migrate`  |
| Drizzle Studio     | `bun run db:studio`   |

**Always run `bun run check` before declaring a task done.** It mirrors what CI and the pre-commit hook enforce.

## Environment variables

Defined in `turbo.json#globalEnv`. Do not hardcode secrets.

- `WEB_URL`, `PUBLIC_WEB_URL`, `API_URL`
- `DATABASE_URL` (Postgres)
- `GROQ_API_KEY` (LLM provider)
- `BETTER_AUTH_BASE_URL`, `BETTER_AUTH_SECRET`
- `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`

`.env*` files are gitignored except `.env.example`.

## Architectural conventions

### API (Elysia)

- Compose features as named Elysia plugins (`new Elysia({ name, prefix })`) and mount them in `apps/api/src/app.ts`. The root prefix is `/api`.
- Define request/response schemas as Elysia models (see `chat/model.ts`) and reference them by name in route options (`body`, `params`, `response`).
- Services (`*/service.ts`) own DB access and return typed errors (`NotFoundError`, `UpsertFailedError`) instead of throwing for expected failures; routes branch on `instanceof` and map to `status(...)` codes.
- Auth lives in `modules/auth`. The `sessionPlugin` injects `user` into the Elysia context for protected routes — use it instead of re-validating sessions.
- Use path aliases `$api/*` (configured via tsconfig) for intra-app imports. External workspace imports use `@workspace/*`.
- Imports of TS files use `.js` extensions (NodeNext-style ESM).

### Web (SvelteKit)

- Svelte 5 runes only: `$state`, `$derived`, `$props`, `$bindable`, `$effect`. No legacy stores/`$:` reactive blocks in new code.
- Talk to the API through `@elysiajs/eden` typed against the exported `App` type from `apps/api/src/app.ts` — keep that export stable.
- Server-only data fetching goes in `+page.server.ts` / `+layout.server.ts` loaders. Use `@workspace/fetch-proxy` to forward cookies/headers when calling the API from the server.
- Reusable primitives live in `@workspace/ui`; chat-specific UI in `@workspace/ai-elements`. Prefer extending these over inlining new primitives in `apps/web`.
- Tailwind v4: styles via utility classes; theme tokens in `apps/web/src/styles/global.css`. Use `tailwind-variants` for variant APIs and `tailwind-merge`/`clsx` (re-exported from `@workspace/ui`) for class composition.
- Use SvelteKit aliases: `$lib/*`, `$styles/*`, `$app/*`.

### Database (Drizzle)

- Schema is the source of truth in `apps/api/src/db/schema.ts`. After changing it, run `bun run db:generate` (in `apps/api`) and commit the generated SQL in `apps/api/drizzle/`.
- Tables use `text` ids, `timestamp` with `defaultNow()`/`$onUpdate`, and `index(...)` on FK columns. Match this pattern for new tables.
- Prefer `relations(...)` for typed joins.

## Coding standards (summary)

The full rules live in `.cursor/rules/code-standards.mdc` — defer to it on conflicts. Highlights:

- Use `let` by default at the top level (matches existing code), `const` where the linter prefers it, never `var`.
- Function declarations for top-level functions; arrow functions only as expressions/callbacks. In classes, methods by default; arrows only for handlers passed to Svelte that need lexical `this`.
- `for...of` over `.forEach`. Optional chaining and nullish coalescing for safe access.
- Prefer `unknown` over `any`. Use `as const`. Avoid type assertions when narrowing works.
- Throw `Error` instances with descriptive messages; use the typed error classes in `apps/api/src/errors.ts` for expected domain failures.
- No `console.log`/`debugger`/`alert` in committed code (`console.error` for genuine error logging is fine).
- No barrel files. Prefer specific imports.
- Keep imports sorted (`simple-import-sort` will tell you).
- Accessibility: semantic HTML, ARIA where needed, alt text, keyboard handlers alongside mouse handlers.
- Security: `rel="noopener"` with `target="_blank"`, avoid `{@html}` unless unavoidable, never `eval`.

## Workflow expectations for agents

1. Plan changes with a TODO list when the task spans multiple files or steps.
2. Edit the smallest relevant set of files. Do not introduce new top-level configs or scripts unless asked.
3. Add new shared deps to the catalog in root `package.json` and reference with `"catalog:"` from workspace packages.
4. After edits, run `bun run check` (or at minimum `bun run type:check` for the affected app and `bun run lint`). Fix all errors before finishing.
5. Do not commit or push unless the user explicitly asks. Never modify git config or force-push.
6. Don't add narrating comments. Add comments only for non-obvious intent or constraints.
7. Don't create README/docs files proactively.

## Things to avoid

- Switching package managers, runtimes, or framework majors.
- Adding ESLint disables or `any` to silence errors — fix the underlying issue.
- Bypassing the `sessionPlugin` for protected API routes.
- Calling the API from the SvelteKit server without going through the Eden client / `fetch-proxy`.
- Touching generated Drizzle migrations by hand.
