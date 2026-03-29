import { Elysia } from "elysia";

import { authPlugin } from "./modules/auth";
import { chatPlugin } from "./modules/chat";

export const app = new Elysia({ prefix: "/api" })
  .get("/health", () => ({
    status: "ok",
    timestamp: Date.now(),
  }))
  .use(authPlugin)
  .use(chatPlugin);

export type App = typeof app;
