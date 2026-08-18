---
title: 'HTML Security, CSP, Trusted Types & Iframe Sandboxing'
description: 'Master enterprise HTML security: Cross-Site Scripting (XSS) defense, Content Security Policy (CSP Level 3), Trusted Types, Clickjacking frame protection, Subresource Integrity (SRI), and Iframe sandboxing.'
order: 24
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 30
prerequisites:
  - /learn/html/23-advanced-forms-architecture
---

# HTML Security, CSP, Trusted Types & Iframe Sandboxing

Front-end applications execute directly within the untrusted environment of the user's browser. A single unescaped HTML string or unsecured third-party script can allow attackers to execute **Cross-Site Scripting (XSS)**, steal session cookies, deface the website, or execute unauthorized transactions.

In this lesson, we explore HTML-level security defenses: **Content Security Policy (CSP Level 3)**, **Trusted Types**, **Subresource Integrity (SRI)**, defending against Clickjacking, secure iframe sandboxing, and the **Permissions Policy**.

```text
┌────────────────────────────────────────────────────────────┐
│                    HTML Security Defense Matrix            │
├──────────────────┬─────────────────────────────────────────┤
│ Attack Vector    │ HTML Defense Countermeasure             │
├──────────────────┼─────────────────────────────────────────┤
│ DOM-based XSS    │ W3C Trusted Types + DOMPurify Sanitizer │
│ Inline Script XSS│ Content Security Policy (CSP) Nonce     │
│ CDN Hijacking    │ Subresource Integrity (SRI Hash)        │
│ Clickjacking     │ `frame-ancestors 'none'` / X-Frame-Opt  │
│ Untrusted Iframe │ `<iframe sandbox="allow-scripts ...">`  │
│ Camera/Mic Abuse │ Permissions-Policy HTTP Header          │
└──────────────────┴─────────────────────────────────────────┘
```

## 1. Defending Against Cross-Site Scripting (XSS) with CSP Level 3

**Cross-Site Scripting (XSS)** occurs when untrusted user input is parsed and executed as HTML or JavaScript.

Deploy a strict **Content Security Policy (CSP)** HTTP header using cryptographic nonces to completely block unauthorized inline scripts and unapproved domains:

```http
Content-Security-Policy: default-src 'self'; \
  script-src 'self' 'nonce-e4b1a8f9' 'strict-dynamic'; \
  style-src 'self' 'unsafe-inline'; \
  img-src 'self' https://images.mycdn.com data:; \
  connect-src 'self' https://api.front-heaven.dev; \
  frame-ancestors 'none'; \
  object-src 'none'; \
  base-uri 'self';
```

With `'strict-dynamic'` and a unique per-request nonce, any `<script>` tag injected by an attacker via a form or URL parameter is immediately blocked by the browser engine.

## 2. Preventing DOM-Based XSS with Trusted Types

Modern browsers support **W3C Trusted Types**, which prevents dangerous DOM sinks (`element.innerHTML = ...`, `eval()`, `document.write()`) from accepting raw unvalidated strings:

```http
Content-Security-Policy: require-trusted-types-for 'script';
```

```typescript
// Define a Trusted Types policy using DOMPurify
import DOMPurify from "dompurify";

const sanitizePolicy = window.trustedTypes?.createPolicy("default", {
  createHTML: (dirtyHtml: string) => DOMPurify.sanitize(dirtyHtml),
});

// ✅ Compliant with Trusted Types (Safe from DOM XSS)
const cleanTrustedHtml = sanitizePolicy?.createHTML(userBioHtml) ?? userBioHtml;
document.getElementById("bio-container")!.innerHTML = cleanTrustedHtml as unknown as string;
```

## 3. Subresource Integrity (SRI) for External CDN Assets

If an external CDN host is compromised, attackers can replace legitimate libraries (like jQuery or Chart.js) with credential-stealing malware.

**Subresource Integrity (SRI)** instructs the browser to verify the cryptographic SHA-384 hash of the file before running it:

```html
<script
  src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"
  integrity="sha384-e6B5t2GZgO6X6N8M+1KqJz7/r3QeGqGfW4sTzWv3d0x2k6v9Gz2q3r5t6y7u8i9o"
  crossorigin="anonymous"
></script>
```

If a single character in the file changes on the CDN, the browser immediately blocks execution.

## 4. Secure Iframe Sandboxing

When embedding third-party content, widgets, or user-generated HTML in an `<iframe>`, lock down its capabilities using the `sandbox` attribute:

```html
<!-- Restrictive Sandbox: Blocks scripts, top-navigation, and form submission by default -->
<iframe
  src="https://third-party-widget.com"
  title="Customer Review Widget"
  sandbox="allow-scripts allow-same-origin"
  loading="lazy"
  width="500"
  height="300"
></iframe>
```

### Key Sandbox Directives:
- Omission of `sandbox`: Full permissions.
- `sandbox=""` (Empty): Maximum restriction (disables scripts, forms, popups, top navigation).
- `allow-scripts`: Allows JavaScript execution inside the iframe.
- **Never pair `allow-scripts` with `allow-same-origin` on untrusted domains**, as the embedded page could programmatically remove its own sandbox!

## Summary

- XSS vulnerabilities are prevented via strict CSP Level 3 policies, nonces, and input sanitization.
- W3C Trusted Types locks down dangerous DOM injection sinks like `innerHTML`.
- Subresource Integrity (SRI) verifies cryptographic hashes of third-party CDN scripts.
- The `sandbox` attribute restricts iframe permissions, preventing malicious redirects and cookie theft.
- `Permissions-Policy` headers control hardware API access (camera, microphone, geolocation).

## Best Practices

1. **Deploy CSP with Nonces**: Prevent unauthorized inline script execution.
2. **Always Add SRI Hashes to External Scripts**: Protect your application from compromised third-party CDNs.
3. **Always Sandbox Third-Party Iframes**: Restrict untrusted embedded content with `sandbox`.
4. **Sanitize User-Supplied HTML with DOMPurify**: Never assign unescaped strings directly to `innerHTML`.
