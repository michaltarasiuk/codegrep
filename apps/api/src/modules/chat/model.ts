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
const ChatUpdateBody = t.Object({
  title: chatInsert.title,
});

const ChatMessagesResponse = t.Array(t.Any());
const ChatListResponse = t.Array(
  t.Object({
    id: chatSelect.id,
    title: chatSelect.title,
    shareId: chatSelect.shareId,
    updatedAt: chatSelect.updatedAt,
  })
);
const ChatUpdateResponse = t.Object({
  id: chatSelect.id,
  title: chatSelect.title,
});
const ChatShareResponse = t.Object({
  id: chatSelect.id,
  shareId: chatSelect.shareId,
});
const ChatIdResponse = t.Object({
  id: chatSelect.id,
});

const ChatError = t.Object({
  message: t.String(),
});

export const models = {
  "Chat.Params": ChatParams,
  "Chat.MessageBody": ChatMessageBody,
  "Chat.UpdateBody": ChatUpdateBody,
  "Chat.MessagesResponse": ChatMessagesResponse,
  "Chat.ListResponse": ChatListResponse,
  "Chat.UpdateResponse": ChatUpdateResponse,
  "Chat.ShareResponse": ChatShareResponse,
  "Chat.IdResponse": ChatIdResponse,
  "Chat.Error": ChatError,
};

export const chatModel = new Elysia({ name: "model.chat" }).model(models);
