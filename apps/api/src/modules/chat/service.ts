import { generateId, type UIMessage } from "ai";
import { and, asc, desc, eq, isNull, not, sql } from "drizzle-orm";

import { db } from "$api/db";
import { chat, message } from "$api/db/schema";
import { NotFoundError, UpsertFailedError } from "$api/errors";
import { isDefined } from "$api/utils/is-defined";

export abstract class ChatService {
  static async findFirst({
    chatId,
    userId,
  }: {
    chatId: string;
    userId: string;
  }) {
    const [found] = await db
      .select()
      .from(chat)
      .where(and(eq(chat.id, chatId), eq(chat.userId, userId)))
      .limit(1);
    return found;
  }

  static async findMany({ userId }: { userId: string }) {
    return await db
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

  static async findMessages({
    chatId,
    userId,
  }: {
    chatId: string;
    userId: string;
  }) {
    const messages = await db
      .select({
        id: message.id,
        role: message.role,
        parts: message.parts,
        createdAt: message.createdAt,
      })
      .from(message)
      .innerJoin(chat, eq(message.chatId, chat.id))
      .where(and(eq(message.chatId, chatId), eq(chat.userId, userId)))
      .orderBy(asc(message.createdAt));
    if (!messages.length) {
      return new NotFoundError({
        resource: "chat",
        id: chatId,
      });
    }
    return messages;
  }

  static async findSharedMessages({ shareId }: { shareId: string }) {
    const messages = await db
      .select({
        id: message.id,
        role: message.role,
        parts: message.parts,
        createdAt: message.createdAt,
      })
      .from(message)
      .innerJoin(chat, eq(message.chatId, chat.id))
      .where(eq(chat.shareId, shareId));
    if (!messages.length) {
      return new NotFoundError({
        resource: "chat",
        id: shareId,
      });
    }
    return messages;
  }

  static async upsert({
    title,
    chatId,
    userId,
  }: {
    title: string;
    chatId: string;
    userId: string;
  }) {
    const [upserted] = await db
      .insert(chat)
      .values({ id: chatId, title, userId })
      .onConflictDoUpdate({
        target: chat.id,
        set: { title },
      })
      .returning();
    if (!isDefined(upserted)) {
      return new UpsertFailedError({
        resource: "chat",
      });
    }
    return upserted;
  }

  static async update({
    title,
    chatId,
    userId,
  }: {
    title: string;
    chatId: string;
    userId: string;
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
    return await db.transaction(async (tx) => {
      const found = this.findFirst({
        chatId,
        userId,
      });
      if (!found) {
        return new NotFoundError({
          resource: "chat",
          id: chatId,
        });
      }
      const inserts = messages.map((m) => ({
        id: `${chatId}:${m.id}`,
        chatId,
        role: m.role,
        metadata: m.metadata,
        parts: m.parts,
      }));
      await tx
        .insert(message)
        .values(inserts)
        .onConflictDoUpdate({
          target: message.id,
          set: {
            role: sql`excluded.role`,
            metadata: sql`excluded.metadata`,
            parts: sql`excluded.parts`,
          },
        });

      return { id: chatId };
    });
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

  static async unshareAll({
    where: { userId },
  }: {
    where: { userId: string };
  }) {
    const unshared = await db
      .update(chat)
      .set({ shareId: null })
      .where(and(eq(chat.userId, userId), not(isNull(chat.shareId))))
      .returning({ id: chat.id });
    return { count: unshared.length };
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
