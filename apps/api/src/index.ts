import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";

import { authPlugin } from "./modules/auth";

const app = new Elysia().use(cors()).use(authPlugin);

app.listen(process.env.PORT, ({ hostname, port }) => {
  console.log(`Server running at http://${hostname}:${port}`);
});
