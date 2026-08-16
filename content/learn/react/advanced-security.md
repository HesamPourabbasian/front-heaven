---
title: "Advanced React Security: XSS, CSRF, CSP"
technology: "react"
difficulty: "advanced"
estimatedMinutes: 25
order: 39
description: "Securing React applications against Cross-Site Scripting (XSS), CSRF, Content Security Policies, and token storage exploits."
---

# Advanced React Security: XSS, CSRF, CSP

Security in frontend web applications is vital for protecting user data and preventing unauthorized access. While React has built-in protections against basic attacks, insecure patterns (such as unescaped HTML injection, unsafe URL rendering, and improper token storage) can leave applications vulnerable to exploitation.

In this lesson, you will learn how to defend against Cross-Site Scripting (XSS), mitigate Cross-Site Request Forgery (CSRF), configure robust Content Security Policies (CSP), and manage secrets securely.

## Cross-Site Scripting (XSS) in React

React automatically escapes string variables rendered in JSX (`<div>{userInput}</div>`), converting dangerous characters (`<`, `>`, `&`) into harmless HTML entities.

However, vulnerabilities arise in three specific scenarios:

### 1. `dangerouslySetInnerHTML`
Never inject raw HTML from untrusted users without sanitization:
```jsx
// ❌ DANGEROUS: Susceptible to XSS injection!
<div dangerouslySetInnerHTML={{ __html: userComment }} />

// ✅ SECURE: Sanitize first using DOMPurify:
import DOMPurify from 'dompurify';

<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userComment) }} />
```

### 2. Unsafe URL Attribute Injection (`javascript:` URLs)
If a user provides a link URL, an attacker could supply `javascript:stealTokens()`:
```jsx
// ❌ Vulnerable:
<a href={userWebsite}>Visit Site</a>

// ✅ Secure: Validate protocol:
function isSafeUrl(url) {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}
```

## Content Security Policy (CSP)

A Content Security Policy (CSP) is an HTTP response header that restricts which scripts, styles, and images the browser is allowed to execute. A strict CSP prevents inline script injection even if an XSS vulnerability exists:

```text
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';
```

## Best Practices

- **Never Store Sensitive Auth Tokens in LocalStorage**: Use `HttpOnly`, `Secure`, `SameSite=Lax` cookies for session tokens.
- **Sanitize HTML with DOMPurify**: Always sanitize any markup rendered via `dangerouslySetInnerHTML`.
- **Audit Dependencies Regularly**: Run `npm audit` and use automated tools like Snyk or Dependabot to catch vulnerable packages.

## Summary

Securing React applications requires defensive coding: sanitizing raw HTML, validating URL protocols, enforcing strict Content Security Policies, and storing authentication tokens in secure browser cookies.
