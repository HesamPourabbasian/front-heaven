---
title: 'HTTP Status Codes: 2xx, 3xx, 4xx & 5xx'
description: 'Master HTTP status codes: Success (200, 201, 204), Redirection (301, 302, 304), Client Errors (400, 401, 403, 404, 409, 422, 429), and Server Errors (500, 502, 503, 504).'
order: 4
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 40
prerequisites: ['/learn/http-and-apis/03-http-methods']
---

# HTTP Status Codes: 2xx, 3xx, 4xx & 5xx

An **HTTP Status Code** is a 3-digit integer returned by the server in the response status line indicating the outcome of the client's request. Status codes are standardized by IETF specifications and categorized into 5 distinct classes based on their first digit.

Mastering status codes allows frontend developers to handle errors defensively, execute conditional retries, manage caching, and display clear feedback to users.

```text
┌─────────────────────────────────────────────────────────────┐
│                 The 5 HTTP Status Code Classes              │
├─────────┬───────────────────┬───────────────────────────────┤
│ Class   │ Category          │ Meaning                       │
├─────────┼───────────────────┼───────────────────────────────┤
│ 1xx     │ Informational     │ Request received, continuing. │
├─────────┼───────────────────┼───────────────────────────────┤
│ 2xx     │ Success           │ Action successfully received  │
│         │                   │ and accepted by the server.   │
├─────────┼───────────────────┼───────────────────────────────┤
│ 3xx     │ Redirection       │ Further action needed by      │
│         │                   │ client to complete request.   │
├─────────┼───────────────────┼───────────────────────────────┤
│ 4xx     │ Client Error      │ Bad syntax, unauthenticated,  │
│         │                   │ or invalid request by client. │
├─────────┼───────────────────┼───────────────────────────────┤
│ 5xx     │ Server Error      │ Server failed to fulfill an   │
│         │                   │ apparently valid request.     │
└─────────┴───────────────────┴───────────────────────────────┘
```

## 1. 2xx Success Codes

- **`200 OK`**: Standard success response for `GET`, `PUT`, or `PATCH`. Returns data in response body.
- **`201 Created`**: The request succeeded and a new resource was created (typically returned after `POST`). The `Location` header points to the new resource URL.
- **`202 Accepted`**: The request has been accepted for asynchronous processing, but processing has not completed.
- **`204 No Content`**: The request succeeded, but the server deliberately returns no body payload (frequently returned after `DELETE` or empty `PUT` updates).

## 2. 3xx Redirection Codes

- **`301 Moved Permanently`**: The resource URL has changed permanently. Search engines update their index to the new `Location` URL.
- **`302 Found` (Temporary Redirect)**: Temporary redirection; clients should continue using the original URL in the future.
- **`304 Not Modified`**: The client's cached copy is still fresh (verified via `ETag` or `If-Modified-Since`). The server transmits no body, saving bandwidth.
- **`307 Temporary Redirect` / `308 Permanent Redirect`**: Guarantees that the HTTP method (e.g. `POST`) is NOT changed to `GET` during redirection.

## 3. 4xx Client Error Codes

- **`400 Bad Request`**: Malformed request syntax or invalid JSON body payload.
- **`401 Unauthorized`**: Authentication is required and has failed or not been provided. (Missing or invalid Bearer token).
- **`403 Forbidden`**: The client is authenticated, but lacks permission/authorization to access the requested resource.
- **`404 Not Found`**: The server cannot find the requested resource URI.
- **`405 Method Not Allowed`**: The HTTP method is not supported for this endpoint (e.g. calling `DELETE /login`).
- **`409 Conflict`**: Request conflicts with current server state (e.g. creating an account with an email that already exists).
- **`422 Unprocessable Content`**: The JSON syntax is valid, but fails domain validation rules (e.g. password too short).
- **`429 Too Many Requests`**: Rate limit exceeded. The client should slow down and check the `Retry-After` header.

## 4. 5xx Server Error Codes

- **`500 Internal Server Error`**: An unhandled exception or crash occurred in server code.
- **`502 Bad Gateway`**: The reverse proxy/load balancer received an invalid response from the upstream backend service.
- **`503 Service Unavailable`**: The server is temporarily overloaded or down for maintenance.
- **`504 Gateway Timeout`**: The proxy/gateway did not receive a response from the upstream server within the timeout window.

## Summary & Key Takeaways

- 2xx indicates success (`200 OK`, `201 Created`, `204 No Content`).
- 3xx indicates redirection (`304 Not Modified` for caching).
- 4xx indicates client mistakes (`401` = unauthenticated, `403` = unauthorized, `404` = not found, `422` = validation error).
- 5xx indicates server failure (`500` = crash, `502` = bad gateway, `504` = timeout).

## Best Practices & Senior Guidance

1. **Differentiate 401 vs 403 Correctly**:
   - `401 Unauthorized`: "Who are you? Please log in."
   - `403 Forbidden`: "I know who you are, but you do not have permission to view this."
2. **Never Return 200 OK with an Error Body**: Avoid anti-patterns like `HTTP 200 OK` with body `{ "success": false, "error": "Crash" }`. Always use semantic HTTP status codes.
