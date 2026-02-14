import { Elysia } from "elysia";
import { env } from "@/lib/env";
import { authModule } from "./modules/auth/controller";

new Elysia().use(authModule).listen(env.SERVER_PORT, ({ hostname, port }) => {
  console.log(`Server running at http://${hostname}:${port}`);
});
