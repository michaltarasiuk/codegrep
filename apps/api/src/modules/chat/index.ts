import { isDefined } from "@workspace/shared/is-defined.js";
import { convertToModelMessages, streamText } from "ai";
import { Elysia, status } from "elysia";

import { NotFoundError, UpsertFailedError } from "$api/errors.js";
import { getChatTitle } from "$api/utils/get-chat-title.js";

import { sessionPlugin } from "../auth/session.js";
import { chatModel } from "./model.js";
import { getChatModel } from "./provider.js";
import { ChatService } from "./service.js";

function notFound(error: NotFoundError) {
  return status(404, { message: error.message });
}

function upsertFailed(error: UpsertFailedError) {
  return status(500, { message: error.message });
}

export let chatPlugin = new Elysia({ name: "chat", prefix: "/chat" })
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
      let result = await ChatService.findMessages({
        chatId,
        userId: user.id,
      });
      if (result instanceof NotFoundError) {
        return notFound(result);
      }
      return result;
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
      let result = await ChatService.findSharedMessages({
        shareId,
      });
      if (result instanceof NotFoundError) {
        return notFound(result);
      }
      return result;
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
      let chat = await ChatService.upsert({
        title: getChatTitle(messages),
        chatId,
        userId: user.id,
      });
      if (chat instanceof UpsertFailedError) {
        return upsertFailed(chat);
      }
      let stream = streamText({
        model: getChatModel(model),
        messages: await convertToModelMessages(messages),
        ...(isDefined(user.personalInstructions) && {
          system: user.personalInstructions,
        }),
        onError({ error }) {
          console.error("chat stream error", error);
        },
      });
      return stream.toUIMessageStreamResponse({
        originalMessages: messages,
        onFinish: async ({ messages }) => {
          let result = await ChatService.setMessages({
            messages,
            chatId,
            userId: user.id,
          });
          if (result instanceof NotFoundError) {
            console.error(result.message);
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
      let result = await ChatService.update({
        title,
        chatId,
        userId: user.id,
      });
      if (result instanceof NotFoundError) {
        return notFound(result);
      }
      return result;
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
      let result = await ChatService.share({
        chatId,
        userId: user.id,
      });
      if (result instanceof NotFoundError) {
        return notFound(result);
      }
      return result;
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
      let result = await ChatService.unshare({
        chatId,
        userId: user.id,
      });
      if (result instanceof NotFoundError) {
        return notFound(result);
      }
      return result;
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
      let result = await ChatService.delete({
        chatId,
        userId: user.id,
      });
      if (result instanceof NotFoundError) {
        return notFound(result);
      }
      return result;
    },
    {
      params: "chat.delete.params",
      response: {
        200: "chat.delete.response",
        404: "chat.error",
      },
    }
  );
