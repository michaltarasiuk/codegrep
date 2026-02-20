import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";

import { env } from "$/lib/env";

import { authPlugin } from "./modules/auth";

new Elysia()
  .use(cors())
  .use(authPlugin)
  .listen(env.SERVER_PORT, ({ hostname, port }) => {
    console.log(`Server running at http://${hostname}:${port}`);
  });
