import { error, redirect } from "@sveltejs/kit";

import { client } from "$lib/utils/client";

export const prerender = false;

export async function load({ request }) {
  const chat = await client.api.chat.create.post(
    {},
    {
      headers: Object.fromEntries(request.headers),
    }
  );

  if (!chat.error) {
    redirect(302, `/chat/${chat.data.id}`);
  }

  error(500, "Unable to create chat");
}
