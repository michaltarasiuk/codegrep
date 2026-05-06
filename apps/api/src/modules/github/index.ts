import { Elysia, status } from "elysia";

import { GithubUpstreamError } from "$api/errors.js";

import { sessionPlugin } from "../auth/session.js";
import { githubModel } from "./model.js";
import { GithubService } from "./service.js";

function upstreamFailed(error: GithubUpstreamError) {
  return status(502, { message: error.message });
}

export let githubPlugin = new Elysia({ name: "github", prefix: "/github" })
  .use(sessionPlugin)
  .use(githubModel)
  .get(
    "/repos",
    async ({ user, query: { q, limit } }) => {
      let result = await GithubService.searchRepos({
        userId: user.id,
        query: q,
        limit,
      });
      if (result instanceof GithubUpstreamError) {
        return upstreamFailed(result);
      }
      return result;
    },
    {
      query: "github.search.query",
      response: {
        200: "github.search.response",
        502: "github.error",
      },
    }
  );
