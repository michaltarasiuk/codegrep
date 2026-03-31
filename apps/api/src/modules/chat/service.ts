import { generateId, type UIMessage } from "ai";
import { and, asc, desc, eq, sql } from "drizzle-orm";

import { db } from "$api/db";
import { chat, message } from "$api/db/schema";
import { CreateFailedError, NotFoundError } from "$api/errors";
import { isDefined } from "$api/utils/is-defined";

export abstract class ChatService {
  static async findFirst({
    where: { chatId, userId },
  }: {
    where: {
      chatId: string;
      userId: string;
    };
  }) {
    const [found] = await db
      .select()
      .from(chat)
      .where(and(eq(chat.id, chatId), eq(chat.userId, userId)))
      .limit(1);
    return found;
  }

  static async findMany({
    where: { userId },
  }: {
    where: {
      userId: string;
    };
  }) {
    return db
      .select({
        id: chat.id,
        title: chat.title,
        shareId: chat.shareId,
        updatedAt: chat.updatedAt,
      })
      .from(chat)
      .where(eq(chat.userId, userId))
      .orderBy(desc(chat.updatedAt));
  }

  static async findManyMessages({
    where: { chatId, userId },
  }: {
    where: {
      chatId: string;
      userId: string;
    };
  }) {
    const found = await this.findFirst({
      where: {
        chatId,
        userId,
      },
    });
    if (!isDefined(found)) {
      return new NotFoundError({
        resource: "chat",
        id: chatId,
      });
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
          id: `${chatId}:${generateId()}`,
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
      return new CreateFailedError({
        resource: "chat",
      });
    }
    return created;
  }

  static async findOrCreate({
    title,
    chatId,
    userId,
  }: {
    title: string;
    chatId: string;
    userId: string;
  }) {
    const found = await this.findFirst({
      where: {
        chatId,
        userId,
      },
    });
    if (isDefined(found)) {
      return found;
    }
    return this.create({
      title,
      chatId,
      userId,
    });
  }

  static async update({
    title,
    where: { chatId, userId },
  }: {
    title: string;
    where: {
      chatId: string;
      userId: string;
    };
  }) {
    const [updated] = await db
      .update(chat)
      .set({ title })
      .where(and(eq(chat.id, chatId), eq(chat.userId, userId)))
      .returning({ id: chat.id, title: chat.title });
    if (!isDefined(updated)) {
      return new NotFoundError({
        resource: "chat",
        id: chatId,
      });
    }
    return updated;
  }

  static async setMessages({
    messages,
    chatId,
    userId,
  }: {
    messages: UIMessage[];
    chatId: string;
    userId: string;
  }) {
    const found = await this.findFirst({
      where: {
        chatId,
        userId,
      },
    });
    if (!isDefined(found)) {
      return new NotFoundError({ resource: "chat", id: chatId });
    }
    const seen = new Set<string>();
    const inserts: (typeof message.$inferInsert)[] = [];
    for (const message of messages) {
      let id = `${chatId}:${message.id}`;
      while (seen.has(id)) {
        id = `${chatId}:${generateId()}`;
      }
      seen.add(id);
      inserts.push({
        id,
        chatId,
        role: message.role,
        metadata: message.metadata,
        parts: message.parts,
      });
    }
    await db.transaction(async (tx) => {
      await tx.delete(message).where(eq(message.chatId, chatId));
      await tx.insert(message).values(inserts);
    });
    return { id: chatId };
  }

  static async share({
    where: { chatId, userId },
  }: {
    where: {
      chatId: string;
      userId: string;
    };
  }) {
    const [shared] = await db
      .update(chat)
      .set({ shareId: sql`coalesce(${chat.shareId}, ${generateId()})` })
      .where(and(eq(chat.id, chatId), eq(chat.userId, userId)))
      .returning({ id: chat.id, shareId: chat.shareId });
    if (!isDefined(shared)) {
      return new NotFoundError({
        resource: "chat",
        id: chatId,
      });
    }
    return shared;
  }

  static async unshare({
    where: { chatId, userId },
  }: {
    where: {
      chatId: string;
      userId: string;
    };
  }) {
    const [unshared] = await db
      .update(chat)
      .set({ shareId: null })
      .where(and(eq(chat.id, chatId), eq(chat.userId, userId)))
      .returning({ id: chat.id });
    if (!isDefined(unshared)) {
      return new NotFoundError({
        resource: "chat",
        id: chatId,
      });
    }
    return unshared;
  }

  static async delete({
    where: { chatId, userId },
  }: {
    where: {
      chatId: string;
      userId: string;
    };
  }) {
    const [deleted] = await db
      .delete(chat)
      .where(and(eq(chat.id, chatId), eq(chat.userId, userId)))
      .returning({ id: chat.id });
    if (!isDefined(deleted)) {
      return new NotFoundError({
        resource: "chat",
        id: chatId,
      });
    }
    return deleted;
  }
}
