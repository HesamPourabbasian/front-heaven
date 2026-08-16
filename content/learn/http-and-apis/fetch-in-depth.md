---
title: 'Fetch in depth'
description: 'Go beyond the one-liner — request options, headers and bodies, robust error handling, timeouts with AbortController, uploads, and the patterns that survive production.'
order: 7
difficulty: 'intermediate'
category: 'Browser APIs'
estimatedMinutes: 35
prerequisites:
  - learn/javascript/fetch
  - learn/http-and-apis/http-status-codes
---

## Introduction

The JavaScript stage taught the `fetch` one-liner — `await fetch(url)` and `res.json()`. That pattern works on a tutorial page and breaks in production: no timeout means a hung request spins forever, no error handling means a 500 crashes the UI, no structure means the same boilerplate in every component. This lesson turns `fetch` from a phrase you copy into a tool you control: the full request options, robust response handling, timeouts, uploads and the small library of patterns every production codebase repeats.

## The full request signature

`fetch` takes two arguments: the URL and an options object. Most of the options you will ever need:

```js
const res = await fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({ name: 'Ada' }),
  credentials: 'same-origin',   // 'include' for cross-origin cookies
  cache: 'no-store',            // bypass HTTP caching for this request
  redirect: 'follow',           // follow 3xx automatically
})
```

The defaults deserve attention because they are the source of classic bugs: `method` defaults to `GET`, `credentials` defaults to `same-origin` (cookies sent only to your own origin), `redirect` defaults to `follow`, and `cache` defaults to the browser's normal caching rules. Half of "why does my fetch misbehave" is the default you did not know you had.

## Reading the response properly

The response object is richer than `res.json()` suggests. It is also *single-use*: the body can be consumed only once, so you must pick the reader that matches what you need:

```js
const res = await fetch('https://api.example.com/data')

res.status        // 200
res.ok            // true for 200–299
res.headers.get('Content-Type')   // 'application/json'
res.headers.get('ETag')           // '"33a64df5"'

const data = await res.json()     // one-shot: parse the body as JSON
```

The body readers: `res.json()` parses JSON (throws on invalid JSON or empty bodies), `res.text()` returns the raw string, `res.blob()` returns binary data (images, files), `res.formData()` parses multipart forms, and `res.arrayBuffer()` gives raw bytes. The discipline: check the status *first*, then read the body with the reader that matches the `Content-Type`. A 204 response has no body — calling `res.json()` on it throws. A 500 returning an HTML error page parsed as JSON throws too. Status first, then the right reader.

## The production fetch pattern

Production code never repeats the raw dance; it wraps it. The canonical shape:

```js
async function apiRequest(path, { method = 'GET', body, headers = {}, timeoutMs = 10000 } = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch(`https://api.example.com${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    })

    if (!res.ok) {
      const errorBody = await res.json().catch(() => null)
      throw new ApiError(res.status, errorBody?.error?.message ?? res.statusText)
    }

    return res.status === 204 ? null : await res.json()
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out')
    }
    throw error
  } finally {
    clearTimeout(timer)
  }
}
```

This one function embodies every discipline of the stage: a **timeout** via `AbortController` (without it, a dead network hangs your UI forever), status checked before body, error bodies parsed as data, 204 handled as "no content", and the whole thing throwing typed errors that callers can catch and display. Every production codebase has a version of this — build yours now and reuse it everywhere.

## Timeouts and cancellation with AbortController

`fetch` has no built-in timeout — a request can hang for minutes on a broken network. `AbortController` is the browser's cancellation mechanism, and it serves two purposes: timeouts and user-initiated cancellation.

```js
const controller = new AbortController()

// Timeout: abort after 10 seconds
setTimeout(() => controller.abort(), 10000)

// User action: cancel an in-flight request
document.querySelector('#cancel').addEventListener('click', () => controller.abort())

try {
  const res = await fetch('/api/search', { signal: controller.signal })
  // ...
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('Request was cancelled')
  }
}
```

The signal is passed in the options; `abort()` cancels the request, and the promise rejects with an `AbortError`. The catch must distinguish: an abort is a *controlled* cancellation (the user clicked, the timeout fired), not a network failure — the two need different UI responses ("cancelled" vs "offline"). The classic front-end use: a search box where every keystroke fires a request — abort the previous one so stale responses never race the latest. Combined with `AbortSignal.timeout(ms)` (a one-line modern shorthand), cancellation becomes part of every request you write.

## Uploads: FormData and files

Sending files changes the body from JSON to **`FormData`** — the browser's multipart format, which handles binary data and sets its own `Content-Type` with the boundary automatically:

```js
const formData = new FormData()
formData.append('avatar', fileInput.files[0])   // a File object
formData.append('caption', 'My new avatar')

const res = await fetch('/api/profile/avatar', {
  method: 'POST',
  body: formData,          // no Content-Type header — the browser sets it
})
```

The golden rule: **never set `Content-Type` by hand when sending `FormData`** — the boundary parameter in the header must match the body's encoding exactly, and only the browser can guarantee that. Hand-setting `application/json` (or worse, `multipart/form-data` without the boundary) breaks the upload silently. Progress reporting requires a different mechanism (`XMLHttpRequest`'s `upload.onprogress` — or streaming APIs) — a detail worth knowing: `fetch` alone does not expose upload progress.

## Concurrency and batching

Network requests are the slowest thing your code does, and parallelising them is the biggest single performance win available:

```js
// Sequential — slow: two round-trips, one after the other
const user = await fetchUser(id)
const posts = await fetchPosts(id)

// Parallel — fast: both in flight at once
const [user, posts] = await Promise.all([
  fetchUser(id),
  fetchPosts(id),
])
```

`Promise.all` fires both requests immediately and waits for both. The rules: use it when requests are *independent* (they do not need each other's data); keep them sequential when they are dependent (fetch the user, then the user's posts *by id* — or better, use the API's `include` from the REST lesson to collapse both into one request). The anti-pattern to avoid is the N+1 request waterfall — a loop of sequential fetches where one parallel call would do.

## Common mistakes

No timeout, so a hung request blocks the UI state forever. Checking `res.ok` *after* parsing the body. Calling `res.json()` on a 204 or on an HTML error page and crashing. Setting `Content-Type` manually for `FormData` uploads. Forgetting that the body is single-use — reading `res.text()` then `res.json()` and getting an error. Firing a new request per keystroke without aborting the previous one, letting stale responses overwrite fresh ones. And serialising independent requests with `await` in a loop when `Promise.all` would run them in parallel.

## Best practices

- Wrap `fetch` in one `apiRequest` function: timeout, status check, error-body parsing, 204 handling.
- Abort in-flight requests with `AbortController` — for timeouts, cancellation, and stale-response races.
- Read the body with the reader that matches the `Content-Type`, after checking the status.
- Send `FormData` without hand-setting `Content-Type`.
- Parallelise independent requests with `Promise.all`; keep dependent ones sequential.
- Distinguish `AbortError` (cancelled) from network errors (offline) in your catch branches.
- Handle every failure branch in the UI — the loading, error and empty states deserve as much design as the data state.

## Summary

Production `fetch` is a wrapper, not a one-liner: options control method, headers, credentials and caching; the response is read by status-first discipline with the matching body reader; `AbortController` provides timeouts and cancellation; `FormData` handles uploads without hand-set headers; and `Promise.all` parallelises independent requests. The result is a single `apiRequest` function you write once and reuse everywhere — carrying every lesson of this stage: status codes, headers, JSON, and the failure branches that make or break a real product.

## Practice

Build the `apiRequest` wrapper from this lesson in your own code, then exercise every branch against `jsonplaceholder.typicode.com`: a successful GET (200, parsed data), a 404 (typed error with message), a timeout (set `timeoutMs: 1` and confirm the `AbortError` branch), and a cancellation (fire a request, abort it from a button, confirm the catch). Then build a small search box that fires a request per keystroke and aborts the previous one — type quickly and confirm only the latest response ever renders. Finally, fetch two independent resources with `Promise.all` and compare the Network tab timings against the sequential version — the waterfall vs the parallel bar is the whole lesson in one picture.
