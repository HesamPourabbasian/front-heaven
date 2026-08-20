---
title: 'HTTP Caching: Cache-Control, ETags & 304 Validation'
description: 'Master HTTP caching architecture: Cache-Control directives (max-age, no-cache, no-store, stale-while-revalidate), ETags, Last-Modified validation, and 304 Not Modified.'
order: 25
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 45
prerequisites: ['/learn/http-and-apis/05-http-headers']
---

# HTTP Caching: Cache-Control, ETags & 304 Validation

The fastest and cheapest network request is the request that never needs to be sent. **HTTP Caching** eliminates redundant network latency, reduces server infrastructure load, and provides instant navigation experiences by reusing previously fetched responses.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Conditional Cache Validation Lifecycle      │
│                                                             │
│  1. Client sends: GET /products (Headers: If-None-Match: "e123")
│             │                                               │
│             ▼                                               │
│  2. Server compares ETag with current database state        │
│     ├── If Changed ──> Returns 200 OK + New JSON Body       │
│     └── If Same    ──> Returns 304 Not Modified (0 Body!)   │
│             │                                               │
│             ▼                                               │
│  3. Browser instantly serves cached representation          │
└─────────────────────────────────────────────────────────────┘
```

## 1. Master Cache-Control Directives

- **`max-age=3600`**: Cache response for 3600 seconds (1 hour).
- **`no-cache`**: The browser can cache the response, but **MUST revalidate with the server using ETags** before using it.
- **`no-store`**: Absolutely no caching allowed anywhere (used for private credit card data).
- **`public` vs `private`**: Allowed to be cached by shared CDN proxies (`public`) vs strictly in the end user's browser (`private`).
- **`stale-while-revalidate=60`**: Serve the stale cached copy instantly while fetching fresh data in the background!

## 2. ETag Validation & `304 Not Modified`

When a server returns an `ETag` (e.g. `ETag: "hash_4829"`), the browser stores the hash. On the next visit, the browser automatically sends `If-None-Match: "hash_4829"`. If data has not changed, the server returns **`304 Not Modified`** with zero response body bytes!

## Summary & Key Takeaways

- `Cache-Control` specifies caching rules for browsers and CDNs.
- `no-cache` forces revalidation via ETags; `no-store` forbids caching entirely.
- `stale-while-revalidate` provides zero-latency rendering with background refresh.
- `304 Not Modified` saves massive bandwidth during revalidation.

## Best Practices & Senior Guidance

1. **Use Content-Hashed Bundles with `max-age=31536000, immutable`**: For static assets with content hashes (`main.a8b2c.js`), cache for 1 year immutable.
2. **Use `no-cache` on `index.html`**: Ensure `index.html` is always revalidated so users immediately receive updated script hashes upon new deployments.
