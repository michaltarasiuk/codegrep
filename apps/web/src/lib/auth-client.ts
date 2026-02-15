import { createAuthClient } from "better-auth/react";
import { env } from "./env";

export const { signIn } = createAuthClient({
  baseURL: env.VITE_API_URL,
});
