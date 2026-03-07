import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { anonymous } from "better-auth/plugins";
import { eq } from "drizzle-orm";

import { db } from "$api/db";
import { account, chat, session, user, verification } from "$api/db/schema";

export const authService = betterAuth({
  trustedOrigins: [process.env.WEB_URL],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user,
      session,
      account,
      verification,
    },
  }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
  },
  plugins: [
    anonymous({
      onLinkAccount: async ({ anonymousUser, newUser }) => {
        await db
          .update(chat)
          .set({ userId: newUser.user.id })
          .where(eq(chat.userId, anonymousUser.user.id));
      },
    }),
  ],
});
