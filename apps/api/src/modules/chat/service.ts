import { generateId, type UIMessage } from "ai";
import { and, asc, eq } from "drizzle-orm";

import { db } from "$api/db";
import { chat, message } from "$api/db/schema";
import { CreateFailedError, NotFoundError } from "$api/errors";

export abstract class ChatService {
  static async getById(chatId: string, userId: string) {
    const [found = null] = await db
      .select()
      .from(chat)
      .where(and(eq(chat.id, chatId), eq(chat.userId, userId)))
      .limit(1);

    return found;
  }

  static async getMessages(chatId: string, userId: string) {
    const found = await this.getById(chatId, userId);

    if (!found) {
      return new NotFoundError({ resource: "chat", id: chatId });
    }

    return db
      .select()
      .from(message)
      .where(eq(message.chatId, chatId))
      .orderBy(asc(message.createdAt));
  }

  static async create(userId: string) {
    const [created] = await db
      .insert(chat)
      .values({ id: generateId(), userId })
      .returning({ id: chat.id });

    if (!created) {
      return new CreateFailedError({ resource: "chat" });
    }

    return created;
  }

  static async saveMessages({
    chatId,
    userId,
    messages,
  }: {
    chatId: string;
    userId: string;
    messages: UIMessage[];
  }) {
    const found = await this.getById(chatId, userId);

    if (!found) {
      return new NotFoundError({ resource: "chat", id: chatId });
    }

    const seen = new Set<string>();
    const inserts: (typeof message.$inferInsert)[] = [];

    for (const m of messages) {
      let id = `${chatId}:${m.id}`;

      while (seen.has(id)) {
        id = `${chatId}:${generateId()}`;
      }
      seen.add(id);

      inserts.push({
        id,
        chatId,
        role: m.role,
        metadata: m.metadata,
        parts: m.parts,
      });
    }

    await db.transaction(async (tx) => {
      await tx.delete(message).where(eq(message.chatId, chatId));
      await tx.insert(message).values(inserts);
    });
  }
}
