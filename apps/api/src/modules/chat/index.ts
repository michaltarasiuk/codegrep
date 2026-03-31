import { convertToModelMessages, streamText } from "ai";
import { Elysia, status } from "elysia";

import { CreateFailedError, NotFoundError } from "$api/errors";
import { getFirstUserText } from "$api/utils/get-first-user-text";
import { isDefined } from "$api/utils/is-defined";

import { sessionPlugin } from "../auth/session";
import { chatModel } from "./model";
import { groqProvider } from "./provider";
import { ChatService } from "./service";

export const chatPlugin = new Elysia({ name: "chat", prefix: "/chat" })
  .use(sessionPlugin)
  .use(chatModel)
  .get(
    "/",
    async ({ user }) => {
      const result = await ChatService.findMany({
        where: { userId: user.id },
      });
      return result;
    },
    {
      response: "Chat.ListResponse",
    }
  )
  .get(
    "/:id/messages",
    async ({ params: { id: chatId }, user }) => {
      const result = await ChatService.findManyMessages({
        where: { chatId, userId: user.id },
      });
      if (result instanceof NotFoundError) {
        return status(404, { message: result.message });
      }
      return result;
    },
    {
      params: "Chat.Params",
    }
  )
  .post(
    "/",
    async ({ body: { id: chatId, model, messages }, user }) => {
      const chat = await ChatService.findOrCreate({
        title: getFirstUserText(messages),
        chatId,
        userId: user.id,
      });
      if (chat instanceof CreateFailedError) {
        return status(500, { message: chat.message });
      }
      const result = streamText({
        model: groqProvider(model),
        messages: await convertToModelMessages(messages),
        ...(isDefined(user.personalInstructions) && {
          system: user.personalInstructions,
        }),
      });
      return result.toUIMessageStreamResponse({
        originalMessages: messages,
        onFinish: async ({ messages }) => {
          const saved = await ChatService.setMessages({
            messages,
            chatId,
            userId: user.id,
          });
          if (saved instanceof NotFoundError) {
            console.error(saved.message);
          }
        },
      });
    },
    {
      body: "Chat.SendMessage",
    }
  )
  .put(
    "/:id",
    async ({ params: { id: chatId }, body: { title }, user }) => {
      const result = await ChatService.updateTitle({
        title,
        where: {
          chatId,
          userId: user.id,
        },
      });
      if (result instanceof NotFoundError) {
        return status(404, { message: result.message });
      }
      return result;
    },
    {
      params: "Chat.Params",
      body: "Chat.UpdateTitle",
      response: {
        200: "Chat.TitleResponse",
        404: "Chat.Error",
      },
    }
  )
  .delete(
    "/:id",
    async ({ params: { id: chatId }, user }) => {
      const result = await ChatService.delete({
        where: {
          chatId,
          userId: user.id,
        },
      });
      if (result instanceof NotFoundError) {
        return status(404, { message: result.message });
      }
      return result;
    },
    {
      params: "Chat.Params",
      response: {
        200: "Chat.IdResponse",
        404: "Chat.Error",
      },
    }
  );
