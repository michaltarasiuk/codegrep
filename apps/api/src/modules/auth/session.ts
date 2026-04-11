import { Elysia, status } from "elysia";

import { UnauthorizedError } from "$api/errors.js";
import { isDefined } from "$api/utils/is-defined.js";

import { authService } from "./service.js";

export const sessionPlugin = new Elysia({ name: "auth/session" })
  .derive({ as: "scoped" }, async ({ request: { headers } }) => {
    const session = await authService.api.getSession({
      headers,
    });

    if (!isDefined(session)) {
      return {
        user: null as never,
        session: null as never,
        authError: new UnauthorizedError(),
      };
    }

    return {
      user: session.user,
      session: session.session,
      authError: null,
    };
  })
  .onBeforeHandle({ as: "scoped" }, ({ authError }) => {
    if (authError instanceof UnauthorizedError) {
      return status(401, authError.message);
    }
  });
