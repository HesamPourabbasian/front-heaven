---
title: Fetch
description: Request resources with the modern promise-based Fetch API.
order: 29
difficulty: intermediate
category: Level 10 - APIs and Networking
estimatedMinutes: 30
prerequisites:
  - learn/javascript/async-await
  - learn/javascript/xmlhttprequest
---

## Requests and responses

`fetch` returns a promise for a `Response`. It rejects for network failures, not for HTTP 4xx or 5xx statuses, so check `response.ok` yourself.

```js
const response = await fetch('/api/items')
if (!response.ok) throw new Error(`HTTP ${response.status}`)
const items = await response.json()
```

Pass method, headers, body, credentials and an `AbortSignal` in the options object. A response body is consumed once; choose `json`, `text`, `blob` or another reader deliberately.

## Summary

Fetch is small but explicit: configure the request, check status, read the body once, and handle cancellation.

## Practice

Build GET and POST requests with JSON headers, inspect them in DevTools, and add an abort button for a slow request.
