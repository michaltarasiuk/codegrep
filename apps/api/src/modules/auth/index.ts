import { Elysia, status } from "elysia";

import { authService } from "./service";

const ALLOWED_METHODS = new Set(["OPTIONS", "GET", "POST"]);

export const authPlugin = new Elysia({ name: "auth" }).all(
  "/auth/*",
  ({ request }) => {
    if (!ALLOWED_METHODS.has(request.method)) {
      return status(401);
    }
    return authService.handler(request);
  }
);
