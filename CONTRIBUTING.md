# Contributing

Thanks for contributing to codegrep! This guide covers local setup, the conventions we follow, and how to land a change.

For architectural context, read [`AGENTS.md`](./AGENTS.md). The authoritative coding rules live in [`.cursor/rules/code-standards.mdc`](./.cursor/rules/code-standards.mdc) — defer to it on conflicts.

## Development setup

1. Install [Bun](https://bun.sh) `>=1.3.12`.
2. Fork and clone the repo.
3. Install dependencies:

   ```bash
   bun install
   ```

4. Copy the example envs and fill them in:

   ```bash
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env
   ```

5. Apply the database schema (requires `DATABASE_URL`):

   ```bash
   bun --cwd apps/api run db:push
   ```

6. Start everything:

   ```bash
   bun run dev
   ```

## Branching and commits

- Branch off `main`. Use a short, descriptive branch name (e.g. `feat/chat-streaming`, `fix/auth-redirect`).
- Keep commits small and focused. Commit messages are not strictly conventional, but a short imperative summary is preferred (`Add chat retry button`, `Fix anonymous session refresh`).
- Rebase on top of `main` rather than merging it back into your branch when possible.

## Coding standards

The full rules are in [`.cursor/rules/code-standards.mdc`](./.cursor/rules/code-standards.mdc). Highlights:

- TypeScript with `strict`, `verbatimModuleSyntax`, and `noUncheckedIndexedAccess`. Don't weaken these.
- Prefer `unknown` over `any`. No `eslint-disable` or type assertions to silence errors — fix the underlying issue.
- Function declarations for top-level functions; arrow functions only as expressions/callbacks.
- `for...of` over `.forEach`. Optional chaining and nullish coalescing for safe access.
- Throw `Error` instances. Use the typed error classes in `apps/api/src/errors.ts` for expected domain failures.
- No `console.log`/`debugger`/`alert` in committed code. `console.error` for genuine error logging is fine.
- No barrel files. Prefer specific imports.
- Imports stay sorted by `simple-import-sort`.
- Accessibility: semantic HTML, ARIA where needed, alt text, keyboard handlers alongside mouse handlers.
- Security: `rel="noopener"` with `target="_blank"`, avoid `{@html}` unless unavoidable, never `eval`.
- Don't add narrating comments. Comments should explain non-obvious intent, trade-offs, or constraints.

### Web (SvelteKit)

- Svelte 5 runes only: `$state`, `$derived`, `$props`, `$bindable`, `$effect`. No legacy stores or `$:` reactive blocks in new code.
- Talk to the API through `@elysiajs/eden` typed against the exported `App` type from `apps/api/src/app.ts` — keep that export stable.
- Server-only data fetching goes in `+page.server.ts` / `+layout.server.ts` loaders. Use `@workspace/fetch-proxy` to forward cookies/headers when calling the API from the server.
- Reusable primitives live in `@workspace/ui`; chat-specific UI in `@workspace/ai-elements`. Extend these instead of inlining new primitives in `apps/web`.
- Tailwind v4: utility classes; theme tokens in `apps/web/src/styles/global.css`. Use `tailwind-variants` for variant APIs and `tailwind-merge`/`clsx` (re-exported from `@workspace/ui`) for class composition.
- SvelteKit aliases: `$lib/*`, `$styles/*`, `$app/*`.

### API (Elysia)

- Compose features as named Elysia plugins (`new Elysia({ name, prefix })`) and mount them in `apps/api/src/app.ts`. The root prefix is `/api`.
- Define request/response schemas as Elysia models (see `chat/model.ts`) and reference them by name in route options (`body`, `params`, `response`).
- Services (`*/service.ts`) own DB access and return typed errors instead of throwing for expected failures; routes branch on `instanceof` and map to `status(...)` codes.
- Auth lives in `modules/auth`. Use `sessionPlugin` to inject `user` into protected route contexts — don't re-validate sessions manually.
- Path aliases: `$api/*` for intra-app imports, `@workspace/*` for workspace packages.
- TS imports use `.js` extensions (NodeNext-style ESM).

### Database (Drizzle)

- Schema is the source of truth in `apps/api/src/db/schema.ts`. After changing it, run `bun run db:generate` (in `apps/api`) and commit the generated SQL in `apps/api/drizzle/`.
- Tables use `text` ids, `timestamp` with `defaultNow()`/`$onUpdate`, and `index(...)` on FK columns.
- Prefer `relations(...)` for typed joins.
- Don't hand-edit generated migrations.

## Dependencies

- Add new shared dependency versions to the `catalog` block in the root `package.json` and reference them with `"catalog:"` from workspace packages.
- Use `bun add` / `bun add -d` (with `--filter <pkg>` for a specific workspace).
- Don't switch package managers, runtimes, or framework majors without discussion.

## Tests

- Vitest in browser mode (via `@vitest/browser-playwright`) for Svelte components.
- Run once: `bun run test:run`. Watch: `bun run test`.
- Add tests alongside the code they cover when introducing non-trivial logic.

## Before opening a pull request

Run the full gate:

```bash
bun run check
```

This runs `format:check`, `lint`, `type:check`, and `test:run` — the same checks CI (`.github/workflows/check.yaml`) and the Lefthook pre-commit hook enforce. Fix every error before submitting.

If you only touched one app, you can also scope the type-check:

```bash
bun --cwd apps/web run type:check
bun --cwd apps/api run type:check
```

## Pull request checklist

- [ ] Branch is rebased on the latest `main`.
- [ ] `bun run check` passes locally.
- [ ] New shared deps added to the root `catalog`.
- [ ] Drizzle schema changes include regenerated migrations.
- [ ] No `console.log`, `debugger`, or unrelated formatting churn.
- [ ] PR description explains the why, not just the what, and links any related issues.

## Reporting issues

Open a GitHub issue with:

- A short summary of the problem.
- Steps to reproduce (commands, env, browser if applicable).
- Expected vs. actual behaviour.
- Relevant logs or screenshots.

Security issues should be reported privately to the maintainers rather than as a public issue.
