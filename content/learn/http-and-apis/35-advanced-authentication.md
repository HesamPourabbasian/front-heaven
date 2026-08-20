---
title: 'Advanced Authentication: Passkeys, WebAuthn & MFA'
description: 'Master next-generation authentication: FIDO2 / WebAuthn, Passkeys, biometric public-key cryptography, Multi-Factor Authentication (TOTP / RFC 6238), and Enterprise Single Sign-On (SSO / SAML).'
order: 35
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 50
prerequisites: ['/learn/http-and-apis/18-oauth2']
---

# Advanced Authentication: Passkeys, WebAuthn & MFA

Traditional password-based authentication is fundamentally flawed: users reuse passwords, fall victim to phishing attacks, and suffer from database credential stuffing leaks.

The industry has moved toward **Passkeys and WebAuthn (FIDO2)**—a passwordless standard built on public-key cryptography and device hardware security modules (Touch ID, Face ID, YubiKey)—alongside **Time-Based One-Time Passwords (TOTP / RFC 6238)** and enterprise **SAML 2.0 / OIDC Single Sign-On**.

```text
┌─────────────────────────────────────────────────────────────┐
│                 WebAuthn / Passkeys Cryptographic Flow      │
│                                                             │
│  1. Server sends random Challenge string                    │
│             │                                               │
│             ▼                                               │
│  2. Browser prompts biometric verification (Touch/Face ID)  │
│             │                                               │
│             ▼                                               │
│  3. Device Hardware Secure Enclave signs Challenge with     │
│     Private Key (Private key NEVER leaves device chip!)     │
│             │                                               │
│             ▼                                               │
│  4. Signed assertion returned to server                     │
│             │                                               │
│             ▼                                               │
│  5. Server verifies signature using stored Public Key!      │
└─────────────────────────────────────────────────────────────┘
```

## 1. WebAuthn JavaScript API

```typescript
export async function registerPasskey(userId: string, userName: string) {
  // 1. Fetch challenge and registration options from server
  const options = await fetch('/api/auth/webauthn/register-options').then(res => res.json());

  // 2. Trigger browser native biometric prompt
  const credential = await navigator.credentials.create({
    publicKey: {
      challenge: Uint8Array.from(atob(options.challenge), c => c.charCodeAt(0)),
      rp: { name: "Front-Heaven", id: "front-heaven.com" },
      user: {
        id: Uint8Array.from(userId, c => c.charCodeAt(0)),
        name: userName,
        displayName: userName
      },
      pubKeyCredParams: [{ alg: -7, type: "public-key" }] // ES256
    }
  });

  // 3. Send public key credential back to server
  await fetch('/api/auth/webauthn/register-verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credential)
  });
}
```

## Summary & Key Takeaways

- Passkeys (WebAuthn/FIDO2) replace passwords with asymmetric cryptography.
- Private keys remain locked inside device hardware secure enclaves.
- Eliminates phishing, credential stuffing, and password leaks entirely.

## Best Practices & Senior Guidance

1. **Offer Passkeys as Primary Login**: Implement Passkeys with fallback to Magic Links or TOTP MFA for seamless user onboarding.
