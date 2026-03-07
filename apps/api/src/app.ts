import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";

import { authPlugin } from "./modules/auth";
import { chatPlugin } from "./modules/chat";

export const app = new Elysia()
  .use(cors({ origin: process.env.WEB_URL, credentials: true }))
  .use(authPlugin)
  .use(chatPlugin);

export type App = typeof app;
