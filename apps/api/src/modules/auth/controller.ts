import { Elysia } from "elysia";
import { authService } from "./service";

const ALLOWED_METHODS = new Set(["GET", "POST"]);

export const authPlugin = new Elysia({ name: "auth" })
  .onBeforeHandle(({ request, set }) => {
    if (!ALLOWED_METHODS.has(request.method)) {
      set.status = 405;
      return "Method Not Allowed";
    }
  })
  .mount("/api/auth", authService.handler);
