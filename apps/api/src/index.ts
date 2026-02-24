import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";

import { authPlugin } from "./modules/auth";
import { chatPlugin } from "./modules/chat";

const app = new Elysia().use(cors()).use(authPlugin).use(chatPlugin);

app.listen(process.env.PORT, ({ hostname, port }) => {
  console.log(`Server running at http://${hostname}:${port}`);
});
