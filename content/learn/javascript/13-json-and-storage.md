---
title: 'JSON & Storage'
description: 'Master JSON and client-side data persistence: JSON syntax, serialization (JSON.stringify), deserialization (JSON.parse), localStorage, sessionStorage, storage limits, and Cookies basics.'
order: 13
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 30
prerequisites:
  - /learn/javascript/12-events
---

# JSON & Storage

Modern web applications constantly transmit structured data across networks and persist user state across browser sessions. **JavaScript Object Notation (JSON)** is the universal, language-agnostic textual data-interchange format derived from JavaScript object syntax. Complementing JSON, the browser's **Web Storage API** (`localStorage` and `sessionStorage`) and HTTP **Cookies** provide mechanisms for caching client-side data, storing user preferences, and maintaining session authentication.

Understanding how to serialize, deserialize, validate, and securely store data in client storage while managing capacity limits and security constraints is a foundational skill for all frontend developers.

In this lesson, we will explore JSON syntax rules, serialization with `JSON.stringify()`, parsing with `JSON.parse()`, persistent storage with `localStorage`, session-isolated storage with `sessionStorage`, quota management, and HTTP cookies.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        Client Storage Comparison                       │
├──────────────────┬─────────────────┬─────────────────┬─────────────────┤
│ Feature          │ localStorage    │ sessionStorage  │ Cookies         │
├──────────────────┼─────────────────┼─────────────────┼─────────────────┤
│ Capacity         │ ~5MB - 10MB     │ ~5MB            │ ~4KB            │
│ Persistence      │ Never expires   │ Closes with Tab │ Explicit expiry │
│ Sent to Server?  │ No (Client-only)│ No (Client-only)│ Yes (Every HTTP)│
│ Access API       │ Sync Web API    │ Sync Web API    │ document.cookie │
│ Security (HttpOnly) No (XSS risk)  │ No (XSS risk)   │ Yes (Secure)    │
└──────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

## JSON Syntax Rules

JSON is a strict text format. While inspired by JavaScript object literals, JSON imposes strict formatting rules:
- Property keys **must** be enclosed in double quotes (`"key"`). Single quotes are invalid.
- Strings **must** use double quotes (`"value"`).
- Trailing commas after the final key/element are strictly **forbidden**.
- Functions, `undefined`, `Symbol`, and `Date` instances are not native JSON types.
- Allowed values: strings, numbers, booleans, `null`, arrays, and nested JSON objects.

```json
{
  "userId": 10482,
  "username": "sarah_connor",
  "isVerified": true,
  "roles": ["admin", "editor"],
  "preferences": {
    "theme": "dark",
    "emailNotifications": null
  }
}
```

## Serialization and Parsing: `JSON.stringify` and `JSON.parse`

- **`JSON.stringify(value, replacer, space)`**: Converts a JavaScript object or value into a JSON-formatted string. Omits functions and `undefined` properties. Supports pretty-printing with indent spacing.
- **`JSON.parse(text, reviver)`**: Parses a JSON string, constructing the JavaScript value or object described by the string. If the string contains invalid syntax, `JSON.parse()` throws a synchronous `SyntaxError`.

```javascript
const userSession = {
  id: "usr_99",
  created: new Date(),
  roles: ["admin"],
  secretToken: undefined // Omitted during stringification
};

// Serialization with 2-space indentation
const jsonString = JSON.stringify(userSession, null, 2);
console.log(jsonString);

// Safe parsing with try...catch
function parseJsonSafely(rawPayload) {
  try {
    return { data: JSON.parse(rawPayload), error: null };
  } catch (err) {
    console.error("Malformed JSON received:", err.message);
    return { data: null, error: err };
  }
}
```

## Persistent Storage: `localStorage`

The `localStorage` object stores key-value pairs with **no expiration date**. Data persists indefinitely, even when the browser is closed, restarted, or the operating system reboots. Storage is scoped strictly to the origin (protocol, domain, and port).

All keys and values stored in `localStorage` are **strings**. Complex objects must be serialized with `JSON.stringify()` before storage and parsed with `JSON.parse()` upon retrieval.

```javascript
// Storage operations
const themeConfig = { mode: "dark", accent: "#3b82f6" };

// 1. Set item (serialize object to string)
localStorage.setItem("app_theme", JSON.stringify(themeConfig));

// 2. Get item (deserialize string to object)
const storedRaw = localStorage.getItem("app_theme");
const currentTheme = storedRaw ? JSON.parse(storedRaw) : { mode: "light" };
console.log(currentTheme.mode); // "dark"

// 3. Remove item & clear
localStorage.removeItem("app_theme");
// localStorage.clear(); // Clears ALL keys for this origin
```

## Session-Isolated Storage: `sessionStorage`

The `sessionStorage` API is syntactically identical to `localStorage`, but data persists **only for the lifetime of the specific browser tab session**. Opening the same URL in a new tab creates a fresh, isolated `sessionStorage` context. The data is cleared as soon as the tab or window is closed.

Ideal for single-session shopping carts, temporary multi-step wizard state, and transient form drafts.

```javascript
// Storing multi-step wizard progress in sessionStorage
const checkoutStep = { step: 2, completedShipping: true };
sessionStorage.setItem("checkout_progress", JSON.stringify(checkoutStep));
```

## Cookies Basics

**Cookies** are small strings of data (up to 4KB) stored in the browser and automatically attached by the browser to every outgoing HTTP request to the matching domain and path.

While modern frontend client state is usually stored in `localStorage`, cookies are essential for authentication and session management:
- **`HttpOnly` Cookies**: Flags that prevent JavaScript from accessing the cookie via `document.cookie`, mitigating XSS credential theft.
- **`Secure`**: Enforces cookie transmission only over encrypted HTTPS connections.
- **`SameSite=Strict/Lax`**: Defends against Cross-Site Request Forgery (CSRF) attacks by restricting when cookies are sent on cross-origin requests.

```javascript
// Reading client-accessible cookies in JavaScript
console.log(document.cookie);

// Setting a client cookie with expiration (max-age in seconds)
document.cookie = "cookie_consent=true; max-age=31536000; path=/; SameSite=Lax";
```

## Summary

JSON is the standard lightweight data-interchange format. Serialize objects with `JSON.stringify()` and parse text with `JSON.parse()` wrapped in `try...catch`. Web Storage (`localStorage` and `sessionStorage`) provides synchronous, string-based key-value persistence scoped by origin. Use `localStorage` for permanent client preferences and `sessionStorage` for temporary tab-isolated workflows. Use HTTP-only, secure cookies for sensitive authentication tokens.

## Best Practices

1. **Always Wrap `JSON.parse()` in `try...catch`**: Malformed JSON from network payloads or corrupted local storage will throw uncaught `SyntaxErrors`.
2. **Never Store Sensitive Secrets in `localStorage`**: Because `localStorage` is accessible to any script running on the page, storing JWT tokens, passwords, or credit card info invites XSS security theft. Use `HttpOnly` cookies instead.
3. **Handle Quota Limits Gracefully**: Web storage is capped around 5MB. Catch `QuotaExceededError` exceptions when persisting large offline datasets.
4. **Namespace Storage Keys**: Prefix keys (e.g., `fh_app_theme`, `fh_user_settings`) to prevent collisions with third-party libraries on the same domain.
5. **Listen to the `storage` Event for Cross-Tab Sync**: Use `window.addEventListener('storage', ...)` to synchronize state changes across multiple open tabs in real time.
