---
title: 'Security in Vue 3 Applications'
description: 'Master frontend application security in Vue 3: XSS prevention, v-html sanitization with DOMPurify, CSRF protection, secure cookie auth, OAuth PKCE, and secret management.'
order: 26
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 35
prerequisites:
  - /learn/vue/12-vue-router
  - /learn/vue/14-api-and-backend-integration
---

# Security in Vue 3 Applications

Security is a fundamental responsibility of every frontend engineer. Because client-side JavaScript executes directly in the user's browser, vulnerable web applications expose sensitive user credentials, session tokens, personal identifiable information (PII), and internal business data to malicious attackers.

In this lesson, we will explore the critical security threats facing Vue 3 applications: Cross-Site Scripting (XSS), Cross-Site Request Forgery (CSRF), Token storage vulnerabilities, OAuth 2.0 PKCE authentication flows, input sanitization, and environment variable security.

## Cross-Site Scripting (XSS) in Vue Templates

Cross-Site Scripting (XSS) occurs when an attacker injects malicious JavaScript code into an application, which is then executed in the victim's browser context. Attackers use XSS to steal authentication session tokens, log keystrokes, and hijack user accounts.

### Automatic HTML Escaping in Mustaches `{{ }}`
By default, Vue protects you from XSS when using standard mustache interpolation: `{{ untrustedInput }}`.

Vue converts strings into plain text nodes using the browser's native `textContent` property, automatically escaping characters like `<`, `>`, `&`, `"`, and `'`. Even if a user inputs `<script>alert('pwned')</script>`, Vue renders it safely as visible text rather than executable HTML.

```vue
<!-- 100% SECURE: Vue treats this as plain text, escaping all HTML tags -->
<p>{{ userComment }}</p>
```

## The Danger of `v-html` and Sanitization with DOMPurify

The most significant vector for XSS vulnerabilities in Vue applications is the **`v-html`** directive. `v-html` directly sets the raw `innerHTML` of the element, executing any embedded `<script>` or `<img onerror="...">` tags provided by malicious users.

```vue
<!-- EXTREMELY DANGEROUS: Never pass raw user-provided content to v-html! -->
<div v-html="untrustedUserBio" />
```

### Safely Sanitizing HTML with DOMPurify
If your application must render user-generated rich text (such as blog posts, WYSIWYG editor content, or markdown), **always sanitize the HTML string using DOMPurify** before passing it to `v-html`:

```bash
npm install dompurify
npm install -D @types/dompurify
```

Create a reusable sanitization composable or utility:

```typescript
// src/utils/sanitizeHtml.ts
import DOMPurify from 'dompurify'

export function sanitizeHtml(dirtyHtml: string): string {
  return DOMPurify.sanitize(dirtyHtml, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'ul', 'ol', 'li', 'code', 'pre', 'blockquote', 'h1', 'h2', 'h3'],
    ALLOWED_ATTR: ['href', 'title', 'target', 'rel', 'class'],
  })
}
```

```vue
<!-- Secure Rich Text Component -->
<script setup lang="ts">
import { computed } from 'vue'
import { sanitizeHtml } from '@/utils/sanitizeHtml'

const props = defineProps<{
  rawHtmlContent: string
}>()

// Safely sanitize before rendering
const safeContent = computed(() => sanitizeHtml(props.rawHtmlContent))
</script>

<template>
  <div v-html="safeContent" class="prose-content" />
</template>
```

## Token Storage Security: `httpOnly` Cookies vs `localStorage`

Where you store user authentication tokens determines their vulnerability to theft:

### 1. `localStorage` / `sessionStorage` (High XSS Risk)
- Accessible by any JavaScript code running on the page.
- If your app has even a single XSS vulnerability or an infected third-party npm package, attackers can execute `localStorage.getItem('token')` and transmit your user's credentials to an external server.

### 2. `httpOnly`, `Secure`, `SameSite` Cookies (Recommended Standard)
- Stored by the browser and automatically sent on HTTP requests to your backend API.
- **`httpOnly`**: JavaScript running in the browser (including malicious XSS scripts) **cannot read or access the cookie**.
- **`Secure`**: Cookie is only transmitted over encrypted HTTPS connections.
- **`SameSite=Lax` or `SameSite=Strict`**: Protects against Cross-Site Request Forgery (CSRF).

**Architecture Recommendation**: For production systems, configure your backend authentication service to set session tokens in `httpOnly` secure cookies.

## Cross-Site Request Forgery (CSRF) Protection

Cross-Site Request Forgery (CSRF) occurs when an attacker tricks a victim's browser into executing unwanted actions on an authenticated web application (e.g. submitting a fund transfer form or changing an email address while the user is logged in).

### Mitigating CSRF:
1. **Set `SameSite=Lax` or `SameSite=Strict`** on all session cookies. This prevents the browser from attaching cookies to cross-origin POST requests initiated from third-party attacker websites.
2. **Anti-CSRF Tokens**: The backend provides a cryptographically random token in a header (`X-CSRF-Token`) that the Vue frontend must attach to mutation requests (`POST`, `PUT`, `DELETE`).
3. **CORS Restrictions**: Ensure your backend API sets strict `Access-Control-Allow-Origin` headers matching your frontend domain, never using wildcard `*` with credentials.

## Client-Side Route Guards vs Server Authorization

A common beginner misconception is assuming that client-side Vue Router navigation guards (`router.beforeEach`) provide true application security.

**Client-side route guards are a user experience feature, not a security boundary.** A knowledgeable attacker can open browser DevTools, modify JavaScript in memory, bypass route guards, and view client-side dashboard templates.

**True security is enforced strictly on the backend API**. Every single API endpoint must independently verify the user's authentication token and role permissions before returning protected data. If an attacker bypasses the client route guard, the backend must return a `401 Unauthorized` or `403 Forbidden` response, preventing unauthorized data from ever reaching the client.

## OAuth 2.0 and OpenID Connect with PKCE

When implementing Single Sign-On (SSO) with providers like Google, GitHub, or Auth0 in a Single Page Application (SPA), always use the **Authorization Code Flow with Proof Key for Code Exchange (PKCE)**.

PKCE dynamically generates a cryptographic `code_verifier` and `code_challenge` in browser memory, preventing authorization code interception attacks without requiring a client secret in frontend code.

## Environment Variable Secrets vs Public Variables

In Vite and Nuxt applications:
- Any variable prefixed with **`VITE_`** or **`NUXT_PUBLIC_`** is bundled directly into the compiled JavaScript files sent to the browser. Anyone on the internet can inspect your source code and read these values!
- **Never put private API secret keys, database passwords, or private payment keys in `VITE_` variables.**
- Store private secrets exclusively on your backend server or in private Nuxt `runtimeConfig` (which only runs in server environments).

```ini
# .env file

# PUBLIC: Safe for browser bundle
VITE_API_BASE_URL=https://api.front-heaven.dev
VITE_STRIPE_PUBLIC_KEY=pk_live_12345

# PRIVATE: NEVER PREFIX WITH VITE_ (Keep on server only!)
STRIPE_SECRET_KEY=sk_live_SECRET_DO_NOT_EXPOSE
DATABASE_URL=postgres://user:pass@db.internal:5432
```

## Best Practices

- **Never Use `v-html` Without `DOMPurify`**: Sanitize any raw HTML string before binding to `v-html`.
- **Prefer `httpOnly` Cookies for JWT Authentication**: Isolate tokens from client JavaScript access to neutralize token theft via XSS.
- **Never Rely Exclusively on Client Route Guards**: Always validate permissions on backend API endpoints.
- **Audit Dependencies Regularly**: Run `npm audit` in your CI/CD pipeline and configure automated dependency vulnerability scanning via Dependabot or Snyk.

## Summary

Frontend security in Vue 3 requires a multi-layered defense strategy: relying on automatic template escaping, sanitizing rich HTML with DOMPurify, storing tokens in `httpOnly` cookies, preventing CSRF with `SameSite` flags, and keeping private credentials off client bundles. By applying these standards, you protect your users and infrastructure from sophisticated modern web vulnerabilities.
