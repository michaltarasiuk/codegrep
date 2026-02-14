import { z } from "zod";

const EnvSchema = z.object({
  VITE_API_URL: z.url(),
});

export const env = EnvSchema.parse(getViteEnv());

function getViteEnv() {
  return {
    VITE_API_URL: import.meta.env.VITE_API_URL,
  };
}
