import { Elysia } from "elysia";

import { authPlugin } from "./modules/auth/index.js";
import { chatPlugin } from "./modules/chat/index.js";

export let app = new Elysia({ prefix: "/api" })
  .get("/health", () => ({
    status: "ok",
    timestamp: Date.now(),
  }))
  .use(authPlugin)
  .use(chatPlugin);

export type App = typeof app;
