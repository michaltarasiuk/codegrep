import { t } from "elysia";

export namespace ChatModel {
  const Id = t.String({ minLength: 1 });
  const Title = t.String({ minLength: 1 });

  export const Params = t.Object({ id: Id });

  export const List = t.Array(
    t.Object({
      id: Id,
      title: Title,
      updatedAt: t.Date(),
    })
  );

  export const Create = t.Object({ title: Title });
  export const Edit = t.Object({ title: Title });

  export const IdResponse = t.Object({ id: Id });
  export const EditResponse = t.Object({ id: Id, title: Title });

  export const SendMessage = t.Object({
    id: Id,
    model: t.String({ minLength: 1 }),
    messages: t.Array(t.Any()),
  });

  export const Error = t.String();
}
