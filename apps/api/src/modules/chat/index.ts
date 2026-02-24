import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { Elysia } from "elysia";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export const chatPlugin = new Elysia({
  name: "chat",
  prefix: "/api/chat",
}).post("/", async ({ body }) => {
  const { messages } = body as { messages: UIMessage[] };
  const result = streamText({
    model: google("gemini-2.5-flash"),
    messages: await convertToModelMessages(messages),
  });
  return result.toUIMessageStreamResponse();
});
