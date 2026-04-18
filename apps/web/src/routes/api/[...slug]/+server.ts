import { createFetchProxy } from "@workspace/fetch-proxy";

import { API_URL } from "$env/static/private";

import type { RequestHandler } from "./$types";

let proxy = createFetchProxy(API_URL);

let handler: RequestHandler = ({ request }) => proxy(request);

export let GET = handler;
export let POST = handler;
export let PUT = handler;
export let PATCH = handler;
export let DELETE = handler;
export let OPTIONS = handler;
