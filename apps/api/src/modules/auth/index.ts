import { Elysia } from "elysia";
import { authService } from "./service";

const ALLOWED_METHODS = new Set(["OPTIONS", "GET", "POST"]);

export const authPlugin = new Elysia({ name: "auth" }).all(
  "/api/auth/*",
  ({ request, set }) => {
    if (!ALLOWED_METHODS.has(request.method)) {
      set.status = 405;
      return "Method Not Allowed";
    }
    return authService.handler(request);
  }
);
