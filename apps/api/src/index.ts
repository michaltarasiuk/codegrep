import "dotenv/config";
import { type Context, Elysia } from "elysia";
import { auth } from "./lib/auth";
import { env } from "./lib/env";

function betterAuthView(context: Context) {
  const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET"];
  if (!BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
    context.set.status = 405;
    return "Method Not Allowed";
  }
  return auth.handler(context.request);
}

const app = new Elysia().all("/api/auth/*", betterAuthView).listen(3000);

app.listen(env.SERVER_PORT, ({ hostname, port }) => {
  console.log(`Server running at http://${hostname}:${port}`);
});
