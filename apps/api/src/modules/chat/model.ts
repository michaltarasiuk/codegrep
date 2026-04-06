import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { Elysia, t } from "elysia";

import { chat } from "$api/db/schema";

const chatSelect = createSelectSchema(chat);
const chatInsert = createInsertSchema(chat);

const select = chatSelect.properties;

const Chat = t.Pick(chatSelect, ["id", "title", "shareId", "updatedAt"]);
const ChatModel = t.String({ minLength: 1 });
const ChatMessage = t.Object(
  {
    id: t.String(),
    role: t.Union([
      t.Literal("system"),
      t.Literal("user"),
      t.Literal("assistant"),
    ]),
    metadata: t.Optional(t.Any()),
    parts: t.Array(t.Any()),
  },
  { additionalProperties: true }
);

export const chatModel = new Elysia({ name: "model.chat" }).model({
  "chat.list.response": t.Array(Chat),

  "chat.messages.params": t.Pick(chatSelect, ["id"]),
  "chat.messages.response": t.Array(ChatMessage),

  "chat.shared.messages.params": t.Object({
    id: t.Exclude(select.shareId, t.Null()),
  }),
  "chat.shared.messages.response": t.Array(ChatMessage),

  "chat.message.body": t.Object({
    id: select.id,
    model: ChatModel,
    messages: t.Array(ChatMessage),
  }),

  "chat.update.params": t.Pick(chatSelect, ["id"]),
  "chat.update.body": t.Pick(chatInsert, ["title"]),
  "chat.update.response": t.Pick(chatInsert, ["id", "title"]),

  "chat.share.params": t.Pick(chatInsert, ["id"]),
  "chat.share.response": t.Pick(chatInsert, ["id", "shareId"]),

  "chat.unshare.params": t.Pick(chatInsert, ["id"]),
  "chat.unshare.response": t.Pick(chatInsert, ["id", "shareId"]),

  "chat.unshare-all.response": t.Object({
    count: t.Integer(),
  }),

  "chat.delete.params": t.Pick(chatSelect, ["id"]),
  "chat.delete.response": t.Pick(chatSelect, ["id"]),

  "chat.error": t.Object({
    message: t.String(),
  }),
});
