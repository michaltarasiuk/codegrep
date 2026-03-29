import { convertToModelMessages, streamText } from "ai";
import { Elysia, status } from "elysia";

import { CreateFailedError, NotFoundError } from "$api/errors";
import { getFirstUserText } from "$api/utils/get-first-user-text";
import { isDefined } from "$api/utils/is-defined";

import { sessionPlugin } from "../auth/session";
import { ChatModel } from "./model";
import { groqProvider } from "./provider";
import { ChatService } from "./service";

export const chatPlugin = new Elysia({ name: "chat", prefix: "/chat" })
  .use(sessionPlugin)
  .get("/", async ({ user }) => {
    const result = await ChatService.list({
      userId: user.id,
    });
    return result;
  })
  .get(
    "/:id/messages",
    async ({ params: { id: chatId }, user }) => {
      const result = await ChatService.listMessages({
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
      const chat = await ChatService.findOrCreate({
        title: getFirstUserText(messages),
        chatId,
        userId: user.id,
      });
      if (chat instanceof CreateFailedError) {
        return status(500, chat.message);
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
      body: ChatModel.SendMessage,
    }
  )
  .put(
    "/:id",
    async ({ params: { id: chatId }, body: { title }, user }) => {
      const result = await ChatService.updateTitle({
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
