import { isDefined } from "@workspace/shared/is-defined.js";
import { convertToModelMessages, streamText } from "ai";
import { Elysia, status } from "elysia";

import { NotFoundError, UpsertFailedError } from "$api/errors.js";
import { getFirstUserText } from "$api/utils/get-first-user-text.js";

import { sessionPlugin } from "../auth/session.js";
import { chatModel } from "./model.js";
import { groqProvider } from "./provider.js";
import { ChatService } from "./service.js";

export const chatPlugin = new Elysia({ name: "chat", prefix: "/chat" })
  .use(sessionPlugin)
  .use(chatModel)
  .get(
    "/",
    async ({ user }) =>
      await ChatService.findMany({
        userId: user.id,
      }),
    {
      response: "chat.list.response",
    }
  )
  .get(
    "/:id/messages",
    async ({ params: { id: chatId }, user }) => {
      const chatMessages = await ChatService.findMessages({
        chatId,
        userId: user.id,
      });
      if (chatMessages instanceof NotFoundError) {
        return status(404, {
          message: chatMessages.message,
        });
      }
      return chatMessages;
    },
    {
      params: "chat.messages.params",
      response: {
        200: "chat.messages.response",
        404: "chat.error",
      },
    }
  )
  .get(
    "/shared/:id/messages",
    async ({ params: { id: shareId } }) => {
      const chatMessages = await ChatService.findSharedMessages({
        shareId,
      });
      if (chatMessages instanceof NotFoundError) {
        return status(404, {
          message: chatMessages.message,
        });
      }
      return chatMessages;
    },
    {
      params: "chat.shared.messages.params",
      response: {
        200: "chat.shared.messages.response",
        404: "chat.error",
      },
    }
  )
  .post(
    "/",
    async ({ body: { id: chatId, model, messages }, user }) => {
      const chat = await ChatService.upsert({
        title: getFirstUserText(messages),
        chatId,
        userId: user.id,
      });
      if (chat instanceof UpsertFailedError) {
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
          const chatMessages = await ChatService.setMessages({
            messages,
            chatId,
            userId: user.id,
          });
          if (chatMessages instanceof NotFoundError) {
            console.error(chatMessages.message);
          }
        },
      });
    },
    {
      body: "chat.message.body",
    }
  )
  .put(
    "/:id",
    async ({ params: { id: chatId }, body: { title }, user }) => {
      const updatedChat = await ChatService.update({
        title,
        chatId,
        userId: user.id,
      });
      if (updatedChat instanceof NotFoundError) {
        return status(404, {
          message: updatedChat.message,
        });
      }
      return updatedChat;
    },
    {
      params: "chat.update.params",
      body: "chat.update.body",
      response: {
        200: "chat.update.response",
        404: "chat.error",
      },
    }
  )
  .put(
    "/:id/share",
    async ({ params: { id: chatId }, user }) => {
      const sharedChat = await ChatService.share({
        chatId,
        userId: user.id,
      });
      if (sharedChat instanceof NotFoundError) {
        return status(404, {
          message: sharedChat.message,
        });
      }
      return sharedChat;
    },
    {
      params: "chat.share.params",
      response: {
        200: "chat.share.response",
        404: "chat.error",
      },
    }
  )
  .put(
    "/:id/unshare",
    async ({ params: { id: chatId }, user }) => {
      const unsharedChat = await ChatService.unshare({
        chatId,
        userId: user.id,
      });
      if (unsharedChat instanceof NotFoundError) {
        return status(404, {
          message: unsharedChat.message,
        });
      }
      return unsharedChat;
    },
    {
      params: "chat.unshare.params",
      response: {
        200: "chat.unshare.response",
        404: "chat.error",
      },
    }
  )
  .put(
    "/unshare-all",
    async ({ user }) =>
      await ChatService.unshareAll({
        userId: user.id,
      }),
    {
      response: "chat.unshare-all.response",
    }
  )
  .delete(
    "/:id",
    async ({ params: { id: chatId }, user }) => {
      const deletedChat = await ChatService.delete({
        chatId,
        userId: user.id,
      });
      if (deletedChat instanceof NotFoundError) {
        return status(404, {
          message: deletedChat.message,
        });
      }
      return deletedChat;
    },
    {
      params: "chat.delete.params",
      response: {
        200: "chat.delete.response",
        404: "chat.error",
      },
    }
  );
