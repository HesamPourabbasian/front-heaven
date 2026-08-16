---
title: Debugging network requests
description: Read the Network tab like a professional — timings, headers, caching, throttling — and use curl to interrogate APIs outside the browser.
order: 10
difficulty: intermediate
category: Workflow
estimatedMinutes: 30
prerequisites:
  - learn/http-and-apis/fetch-in-depth
---

## Introduction

Every request your page makes is visible, inspectable, and measurable. The DevTools **Network** tab is the single most important debugging surface in front-end development — the place where "it doesn't work" becomes a precise diagnosis: which request failed, with what status, in how long, with which headers. This lesson teaches you to read it fluently, use `curl` to interrogate APIs outside the browser, and turn network debugging from frustration into a routine.

## The Network tab in one page

Open it with `Cmd+Shift+I` → Network (or `Cmd+Option+I`). Every request the page makes appears as a row: method, URL, status, type, size, and time. The controls that matter:

- **Record** (the red dot) — whether new requests are captured. Disabled means a silent gap in your timeline.
- **Preserve log** — keep requests across page navigations. Without it, a page reload wipes the log *during the exact reload you are debugging*.
- **Filter bar** — by type (`Fetch/XHR`, `Doc`, `Img`, `JS`, `CSS`) and by text. Filtering to `Fetch/XHR` is the first move when debugging API calls.
- **Throttling** — simulate network conditions (Slow 3G, Fast 4G) to reproduce the field experience.
- **Disable cache** — force fresh requests; essential when "it worked before" is actually "the browser served the stale copy".
- **Block request URL** — replay the page with a specific resource blocked, to test failure branches and performance resilience.

## Reading a request row

Click any request to open its full story in the side panel — the tabs in order tell the whole tale:

- **Headers** — the request line, request headers, response headers, and the *cached* status. This is where the status-code and headers lessons meet: confirm what was actually sent (`Authorization` present? `Content-Type` right?) and what came back (`Access-Control-Allow-Origin`? `Cache-Control`? `ETag`?).
- **Payload** — the request body: the JSON you `stringify`'d, the form fields, the query string. The fastest way to discover "the server got the wrong data" is reading what actually left.
- **Preview** — the response body, rendered (JSON pretty-printed, images shown). The first stop when checking *what came back*.
- **Response** — the raw response text, exactly as received — the place where malformed JSON and HTML error pages reveal themselves.
- **Timing** — the request's lifecycle, split into phases: *Queued*, *Stalled*, *DNS lookup*, *Connection*, *TLS handshake*, *Request sent*, *Waiting* (TTFB — time to first byte), *Content download*. The timing waterfall is where performance problems reveal their true location.

## The timing waterfall

The **Waterfall** column visualises every request's life in parallel. Read it like an ECG of your app's network behaviour:

- **Multiple requests stacked sequentially** — an N+1 pattern: your code waits for one response, then fires the next. The fix from the fetch lesson: `Promise.all` or an API `include`.
- **A long `Waiting (TTFB)`** — the server is slow to answer; the problem is server-side (or a cold cache), not the network.
- **A long `Content download`** — the payload is huge; the fix is smaller responses (`fields` selection, `srcset`-style media, compression).
- **A long `Stalled` or `Queued`** — the browser's connection limit (six per origin) or a preflight in the way; parallelise less or consolidate.

The discipline: never describe a slow page as "the API is slow". Point at a phase — *DNS took 800ms* and *TTFB took 2.4s* are different bugs with different owners.

## Reproducing conditions: throttling and blocking

The Network tab's two superpowers are simulation. **Throttling** answers "what does my page feel like on a phone in a train?" — preset to Slow 3G, then feel the difference between your loading state and your skeleton. **Blocking** answers "what happens when this fails?" — block the stylesheet and watch the unstyled flash, block the API and watch your error state, block the main script and watch the no-JS experience. Both are the fastest way to *test the failure branches* you wrote in the fetch lesson — the loading, error and empty states that only show themselves when the network misbehaves.

## curl: the API conversation without a browser

CORS exists only in browsers — which makes `curl` the perfect tool for asking "is it *my* code, or is it the *API*?":

```bash
curl -i https://api.example.com/users/42
```

`-i` shows response headers. The standard interrogation:

```bash
curl -i https://api.github.com/repos/octocat/Hello-World        # what the API really answers
curl -i -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"name": "Ada"}'                                          # an authenticated POST
curl -i -X OPTIONS https://api.example.com/users \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST"                      # the preflight, by hand
```

The debug decision tree this enables: if `curl` succeeds but the browser fails with CORS, it is CORS (the CORS lesson's checklist). If `curl` fails the same way, the bug is in the request or the API — not the browser, not your code's transport. `curl` strips away the browser, the page, the framework — leaving the raw conversation. One caveat: `curl` sends no cookies by default (`-b` / `-c` manage them) and no origin, so it cannot reproduce *browser-only* behaviour — which is precisely why it isolates it.

## The debugging workflow

Network debugging is a routine, not an art. When a request misbehaves:

1. **Reproduce with the log on** — `Preserve log`, reload, watch.
2. **Filter to `Fetch/XHR`** — isolate your API calls from the noise.
3. **Read the row**: status code first. 4xx → the request is wrong; inspect the payload. 5xx → the server is wrong; inspect the timing. 3xx → follow the `Location`. CORS error → the checklist.
4. **Compare sent vs received**: the Headers tab shows what left; the Preview tab shows what came back. The mismatch is usually the bug — wrong `Content-Type`, missing header, stale cache.
5. **Isolate with `curl`** — same request outside the browser. Works in curl, fails in browser → CORS. Fails in curl → request or API bug.
6. **Test the failure branches** — throttle, block, and watch your error states do their job.

## Common mistakes

Debugging with `Preserve log` off, so the reload that reproduces the bug erases the evidence. Reading only the *preview* of a failing request and never the status. Forgetting that the *response headers* — not the request headers — carry the CORS, caching and redirect answers. Diagnosing "the API is slow" without looking at the waterfall phases. Using `curl` for CORS questions (it never sees CORS) or skipping `-i` and missing the headers. And blaming the framework for what the Network tab shows clearly: the request that left the machine is the truth.

## Best practices

- Always debug with `Preserve log` on; filter to `Fetch/XHR` first.
- Read status → payload → response headers → timing, in that order.
- Point at a timing phase (DNS, TTFB, download) instead of "the network".
- Use throttling and request blocking to test loading and failure states.
- Use `curl -i` to separate browser-only behaviour (CORS, cookies) from the raw API.
- Compare what you intended to send with what the Headers tab shows actually went.
- Make the Network tab the first stop for every "it doesn't work" — the evidence is always there.

## Summary

The Network tab is the ground truth of your app's network behaviour: every request visible, every header inspectable, every phase measurable. Read rows as status first, payload, response headers, timing; filter to `Fetch/XHR` and keep the log on. The waterfall turns vague slowness into precise phases — DNS, TTFB, download — each with its own owner. Throttling and blocking test the failure branches you wrote. And `curl -i` interrogates the API itself, isolating browser-only concerns like CORS. With these tools, debugging is not guessing — it is reading the conversation.

## Practice

Load a page you built (or this site) and run a full network audit: with `Preserve log` on, reload, filter to `Fetch/XHR`, and for each API request record — status, size, and the dominant timing phase. Identify the slowest request and pinpoint *why* from its waterfall: is it TTFB (server), download (payload), or queuing (concurrency)? Then reproduce field conditions: throttle to Slow 3G and observe your loading states; block your main API request and confirm your error state renders — and fix whichever state is missing. Finally, take one failing request from your recent debugging memory and replay it with `curl -i`: does it fail the same way? If it works in curl but not the browser, run the CORS checklist; if it fails in both, inspect the request itself. Write the one-paragraph diagnosis your future self would want to read.