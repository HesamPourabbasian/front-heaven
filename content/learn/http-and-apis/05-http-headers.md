---
title: 'HTTP Headers: Negotiation, Auth & Caching'
description: 'Master HTTP headers: Content-Type, Accept, Authorization, Cache-Control, Cookie/Set-Cookie, Origin, Referer, User-Agent, and CORS control headers.'
order: 5
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 35
prerequisites: ['/learn/http-and-apis/02-http-fundamentals']
---

# HTTP Headers: Negotiation, Auth & Caching

**HTTP Headers** are key-value metadata pairs included in both HTTP Requests and HTTP Responses. Headers communicate critical operational context: data representation formats, client identity, authorization credentials, caching policies, cookies, and browser security restrictions.

Headers follow the case-insensitive format `Header-Name: value`.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Core HTTP Headers by Category               │
├───────────────┬─────────────────────────────────────────────┤
│ Representation│ Content-Type, Accept, Content-Length,       │
│               │ Content-Encoding (gzip, br)                 │
├───────────────┼─────────────────────────────────────────────┤
│ Authentication│ Authorization (Bearer <JWT>, Basic <base64>)│
├───────────────┼─────────────────────────────────────────────┤
│ State/Cookies │ Cookie, Set-Cookie (HttpOnly, Secure)       │
├───────────────┼─────────────────────────────────────────────┤
│ Caching       │ Cache-Control, ETag, If-None-Match, Expires │
├───────────────┼─────────────────────────────────────────────┤
│ Context/Sec   │ Origin, Referer, User-Agent, Host, CSP      │
└───────────────┴─────────────────────────────────────────────┘
```

## 1. Content Negotiation Headers

Content negotiation allows the client and server to agree on the optimal data format:

- **`Content-Type`**: Informs the recipient of the media type of the sent payload.
  - `application/json`: Standard JSON document.
  - `multipart/form-data`: Binary file uploads.
  - `application/x-www-form-urlencoded`: HTML form submissions.
- **`Accept`**: Informs the server what media types the client understands:
  - `Accept: application/json, text/plain, */*`

## 2. Authentication & Authorization Headers

- **`Authorization: Bearer <token>`**: Transmits a JSON Web Token (JWT) or OAuth 2.0 access token to authenticate API requests.
- **`Authorization: Basic <base64-credentials>`**: Transmits base64-encoded `username:password` pairs.

## 3. Caching Control Headers

- **`Cache-Control`**: Dictates caching behavior across browsers, CDNs, and proxies:
  - `max-age=3600`: Cache response for 1 hour (3600 seconds).
  - `no-cache`: Must revalidate with server before serving cached copy.
  - `no-store`: Never store response in any cache (confidential banking data).
  - `public` / `private`: Allow CDN caching vs browser-only caching.
- **`ETag`**: A unique fingerprint hash of the resource returned by the server.
- **`If-None-Match: "<hash>"`**: Client passes cached ETag to server. If unchanged, server returns `304 Not Modified`.

## 4. Origin & Referrer Headers

- **`Origin`**: Informs the server of the scheme, host, and port where the request originated (`Origin: https://front-heaven.com`). Used in CORS evaluation.
- **`Referer`**: The full URL of the preceding web page from which the link was followed.

## Summary & Key Takeaways

- Headers communicate metadata for content negotiation, auth, caching, and security.
- `Content-Type` describes the sent payload; `Accept` requests the desired return format.
- `Authorization: Bearer <token>` is the enterprise standard for API authentication.
- `Cache-Control` and `ETag` prevent redundant network transmissions.

## Best Practices & Senior Guidance

1. **Always Set `Content-Type: application/json` on POST/PUT**: Failing to set `Content-Type` often causes backend body parsers to ignore JSON payloads.
2. **Never Transmit Passwords in Custom Headers**: Transmit credentials in standard `Authorization` headers over HTTPS.
