import { Elysia, status } from "elysia";

import { UnauthorizedError } from "$api/errors";

import { authService } from "./service";

export const sessionPlugin = new Elysia({ name: "auth/session" })
  .derive({ as: "scoped" }, async ({ request }) => {
    const session = await authService.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return { userId: null as never, authError: new UnauthorizedError() };
    }

    return { userId: session.user.id, authError: null };
  })
  .onBeforeHandle({ as: "scoped" }, ({ authError }) => {
    if (authError instanceof UnauthorizedError) {
      return status(401, authError.message);
    }
  });
