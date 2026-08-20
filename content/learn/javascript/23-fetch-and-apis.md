---
title: 'Fetch & APIs'
description: 'Master client-side network communication: Fetch API, HTTP methods (GET, POST, PUT, PATCH, DELETE), headers, request payloads, response parsing, HTTP error handling, request cancellation with AbortController, and API authentication.'
order: 23
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 40
prerequisites:
  - /learn/javascript/22-event-loop
---

# Fetch & APIs

Modern web applications rely on continuous communication with backend services, microservices, and third-party RESTful APIs. The **Fetch API** is the modern, Promise-based standard built into browsers and server environments (Node.js 18+, Deno, Bun) that replaces the legacy `XMLHttpRequest` API.

Effective API integration requires a deep understanding of HTTP protocol fundamentals, proper status code handling, request cancellation using **`AbortController`**, authentication headers (Bearer tokens, API keys), and resilient error boundaries.

In this lesson, we will master the Fetch API, explore HTTP methods (GET, POST, PUT, PATCH, DELETE), configure custom headers and payloads, handle HTTP error statuses, cancel inflight requests with `AbortController`, and implement authenticated client architectures.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        Fetch Request Lifecycle                         │
├────────────────────────────────────────────────────────────────────────┤
│  Client App ──fetch(url, options)──> [ Network Gateway ]               │
│                                                │                       │
│  Client App <──Response (HTTP Headers/Status)──┘                       │
│       │                                                                │
│       ├── Check: response.ok (200-299 Status Range?)                   │
│       │     ├── YES: await response.json() ──> [ Process Data ]        │
│       │     └── NO:  throw new HttpError(response.status)              │
│       └── Abort Signal: controller.abort() ──> [ Cancel Inflight ]     │
└────────────────────────────────────────────────────────────────────────┘
```

## HTTP Basics and Common Methods

RESTful web APIs map operations to standard HTTP methods:
- **`GET`**: Retrieves data from the server (safe and idempotent; should have no request body).
- **`POST`**: Submits new data to the server to create a resource.
- **`PUT`**: Replaces an existing resource completely with the submitted payload.
- **`PATCH`**: Partially updates specific fields of an existing resource.
- **`DELETE`**: Removes a resource from the server.

## The Fetch API: Anatomy and JSON Parsing

The `fetch()` function accepts a resource URL and an optional configuration object, returning a `Promise` that resolves to a `Response` object.

A critical nuance of `fetch()`: **A Fetch Promise only rejects on true network failures** (DNS resolution errors, offline network connection). It **does not reject on HTTP 404, 401, or 500 errors**! You must inspect `response.ok` (which is `true` for status codes `200-299`) to handle HTTP application errors:

```javascript
async function fetchUserProfile(userId) {
  const response = await fetch(`https://api.example.com/v1/users/${userId}`);

  // Crucial check: Fetch does not reject on 4xx/5xx errors
  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
  }

  // Parse JSON response stream
  const userData = await response.json();
  return userData;
}
```

## Sending Request Payloads: POST, PUT, and Headers

When sending data to an API, you must specify the HTTP `method`, set the `Content-Type` header (usually `application/json`), and serialize the JavaScript object into a JSON string using `JSON.stringify()`:

```javascript
async function createNewProduct(productData) {
  const response = await fetch("https://api.example.com/v1/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": "Bearer tok_live_99882233"
    },
    body: JSON.stringify(productData)
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || `Creation failed with status ${response.status}`);
  }

  return await response.json();
}
```

## Request Cancellation with `AbortController`

In real-world applications, users frequently navigate away from pages, close modals, or type into fast autocomplete inputs. Allowing previous uncompleted search requests to finish can waste bandwidth and trigger **race conditions** (where an older slow request resolves after a newer fast request, displaying stale data).

The **`AbortController`** API enables aborting one or more fetch requests on demand:

```javascript
class SearchClient {
  constructor() {
    this.currentController = null;
  }

  async search(query) {
    // Abort previous inflight search if still running
    if (this.currentController) {
      this.currentController.abort();
    }

    // Create a new controller for the new request
    this.currentController = new AbortController();
    const { signal } = this.currentController;

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal });
      if (!response.ok) throw new Error("Search failed");
      return await response.json();
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Search request was canceled by a newer query");
        return null;
      }
      throw error;
    }
  }
}
```

## Setting Request Timeouts

You can combine `AbortController` with `AbortSignal.timeout(ms)` to enforce strict network timeouts:

```javascript
async function fetchWithTimeout(url, timeoutMs = 5000) {
  const signal = AbortSignal.timeout(timeoutMs);

  try {
    const response = await fetch(url, { signal });
    return await response.json();
  } catch (err) {
    if (err.name === "TimeoutError") {
      throw new Error(`Request timed out after ${timeoutMs}ms`);
    }
    throw err;
  }
}
```

## Summary

The Fetch API provides a standardized Promise-based interface for network communication. Always check `response.ok` before parsing response bodies, as fetch does not reject on HTTP 4xx/5xx status codes. Provide `Content-Type: application/json` and serialize bodies with `JSON.stringify()`. Use `AbortController` to cancel stale requests and avoid UI race conditions, and utilize `AbortSignal.timeout()` to enforce network request deadlines.

## Best Practices

1. **Always Check `response.ok`**: Never assume a resolved `fetch()` was successful; explicitly verify `if (!response.ok)`.
2. **Use `AbortController` on Typeahead/Search Inputs**: Cancel preceding keystroke queries before launching a new request.
3. **Encapsulate an API Client**: Build a centralized API service wrapper that manages base URLs, auth headers, and common error logging.
4. **Implement Request Timeouts**: Always attach `AbortSignal.timeout()` to prevent hung network requests.
5. **Handle Token Expiration Gracefully**: Implement an HTTP interceptor to detect 401 Unauthorized responses and trigger token refresh workflows.
