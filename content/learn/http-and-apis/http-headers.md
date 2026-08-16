---
title: HTTP headers
description: The metadata layer of every request and response — content negotiation, caching headers, and the headers you will set and read in daily work.
order: 4
difficulty: intermediate
category: Core Content
estimatedMinutes: 30
prerequisites:
  - learn/http-and-apis/http-methods
  - learn/http-and-apis/http-status-codes
---

## Introduction

Between the status line and the body sits a layer most beginners skip: **headers** — key-value metadata describing the request and response. The body says *what*; the headers say *how*: what format it is, what formats are acceptable, how long it can be cached, who is asking, and how the two sides should interpret each other. Reading and setting headers correctly is what separates "it works on my machine" from code that behaves correctly in production — and it is the layer where caching, content negotiation and authentication actually happen.

## Request headers you will see daily

The client sends headers describing itself and its expectations. The ones you will meet constantly:

```text
Accept: application/json              — the formats the client can handle
Content-Type: application/json        — the format of the body being sent
Authorization: Bearer eyJhbGciOi...   — credentials (covered in the auth lesson)
Accept-Language: en-GB, en;q=0.9      — preferred languages, with priorities
User-Agent: Mozilla/5.0 ...           — who the client is
Cache-Control: no-cache               — request-side caching instructions
```

The first three carry the work. **`Accept`** is content *negotiation*: the client declares which formats it can consume, and the server picks a match. **`Content-Type`** announces the body's format — the server's parser depends on it, and sending JSON with `text/plain` breaks parsing silently. **`Authorization`** carries credentials on every authenticated request — the auth lesson covers its forms.

## Response headers you will read daily

The server answers with its own metadata. The ones that matter:

```text
Content-Type: application/json; charset=utf-8   — how to interpret the body
Content-Length: 84                              — body size in bytes
Cache-Control: max-age=300                      — caching policy
ETag: "33a64df5"                                — a version fingerprint of the body
Location: /api/users/42                         — where the new/redirected resource lives
Set-Cookie: session=abc123; HttpOnly; Secure    — the server planting a cookie
```

**`Content-Type`** is the most important: the client cannot safely parse the body without it. The `; charset=utf-8` suffix declares the encoding — without it, text with non-ASCII characters can garble. **`ETag`** and **`Cache-Control`** drive caching — the pair that decides whether your page's next load comes from the network or from memory. **`Location`** is the redirect's payload: a `201` or `3xx` response tells you where the resource actually lives.

## Content negotiation in practice

Negotiation is a conversation: the client states its preferences, the server honours them if it can. The `Accept` header carries preference weights — `q` values from 0 to 1:

```text
Accept: text/html, application/xhtml+xml, application/json;q=0.9, */*;q=0.8
```

The server reads the list and responds with the best match — and its choice is announced in the response's `Content-Type`. When you `fetch` a JSON API, the negotiation is usually implicit (the server knows it serves JSON), but real products use it: an API endpoint that returns HTML for browsers and JSON for clients, a service that serves WebP images only to clients that accept them. If the server cannot satisfy the client, it answers `406 Not Acceptable`.

## Caching headers: the performance layer

Caching is where headers pay the largest performance dividend. The core header is **`Cache-Control`**, and its most common values form a small vocabulary:

```text
Cache-Control: max-age=300                    — reuse for 5 minutes, no revalidation
Cache-Control: no-cache                       — always revalidate before reuse
Cache-Control: no-store                       — never store (sensitive data)
Cache-Control: public, max-age=3600           — cacheable by anyone, an hour
Cache-Control: private, max-age=3600          — only the user's own cache
```

- `max-age=N` — the response is fresh for N seconds; within that window the browser serves the stored copy without a network request. The difference between an instant back-navigation and a spinner.
- `no-cache` — sounds like "don't cache" but means "don't reuse without asking": the browser must revalidate with the server, which answers `304` if nothing changed — the body is not re-downloaded, but a round-trip happens.
- `no-store` — never persist at all; the right policy for tokens, balances, and anything sensitive.

The **`ETag`** header powers the revalidation: the client sends `If-None-Match: "33a64df5"`, the server compares, and answers `304 Not Modified` (empty body) or `200` with the new body. Combined with `Cache-Control`, this is the standard server-side setup that makes static assets load once and reuse forever.

## Setting headers in fetch

Setting headers in `fetch` is explicit and per-request:

```js
const res = await fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({ name: 'Ada' }),
})
```

Two practical notes. First, **`Content-Type` must match the body you actually send** — `JSON.stringify` output is JSON, so `application/json` is correct; `FormData` needs no header at all (the browser sets `multipart/form-data` with the boundary automatically); a URL-encoded body needs `application/x-www-form-urlencoded`. Second, some headers are **forbidden** for the browser to set — `Host`, `Content-Length`, `Cookie` — and others are restricted (`Referer`, `User-Agent`). The browser owns those; trying to set them silently fails. When you see a header "not being sent", the Network tab shows the truth — compare what you intended with what left the machine.

## Cookies: the header the browser manages

Cookies are the exception to everything above: you rarely set them by hand. A response's **`Set-Cookie`** header plants a cookie; the browser stores it, and automatically includes it in the **`Cookie`** request header on subsequent requests to the same domain. The attributes control the behaviour:

```text
Set-Cookie: session=abc123; Path=/; HttpOnly; Secure; SameSite=Lax
```

- **`HttpOnly`** — JavaScript cannot read the cookie. The classic defence against XSS stealing sessions; a session cookie without it is a liability.
- **`Secure`** — only sent over HTTPS.
- **`SameSite`** — controls sending on cross-site requests: `Lax` (default, safe for top-level navigation), `Strict` (never on cross-site), `None` (always, requires `Secure`).

The front-end consequence: `fetch` includes cookies automatically for same-origin requests, and *not* for cross-origin requests unless the API opts in via CORS (`credentials: 'include'` — the CORS lesson covers it). Cookie-based auth means the browser handles the credential transport — you never see the token.

## Common mistakes

Sending `Content-Type: application/json` with a body that is not JSON, or forgetting it for JSON bodies and watching the server reject every request. Setting `Accept` to `application/json` and trying to parse an HTML error page as JSON when the server returns a 4xx — negotiate and branch on status first. Expecting `max-age` and `no-store` to do the same thing. Reading a header from the wrong side: request headers describe the client, response headers describe the server — `Location` arrives in responses, not requests. And assuming a response header you expect is actually present — the Network tab shows exactly what arrived; debugging headers means reading the actual traffic, not the documentation.

## Best practices

- Set `Content-Type` to match the body; let the browser set it for `FormData`.
- Read `Content-Type` of every response before parsing the body.
- Use `Accept` to negotiate; branch on the status before trusting the body.
- Understand `Cache-Control` values: `max-age` reuse, `no-cache` revalidate, `no-store` never.
- Use `ETag`/`If-None-Match` patterns to make revalidation cheap.
- Prefer `HttpOnly` + `Secure` + `SameSite` cookies for sessions; never read sessions via JavaScript.
- Debug headers in the Network tab — intended headers and sent headers are often different things.

## Summary

Headers are the metadata layer of HTTP: the client's `Accept` negotiates formats, `Content-Type` announces the body's format on both sides, `Authorization` and cookies carry identity, and `Cache-Control` + `ETag` decide how long responses are reused. Setting the right request headers and reading the right response headers — with the Network tab as the source of truth — turns guessing into engineering. Master this layer and you control the two invisible forces of web performance: what gets cached, and what gets sent.

## Practice

Open the Network tab and load a page with static assets (any site, or this one). Click the main document request and the first stylesheet: for each, write down the request headers the browser sent (`Accept`, `Accept-Encoding`, `Cache-Control`) and the response headers (`Content-Type`, `Cache-Control`, `ETag`, `Content-Length`). Then reload the page twice and watch the cache headers do their work — a stylesheet served from cache makes the second load skip the network. Next, in your console, run a `fetch` with explicit headers (`Accept: application/json`, `Content-Type: application/json` on a POST to `jsonplaceholder.typicode.com/posts`) and confirm in the Network tab that exactly your headers were sent. Finally, find one response with `ETag` and manually send `If-None-Match` with its value to the same URL — observe the `304` with its empty body.