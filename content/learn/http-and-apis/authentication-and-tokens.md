---
title: Authentication and tokens
description: Secure your API calls — API keys, Basic auth, bearer tokens, refresh flows, and the secure way to store credentials in the browser.
order: 8
difficulty: intermediate
category: Security
estimatedMinutes: 30
prerequisites:
  - learn/http-and-apis/fetch-in-depth
---

## Introduction

Almost every real API gates its data behind authentication: prove who you are, and the server decides what you may see and do. The mechanism is always the same shape — credentials travel with each request, because HTTP is stateless and the server remembers nothing. The variety is in *what* travels: an API key, a username and password, or a token — with different security properties, storage requirements and failure modes. This lesson covers the three dominant schemes, the token lifecycle, and the storage decisions that determine whether your auth is secure or a liability.

## The stateless rule

HTTP does not remember you. Every request must *prove* your identity on its own — which is why authentication is a per-request concern, not a one-time event. The practical consequences:

- Credentials travel with every authenticated request, in a header (usually `Authorization`), a cookie, or a query parameter.
- The server verifies them on *every* request — a stolen credential works until it expires or is revoked.
- "Logging out" is meaningless unless the server can invalidate what you presented.

This shapes everything below: tokens exist to be *presented*, verified, and expired — and the security of the whole system rests on how they are stored and transmitted.

## API keys: simple, and not for users

The simplest scheme: a long random string the client sends with every request.

```js
const res = await fetch('https://api.example.com/data', {
  headers: { 'X-API-Key': 'live_3f9a...7c2b' },
})
```

API keys are great for *server-to-server* communication — a backend calling another backend — because the key lives in an environment variable, never in code or the browser. The rule that defines them: **a key that ships to a browser is public**. Anyone can open DevTools and read it — it is in the request headers of every call your page makes. For that reason, API keys are the wrong tool for identifying *users* in browser clients; they are the right tool for identifying *applications* server-side. If you must use one from the browser, treat it as public data and scope it ruthlessly (read-only, restricted to what the public needs) — and never put a *secret* key in client code, whatever the tutorial says.

## Basic auth: username and password, barely disguised

Basic auth is the oldest scheme: `username:password`, base64-encoded, in the `Authorization` header.

```js
const credentials = btoa(`${username}:${password}`)
const res = await fetch('https://api.example.com/me', {
  headers: { 'Authorization': `Basic ${credentials}` },
})
```

Two properties you must internalise. First, **base64 is not encryption** — `btoa` is a reversible encoding that any observer decodes in seconds. Basic auth is only safe *because* HTTPS encrypts the whole request; over plain HTTP it is handing over your password in public. Second, the password is now sent with **every request**, which multiplies the exposure — every request that leaks (a compromised server, a buggy proxy) leaks the password itself. Modern APIs rarely use Basic for user auth; you will still meet it in internal tools and some service APIs, and the browser's built-in `Authorization: Basic` prompt for protected directories.

## Bearer tokens: the modern standard

The dominant scheme of modern APIs is the **bearer token**: a string of characters presented in the `Authorization` header, and *whoever bears it is authenticated*.

```js
const res = await fetch('https://api.example.com/me', {
  headers: { 'Authorization': `Bearer ${token}` },
})
```

The token itself is usually a **JWT** (JSON Web Token) — a compact, signed package of claims: who the user is, when it expires, what it allows. Three parts separated by dots: a header, a payload of claims, and a signature. The signature is the point: the server can *verify* the token without storing session state — statelessness, made practical. The front-end never needs to read the payload; it presents the token and lets the server decide. What the front-end must understand is the **lifecycle**:

- **Access token** — short-lived (minutes to an hour). Sent with every request. Short life is the security feature: a stolen access token is useful for only a short window.
- **Refresh token** — long-lived (days to months). Never sent with data requests; only exchanged for a *new* access token when the old one expires.

The flow: the client logs in, receives both tokens, uses the access token until it expires, then presents the refresh token to get a new pair — silently, in the background, without the user noticing. The secure-storage problem is exactly what the refresh flow solves: the refresh token is long-lived, so it must be protected; the access token is short-lived, so its storage matters less.

## Storing tokens: the decision that matters

Where the token lives decides how much damage a leak does. The options, honestly assessed:

- **`localStorage`** — convenient, survives restarts, readable by any script on your origin. **The problem: any XSS vulnerability hands your tokens to an attacker.** This is why security guidance calls localStorage-stored tokens a liability. Millions of sites still do it — which makes it the *default* mistake, not the right answer.
- **`sessionStorage`** — same XSS exposure, but cleared when the tab closes; marginally better, still script-readable.
- **HttpOnly cookies** — the token lives in a cookie the browser manages, *invisible to JavaScript* (the `HttpOnly` attribute from the headers lesson). XSS cannot read what scripts cannot see. The browser attaches the cookie automatically; your code never touches the token. This is the recommended home for tokens — with the caveat that the cookie must be `Secure` (HTTPS only) and `SameSite` (the CORS lesson covers cross-origin cookie rules).

The honest summary for front-end work: **HttpOnly cookies are the secure default; `localStorage` is the common, risky shortcut.** When the refresh-token pattern is added, the standard architecture is: access token in memory (short-lived, lost on reload — fine), refresh token in an HttpOnly cookie (long-lived, invisible to scripts, renewed in the background). Build the reflex: if you are about to write `localStorage.setItem('token', ...)`, stop and ask what an XSS attacker would do with it.

## Handling 401s: the refresh dance

When an access token expires mid-session, the API answers `401 Unauthorized`. The production pattern is a silent refresh:

```js
async function fetchWithAuth(path, options = {}) {
  const res = await fetch(path, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${getAccessToken()}`,
    },
  })

  if (res.status === 401 && !options._retried) {
    const refreshed = await tryRefreshToken()   // exchange refresh token
    if (refreshed) {
      return fetchWithAuth(path, { ...options, _retried: true })
    }
    redirectToLogin()
  }

  return res
}
```

The pattern: on `401`, attempt the refresh *once*, retry the original request with the new token, and only if refresh fails, treat the session as over — redirect to login. Without the `_retried` guard, a failing refresh loops forever. Two refinements in real codebases: **queue concurrent requests** — if three requests expire at once, they should share one refresh, not fire three; and treat the login redirect as a *user-visible event* (a toast, a return-to URL), never a silent death.

## Common mistakes

Putting a secret API key in client code — DevTools makes it public within seconds. Believing base64 is encryption and shipping Basic auth without understanding it rides entirely on HTTPS. Storing tokens in `localStorage` without considering XSS — the single most common auth mistake in front-end code. Handling `401` as a fatal error when a silent refresh would save the session. Sending the refresh token with every request. Ignoring expiry and letting the UI crash on expired sessions instead of refreshing. And never testing the expiry path — the refresh flow is exactly the code that fails in production because it only runs when time passes.

## Best practices

- Keep API keys server-side; anything in the browser is public — scope it accordingly.
- Prefer bearer tokens for user auth; understand that HTTPS is the encryption, headers are the transport.
- Use short-lived access tokens + long-lived refresh tokens; exchange, never re-send.
- Store tokens in HttpOnly cookies; treat `localStorage` as the known-risky default to avoid.
- Handle `401` with a single silent refresh and a `_retried` guard; queue concurrent refreshes.
- Treat failed refresh as an explicit session end: redirect, message, and a return path.
- Test the expiry path — set a 1-minute token in development and watch the flow run.

## Summary

Authentication travels with every request because HTTP is stateless: API keys identify applications (and belong server-side), Basic auth is username/password transported on HTTPS's coattails, and bearer tokens — usually JWTs — are the modern standard, short-lived by design with a long-lived refresh token doing the renewal. The storage decision is the security decision: HttpOnly cookies keep tokens invisible to scripts; `localStorage` hands them to any XSS. And the `401` handler is the production skill — one silent refresh, one retry, and an explicit session end when refresh fails.

## Practice

Implement the refresh pattern end-to-end against a mock: create a tiny local server (or use a public demo like Auth0's or a mock service) that issues a short-lived access token (expires in 60 seconds) and a long-lived refresh token, and rejects data requests with `401` when the access token is expired. Build the client flow: login to get both tokens, fetch data with the access token, wait for expiry, confirm the `401`, run the silent refresh, retry, and succeed — then log the whole sequence. Test the failure branch too: revoke the refresh token and confirm the app redirects to login instead of looping. Finally, write down the storage plan for your app: which token lives where, and what an XSS attacker could and could not steal.