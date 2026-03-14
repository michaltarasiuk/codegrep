import { generateId, type UIMessage } from "ai";
import { and, asc, desc, eq } from "drizzle-orm";

import { db } from "$api/db";
import { chat, message } from "$api/db/schema";
import { CreateFailedError, NotFoundError } from "$api/errors";
import { isDefined } from "$api/is-defined";

export abstract class ChatService {
  static async getById({ chatId, userId }: { chatId: string; userId: string }) {
    const [found = null] = await db
      .select()
      .from(chat)
      .where(and(eq(chat.id, chatId), eq(chat.userId, userId)))
      .limit(1);

    return found;
  }

  static async listByUser({ userId }: { userId: string }) {
    return db
      .select({
        id: chat.id,
        title: chat.title,
      })
      .from(chat)
      .where(eq(chat.userId, userId))
      .orderBy(desc(chat.updatedAt));
  }

  static async getMessages({
    chatId,
    userId,
  }: {
    chatId: string;
    userId: string;
  }) {
    const found = await this.getById({
      chatId,
      userId,
    });

    if (!isDefined(found)) {
      return new NotFoundError({ resource: "chat", id: chatId });
    }

    return db
      .select()
      .from(message)
      .where(eq(message.chatId, chatId))
      .orderBy(asc(message.createdAt));
  }

  static async create({ title, userId }: { title: string; userId: string }) {
    const chatId = generateId();
    const messageId = `${chatId}:${generateId()}`;

    const created = await db.transaction(async (tx) => {
      const [createdChat] = await tx
        .insert(chat)
        .values({ id: chatId, title, userId })
        .returning({ id: chat.id });

      if (!isDefined(createdChat)) {
        return null;
      }

      const [createdMessage] = await tx
        .insert(message)
        .values({
          id: messageId,
          chatId,
          role: "user",
          parts: [{ type: "text", text: title }],
        })
        .returning({ id: message.id });

      if (!isDefined(createdMessage)) {
        return null;
      }

      return createdChat;
    });

    if (!isDefined(created)) {
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
    const found = await this.getById({
      chatId,
      userId,
    });

    if (!isDefined(found)) {
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
