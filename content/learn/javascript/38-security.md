---
title: 'Security'
description: 'Master frontend and JavaScript security: Cross-Site Scripting (XSS, DOM XSS), Cross-Site Request Forgery (CSRF), Cross-Origin Resource Sharing (CORS), Content Security Policy (CSP), Trusted Types, Same-Origin Policy, Prototype Pollution, and secure auth.'
order: 38
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 45
prerequisites:
  - /learn/javascript/37-advanced-web-apis
---

# Frontend Security

Web security is a paramount responsibility in modern frontend engineering. Client-side applications run directly within an untrusted environment—the end-user's browser—where malicious actors can inspect source code, modify execution state, inject malicious scripts, and exploit cross-origin boundaries.

A comprehensive security architecture protects against **Cross-Site Scripting (XSS)**, **Cross-Site Request Forgery (CSRF)**, **Prototype Pollution**, and supply-chain vulnerabilities, while leveraging browser security standards like **Content Security Policy (CSP)**, **Trusted Types**, and **CORS**.

In this lesson, we will explore XSS vectors and defenses, implement Content Security Policy headers, analyze CORS and the Same-Origin Policy, guard against Prototype Pollution, secure authentication tokens, and configure secure HTTP cookies.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        Frontend Attack Surface                         │
├───────────────────────────────────┬────────────────────────────────────┤
│ Vulnerability Vector              │ Primary Defense Strategy           │
├───────────────────────────────────┼────────────────────────────────────┤
│ Cross-Site Scripting (XSS)        │ Contextual Encoding, CSP, Sanitizer│
│ DOM-based XSS                     │ Trusted Types, avoid innerHTML     │
│ Cross-Site Request Forgery (CSRF) │ SameSite=Strict Cookies, Anti-CSRF │
│ Prototype Pollution               │ Object.freeze, Object.create(null) │
│ Cross-Origin Data Leakage         │ Same-Origin Policy, CORS Preflight │
│ Credential / Token Theft          │ HttpOnly, Secure, SameSite Cookies │
└───────────────────────────────────┴────────────────────────────────────┘
```

## Cross-Site Scripting (XSS) and DOM XSS

**Cross-Site Scripting (XSS)** occurs when an attacker successfully injects malicious JavaScript into a trusted web application. Once executed, the malicious script runs with the full authority of the victim's session, capable of stealing session cookies, capturing keystrokes, and manipulating the DOM.

- **Stored XSS**: Malicious input is stored in the database and delivered to subsequent viewers.
- **Reflected XSS**: Injected script is reflected off the web server in an immediate error or search parameter.
- **DOM XSS**: The vulnerability exists entirely within client-side JavaScript code that unsafely reads from a user-controlled *Source* (`location.search`, `hash`) and writes to an execution *Sink* (`innerHTML`, `eval`, `document.write`).

```javascript
// VULNERABLE DOM XSS Sink
const params = new URLSearchParams(window.location.search);
const userQuery = params.get("q"); // Untrusted Source
// document.getElementById("search-results").innerHTML = userQuery; // DANGEROUS SINK!

// SECURE DEFENSE: Contextual Text Encoding / textContent
const safeContainer = document.getElementById("search-results");
safeContainer.textContent = userQuery; // Immune to script injection!
```

## Content Security Policy (CSP) and Trusted Types

**Content Security Policy (CSP)** is an HTTP response header that restricts the resources (scripts, styles, images, fonts, frames) the browser is allowed to load and execute:

```http
Content-Security-Policy: default-src 'self'; script-src 'self' https://trusted-cdn.com; object-src 'none'; require-trusted-types-for 'script';
```

**Trusted Types** enforces that dangerous DOM sinks (like `element.innerHTML`) accept only validated `TrustedHTML` policy objects rather than raw strings:

```javascript
// Creating a Trusted Types Sanitization Policy
if (window.trustedTypes && trustedTypes.createPolicy) {
  const sanitizePolicy = trustedTypes.createPolicy("dom-sanitizer", {
    createHTML: (string) => DOMPurify.sanitize(string) // Sanitized with DOMPurify
  });

  // Assigning sanitized TrustedHTML
  const cleanHTML = sanitizePolicy.createHTML("<p>User bio text</p>");
  document.getElementById("bio").innerHTML = cleanHTML;
}
```

## Prototype Pollution

**Prototype Pollution** is a vulnerability unique to JavaScript where an attacker manipulates object prototype properties (such as `Object.prototype.__proto__`), injecting malicious properties that are inherited by every object across the entire application runtime.

This vulnerability frequently occurs during recursive deep-merge, object cloning, or query-string parsing operations:

```javascript
// Vulnerable Deep Merge Function
function unsafeMerge(target, source) {
  for (const key in source) {
    if (typeof source[key] === "object" && source[key] !== null) {
      target[key] = unsafeMerge(target[key] || {}, source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

// Attacker Payload polluting Object.prototype
const maliciousPayload = JSON.parse('{"__proto__": {"isAdmin": true}}');
unsafeMerge({}, maliciousPayload);

const regularUser = {};
console.log(regularUser.isAdmin); // true! (Object.prototype was polluted!)
```

### Defense Against Prototype Pollution:
1. Block sensitive keys (`__proto__`, `constructor`, `prototype`).
2. Use `Object.create(null)` for key-value dictionary objects.
3. Freeze the base prototype: `Object.freeze(Object.prototype)`.

## Cross-Origin Resource Sharing (CORS) and Same-Origin Policy

The **Same-Origin Policy (SOP)** restricts how a document or script loaded from one *Origin* (Protocol + Domain + Port) can interact with resources from another origin.

**CORS** is the HTTP header mechanism that allows servers to selectively permit cross-origin access. When a browser makes a "non-simple" cross-origin request (e.g. `POST` with `Content-Type: application/json` or custom headers), it automatically sends an `OPTIONS` **Preflight Request** before the actual request:

```http
OPTIONS /api/data HTTP/1.1
Origin: https://client-app.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type, Authorization
```

## Secure Authentication and Cookies

Storing JWT authentication tokens in `localStorage` exposes them to complete theft via XSS vulnerabilities.

### Secure Token Storage Best Practice:
- Store session authentication tokens in **`HttpOnly` Cookies** set by the backend server.
- Flags: `HttpOnly` (blocks JavaScript access), `Secure` (HTTPS only), and `SameSite=Strict` or `SameSite=Lax` (blocks CSRF cross-origin submissions).

```http
Set-Cookie: auth_session=jwt_token_payload; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400
```

## Summary

Frontend security requires defense-in-depth across multiple architectural layers. Defend against XSS by sanitizing inputs with DOMPurify, avoiding dangerous DOM sinks, and enforcing strict Content Security Policies (CSP) and Trusted Types. Prevent Prototype Pollution by validating keys and freezing prototypes. Guard cross-origin interactions via SOP and CORS, and store sensitive credentials exclusively in `HttpOnly`, `Secure`, `SameSite` cookies.

## Best Practices

1. **Never Store Authentication JWTs in `localStorage`**: Use `HttpOnly`, `Secure`, `SameSite=Strict` cookies to eliminate token theft via XSS.
2. **Sanitize HTML with DOMPurify**: If you must render dynamic HTML markup, sanitize it using trusted libraries like DOMPurify.
3. **Enforce a Strict Content Security Policy (CSP)**: Disallow `'unsafe-inline'` and `'unsafe-eval'` scripts in your CSP headers.
4. **Guard Against Prototype Pollution in Deep Merges**: Always validate that keys do not match `__proto__`, `constructor`, or `prototype`.
5. **Audit Dependencies with `npm audit`**: Automatically scan dependencies in CI pipelines to catch known vulnerabilities before deployment.
