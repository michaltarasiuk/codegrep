import { t, type UnwrapSchema } from "elysia";

export const ChatModel = {
  chatParams: t.Object({
    chatId: t.String({ minLength: 1 }),
  }),
  sendMessage: t.Object({
    chatId: t.String({ minLength: 1 }),
    model: t.String({ minLength: 1 }),
    messages: t.Array(t.Any()),
  }),
  createResponse: t.Object({
    id: t.String(),
  }),
  errorMessage: t.String(),
} as const;

export type ChatModel = {
  [K in keyof typeof ChatModel]: UnwrapSchema<(typeof ChatModel)[K]>;
};
