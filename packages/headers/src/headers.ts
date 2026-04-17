/*!---------------------------------------------------------------------------------------------
 * Copyright (c) 2023 Michael Jackson. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *
 * Ported from https://github.com/mjackson/remix-the-web/tree/main/packages/headers
 *--------------------------------------------------------------------------------------------*/

export { Accept, type AcceptInit } from "./lib/accept.js";
export {
  AcceptEncoding,
  type AcceptEncodingInit,
} from "./lib/accept-encoding.js";
export {
  AcceptLanguage,
  type AcceptLanguageInit,
} from "./lib/accept-language.js";
export { CacheControl, type CacheControlInit } from "./lib/cache-control.js";
export {
  ContentDisposition,
  type ContentDispositionInit,
} from "./lib/content-disposition.js";
export { ContentType, type ContentTypeInit } from "./lib/content-type.js";
export { Cookie, type CookieInit } from "./lib/cookie.js";
export { IfNoneMatch, type IfNoneMatchInit } from "./lib/if-none-match.js";
export { SetCookie, type SetCookieInit } from "./lib/set-cookie.js";
export {
  SuperHeaders as default,
  SuperHeaders,
  type SuperHeadersInit,
} from "./lib/super-headers.js";
