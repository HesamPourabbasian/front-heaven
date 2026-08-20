---
title: 'OpenID Connect (OIDC) & Identity Federation'
description: 'Master OpenID Connect (OIDC): OIDC vs OAuth 2.0, ID Tokens vs Access Tokens, UserInfo endpoint, Discovery document (.well-known/openid-configuration), and Identity Federation.'
order: 19
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 45
prerequisites: ['/learn/http-and-apis/18-oauth2']
---

# OpenID Connect (OIDC) & Identity Federation

While OAuth 2.0 was designed specifically for *Authorization* ("What permissions does this app have?"), it did not provide a standardized way to handle *Authentication* ("Who is the user?").

**OpenID Connect (OIDC)** is an identity layer built directly on top of OAuth 2.0. It introduces standardized **ID Tokens (JWT)**, user profile queries via the **UserInfo Endpoint**, and automatic server discovery via the **OpenID Discovery Document**.

```text
┌─────────────────────────────────────────────────────────────┐
│                 OAuth 2.0 vs OpenID Connect                 │
├──────────────────────────────┬──────────────────────────────┤
│ OAuth 2.0 (Authorization)    │ OpenID Connect (AuthN + AuthZ│
├──────────────────────────────┼──────────────────────────────┤
│ - Returns Access Token       │ - Returns ID Token + Access  │
│ - "Allows app to access API" │ - "Proves who the user is"   │
│ - For APIs (Resource Server) │ - For Frontend Client Apps   │
└──────────────────────────────┴──────────────────────────────┘
```

## 1. The ID Token vs Access Token

- **ID Token**: A signed JWT intended strictly for the **Client application**. Contains user identity claims (`sub`, `name`, `email`, `picture`).
- **Access Token**: An opaque or JWT token intended strictly for the **Resource Server (API)** to authorize data operations.

## 2. The OpenID Discovery Document

OIDC servers publish their endpoints and cryptographic public keys at a standardized URL:
`https://auth.company.com/.well-known/openid-configuration`

Clients read this JSON document to automatically discover the authorization endpoint, token endpoint, userinfo endpoint, and JSON Web Key Sets (JWKS).

## Summary & Key Takeaways

- OIDC extends OAuth 2.0 to provide standardized user authentication.
- ID Tokens represent user profile identity; Access Tokens authorize API calls.
- Discovery documents (`.well-known/openid-configuration`) standardize client setup.

## Best Practices & Senior Guidance

1. **Never Send ID Tokens as API Auth Headers**: Always send the `Access Token` in `Authorization: Bearer <access_token>` to backend APIs.
