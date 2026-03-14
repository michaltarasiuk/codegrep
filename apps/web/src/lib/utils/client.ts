import { treaty } from "@elysiajs/eden";
import { anonymousClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/svelte";

import type { App } from "$api/app";
import { PUBLIC_API_URL } from "$env/static/public";

export const client = treaty<App>(PUBLIC_API_URL, {
  fetch: {
    credentials: "include",
  },
});

export const authClient = createAuthClient({
  baseURL: PUBLIC_API_URL,
  plugins: [anonymousClient()],
});
