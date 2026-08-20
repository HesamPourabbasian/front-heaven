---
title: 'OAuth 2.0 & The PKCE Authorization Flow'
description: 'Master OAuth 2.0 (RFC 6749): Roles (Client, Auth Server, Resource Server), Scopes, Authorization Code Flow, and Proof Key for Code Exchange (PKCE) for Single-Page Applications.'
order: 18
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 50
prerequisites: ['/learn/http-and-apis/17-jwt']
---

# OAuth 2.0 & The PKCE Authorization Flow

**OAuth 2.0** (RFC 6749) is the industry-standard protocol for delegated authorization. It enables third-party applications to obtain limited access to a user's HTTP resources without requiring the user to share their login password.

In modern Single-Page Applications (SPAs) and mobile clients, the **Authorization Code Flow with Proof Key for Code Exchange (PKCE)** is the only secure authorization standard.

```text
┌─────────────────────────────────────────────────────────────┐
│                 OAuth 2.0 Authorization Code + PKCE         │
│                                                             │
│  1. Angular App generates Code Verifier & SHA-256 Challenge │
│             │                                               │
│             ▼                                               │
│  2. Redirects user to Auth Server (/authorize?challenge=...)│
│             │                                               │
│             ▼                                               │
│  3. User logs in & grants consent -> Redirects with Code    │
│             │                                               │
│             ▼                                               │
│  4. App POSTs Code + Code Verifier to /oauth/token          │
│             │                                               │
│             ▼                                               │
│  5. Auth Server hashes Verifier; if matches Challenge,      │
│     returns Access Token & Refresh Token!                   │
└─────────────────────────────────────────────────────────────┘
```

## 1. The 4 Roles in OAuth 2.0

1. **Resource Owner**: The end user who owns the data.
2. **Client**: The application requesting access (your frontend SPA).
3. **Authorization Server**: The identity server (Auth0, Keycloak, Okta, Google).
4. **Resource Server**: The backend API hosting the protected data.

## 2. Why PKCE is Mandatory for Frontend Apps

In public clients (browser SPAs and mobile apps), client secrets cannot be kept confidential because any user can inspect JavaScript code. **PKCE** (Proof Key for Code Exchange) solves this dynamically:
1. The client generates a random cryptographic **Code Verifier** and computes its SHA-256 hash (**Code Challenge**).
2. The authorization code can ONLY be exchanged for tokens if the client proves it originated the request by presenting the original Code Verifier.

## Summary & Key Takeaways

- OAuth 2.0 provides delegated authorization without sharing passwords.
- Authorization Code Flow with PKCE is the gold standard for Single-Page Applications.
- Scopes (`scope: "read:orders write:cart"`) limit token privileges.

## Best Practices & Senior Guidance

1. **Never Use Implicit Grant Flow**: Implicit flow transmits access tokens in URL fragments and is officially deprecated by OAuth security working groups.
