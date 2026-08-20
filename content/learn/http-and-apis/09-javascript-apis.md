---
title: 'JavaScript Data Fetching: Fetch API & Axios'
description: 'Master data fetching in JavaScript: Fetch API, request configuration, headers, JSON deserialization, HTTP error handling, async/await, Axios, and AbortController cancellation.'
order: 9
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 45
prerequisites: ['/learn/http-and-apis/08-rest-apis']
---

# JavaScript Data Fetching: Fetch API & Axios

In frontend web applications, interacting with backend APIs is accomplished using JavaScript's native **Fetch API (`fetch()`)** or popular third-party HTTP client libraries like **Axios**.

Mastering modern asynchronous data fetching with `async/await`, error handling, typed responses, and request cancellation with **`AbortController`** ensures robust, resilient user experiences.

```text
┌─────────────────────────────────────────────────────────────┐
│                 JavaScript Fetch Request Lifecycle          │
│                                                             │
│  fetch('/api/users') ──> Returns Promise<Response>          │
│             │                                               │
│             ▼                                               │
│  Check response.ok (HTTP status in range 200–299)           │
│  ├── If true  ──> await response.json() ──> Typed Payload   │
│  └── If false ──> throw new Error(`HTTP ${response.status}`)│
│             │                                               │
│             ▼                                               │
│  Catch network disconnects / cancellations in catch block   │
└─────────────────────────────────────────────────────────────┘
```

## 1. The Native Fetch API (`fetch()`)

`fetch()` is built natively into all modern browsers and Node.js:

```typescript
export interface User {
  id: number;
  name: string;
  email: string;
}

export async function fetchUser(userId: number): Promise<User> {
  const response = await fetch(`https://api.front-heaven.com/users/${userId}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
    }
  });

  // CRITICAL: fetch() only rejects on network failure, NOT on 404 or 500!
  if (!response.ok) {
    throw new Error(`Failed to fetch user. Status: ${response.status} ${response.statusText}`);
  }

  const data: User = await response.json();
  return data;
}
```

## 2. Sending Data with POST, PUT & PATCH

```typescript
export async function createProduct(product: { name: string; price: number }) {
  const response = await fetch('https://api.front-heaven.com/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(product)
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => ({}));
    throw new Error(errorPayload.message || `HTTP error ${response.status}`);
  }

  return await response.json();
}
```

## 3. Request Cancellation with `AbortController`

When a user navigates away from a page or types rapidly into a search box, in-flight requests should be aborted to prevent race conditions and save bandwidth:

```typescript
export function searchWithAbort(searchTerm: string) {
  const controller = new AbortController();

  const requestPromise = fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`, {
    signal: controller.signal // Link abort signal to request
  })
  .then(res => res.json())
  .catch(err => {
    if (err.name === 'AbortError') {
      console.log('Search request was aborted by user');
    } else {
      console.error('Network error:', err);
    }
  });

  return { requestPromise, cancel: () => controller.abort() };
}
```

## Summary & Key Takeaways

- `fetch()` returns a `Promise<Response>`.
- `fetch()` does NOT reject on HTTP 4xx or 5xx status codes; you must check `response.ok`.
- Use `AbortController` and `signal` to cancel in-flight HTTP requests.
- `response.json()` parses the response body stream asynchronously.

## Best Practices & Senior Guidance

1. **Always Check `response.ok`**: Never write `const data = await (await fetch(url)).json()` without verifying `response.ok`. If the server returns a 500 HTML error page, `json()` will throw a confusing syntax error.
2. **Always Implement Request Timeouts**: Wrap `fetch()` with `AbortSignal.timeout(5000)` to ensure hanging network connections timeout gracefully after 5 seconds.
