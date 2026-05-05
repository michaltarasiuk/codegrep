import { Elysia, t } from "elysia";

export let Repo = t.Object({
  id: t.Number(),
  fullName: t.String({ minLength: 1 }),
});

export let githubModel = new Elysia({ name: "github.model" }).model({
  "github.search.query": t.Object({
    q: t.Optional(t.String({ minLength: 1, maxLength: 256, pattern: "\\S" })),
    limit: t.Integer({ minimum: 1, maximum: 100, default: 10 }),
  }),
  "github.search.response": t.Array(Repo),

  "github.error": t.Object({
    message: t.String(),
  }),
});
