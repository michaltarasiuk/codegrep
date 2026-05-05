import { Octokit } from "@octokit/rest";
import { isDefined } from "@workspace/shared/is-defined.js";
import { and, eq } from "drizzle-orm";

import { db } from "$api/db/index.js";
import { account } from "$api/db/schema.js";
import { GithubUpstreamError } from "$api/errors.js";

const GITHUB_PROVIDER_ID = "github";
const USER_AGENT = "codegrep";
const SCOPE_QUALIFIER = /(?:^|\s)(?:user|org|owner|repo):/i;

interface OctokitRepo {
  id: number;
  full_name: string;
}
interface Repo {
  id: number;
  fullName: string;
}

interface SearchInput {
  query: string;
  limit: number;
}

const OCTOKIT_DEFAULTS = {
  userAgent: USER_AGENT,
} as const;

let publicClient = new Octokit(OCTOKIT_DEFAULTS);

export abstract class GithubService {
  static async searchRepos({
    userId,
    ...searchInput
  }: SearchInput & { userId: string }) {
    let accessToken = await getGithubAccessToken(userId);
    try {
      let items = isDefined(accessToken)
        ? await searchAuthenticated(accessToken, searchInput)
        : await searchPublic(searchInput);
      return items.slice(0, searchInput.limit).map(toRepo);
    } catch (error) {
      console.error("github upstream error", error);
      return new GithubUpstreamError();
    }
  }
}

async function getGithubAccessToken(userId: string) {
  let [githubAccount] = await db
    .select({ accessToken: account.accessToken })
    .from(account)
    .where(
      and(
        eq(account.userId, userId),
        eq(account.providerId, GITHUB_PROVIDER_ID)
      )
    )
    .limit(1);
  return githubAccount?.accessToken ?? null;
}

async function searchAuthenticated(
  auth: string,
  { query, limit }: SearchInput
) {
  let octokit = new Octokit({ auth, ...OCTOKIT_DEFAULTS });
  if (SCOPE_QUALIFIER.test(query)) {
    return await runSearch(octokit, {
      query,
      limit,
      sort: "stars",
    });
  }
  let {
    data: { login },
  } = await octokit.users.getAuthenticated();
  let [owned, popular] = await Promise.all([
    runSearch(octokit, {
      query: `user:${login} ${query}`,
      limit,
      sort: "updated",
    }),
    runSearch(octokit, {
      query,
      limit,
      sort: "stars",
    }),
  ]);
  return dedupeById(owned, popular);
}

async function searchPublic({ query, limit }: SearchInput) {
  return await runSearch(publicClient, { query, limit, sort: "stars" });
}

async function runSearch(
  octokit: Octokit,
  {
    query,
    limit,
    sort,
  }: {
    query: string;
    limit: number;
    sort: "stars" | "updated";
  }
): Promise<OctokitRepo[]> {
  let { data } = await octokit.search.repos({
    q: query,
    per_page: limit,
    sort,
  });
  if (data.incomplete_results) {
    console.error("github search returned incomplete results", { query });
  }
  return data.items;
}

function toRepo({ id, full_name }: OctokitRepo): Repo {
  return { id, fullName: full_name };
}

function dedupeById<T extends { id: number }>(a: T[], b: T[]): T[] {
  let seen = new Set(a.map((v) => v.id));
  return [...a, ...b.filter((v) => !seen.has(v.id))];
}
