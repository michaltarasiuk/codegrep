import { treaty } from "@elysiajs/eden";
import { anonymousClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/svelte";

import type { App } from "$api/app";

const apiURL = import.meta.env.PUBLIC_API_URL;

export const client = treaty<App>(apiURL);

export const authClient = createAuthClient({
  baseURL: apiURL,
  plugins: [anonymousClient()],
});
