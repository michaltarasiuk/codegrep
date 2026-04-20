import { createFetchProxy } from "@workspace/fetch-proxy";

import { API_URL } from "$env/static/private";

import type { RequestHandler } from "./$types";

let proxy = createFetchProxy(API_URL);

let handler: RequestHandler = ({ request }) => proxy(request);

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;
