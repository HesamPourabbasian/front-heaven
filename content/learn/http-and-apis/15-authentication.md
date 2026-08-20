---
title: 'API Authentication: Sessions, Tokens & Rotation'
description: 'Master API authentication architectures: Session-based auth vs Token-based auth, API keys, HTTP Basic auth, Bearer tokens, Access vs Refresh tokens, and Token Rotation strategies.'
order: 15
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 45
prerequisites: ['/learn/http-and-apis/05-http-headers']
---

# API Authentication: Sessions, Tokens & Rotation

Authentication is the process of verifying who a client or user is. In modern web and API architecture, choosing the right authentication strategy—**Stateful Cookie Sessions** vs **Stateless Bearer Tokens** vs **API Keys**—determines system scalability, cross-domain capabilities, and security posture.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Session vs Token Authentication             │
├──────────────────────────────┬──────────────────────────────┤
│ Stateful Session Auth        │ Stateless Token Auth (JWT)   │
├──────────────────────────────┼──────────────────────────────┤
│ 1. User logs in.             │ 1. User logs in.             │
│ 2. Server creates session in │ 2. Server signs JWT token    │
│    Redis/DB & returns Cookie.│    and returns to client.    │
│ 3. Client transmits Cookie.  │ 3. Client sends Bearer token.│
│ 4. Server looks up session ID│ 4. Server verifies signature │
│    in Redis on EVERY call.   │    cryptographically (0 DB). │
└──────────────────────────────┴──────────────────────────────┘
```

## 1. Access Tokens & Refresh Tokens

In token-based architectures, using a single long-lived access token is dangerous (if stolen, an attacker has permanent access). Instead, use a **Dual-Token Architecture**:

1. **Access Token (Short-Lived: 15 Minutes)**:
   - Stateless JWT passed in `Authorization: Bearer <token>`.
   - Used to authorize everyday API requests.
2. **Refresh Token (Long-Lived: 7–30 Days)**:
   - Stored in a secure, `HttpOnly`, `Secure` cookie.
   - Sent only to `/api/auth/refresh` to request a new short-lived access token.

## 2. Refresh Token Rotation

To protect against token theft, enterprise systems implement **Refresh Token Rotation**:
- Every time a refresh token is used to obtain a new access token, the server **invalidates the old refresh token and issues a brand-new one**.
- If an attacker attempts to replay an already-used refresh token, the server detects the breach, immediately revokes the entire token family, and logs out the user!

## Summary & Key Takeaways

- Stateful sessions require central database lookups; stateless tokens verify cryptographically.
- Dual-token architecture pairs short-lived access tokens with secure refresh tokens.
- Refresh token rotation detects and neutralizes stolen token replay attacks.

## Best Practices & Senior Guidance

1. **Never Store Access Tokens in `localStorage`**: Tokens in `localStorage` are vulnerable to XSS theft; keep access tokens in JavaScript memory and refresh tokens in `HttpOnly` cookies.
2. **Keep Access Token Lifespans Short (15 min)**: Minimizes the vulnerability window if a token is intercepted.
