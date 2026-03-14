import { t, type UnwrapSchema } from "elysia";

export const ChatModel = {
  chatParams: t.Object({
    id: t.String({ minLength: 1 }),
  }),
  listChatsResponse: t.Array(
    t.Object({
      id: t.String(),
      title: t.String(),
      updatedAt: t.Date(),
    })
  ),
  createChatBody: t.Object({
    title: t.String({ minLength: 1 }),
  }),
  createChatResponse: t.Object({
    id: t.String(),
  }),
  sendMessageBody: t.Object({
    id: t.String({ minLength: 1 }),
    model: t.String({ minLength: 1 }),
    messages: t.Array(t.Any()),
  }),
  errorMessage: t.String(),
} as const;

export type ChatModel = {
  [K in keyof typeof ChatModel]: UnwrapSchema<(typeof ChatModel)[K]>;
};
