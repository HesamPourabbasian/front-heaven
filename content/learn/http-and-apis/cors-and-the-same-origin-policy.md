---
title: CORS and the same-origin policy
description: Why the browser blocks cross-origin requests, what CORS actually is, how preflight works, and how to read CORS errors instead of fearing them.
order: 9
difficulty: intermediate
category: Security
estimatedMinutes: 30
prerequisites:
  - learn/http-and-apis/fetch-in-depth
---

## Introduction

At some point in your career a `fetch` to another domain fails with the most feared console message: `Access to fetch at 'https://api.example.com' from origin 'http://localhost:3000' has been blocked by CORS policy`. This lesson explains what is actually happening — and it is not what it looks like. The browser is not stopping you from *sending* the request; it is refusing to *reveal the response* to your code. That distinction is the whole subject: the same-origin policy, the browser's defence against cross-site data theft, and CORS, the negotiated exception.

## The same-origin policy

A page's **origin** is the triple of scheme + host + port: `https://example.com:443`. Two URLs share an origin only if all three match. The **same-origin policy** is the browser's rule: a page can freely read resources from its *own* origin, and is blocked from reading resources from other origins.

Why does this rule exist? Consider a logged-in bank tab and a malicious site in another tab. If the malicious page could `fetch('https://bank.com/api/balance')` and read the response, it would steal your balance — because your bank's session cookie travels with the request. The same-origin policy makes that theft impossible: the request *may* reach the bank (cookies included — that part the browser cannot fully stop), but the malicious page is **forbidden from reading the response**. The attacker gets a response they cannot see.

That is the essence: **the same-origin policy is about reading, not sending.** Cross-origin requests are sent all the time — images, scripts, fonts, forms — because they do not expose response data to scripts. What the policy gates is the *reading*.

## What CORS is

**CORS** — Cross-Origin Resource Sharing — is the browser's mechanism for *safe exceptions* to the policy. It is not a security tool you add; it is a **header-based negotiation between servers and browsers**: the server declares, in response headers, which origins it is willing to share with.

```text
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://myapp.com
Content-Type: application/json

{"data": "..."}
```

`Access-Control-Allow-Origin` is the star of the show. When the browser sees it listing your origin, it lets your code read the response. Without it (or with a mismatched value), the browser swallows the response — your `fetch` rejects with a `TypeError` and that console message. The name of the header is the mental model: the server **allows** your **origin** to **share** the resource.

```text
Access-Control-Allow-Origin: *            — anyone may read (public data)
Access-Control-Allow-Origin: https://myapp.com   — only this origin
```

Crucially: CORS is enforced **client-side, by the browser**. `curl` never reads CORS headers; your backend calling another backend never hits CORS. It exists purely as the browser's gate on script-visible cross-origin data.

## Simple requests vs preflight

Not every cross-origin request gets the full negotiation. Requests that cannot be used for harmful "simple" reads — historically called **simple requests** — are sent directly, with CORS headers checked on the response. The criteria: safe methods (`GET`, `HEAD`, `POST` with limited content types like `application/x-www-form-urlencoded`, `multipart/form-data`, or `text/plain`) and only certain headers. The request goes out; if the response lacks the right CORS headers, your code still cannot read it.

Everything else triggers **preflight**: before the real request, the browser sends a `OPTIONS` probe asking permission — *may I send a POST with `application/json` and an `Authorization` header?* — and only if the server answers with the right headers does the real request follow:

```text
OPTIONS /api/data HTTP/1.1
Origin: https://myapp.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: authorization, content-type
```

```text
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://myapp.com
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE
Access-Control-Allow-Headers: authorization, content-type
Access-Control-Max-Age: 86400
```

This is why your `fetch` with `Content-Type: application/json` sometimes produces *two* requests in the Network tab — the `OPTIONS` preflight and the real call. The common surprise: "simple" text/plain requests skip preflight but arrive with unparsable bodies, and JSON requests preflight — the price of doing proper cross-origin work.

## Credentials: cookies and tokens across origins

Cross-origin requests with cookies are the sharpest edge. By default, `fetch` sends no cookies cross-origin and `Access-Control-Allow-Origin: *` is refused *when credentials are involved* — the browser demands an explicit origin and a second header:

```js
const res = await fetch('https://api.example.com/me', {
  credentials: 'include',   // send cookies on cross-origin requests
})
```

```text
Access-Control-Allow-Origin: https://myapp.com
Access-Control-Allow-Credentials: true
```

The rules: with `credentials: 'include'`, the server must respond with a specific origin (not `*`) **and** `Access-Control-Allow-Credentials: true` — otherwise the browser blocks the read. This combination is the cookie-based auth path (from the authentication lesson): the token lives in an HttpOnly cookie, the API trusts the cookie, and CORS makes the cross-origin handshake explicit.

## Reading the error: a checklist

The CORS console error contains the diagnosis, if you read it: it names the origin, the request, and the header that was missing or mismatched. The checklist:

1. **Is the `Access-Control-Allow-Origin` header present on the response?** — Open the Network tab, inspect the request's *response headers* (preflight `OPTIONS` included). No header → the server does not share with you.
2. **Does it match your exact origin?** — scheme, host *and port*. `localhost:3000` and `localhost:5173` are different origins. `*` with credentials is invalid.
3. **Is the method allowed?** — the preflight asks; the response's `Access-Control-Allow-Methods` must include yours.
4. **Are the request headers allowed?** — a custom header like `X-API-Key` or `Authorization` must appear in `Access-Control-Allow-Headers`.
5. **Is it your server at all?** — a `404` or `500` response also carries CORS headers *only if the server sets them*; an unhandled route answers without CORS headers, producing a confusing CORS error that is really a routing bug.

Ninety percent of CORS errors are one of: wrong origin in the allow list (ports!), a missing header in `Allow-Headers`, or a server that does not set CORS headers at all. The rest are actually status-code bugs wearing a CORS costume.

## Who fixes CORS?

The power to fix CORS sits with the **server**, not the client. The client can only send different requests (simpler content types, fewer headers) to dodge preflight — a hack, not a fix. The real fixes: the API's server sets the allow-origin header; a **proxy** — your own backend, or a dev-time proxy like Vite's `server.proxy` — forwards the request from your origin, so the browser sees a same-origin request and CORS never engages. That last one is why front-end dev servers silently solve the problem in development: the proxy makes your local server the middleman, and the browser is none the wiser.

## Common mistakes

Believing CORS is a client-side fix — no header you set in `fetch` can grant you access; only the server's response headers can. Trusting `Access-Control-Allow-Origin: *` with credentials — invalid by spec, and the browser refuses it. Adding `credentials: 'include'` without the server's `Allow-Credentials: true`. Debugging the real request while the failure is in the invisible `OPTIONS` preflight — always inspect *both* requests. And mistaking a CORS error for the underlying bug: a 500 that answers without CORS headers *looks* like a CORS problem and *is* a server problem.

## Best practices

- Understand the policy: the browser blocks *reading* cross-origin responses; sending is allowed, revealing is not.
- Read CORS errors as a checklist: origin match, method allowed, headers allowed, server actually responding.
- Inspect the `OPTIONS` preflight in the Network tab — that is where the negotiation lives.
- For cookies: `credentials: 'include'` + explicit origin + `Access-Control-Allow-Credentials: true`.
- Fix CORS server-side (headers) or via a proxy — never by hacking the client request.
- Remember CORS applies only to browsers: curl, servers and tests never see it.
- Treat `Access-Control-Allow-Origin: *` as "public data" — it means anyone's scripts can read it.

## Summary

The same-origin policy is the browser's rule that scripts may read only same-origin resources — a defence against cross-site data theft, enforced on *reading*, not sending. CORS is the negotiated exception: the server declares which origins may read, via `Access-Control-Allow-Origin` and friends, and the browser enforces it. JSON and authenticated requests trigger an `OPTIONS` preflight; credential-carrying requests demand explicit origins and `Allow-Credentials`. The power to fix CORS lives server-side — with headers or a proxy — and the console error is a checklist, not a curse.

## Practice

Trigger every CORS state and read each one like a mechanic. First, a public CORS-open API (`https://api.github.com` or `https://httpbin.org/anything`) — fetch it from your page and confirm the response headers include `Access-Control-Allow-Origin`, with your origin or `*`. Second, create a deliberately blocked case: open `https://httpbin.org` — which sets restrictive CORS — or spin up a tiny local server (`python3 -m http.server` serves files, and a two-line Node server can answer without CORS headers) and `fetch` it cross-origin; observe the exact error, then inspect the response headers to confirm the missing `Access-Control-Allow-Origin`. Third, open the Network tab and find the `OPTIONS` preflight on a JSON `POST` to `httpbin.org` — read its request headers (`Access-Control-Request-Method`) and the response's `Allow-Methods`. Finally, fix the blocked case with a proxy: configure Vite's `server.proxy` (or any dev proxy) and confirm the browser sees a same-origin request — CORS gone, mystery solved.