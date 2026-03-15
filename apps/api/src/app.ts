import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";

import { authPlugin } from "./modules/auth";
import { chatPlugin } from "./modules/chat";

export const app = new Elysia()
  .use(
    cors({
      origin: process.env.WEB_URL,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  )
  .get("/health", () => ({
    status: "ok",
    timestamp: Date.now(),
  }))
  .use(authPlugin)
  .use(chatPlugin);

export type App = typeof app;
