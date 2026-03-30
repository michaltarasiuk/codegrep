import { t } from "elysia";

import { table } from "$api/db/schema";
import { spread } from "$api/db/utils";

const chatSelect = spread(table.chat, "select");
const chatInsert = spread(table.chat, "insert");

export namespace ChatModel {
  export const Params = t.Object({
    id: chatSelect.id,
  });

  export const MessageBody = t.Object({
    id: chatSelect.id,
    model: t.String({ minLength: 1 }),
    messages: t.Array(t.Any()),
  });
  export const EditBody = t.Object({
    title: chatInsert.title,
  });

  export const List = t.Array(
    t.Object({
      id: chatSelect.id,
      title: chatSelect.title,
      updatedAt: chatSelect.updatedAt,
    })
  );

  export const IdResponse = t.Object({
    id: chatSelect.id,
  });
  export const EditResponse = t.Object({
    id: chatSelect.id,
    title: chatSelect.title,
  });

  export const Error = t.String();
}
