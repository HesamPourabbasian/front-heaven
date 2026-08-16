---
title: Working With APIs
description: Consume JSON APIs, validate responses, manage loading states and design a reliable data flow.
order: 30
difficulty: intermediate
category: Level 10 - APIs and Networking
estimatedMinutes: 35
prerequisites:
  - learn/javascript/fetch
  - learn/javascript/data-types
---

## API boundaries

An API boundary is untrusted input. Model loading, success, empty, error and retry states. Check status, parse JSON, validate its shape, and transform transport data into the shape your UI needs.

```js
async function loadItems() {
  const response = await fetch('/api/items')
  if (!response.ok) throw new Error('Items unavailable')
  const value = await response.json()
  if (!Array.isArray(value.items)) throw new Error('Invalid response')
  return value.items
}
```

Use URL query parameters for filters and pagination, abort stale requests, and never expose server secrets in browser code. CORS and authentication belong to the API contract, not a client-side workaround.

## Summary

Good API clients validate at the boundary, represent every UI state and make cancellation, retries and pagination explicit.

## Practice

Build a searchable list with loading, empty, error and retry states. Add query parameters, abort stale searches and validate the response shape.
