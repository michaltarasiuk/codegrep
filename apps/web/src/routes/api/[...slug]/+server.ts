import { API_URL } from "$env/static/private";
import { createFetchProxy } from "$lib/utils/fetch-proxy.js";

import type { RequestHandler } from "./$types";

const proxy = createFetchProxy(API_URL);

const handler: RequestHandler = ({ request }) => proxy(request);

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;
