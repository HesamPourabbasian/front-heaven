---
title: 'HTTP status codes'
description: 'Decode the three-digit language of HTTP — the 1xx–5xx classes, the codes you will meet daily, and how to handle them properly in fetch.'
order: 3
difficulty: 'intermediate'
category: 'Core Content'
estimatedMinutes: 30
prerequisites:
  - learn/http-and-apis/what-is-http
---

## Introduction

Every HTTP response begins with a status code — three digits that summarise the outcome of the request. `200 OK`, `404 Not Found`, `500 Internal Server Error`: you have seen these for years. What most beginners miss is that the status code is a *decision point* — the first thing your code should read, because it tells you whether the response body is data or an error. This lesson teaches the five classes, the codes you will meet daily, and the disciplined way to handle them in real code.

## The five classes

The first digit groups the code by meaning. Once you know the classes, most codes explain themselves:

- **1xx — Informational.** The request was received; the conversation continues. `100 Continue`, `101 Switching Protocols` (WebSockets). You will almost never handle these as a front-end developer.
- **2xx — Success.** The request was understood and fulfilled. The class your happy path lives in.
- **3xx — Redirection.** The resource moved; follow the `Location` header to find it. Browsers follow these automatically; `fetch` does too (for GET).
- **4xx — Client error.** The request was bad — the client sent something wrong. The server understood you, but cannot do what you asked. Almost always a bug to fix on your side.
- **5xx — Server error.** The server failed while trying to do what you asked. The request may have been perfect — the server is having a bad day. Retrying is legitimate here.

The mental split that matters: 2xx is success, 4xx is your fault, 5xx is their fault, 3xx is a detour. This single framing resolves most "why is my request failing" confusion in seconds.

## The codes you will use daily

Within the classes, a handful of codes carry most of the traffic:

- **200 OK** — the canonical success. The body contains what you asked for.
- **201 Created** — success, and a *resource was created* (typically after `POST`). The response often includes a `Location` header pointing at the new resource.
- **204 No Content** — success, but deliberately empty. The classic response to `DELETE` and to updates that have nothing to return.
- **301 Moved Permanently** — the resource has a new permanent home; update your bookmarks and links. `fetch` follows it transparently.
- **304 Not Modified** — the resource has not changed since you last asked; use your cached copy. This is how conditional caching works — the browser handles it for you.
- **400 Bad Request** — the request is malformed: invalid JSON, a missing required field, a bad query parameter. Fix the request.
- **401 Unauthorized** — you are not authenticated: no token, an expired token, a missing `Authorization` header. The fix is on the auth side, not the data side.
- **403 Forbidden** — you *are* authenticated but not allowed to do this. (The distinction from 401 matters: 401 asks "who are you?", 403 says "I know who you are — and the answer is no".)
- **404 Not Found** — the path does not exist, or the resource does not. If the URL looks right, this is often an API design issue: the resource was deleted, or the route never existed.
- **405 Method Not Allowed** — the path exists but this method does not work on it (POSTing to a read-only endpoint).
- **409 Conflict** — the request clashes with the current state: creating a user whose email already exists, editing a record that changed since you loaded it.
- **422 Unprocessable Content** — the request is well-formed but semantically invalid: a valid email field containing "not-an-email". The API's way of saying "your JSON parses, your values don't".
- **429 Too Many Requests** — rate limit reached. The `Retry-After` header tells you when to try again.
- **500 Internal Server Error** — the server crashed. Not your fault; a bug on the server side.
- **502 Bad Gateway / 503 Service Unavailable / 504 Gateway Timeout** — the server's dependencies failed, it is overloaded, or an upstream service timed out. Retry with backoff.

You do not need to memorise the catalogue — you need the reflex to *look up* an unfamiliar code and the judgement to know which class it belongs to.

## Handling codes in fetch

The single most important fact about `fetch` error handling: **fetch only rejects on network failure, never on HTTP errors**. A `404`, a `500`, even a `429` — `fetch` happily resolves and hands you the response. Checking the status is *your* job:

```js
const res = await fetch('https://api.example.com/users/42')

if (!res.ok) {
  // res.ok is true only for 200–299
  throw new Error(`Request failed: ${res.status} ${res.statusText}`)
}

const user = await res.json()
```

`res.ok` is the coarse success check — enough for most code. For real products, branch by class:

```js
if (res.status === 401) {
  // session expired — redirect to login, refresh the token
} else if (res.status === 403) {
  // not allowed — show "you lack permission"
} else if (res.status === 404) {
  // resource gone — show the not-found state
} else if (res.status >= 500) {
  // server error — show "try again later", retry with backoff
}
```

The discipline: the *status code* decides the user-facing outcome, and the *body* carries the details (many APIs send `{"error": {"message": "..."}}` with the code). Reading one without the other produces the classic bug where a 404's HTML error page gets parsed as JSON and crashes with a confusing error.

## Redirects and caching codes

Two codes work quietly behind the scenes. **3xx redirects** are followed automatically by `fetch` and the browser — your code never sees them; the final response arrives with its real status. The `redirect: 'manual'` option exists for cases where you *want* to see the redirect — an auth flow returning `302` to a login page, for instance. **304 Not Modified** powers conditional requests: the browser sends `If-None-Match` or `If-Modified-Since` headers with cached resources, and a server that detects no change replies `304` with an empty body — saving the full re-download. You do not implement this by hand; you configure caching headers on the server (the headers lesson covers them) and the browser does the rest.

## Error responses are data too

Professional APIs return structured error bodies — a small JSON document with a machine-readable code and a human-readable message:

```json
{
  "error": {
    "code": "EMAIL_TAKEN",
    "message": "A user with this email already exists",
    "field": "email"
  }
}
```

The pattern lets your UI act on `code` (prefill the email field, focus it, show the message) instead of scraping text. When you handle errors, parse them as data — same as any response. The front-end discipline: treat `!res.ok` as the *branch*, and the error body as the *payload* of that branch.

## Common mistakes

Assuming `fetch` throws on HTTP errors — it does not; check `res.ok` or the status yourself. Parsing `res.json()` before checking the status, and crashing on HTML or empty error bodies. Treating every 4xx as the same failure, when `401` needs a login redirect and `422` needs a form message. Treating every 5xx as "retry immediately", when rate limits (`429`) and outages (`503`) need backoff. Displaying raw status text to users instead of the API's structured message. And logging only the body, not the status — the two together are the story.

## Best practices

- Read the status code before the body, always — `res.ok` for the coarse check, class-based branching for real products.
- Handle `401` as "re-authenticate", `403` as "not allowed", `404` as "not found", `422` as "fix your input", `5xx` as "server problem, retry with backoff".
- Parse error bodies as structured data; show the API's message, not the raw status text.
- Remember 2xx success, 4xx client error, 5xx server error — and that 3xx redirects are normally invisible to your code.
- Retry on `5xx` with backoff; respect `Retry-After` on `429`.
- Test every failure branch, not just the happy path — the 404 state deserves a UI as much as the data state.

## Summary

Status codes are the outcome summary of every request, organised in five classes: 1xx informational, 2xx success, 3xx redirection, 4xx client error (your fault), 5xx server error (their fault). The daily cast — 200, 201, 204, 301, 304, 400, 401, 403, 404, 422, 429, 500 — covers nearly everything you will meet. In `fetch`, the status check is yours: the promise resolves on HTTP errors, so branch on `res.ok` or the status, read error bodies as structured data, and let the code decide the user-facing outcome.

## Practice

Write a small page (or a console script) that fetches from `jsonplaceholder.typicode.com` and logs the status and body of every request: `GET /posts/1` (200), `GET /posts/999999` (404 — observe that `fetch` does *not* throw), `GET /invalid-path` (404), and a request to `https://httpbin.org/status/500` (500). For each, exercise your error handling: `if (!res.ok) throw new Error(...)` — and confirm the 404 and 500 both reach the `throw` without crashing the script. Then add class-based branching: a 404 shows "Not found", a 5xx shows "Try again later", and log each request in the Network tab to see the codes on the wire. The goal is the reflex: every response you ever handle, you check the status first.