import { treaty } from "@elysiajs/eden";
import { createAuthClient } from "better-auth/svelte";

import type { App } from "$api/app.js";
import { PUBLIC_WEB_URL } from "$env/static/public";

import { authPlugins } from "./auth.js";

export let client = treaty<App>(PUBLIC_WEB_URL);

export let authClient = createAuthClient({
  baseURL: PUBLIC_WEB_URL,
  plugins: [...authPlugins],
});
