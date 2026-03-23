import { generateId, type UIMessage } from "ai";
import { and, asc, desc, eq } from "drizzle-orm";

import { db } from "$api/db";
import { chat, message } from "$api/db/schema";
import {
  CreateFailedError,
  NotFoundError,
  NoUserMessageError,
} from "$api/errors";
import { isDefined } from "$api/utils/is-defined";

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

  static async create({
    title,
    chatId,
    userId,
  }: {
    title: string;
    chatId: string;
    userId: string;
  }) {
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

  static async createIfNotExists({
    generateTitle,
    chatId,
    userId,
  }: {
    generateTitle: () => Promise<string | NoUserMessageError>;
    chatId: string;
    userId: string;
  }) {
    let chat: { id: string } | null = await this.getById({
      chatId,
      userId,
    });
    if (!isDefined(chat)) {
      const title = await generateTitle();
      if (title instanceof NoUserMessageError) {
        return title;
      }
      const created = await this.create({
        title,
        chatId,
        userId,
      });
      if (created instanceof CreateFailedError) {
        return created;
      } else {
        chat = created;
      }
    }
    return chat;
  }

  static async editTitle({
    title,
    chatId,
    userId,
  }: {
    title: string;
    chatId: string;
    userId: string;
  }) {
    const [updated = null] = await db
      .update(chat)
      .set({ title })
      .where(and(eq(chat.id, chatId), eq(chat.userId, userId)))
      .returning({ id: chat.id, title: chat.title });

    if (!isDefined(updated)) {
      return new NotFoundError({ resource: "chat", id: chatId });
    }

    return updated;
  }

  static async delete({ chatId, userId }: { chatId: string; userId: string }) {
    const [deleted = null] = await db
      .delete(chat)
      .where(and(eq(chat.id, chatId), eq(chat.userId, userId)))
      .returning({ id: chat.id });

    if (!isDefined(deleted)) {
      return new NotFoundError({ resource: "chat", id: chatId });
    }

    return deleted;
  }

  static async saveMessages({
    messages,
    chatId,
    userId,
  }: {
    messages: UIMessage[];
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
