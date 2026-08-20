---
title: 'API & Web Security: CSRF, CSP, Replay & Signatures'
description: 'Master enterprise API security: Cross-Site Request Forgery (CSRF), Content Security Policy (CSP), Cross-Site Scripting (XSS), Clickjacking, HMAC Request Signing, and Replay Attack defense.'
order: 34
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 55
prerequisites: ['/learn/http-and-apis/16-cookies']
---

# API & Web Security: CSRF, CSP, Replay & Signatures

Modern web applications operate in a hostile threat environment. Securing enterprise APIs requires multi-layered defense-in-depth: protecting client cookies against **CSRF**, enforcing strict browser execution boundaries with **Content Security Policy (CSP)**, preventing injection attacks, and securing high-value transactions with **HMAC Request Signing**.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Enterprise API Security Guardrails          │
├───────────────────┬─────────────────────────────────────────┤
│ Vulnerability     │ Definitive Defense Mechanism            │
├───────────────────┼─────────────────────────────────────────┤
│ CSRF              │ SameSite=Strict/Lax Cookies +           │
│                   │ Anti-CSRF Synchronizer Tokens / Origin  │
├───────────────────┼─────────────────────────────────────────┤
│ XSS Injection     │ Strict Content Security Policy (CSP) +  │
│                   │ Framework Auto-Escaping + HttpOnly      │
├───────────────────┼─────────────────────────────────────────┤
│ Clickjacking      │ X-Frame-Options: DENY / CSP frame-ancest│
├───────────────────┼─────────────────────────────────────────┤
│ Replay Attacks    │ Timestamp Verification + Request Nonce  │
├───────────────────┼─────────────────────────────────────────┤
│ Payload Tampering │ HMAC-SHA256 Cryptographic Signatures    │
└───────────────────┴─────────────────────────────────────────┘
```

## 1. Content Security Policy (CSP)

A **Content Security Policy (CSP)** header restricts what scripts, styles, images, and API origins the browser is permitted to execute:

```http
Content-Security-Policy: default-src 'self'; \
                         script-src 'self' 'nonce-rAnd0m123'; \
                         connect-src 'self' https://api.front-heaven.com; \
                         img-src 'self' data: https://cdn.front-heaven.com; \
                         frame-ancestors 'none';
```

If an attacker injects an evil script `<script src="https://evil.com/malware.js">`, the browser intercepts and blocks the script immediately!

## 2. HMAC Request Signing & Replay Attack Defense

For banking, cloud infrastructure, or financial webhook calls (e.g. AWS Signature Version 4 or Stripe webhooks), requests are signed using **HMAC-SHA256**:

```typescript
import { createHmac } from 'crypto';

export function signApiRequest(payload: string, secretKey: string, timestamp: number, nonce: string) {
  const message = `${timestamp}.${nonce}.${payload}`;
  const signature = createHmac('sha256', secretKey).update(message).digest('hex');

  return {
    'X-Signature': signature,
    'X-Timestamp': timestamp.toString(),
    'X-Nonce': nonce
  };
}
```

The server:
1. Rejects any request where `Math.abs(currentTime - timestamp) > 300` (5-minute replay window).
2. Verifies the `X-Nonce` has not been seen in Redis within the last 5 minutes.
3. Computes the HMAC signature; if mismatched, rejects with `401 Unauthorized`.

## Summary & Key Takeaways

- CSP restricts allowed script and connection origins in browsers.
- Anti-CSRF tokens and SameSite cookies neutralize cross-site request forgery.
- HMAC signatures combined with timestamps and nonces eliminate replay attacks and payload tampering.

## Best Practices & Senior Guidance

1. **Deploy CSP in Report-Only Mode First**: Use `Content-Security-Policy-Report-Only` with a report URI to audit violations before enforcing strict blocking.
2. **Never Trust Client-Sent Timestamps Without Server Window Checks**: Enforce a strict 5-minute clock drift tolerance on signed payloads.
