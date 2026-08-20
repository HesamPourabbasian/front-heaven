---
title: 'JSON Web Tokens (JWT) & Cryptographic Claims'
description: 'Master JSON Web Tokens (JWT / RFC 7519): Header, Payload, Signature, standard claims (iss, sub, exp, aud), asymmetric signing (RS256 vs HS256), and security vulnerabilities.'
order: 17
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 45
prerequisites: ['/learn/http-and-apis/15-authentication']
---

# JSON Web Tokens (JWT) & Cryptographic Claims

**JSON Web Token (JWT)**, defined in **RFC 7519**, is a compact, URL-safe, and self-contained standard for transmitting cryptographically verifiable claims between two parties. JWTs are widely used in stateless API authentication, single sign-on (SSO), and microservice identity propagation.

A JWT is not encrypted; it is **signed**. Anyone who inspects a JWT can decode its payload, but nobody can tamper with its contents without invalidating the cryptographic signature.

```text
┌─────────────────────────────────────────────────────────────┐
│                 JSON Web Token (JWT) Anatomy                │
│                                                             │
│  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9                       │
│  .eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ikhlc2FtIn0          │
│  .SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c               │
│                                                             │
│  ├── Part 1 (Red):   Header    (Algorithm & Token Type)     │
│  ├── Part 2 (Purple): Payload   (Claims & User Data)        │
│  └── Part 3 (Blue):   Signature (HMACSHA256 Verification)   │
└─────────────────────────────────────────────────────────────┘
```

## 1. The 3 Parts of a JWT

A JWT consists of three Base64URL-encoded strings separated by dots (`.`):

1. **Header**: Specifies the signature algorithm (`alg`: `HS256` or `RS256`) and token type (`typ`: `JWT`).
2. **Payload**: Contains **Claims**—statements about the user and metadata:
   - Standard Claims: `sub` (Subject ID), `iss` (Issuer), `exp` (Expiration timestamp), `aud` (Audience), `iat` (Issued At).
3. **Signature**: Computed by taking the encoded header, encoded payload, and a private secret key, and hashing them with the specified algorithm.

## 2. Symmetric (HS256) vs Asymmetric (RS256) Signing

- **HS256 (HMAC with SHA-256)**: Symmetric key. The same secret key is used to both create and verify tokens. (Both backend auth server and API service must know the secret).
- **RS256 (RSA Signature)**: Asymmetric public/private key pair. The Auth server signs tokens with its private key; client microservices verify signatures using the public key without needing the private key.

## 3. JWT Security Vulnerabilities

- **The `alg: "none"` Exploit**: Attackers modify the header to `{"alg": "none"}` to bypass signature verification. (Modern libraries strictly forbid `none`).
- **Storing Sensitive Data in Payload**: Never store passwords, credit cards, or personal secrets in a JWT payload; payloads are easily decoded using `atob()`.

## Summary & Key Takeaways

- JWTs are compact, signed, self-contained JSON tokens.
- Composed of 3 Base64URL parts: Header, Payload, and Signature.
- Standard claims (`exp`, `sub`, `iss`) manage token identity and validity.
- RS256 asymmetric signing is the enterprise standard for microservices.

## Best Practices & Senior Guidance

1. **Always Enforce Signature Algorithm on the Server**: Hardcode `algorithms: ['RS256']` during verification to prevent algorithm confusion attacks.
2. **Always Check Expiration (`exp`)**: Ensure your verification pipeline checks `exp` on every single request.
