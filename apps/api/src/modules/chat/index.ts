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
    async ({ user }) =>
      await ChatService.findMany({
        where: {
          userId: user.id,
        },
      }),
    {
      response: "Chat.ListResponse",
    }
  )
  .get(
    "/:id/messages",
    async ({ params: { id: chatId }, user }) => {
      const chatMessages = await ChatService.findManyMessages({
        where: {
          chatId,
          userId: user.id,
        },
      });
      if (chatMessages instanceof NotFoundError) {
        return status(404, {
          message: chatMessages.message,
        });
      }
      return chatMessages;
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
        return status(500, {
          message: chat.message,
        });
      }
      const stream = streamText({
        model: groqProvider(model),
        messages: await convertToModelMessages(messages),
        ...(isDefined(user.personalInstructions) && {
          system: user.personalInstructions,
        }),
      });
      return stream.toUIMessageStreamResponse({
        originalMessages: messages,
        onFinish: async ({ messages }) => {
          const saveMessagesResult = await ChatService.setMessages({
            messages,
            chatId,
            userId: user.id,
          });
          if (saveMessagesResult instanceof NotFoundError) {
            console.error(saveMessagesResult.message);
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
      const updatedChat = await ChatService.update({
        title,
        where: {
          chatId,
          userId: user.id,
        },
      });
      if (updatedChat instanceof NotFoundError) {
        return status(404, {
          message: updatedChat.message,
        });
      }
      return updatedChat;
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
      const deletedChat = await ChatService.delete({
        where: {
          chatId,
          userId: user.id,
        },
      });
      if (deletedChat instanceof NotFoundError) {
        return status(404, {
          message: deletedChat.message,
        });
      }
      return deletedChat;
    },
    {
      params: "Chat.Params",
      response: {
        200: "Chat.IdResponse",
        404: "Chat.Error",
      },
    }
  );
