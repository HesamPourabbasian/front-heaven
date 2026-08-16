---
title: XMLHttpRequest
description: Read the older event-based networking API and understand where it still appears in browser code.
order: 28
difficulty: intermediate
category: Level 10 - APIs and Networking
estimatedMinutes: 25
prerequisites:
  - learn/javascript/browser-javascript
  - learn/javascript/callbacks
---

## The older API

`XMLHttpRequest` predates promises and `fetch`, but legacy applications and upload-progress code still use it. Configure the method and URL, listen for `load` and `error`, then call `send`.

```js
const request = new XMLHttpRequest()
request.open('GET', '/api/items')
request.addEventListener('load', () => console.log(request.status, request.responseText))
request.addEventListener('error', () => console.error('Network failure'))
request.send()
```

It exposes ready states, progress events, aborting and response types, but its callback API is verbose. Prefer `fetch` for new code unless you specifically need an XHR-only capability.

## Summary

XHR explains older code and still matters for progress events. Know how to inspect and replace it safely.

## Practice

Fetch JSON with XHR, handle status and parse errors, then write the equivalent with `fetch` and compare the control flow.
