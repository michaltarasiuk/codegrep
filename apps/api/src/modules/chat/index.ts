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

export const chatPlugin = new Elysia({ name: "chat", prefix: "/chat" })
  .use(sessionPlugin)
  .get("/", async ({ user }) => {
    const result = await ChatService.listByUser({
      userId: user.id,
    });
    return result;
  })
  .get(
    "/:id/messages",
    async ({ params: { id: chatId }, user }) => {
      const result = await ChatService.getMessages({
        chatId,
        userId: user.id,
      });
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
    async ({ body: { id: chatId, model, messages }, user }) => {
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
      body: ChatModel.sendMessageBody,
    }
  )
  .post(
    "/create",
    async ({ body: { title }, user }) => {
      const result = await ChatService.create({
        title,
        userId: user.id,
      });
      if (result instanceof CreateFailedError) {
        return status(500, result.message);
      }
      return result;
    },
    {
      body: ChatModel.createChatBody,
      response: {
        200: ChatModel.createChatResponse,
        500: ChatModel.errorMessage,
      },
    }
  );
