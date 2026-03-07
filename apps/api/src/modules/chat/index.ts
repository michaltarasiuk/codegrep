import { createGroq } from "@ai-sdk/groq";
import { convertToModelMessages, streamText } from "ai";
import { Elysia, status } from "elysia";

import { CreateFailedError, NotFoundError } from "$api/errors";

import { sessionPlugin } from "../auth/session";
import { ChatModel } from "./model";
import { ChatService } from "./service";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export const chatPlugin = new Elysia({
  name: "chat",
  prefix: "/api/chat",
})
  .use(sessionPlugin)
  .get(
    "/:chatId/messages",
    async ({ params: { chatId }, user }) => {
      const result = await ChatService.getMessages(chatId, user.id);

      if (result instanceof NotFoundError) {
        return status(404, result.message);
      }

      return result;
    },
    {
      params: ChatModel.chatParams,
    }
  )
  .post(
    "/",
    async ({ body: { chatId, model, messages }, user }) => {
      const result = streamText({
        model: groq(model),
        messages: await convertToModelMessages(messages),
      });

      return result.toUIMessageStreamResponse({
        originalMessages: messages,
        onFinish: async ({ messages: newMessages }) => {
          const saved = await ChatService.saveMessages({
            chatId,
            userId: user.id,
            messages: newMessages,
          });

          if (saved instanceof NotFoundError) {
            console.error("Failed to save messages:", saved.message);
          }
        },
      });
    },
    {
      body: ChatModel.sendMessage,
    }
  )
  .post(
    "/create",
    async ({ user }) => {
      const result = await ChatService.create(user.id);

      if (result instanceof CreateFailedError) {
        return status(500, result.message);
      }

      return { id: result.id };
    },
    {
      response: {
        200: ChatModel.createResponse,
        500: ChatModel.errorMessage,
      },
    }
  );
