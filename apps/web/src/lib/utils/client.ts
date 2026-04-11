import { treaty } from "@elysiajs/eden";
import { createAuthClient } from "better-auth/svelte";

import type { App } from "$api/app.js";
import { PUBLIC_WEB_URL } from "$env/static/public";

import { authClientPlugins } from "./auth-client-plugins.js";

export const client = treaty<App>(PUBLIC_WEB_URL);

export const authClient = createAuthClient({
  baseURL: PUBLIC_WEB_URL,
  plugins: [...authClientPlugins],
});
