import { t } from "elysia";

export namespace ChatModel {
  const Id = t.String({ minLength: 1 });
  const Title = t.String({ minLength: 1 });

  export const Params = t.Object({ id: Id });

  export const List = t.Array(
    t.Object({
      id: t.String(),
      title: t.String(),
      updatedAt: t.Date(),
    })
  );

  export const Create = t.Object({ title: Title });
  export const Edit = t.Object({ title: Title });

  export const IdResponse = t.Object({ id: t.String() });
  export const EditResponse = t.Object({ id: t.String(), title: t.String() });

  export const SendMessage = t.Object({
    id: Id,
    model: t.String({ minLength: 1 }),
    messages: t.Array(t.Any()),
  });

  export const Error = t.String();
}
