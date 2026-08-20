---
title: 'HTTP Cookies: Security, SameSite & Attributes'
description: 'Master HTTP cookies: Session vs Persistent cookies, Set-Cookie attributes (Secure, HttpOnly, SameSite: Strict/Lax/None), cookie scoping (domain, path), and preventing CSRF attacks.'
order: 16
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 45
prerequisites: ['/learn/http-and-apis/15-authentication']
---

# HTTP Cookies: Security, SameSite & Attributes

An **HTTP Cookie** is a small piece of data sent by a web server via the `Set-Cookie` response header and stored by the user's web browser. The browser automatically attaches stored cookies to all subsequent requests made to that server via the `Cookie` header.

Cookies are the primary mechanism for managing user login sessions and tracking preferences. Mastering cookie security flags—**`HttpOnly`**, **`Secure`**, and **`SameSite`**—is essential for defending applications against Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF) attacks.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Hardened Enterprise Cookie Syntax           │
│                                                             │
│  Set-Cookie: session_id=abc123xyz;                          │
│              Secure;                                        │
│              HttpOnly;                                      │
│              SameSite=Strict;                               │
│              Path=/;                                        │
│              Domain=front-heaven.com;                       │
│              Max-Age=604800;                                │
└─────────────────────────────────────────────────────────────┘
```

## 1. Critical Cookie Security Flags

- **`HttpOnly`**: Prevents client-side JavaScript (`document.cookie`) from accessing the cookie. This makes it impossible for an XSS script injection to steal session identifiers!
- **`Secure`**: Enforces that the browser will **only** transmit the cookie over encrypted HTTPS connections.
- **`SameSite`**: Controls whether cookies are sent on cross-site requests, providing robust protection against CSRF:
  - `SameSite=Strict`: The cookie is NEVER sent on cross-site requests (even when clicking an external link to your site).
  - `SameSite=Lax` (Default): The cookie is sent on top-level navigation (clicking a link), but blocked on cross-site images, iframes, and AJAX POSTs.
  - `SameSite=None`: The cookie is sent on all cross-site requests (Mandates the `Secure` attribute).

## 2. Cookie Lifespan: Session vs Persistent

- **Session Cookies**: Omit `Expires` or `Max-Age`. Deleted automatically when the browser tab/window is closed.
- **Persistent Cookies**: Include `Max-Age=604800` (7 days in seconds) or `Expires=Date`. Persist across browser restarts until expired.

## Summary & Key Takeaways

- Cookies are stored by browsers and automatically attached to requests matching their Domain and Path.
- `HttpOnly` stops XSS token theft; `Secure` prevents plain-text sniffing.
- `SameSite=Strict` or `Lax` blocks Cross-Site Request Forgery (CSRF).

## Best Practices & Senior Guidance

1. **Always Set `HttpOnly; Secure; SameSite=Lax` for Auth Cookies**: This 3-flag combination provides default defense-in-depth against both XSS and CSRF attacks.
