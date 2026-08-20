---
title: 'CORS & Same-Origin Policy in Depth'
description: 'Master web security boundaries: Same-Origin Policy (scheme, host, port), Cross-Origin Resource Sharing (CORS), simple requests, preflight OPTIONS checks, and resolving CORS errors.'
order: 10
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 40
prerequisites: ['/learn/http-and-apis/05-http-headers']
---

# CORS & Same-Origin Policy in Depth

Every web developer has encountered the dreaded browser console error: *"Access to fetch at 'https://api.example.com' from origin 'https://my-app.com' has been blocked by CORS policy."*

To understand why this happens and how to resolve it correctly, one must understand the browser's foundational security rule: the **Same-Origin Policy (SOP)**, and the controlled exception mechanism: **Cross-Origin Resource Sharing (CORS)**.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Same-Origin Policy Comparison               │
│                                                             │
│  Base Origin: https://front-heaven.com:443                  │
├──────────────────────────────────┬───────────┬──────────────┤
│ Target URL                       │ Same Origin? Reason      │
├──────────────────────────────────┼───────────┼──────────────┤
│ https://front-heaven.com/about   │ YES       │ Match        │
│ https://front-heaven.com:8080/   │ NO        │ Diff Port    │
│ http://front-heaven.com/         │ NO        │ Diff Scheme  │
│ https://api.front-heaven.com/    │ NO        │ Diff Subdomain
└──────────────────────────────────┴───────────┴──────────────┘
```

## 1. What is an Origin?

An **Origin** is defined by the exact combination of three components:
$$\text{Origin} = \text{Scheme (Protocol)} + \text{Host (Domain)} + \text{Port}$$

If any of these three elements differ, the request is considered **Cross-Origin**.

## 2. What is CORS?

**Cross-Origin Resource Sharing (CORS)** is an HTTP-header-based security mechanism that allows servers to explicitly declare which foreign origins are permitted to access their resources.

CORS is enforced **strictly by web browsers** to protect users. If an attacker's website runs JavaScript attempting to fetch private account data from your online bank, the browser blocks the response unless the bank's server explicitly permits the attacker's origin.

## 3. Simple Requests vs Preflight Requests

### Simple Requests
Requests using `GET`, `HEAD`, or simple `POST` with standard headers (`Content-Type: application/x-www-form-urlencoded`, `multipart/form-data`, `text/plain`) are sent directly without a preflight check.

### Preflight Requests (`OPTIONS`)
If a request contains custom headers (`Authorization: Bearer ...`) or JSON content type (`Content-Type: application/json`), the browser automatically sends an HTTP **`OPTIONS`** preflight request first to ask the server for permission:

```http
OPTIONS /api/v1/users HTTP/1.1
Host: api.company.com
Origin: https://front-heaven.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: authorization, content-type
```

Server response permitting access:

```http
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://front-heaven.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Authorization, Content-Type
Access-Control-Max-Age: 86400
```

Once the preflight succeeds, the browser transmits the actual `POST` request.

## 4. How to Fix CORS Errors Correctly

> [!IMPORTANT]
> **CORS is configured on the SERVER, not on the client!**
> You cannot fix a CORS error by adding headers to your frontend `fetch()` call.

To fix CORS:
1. **Configure Backend CORS Headers**: Configure your backend server (Express, NestJS, Spring, Django) to return `Access-Control-Allow-Origin: https://front-heaven.com` (or `*` for public APIs).
2. **Use a Development Proxy**: During local frontend development, configure a Vite/Nuxt/Angular dev server proxy to forward `/api` calls to the backend without triggering cross-origin browser checks.

## Summary & Key Takeaways

- Same-Origin Policy blocks client-side JavaScript from reading cross-origin responses.
- CORS is a browser security mechanism configured on the backend server.
- Preflight `OPTIONS` requests verify permissions before sending complex requests.
- `Access-Control-Allow-Origin` specifies allowed frontend origins.

## Best Practices & Senior Guidance

1. **Never Set `Access-Control-Allow-Origin: *` with Credentials**: If using cookies or auth headers, you must specify the exact origin and set `Access-Control-Allow-Credentials: true`.
2. **Use Dev Proxies in Local Environments**: Configure local CLI proxies in `angular.json` or `nuxt.config.ts` to avoid CORS issues during development.
