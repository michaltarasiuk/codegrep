import { Elysia } from "elysia";
import { authService } from "./service";

const BETTER_AUTH_ACCEPT_METHODS = ["GET", "POST"];

export const authModule = new Elysia({ prefix: "/api/auth" }).all(
  "*",
  (context) => {
    if (!BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
      context.set.status = 405;
      return "Method Not Allowed";
    }
    return authService.handler(context.request);
  }
);
