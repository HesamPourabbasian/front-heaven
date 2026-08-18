---
title: 'Front-End Security, CSP & Supply Chain Defense'
description: 'Master enterprise web application security: Cross-Site Scripting (XSS), CSRF, Content Security Policy (CSP Level 3), Subresource Integrity (SRI), Token Storage (HttpOnly vs localStorage), and Supply Chain Auditing.'
order: 14
difficulty: 'advanced'
category: 'Senior Front-End Engineering'
estimatedMinutes: 50
prerequisites:
  - /learn/advanced-topics/13-accessibility-engineering
---

# Front-End Security, CSP & Supply Chain Defense

Front-end applications are executed directly on untrusted client hardware inside the user's browser. Senior engineers design security architectures with a **Defense-in-Depth** strategy: assuming that an attacker will attempt Cross-Site Scripting (XSS), token extraction, prototype pollution, clickjacking, and third-party npm supply chain attacks.

In this lesson, we explore browser security primitives (**Same-Origin Policy**, **CORS**, **CSP Level 3**, **Trusted Types**, **SRI**), front-end application vulnerabilities (XSS, CSRF, Clickjacking), secure token storage architectures, and npm supply chain defense.

```text
┌────────────────────────────────────────────────────────────┐
│                Front-End Defense-in-Depth Matrix           │
├──────────────────┬─────────────────────────────────────────┤
│ Attack Vector    │ Primary Defensive Countermeasure        │
├──────────────────┼─────────────────────────────────────────┤
│ Stored / DOM XSS │ Content Security Policy (CSP) + Escaping│
│ CSRF             │ SameSite=Lax/Strict Cookies + CSRF Token│
│ Clickjacking     │ Frame-Ancestors CSP / X-Frame-Options   │
│ CDN Tampering    │ Subresource Integrity (SRI Hash)        │
│ Malicious npm pkg│ Socket.dev / npm audit / Provenance     │
│ Token Theft      │ HttpOnly, Secure, SameSite Cookies      │
└──────────────────┴─────────────────────────────────────────┘
```

## 1. Cross-Site Scripting (XSS) & Content Security Policy (CSP Level 3)

**Cross-Site Scripting (XSS)** occurs when an attacker injects malicious JavaScript into a victim's browser session, allowing them to steal session cookies, exfiltrate private user data, or perform actions on the user's behalf.

- **Stored XSS**: Malicious script is saved in the database (e.g., user comments) and rendered to all viewers.
- **Reflected XSS**: Script is reflected off a URL query parameter without escaping.
- **DOM XSS**: Client-side JavaScript reads from an untrusted source (`location.hash`, `innerHTML`) and passes it into an execution sink (`eval()`, `document.write()`, `el.innerHTML = ...`).

### Hardening with Content Security Policy (CSP):
CSP is an HTTP response header that restricts which script sources, connections, images, and frames the browser is allowed to execute:

```http
Content-Security-Policy: default-src 'self'; \
  script-src 'self' 'nonce-rAnd0m123' 'strict-dynamic'; \
  style-src 'self' 'unsafe-inline'; \
  img-src 'self' https://images.mycdn.com data:; \
  connect-src 'self' https://api.myenterprise.com; \
  frame-ancestors 'none'; \
  object-src 'none'; \
  base-uri 'self';
```

With `'strict-dynamic'` and cryptographic **Nonces** (`nonce-rAnd0m123`), inline injected `<script>` tags injected by attackers are completely blocked by the browser engine!

## 2. Secure Authentication: HttpOnly Cookies vs `localStorage`

Storing sensitive JWT access tokens in `localStorage` or `sessionStorage` is a severe security anti-pattern because **any JavaScript running on the page (including third-party analytics or XSS exploits) has unrestricted access to `localStorage`**:

```http
# ✅ Secure Token Cookie Configuration
Set-Cookie: auth_token=eyJhbGciOi...; \
  HttpOnly; \
  Secure; \
  SameSite=Strict; \
  Path=/; \
  Max-Age=3600
```

### Explanation of Security Flags:
1. **`HttpOnly`**: Prohibits client-side JavaScript (`document.cookie`) from reading the cookie, making token theft via XSS impossible.
2. **`Secure`**: Guarantees the cookie is transmitted only over encrypted HTTPS connections.
3. **`SameSite=Strict` (or `Lax`)**: Protects against Cross-Site Request Forgery (CSRF) by preventing the browser from sending the cookie on cross-site requests.

## 3. Subresource Integrity (SRI)

When loading third-party scripts or CSS from public CDNs, an attacker who compromises the CDN server could alter the script to harvest user passwords.

**Subresource Integrity (SRI)** allows the browser to verify the cryptographic SHA-384 hash of the downloaded file before executing it:

```html
<script
  src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"
  integrity="sha384-e6B5t2GZgO6X6N8M+1KqJz7/r3QeGqGfW4sTzWv3d0x2k6v9Gz2q3r5t6y7u8i9o"
  crossorigin="anonymous"
></script>
```

If even a single byte in the file is modified on the CDN, the browser immediately rejects and blocks the script.

## 4. Preventing Prototype Pollution

**Prototype Pollution** occurs when attacker-controlled JSON inputs modify the base `Object.prototype`, affecting all JavaScript objects in the application:

```javascript
// ❌ Vulnerable deep merge function allowing __proto__ pollution
function deepMerge(target, source) {
  for (const key in source) {
    if (key === "__proto__" || key === "constructor" || key === "prototype") {
      continue; // Block dangerous prototype keys!
    }
    if (typeof source[key] === "object" && source[key] !== null) {
      if (!target[key]) target[key] = {};
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}
```

## 5. Supply Chain Security & Dependency Auditing

Modern web applications depend on hundreds of third-party npm packages. Secure your supply chain:
1. **Lockfiles (`package-lock.json` / `pnpm-lock.yaml`)**: Pin exact dependency versions and cryptographic integrity hashes.
2. **Automated Vulnerability Scanning**: Run `npm audit` and configure GitHub Dependabot / Snyk in CI.
3. **Package Provenance**: Verify that published npm packages were built via signed GitHub Actions workflows.

## Summary

- XSS occurs when untrusted input is executed as JavaScript; Content Security Policy (CSP Level 3) blocks unauthorized scripts.
- Never store JWT access tokens in `localStorage`; store them in `HttpOnly`, `Secure`, `SameSite` cookies.
- Subresource Integrity (SRI) validates cryptographic hashes of CDN assets to protect against CDN hijacking.
- Deep merge utilities must filter `__proto__` and `constructor` to prevent prototype pollution.
- Supply chain security requires strict lockfiles, automated dependency audits, and signed package provenance.

## Best Practices

1. **Deploy a Strict Content Security Policy (CSP)**: Block un-nonced inline scripts and restrict `connect-src` to approved API domains.
2. **Store Auth Tokens in `HttpOnly` Cookies**: Keep sensitive session tokens invisible to client-side JavaScript.
3. **Always Add SRI Hashes to External CDN Assets**: Protect your users from compromised third-party script CDNs.
4. **Sanitize HTML with DOMPurify**: If rendering rich HTML from users, sanitize it through `DOMPurify.sanitize(dirtyHtml)`.
