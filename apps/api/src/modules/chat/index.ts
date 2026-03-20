import { convertToModelMessages, streamText } from "ai";
import { Elysia, status } from "elysia";

import { CreateFailedError, NotFoundError } from "$api/errors";

import { sessionPlugin } from "../auth/session";
import { ai } from "./ai";
import { ChatModel } from "./model";
import { ChatService } from "./service";

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
      params: ChatModel.Params,
    }
  )
  .post(
    "/",
    async ({ body: { id: chatId, model, messages }, user }) => {
      const result = streamText({
        model: ai(model),
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
      body: ChatModel.SendMessage,
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
      body: ChatModel.Create,
      response: {
        200: ChatModel.IdResponse,
        500: ChatModel.Error,
      },
    }
  )
  .put(
    "/:id",
    async ({ params: { id: chatId }, body: { title }, user }) => {
      const result = await ChatService.editName({
        title,
        chatId,
        userId: user.id,
      });
      if (result instanceof NotFoundError) {
        return status(404, result.message);
      }
      return result;
    },
    {
      params: ChatModel.Params,
      body: ChatModel.Edit,
      response: {
        200: ChatModel.EditResponse,
        404: ChatModel.Error,
      },
    }
  )
  .delete(
    "/:id",
    async ({ params: { id: chatId }, user }) => {
      const result = await ChatService.delete({
        chatId,
        userId: user.id,
      });
      if (result instanceof NotFoundError) {
        return status(404, result.message);
      }
      return result;
    },
    {
      params: ChatModel.Params,
      response: {
        200: ChatModel.IdResponse,
        404: ChatModel.Error,
      },
    }
  );
