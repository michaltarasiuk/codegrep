import { z } from "zod";

const EnvSchema = z.object({
  SERVER_PORT: z
    .string()
    .transform(Number)
    .pipe(z.number().int().positive().max(65_535)),
  DATABASE_URL: z.url(),
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.url(),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
});

export const env = EnvSchema.parse(process.env);
