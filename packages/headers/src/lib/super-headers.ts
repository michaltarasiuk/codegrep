import { Accept, type AcceptInit } from "./accept.js";
import { AcceptEncoding, type AcceptEncodingInit } from "./accept-encoding.js";
import { AcceptLanguage, type AcceptLanguageInit } from "./accept-language.js";
import { CacheControl, type CacheControlInit } from "./cache-control.js";
import {
  ContentDisposition,
  type ContentDispositionInit,
} from "./content-disposition.js";
import { ContentType, type ContentTypeInit } from "./content-type.js";
import { Cookie, type CookieInit } from "./cookie.js";
import { canonicalHeaderName } from "./header-names.js";
import { type HeaderValue } from "./header-value.js";
import { IfNoneMatch, type IfNoneMatchInit } from "./if-none-match.js";
import { SetCookie, type SetCookieInit } from "./set-cookie.js";
import { isIterable, quoteEtag } from "./utils.js";

type DateInit = number | Date;

interface SuperHeadersPropertyInit {
  /**
   * The [`Accept`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept) header value.
   */
  accept?: string | AcceptInit;
  /**
   * The [`Accept-Encoding`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding) header value.
   */
  acceptEncoding?: string | AcceptEncodingInit;
  /**
   * The [`Accept-Language`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language) header value.
   */
  acceptLanguage?: string | AcceptLanguageInit;
  /**
   * The [`Accept-Ranges`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Ranges) header value.
   */
  acceptRanges?: string;
  /**
   * The [`Age`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Age) header value.
   */
  age?: string | number;
  /**
   * The [`Cache-Control`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) header value.
   */
  cacheControl?: string | CacheControlInit;
  /**
   * The [`Connection`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Connection) header value.
   */
  connection?: string;
  /**
   * The [`Content-Disposition`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition) header value.
   */
  contentDisposition?: string | ContentDispositionInit;
  /**
   * The [`Content-Encoding`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding) header value.
   */
  contentEncoding?: string | string[];
  /**
   * The [`Content-Language`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Language) header value.
   */
  contentLanguage?: string | string[];
  /**
   * The [`Content-Length`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Length) header value.
   */
  contentLength?: string | number;
  /**
   * The [`Content-Type`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) header value.
   */
  contentType?: string | ContentTypeInit;
  /**
   * The [`Cookie`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cookie) header value.
   */
  cookie?: string | CookieInit;
  /**
   * The [`Date`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Date) header value.
   */
  date?: string | DateInit;
  /**
   * The [`ETag`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) header value.
   */
  etag?: string;
  /**
   * The [`Expires`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Expires) header value.
   */
  expires?: string | DateInit;
  /**
   * The [`Host`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Host) header value.
   */
  host?: string;
  /**
   * The [`If-Modified-Since`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Modified-Since) header value.
   */
  ifModifiedSince?: string | DateInit;
  /**
   * The [`If-None-Match`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-None-Match) header value.
   */
  ifNoneMatch?: string | string[] | IfNoneMatchInit;
  /**
   * The [`If-Unmodified-Since`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Unmodified-Since) header value.
   */
  ifUnmodifiedSince?: string | DateInit;
  /**
   * The [`Last-Modified`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Last-Modified) header value.
   */
  lastModified?: string | DateInit;
  /**
   * The [`Location`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Location) header value.
   */
  location?: string;
  /**
   * The [`Referer`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer) header value.
   */
  referer?: string;
  /**
   * The [`Set-Cookie`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie) header value(s).
   */
  setCookie?: string | (string | SetCookieInit)[];
}

export type SuperHeadersInit =
  | Iterable<[string, string]>
  | (SuperHeadersPropertyInit & Record<string, string | HeaderValue>);

const CR_LF = "\r\n";

const ACCEPT_KEY = "accept";
const ACCEPT_ENCODING_KEY = "accept-encoding";
const ACCEPT_LANGUAGE_KEY = "accept-language";
const ACCEPT_RANGES_KEY = "accept-ranges";
const AGE_KEY = "age";
const CACHE_CONTROL_KEY = "cache-control";
const CONNECTION_KEY = "connection";
const CONTENT_DISPOSITION_KEY = "content-disposition";
const CONTENT_ENCODING_KEY = "content-encoding";
const CONTENT_LANGUAGE_KEY = "content-language";
const CONTENT_LENGTH_KEY = "content-length";
const CONTENT_TYPE_KEY = "content-type";
const COOKIE_KEY = "cookie";
const DATE_KEY = "date";
const ETAG_KEY = "etag";
const EXPIRES_KEY = "expires";
const HOST_KEY = "host";
const IF_MODIFIED_SINCE_KEY = "if-modified-since";
const IF_NONE_MATCH_KEY = "if-none-match";
const IF_UNMODIFIED_SINCE_KEY = "if-unmodified-since";
const LAST_MODIFIED_KEY = "last-modified";
const LOCATION_KEY = "location";
const REFERER_KEY = "referer";
const SET_COOKIE_KEY = "set-cookie";

/**
 * An enhanced JavaScript `Headers` interface with type-safe access.
 *
 * [API Reference](https://github.com/mjackson/remix-the-web/tree/main/packages/headers)
 *
 * [MDN `Headers` Base Class Reference](https://developer.mozilla.org/en-US/docs/Web/API/Headers)
 */
export class SuperHeaders extends Headers {
  #map: Map<string, string | HeaderValue>;
  #setCookies: (string | SetCookie)[] = [];

  constructor(init?: string | SuperHeadersInit | Headers) {
    super();

    this.#map = new Map();

    if (init) {
      if (typeof init === "string") {
        let lines = init.split(CR_LF);
        for (let line of lines) {
          let match = line.match(/^([^:]+):(.*)/);
          if (match) {
            this.append(match[1]!.trim(), match[2]!.trim());
          }
        }
      } else if (isIterable(init)) {
        for (let [name, value] of init) {
          this.append(name, value);
        }
      } else if (typeof init === "object") {
        for (let name of Object.getOwnPropertyNames(init)) {
          let value = init[name]!;

          let descriptor = Object.getOwnPropertyDescriptor(
            SuperHeaders.prototype,
            name
          );
          if (descriptor?.set) {
            descriptor.set.call(this, value);
          } else {
            this.set(name, value.toString());
          }
        }
      }
    }
  }

  /**
   * Appends a new header value to the existing set of values for a header,
   * or adds the header if it does not already exist.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/Headers/append)
   */
  append(name: string, value: string): void {
    let key = name.toLowerCase();
    if (key === SET_COOKIE_KEY) {
      this.#setCookies.push(value);
    } else {
      let existingValue = this.#map.get(key);
      this.#map.set(key, existingValue ? `${existingValue}, ${value}` : value);
    }
  }

  /**
   * Removes a header.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/Headers/delete)
   */
  delete(name: string): void {
    let key = name.toLowerCase();
    if (key === SET_COOKIE_KEY) {
      this.#setCookies = [];
    } else {
      this.#map.delete(key);
    }
  }

  /**
   * Returns a string of all the values for a header, or `null` if the header does not exist.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/Headers/get)
   */
  get(name: string): string | null {
    let key = name.toLowerCase();
    if (key === SET_COOKIE_KEY) {
      return this.getSetCookie().join(", ");
    } else {
      let value = this.#map.get(key);
      if (typeof value === "string") {
        return value;
      } else if (value != null) {
        let str = value.toString();
        return str === "" ? null : str;
      } else {
        return null;
      }
    }
  }

  /**
   * Returns an array of all values associated with the `Set-Cookie` header. This is
   * useful when building headers for a HTTP response since multiple `Set-Cookie` headers
   * must be sent on separate lines.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/Headers/getSetCookie)
   */
  getSetCookie(): string[] {
    return this.#setCookies.map((v) =>
      typeof v === "string" ? v : v.toString()
    );
  }

  /**
   * Returns `true` if the header is present in the list of headers.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/Headers/has)
   */
  has(name: string): boolean {
    let key = name.toLowerCase();
    return key === SET_COOKIE_KEY
      ? this.#setCookies.length > 0
      : this.get(key) != null;
  }

  /**
   * Sets a new value for the given header. If the header already exists, the new value
   * will replace the existing value.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/Headers/set)
   */
  set(name: string, value: string): void {
    let key = name.toLowerCase();
    if (key === SET_COOKIE_KEY) {
      this.#setCookies = [value];
    } else {
      this.#map.set(key, value);
    }
  }

  /**
   * Returns an iterator of all header keys (lowercase).
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/Headers/keys)
   */
  *keys(): HeadersIterator<string> {
    for (let [key] of this) yield key;
  }

  /**
   * Returns an iterator of all header values.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/Headers/values)
   */
  *values(): HeadersIterator<string> {
    for (let [, value] of this) yield value;
  }

  /**
   * Returns an iterator of all header key/value pairs.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/Headers/entries)
   */
  *entries(): HeadersIterator<[string, string]> {
    for (let [key] of this.#map) {
      let str = this.get(key);
      if (str) yield [key, str];
    }

    for (let value of this.getSetCookie()) {
      yield [SET_COOKIE_KEY, value];
    }
  }

  [Symbol.iterator](): HeadersIterator<[string, string]> {
    return this.entries();
  }

  /**
   * Invokes the `callback` for each header key/value pair.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/Headers/forEach)
   */
  forEach(
    callback: (value: string, key: string, headers: SuperHeaders) => void,
    thisArg?: unknown
  ): void {
    for (let [key, value] of this) {
      callback.call(thisArg, value, key, this);
    }
  }

  /**
   * Returns a string representation of the headers suitable for use in a HTTP message.
   */
  toString(): string {
    let lines: string[] = [];

    for (let [key, value] of this) {
      lines.push(`${canonicalHeaderName(key)}: ${value}`);
    }

    return lines.join(CR_LF);
  }

  // Header-specific getters and setters

  /**
   * The `Accept` header is used by clients to indicate the media types that are acceptable
   * in the response.
   *
   * [MDN `Accept` Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept)
   *
   * [HTTP/1.1 Specification](https://datatracker.ietf.org/doc/html/rfc7231#section-5.3.2)
   */
  get accept(): Accept {
    return this.#getHeaderValue(ACCEPT_KEY, Accept);
  }

  set accept(value: string | AcceptInit | undefined | null) {
    this.#setHeaderValue(ACCEPT_KEY, Accept, value);
  }

  /**
   * The `Accept-Encoding` header contains information about the content encodings that the client
   * is willing to accept in the response.
   *
   * [MDN `Accept-Encoding` Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding)
   *
   * [HTTP/1.1 Specification](https://datatracker.ietf.org/doc/html/rfc7231#section-5.3.4)
   */
  get acceptEncoding(): AcceptEncoding {
    return this.#getHeaderValue(ACCEPT_ENCODING_KEY, AcceptEncoding);
  }

  set acceptEncoding(value: string | AcceptEncodingInit | undefined | null) {
    this.#setHeaderValue(ACCEPT_ENCODING_KEY, AcceptEncoding, value);
  }

  /**
   * The `Accept-Language` header contains information about preferred natural language for the
   * response.
   *
   * [MDN `Accept-Language` Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language)
   *
   * [HTTP/1.1 Specification](https://datatracker.ietf.org/doc/html/rfc7231#section-5.3.5)
   */
  get acceptLanguage(): AcceptLanguage {
    return this.#getHeaderValue(ACCEPT_LANGUAGE_KEY, AcceptLanguage);
  }

  set acceptLanguage(value: string | AcceptLanguageInit | undefined | null) {
    this.#setHeaderValue(ACCEPT_LANGUAGE_KEY, AcceptLanguage, value);
  }

  /**
   * The `Accept-Ranges` header indicates the server's acceptance of range requests.
   *
   * [MDN `Accept-Ranges` Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Ranges)
   *
   * [HTTP/1.1 Specification](https://datatracker.ietf.org/doc/html/rfc7233#section-2.3)
   */
  get acceptRanges(): string | null {
    return this.#getStringValue(ACCEPT_RANGES_KEY);
  }

  set acceptRanges(value: string | undefined | null) {
    this.#setStringValue(ACCEPT_RANGES_KEY, value);
  }

  /**
   * The `Age` header contains the time in seconds an object was in a proxy cache.
   *
   * [MDN `Age` Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Age)
   *
   * [HTTP/1.1 Specification](https://datatracker.ietf.org/doc/html/rfc7234#section-5.1)
   */
  get age(): number | null {
    return this.#getNumberValue(AGE_KEY);
  }

  set age(value: string | number | undefined | null) {
    this.#setNumberValue(AGE_KEY, value);
  }

  /**
   * The `Cache-Control` header contains directives for caching mechanisms in both requests and responses.
   *
   * [MDN `Cache-Control` Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)
   *
   * [HTTP/1.1 Specification](https://datatracker.ietf.org/doc/html/rfc7234#section-5.2)
   */
  get cacheControl(): CacheControl {
    return this.#getHeaderValue(CACHE_CONTROL_KEY, CacheControl);
  }

  set cacheControl(value: string | CacheControlInit | undefined | null) {
    this.#setHeaderValue(CACHE_CONTROL_KEY, CacheControl, value);
  }

  /**
   * The `Connection` header controls whether the network connection stays open after the current
   * transaction finishes.
   *
   * [MDN `Connection` Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Connection)
   *
   * [HTTP/1.1 Specification](https://datatracker.ietf.org/doc/html/rfc7230#section-6.1)
   */
  get connection(): string | null {
    return this.#getStringValue(CONNECTION_KEY);
  }

  set connection(value: string | undefined | null) {
    this.#setStringValue(CONNECTION_KEY, value);
  }

  /**
   * The `Content-Disposition` header is a response-type header that describes how the payload is displayed.
   *
   * [MDN `Content-Disposition` Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition)
   *
   * [RFC 6266](https://datatracker.ietf.org/doc/html/rfc6266)
   */
  get contentDisposition(): ContentDisposition {
    return this.#getHeaderValue(CONTENT_DISPOSITION_KEY, ContentDisposition);
  }

  set contentDisposition(
    value: string | ContentDispositionInit | undefined | null
  ) {
    this.#setHeaderValue(CONTENT_DISPOSITION_KEY, ContentDisposition, value);
  }

  /**
   * The `Content-Encoding` header specifies the encoding of the resource.
   *
   * Note: If multiple encodings have been used, this value may be a comma-separated list. However, most often this
   * header will only contain a single value.
   *
   * [MDN `Content-Encoding` Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding)
   *
   * [HTTP/1.1 Specification](https://httpwg.org/specs/rfc9110.html#field.content-encoding)
   */
  get contentEncoding(): string | null {
    return this.#getStringValue(CONTENT_ENCODING_KEY);
  }

  set contentEncoding(value: string | string[] | undefined | null) {
    this.#setStringValue(
      CONTENT_ENCODING_KEY,
      Array.isArray(value) ? value.join(", ") : value
    );
  }

  /**
   * The `Content-Language` header describes the natural language(s) of the intended audience for the response content.
   *
   * Note: If the response content is intended for multiple audiences, this value may be a comma-separated list. However,
   * most often this header will only contain a single value.
   *
   * [MDN `Content-Language` Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Language)
   *
   * [HTTP/1.1 Specification](https://httpwg.org/specs/rfc9110.html#field.content-language)
   */
  get contentLanguage(): string | null {
    return this.#getStringValue(CONTENT_LANGUAGE_KEY);
  }

  set contentLanguage(value: string | string[] | undefined | null) {
    this.#setStringValue(
      CONTENT_LANGUAGE_KEY,
      Array.isArray(value) ? value.join(", ") : value
    );
  }

  /**
   * The `Content-Length` header indicates the size of the entity-body in bytes.
   *
   * [MDN `Content-Length` Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Length)
   *
   * [HTTP/1.1 Specification](https://datatracker.ietf.org/doc/html/rfc7230#section-3.3.2)
   */
  get contentLength(): number | null {
    return this.#getNumberValue(CONTENT_LENGTH_KEY);
  }

  set contentLength(value: string | number | undefined | null) {
    this.#setNumberValue(CONTENT_LENGTH_KEY, value);
  }

  /**
   * The `Content-Type` header indicates the media type of the resource.
   *
   * [MDN `Content-Type` Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type)
   *
   * [HTTP/1.1 Specification](https://datatracker.ietf.org/doc/html/rfc7231#section-3.1.1.5)
   */
  get contentType(): ContentType {
    return this.#getHeaderValue(CONTENT_TYPE_KEY, ContentType);
  }

  set contentType(value: string | ContentTypeInit | undefined | null) {
    this.#setHeaderValue(CONTENT_TYPE_KEY, ContentType, value);
  }

  /**
   * The `Cookie` request header contains stored HTTP cookies previously sent by the server with
   * the `Set-Cookie` header.
   *
   * [MDN `Cookie` Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cookie)
   *
   * [HTTP/1.1 Specification](https://datatracker.ietf.org/doc/html/rfc6265#section-5.4)
   */
  get cookie(): Cookie {
    return this.#getHeaderValue(COOKIE_KEY, Cookie);
  }

  set cookie(value: string | CookieInit | undefined | null) {
    this.#setHeaderValue(COOKIE_KEY, Cookie, value);
  }

  /**
   * The `Date` header contains the date and time at which the message was sent.
   *
   * [MDN `Date` Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Date)
   *
   * [HTTP/1.1 Specification](https://datatracker.ietf.org/doc/html/rfc7231#section-7.1.1.2)
   */
  get date(): Date | null {
    return this.#getDateValue(DATE_KEY);
  }

  set date(value: string | DateInit | undefined | null) {
    this.#setDateValue(DATE_KEY, value);
  }

  /**
   * The `ETag` header provides a unique identifier for the current version of the resource.
   *
   * [MDN `ETag` Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag)
   *
   * [HTTP/1.1 Specification](https://datatracker.ietf.org/doc/html/rfc7232#section-2.3)
   */
  get etag(): string | null {
    return this.#getStringValue(ETAG_KEY);
  }

  set etag(value: string | undefined | null) {
    this.#setStringValue(
      ETAG_KEY,
      typeof value === "string" ? quoteEtag(value) : value
    );
  }

  /**
   * The `Expires` header contains the date/time after which the response is considered stale.
   *
   * [MDN `Expires` Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Expires)
   *
   * [HTTP/1.1 Specification](https://datatracker.ietf.org/doc/html/rfc7234#section-5.3)
   */
  get expires(): Date | null {
    return this.#getDateValue(EXPIRES_KEY);
  }

  set expires(value: string | DateInit | undefined | null) {
    this.#setDateValue(EXPIRES_KEY, value);
  }

  /**
   * The `Host` header specifies the domain name of the server and (optionally) the TCP port number.
   *
   * [MDN `Host` Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Host)
   *
   * [HTTP/1.1 Specification](https://datatracker.ietf.org/doc/html/rfc7230#section-5.4)
   */
  get host(): string | null {
    return this.#getStringValue(HOST_KEY);
  }

  set host(value: string | undefined | null) {
    this.#setStringValue(HOST_KEY, value);
  }

  /**
   * The `If-Modified-Since` header makes a request conditional on the last modification date of the
   * requested resource.
   *
   * [MDN `If-Modified-Since` Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Modified-Since)
   *
   * [HTTP/1.1 Specification](https://datatracker.ietf.org/doc/html/rfc7232#section-3.3)
   */
  get ifModifiedSince(): Date | null {
    return this.#getDateValue(IF_MODIFIED_SINCE_KEY);
  }

  set ifModifiedSince(value: string | DateInit | undefined | null) {
    this.#setDateValue(IF_MODIFIED_SINCE_KEY, value);
  }

  /**
   * The `If-None-Match` header makes a request conditional on the absence of a matching ETag.
   *
   * [MDN `If-None-Match` Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-None-Match)
   *
   * [HTTP/1.1 Specification](https://datatracker.ietf.org/doc/html/rfc7232#section-3.2)
   */
  get ifNoneMatch(): IfNoneMatch {
    return this.#getHeaderValue(IF_NONE_MATCH_KEY, IfNoneMatch);
  }

  set ifNoneMatch(
    value: string | string[] | IfNoneMatchInit | undefined | null
  ) {
    this.#setHeaderValue(IF_NONE_MATCH_KEY, IfNoneMatch, value);
  }

  /**
   * The `If-Unmodified-Since` header makes a request conditional on the last modification date of the
   * requested resource.
   *
   * [MDN `If-Unmodified-Since` Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Unmodified-Since)
   *
   * [HTTP/1.1 Specification](https://datatracker.ietf.org/doc/html/rfc7232#section-3.4)
   */
  get ifUnmodifiedSince(): Date | null {
    return this.#getDateValue(IF_UNMODIFIED_SINCE_KEY);
  }

  set ifUnmodifiedSince(value: string | DateInit | undefined | null) {
    this.#setDateValue(IF_UNMODIFIED_SINCE_KEY, value);
  }

  /**
   * The `Last-Modified` header contains the date and time at which the resource was last modified.
   *
   * [MDN `Last-Modified` Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Last-Modified)
   *
   * [HTTP/1.1 Specification](https://datatracker.ietf.org/doc/html/rfc7232#section-2.2)
   */
  get lastModified(): Date | null {
    return this.#getDateValue(LAST_MODIFIED_KEY);
  }

  set lastModified(value: string | DateInit | undefined | null) {
    this.#setDateValue(LAST_MODIFIED_KEY, value);
  }

  /**
   * The `Location` header indicates the URL to redirect to.
   *
   * [MDN `Location` Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Location)
   *
   * [HTTP/1.1 Specification](https://datatracker.ietf.org/doc/html/rfc7231#section-7.1.2)
   */
  get location(): string | null {
    return this.#getStringValue(LOCATION_KEY);
  }

  set location(value: string | undefined | null) {
    this.#setStringValue(LOCATION_KEY, value);
  }

  /**
   * The `Referer` header contains the address of the previous web page from which a link to the
   * currently requested page was followed.
   *
   * [MDN `Referer` Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer)
   *
   * [HTTP/1.1 Specification](https://datatracker.ietf.org/doc/html/rfc7231#section-5.5.2)
   */
  get referer(): string | null {
    return this.#getStringValue(REFERER_KEY);
  }

  set referer(value: string | undefined | null) {
    this.#setStringValue(REFERER_KEY, value);
  }

  /**
   * The `Set-Cookie` header is used to send cookies from the server to the user agent.
   *
   * [MDN `Set-Cookie` Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)
   *
   * [HTTP/1.1 Specification](https://datatracker.ietf.org/doc/html/rfc6265#section-4.1)
   */
  get setCookie(): SetCookie[] {
    let setCookies = this.#setCookies;

    for (let i = 0; i < setCookies.length; ++i) {
      if (typeof setCookies[i] === "string") {
        setCookies[i] = new SetCookie(setCookies[i]);
      }
    }

    return setCookies as SetCookie[];
  }

  set setCookie(
    value:
      | (string | SetCookieInit)[]
      | string
      | SetCookieInit
      | undefined
      | null
  ) {
    if (value != null) {
      this.#setCookies = (Array.isArray(value) ? value : [value]).map((v) =>
        typeof v === "string" ? v : new SetCookie(v)
      );
    } else {
      this.#setCookies = [];
    }
  }

  // Helpers

  #getHeaderValue<T extends HeaderValue>(
    key: string,
    ctor: new (init?: string) => T
  ): T {
    let value = this.#map.get(key);

    if (value !== undefined) {
      if (typeof value === "string") {
        let obj = new ctor(value);
        this.#map.set(key, obj); // cache the new object
        return obj;
      } else {
        return value as T;
      }
    }

    let obj = new ctor();
    this.#map.set(key, obj); // cache the new object
    return obj;
  }

  #setHeaderValue(
    key: string,
    ctor: new (init?: string) => HeaderValue,
    value: unknown
  ): void {
    if (value != null) {
      this.#map.set(
        key,
        typeof value === "string" ? value : new ctor(value as never)
      );
    } else {
      this.#map.delete(key);
    }
  }

  #getDateValue(key: string): Date | null {
    let value = this.#map.get(key);
    return value === undefined ? null : new Date(value as string);
  }

  #setDateValue(
    key: string,
    value: string | DateInit | undefined | null
  ): void {
    if (value != null) {
      this.#map.set(
        key,
        typeof value === "string"
          ? value
          : (typeof value === "number" ? new Date(value) : value).toUTCString()
      );
    } else {
      this.#map.delete(key);
    }
  }

  #getNumberValue(key: string): number | null {
    let value = this.#map.get(key);
    return value === undefined ? null : parseInt(value as string, 10);
  }

  #setNumberValue(
    key: string,
    value: string | number | undefined | null
  ): void {
    if (value != null) {
      this.#map.set(key, typeof value === "string" ? value : value.toString());
    } else {
      this.#map.delete(key);
    }
  }

  #getStringValue(key: string): string | null {
    let value = this.#map.get(key);
    return value === undefined ? null : (value as string);
  }

  #setStringValue(key: string, value: string | undefined | null): void {
    if (value != null) {
      this.#map.set(key, value);
    } else {
      this.#map.delete(key);
    }
  }
}
