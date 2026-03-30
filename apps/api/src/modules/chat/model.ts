import { Elysia, t } from "elysia";

import { table } from "$api/db/schema";
import { spread } from "$api/db/utils";

const chatSelect = spread(table.chat, "select");
const chatInsert = spread(table.chat, "insert");

const ChatParams = t.Object({
  id: chatSelect.id,
});

const ChatMessageBody = t.Object({
  id: chatSelect.id,
  model: t.String({ minLength: 1 }),
  messages: t.Array(t.Any()),
});
const ChatUpdateTitleBody = t.Object({
  title: chatInsert.title,
});

const ChatListResponse = t.Array(
  t.Object({
    id: chatSelect.id,
    title: chatSelect.title,
    updatedAt: chatSelect.updatedAt,
  })
);
const ChatTitleResponse = t.Object({
  id: chatSelect.id,
  title: chatSelect.title,
});
const ChatIdResponse = t.Object({
  id: chatSelect.id,
});

const ChatError = t.Object({
  message: t.String(),
});

export const models = {
  "Chat.Params": ChatParams,
  "Chat.SendMessage": ChatMessageBody,
  "Chat.UpdateTitle": ChatUpdateTitleBody,
  "Chat.ListResponse": ChatListResponse,
  "Chat.TitleResponse": ChatTitleResponse,
  "Chat.IdResponse": ChatIdResponse,
  "Chat.Error": ChatError,
};

export const chatModel = new Elysia({ name: "model.chat" }).model(models);
