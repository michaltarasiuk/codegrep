import { Elysia, status } from "elysia";

import { authService } from "./service.js";

let ALLOWED_METHODS = new Set(["OPTIONS", "GET", "POST"]);

export let authPlugin = new Elysia({ name: "auth" }).all(
  "/auth/*",
  async ({ request }) => {
    if (!ALLOWED_METHODS.has(request.method)) {
      return status(401);
    }
    try {
      return await authService.handler(request);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);
