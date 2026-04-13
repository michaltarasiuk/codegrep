import { treaty } from "@elysiajs/eden";
import { createAuthClient } from "better-auth/svelte";

import type { App } from "$api/app.js";
import { API_URL } from "$env/static/private";

import { authPlugins } from "./auth.js";

export const client = treaty<App>(API_URL);

export const authClient = createAuthClient({
  baseURL: API_URL,
  plugins: [...authPlugins],
});
