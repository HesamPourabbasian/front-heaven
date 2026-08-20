---
title: 'REST API Design: Resources, Versioning & Deprecation'
description: 'Master enterprise REST API design: resource naming, URI conventions, HTTP status code strategy, RFC 7807 problem details, API versioning strategies, and deprecation headers.'
order: 20
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 45
prerequisites: ['/learn/http-and-apis/08-rest-apis']
---

# REST API Design: Resources, Versioning & Deprecation

Designing scalable, intuitive, and long-lasting REST APIs requires strict consistency. A well-designed API acts as a predictable developer interface that reduces onboarding time, minimizes client-side bugs, and evolves seamlessly over years without breaking existing mobile or web clients.

```text
┌─────────────────────────────────────────────────────────────┐
│                 API Versioning Strategies Matrix            │
├───────────────────┬──────────────────────┬──────────────────┤
│ Strategy          │ Example Format       │ Trade-offs       │
├───────────────────┼──────────────────────┼──────────────────┤
│ URI Path (Standard│ /api/v1/products     │ Highly visible,  │
│                   │                      │ easy to cache.   │
├───────────────────┼──────────────────────┼──────────────────┤
│ Custom Header     │ X-API-Version: 2     │ Clean URLs, but  │
│                   │                      │ harder to cache. │
├───────────────────┼──────────────────────┼──────────────────┤
│ Accept Header     │ Accept: application/ │ Purest REST, but │
│ (Content Negot)   │ vnd.company.v2+json  │ complex testing. │
└───────────────────┴──────────────────────┴──────────────────┘
```

## 1. Standardized Error Format (RFC 7807 Problem Details)

Instead of returning custom error JSON schemas, enterprise APIs adhere to the **RFC 7807 Problem Details** standard:

```json
{
  "type": "https://api.front-heaven.com/errors/insufficient-funds",
  "title": "Insufficient Funds",
  "status": 422,
  "detail": "Your current account balance of $12.50 is lower than the requested charge of $49.00.",
  "instance": "/transactions/tx_99482",
  "invalidParams": [
    { "name": "amount", "reason": "Exceeds available balance" }
  ]
}
```

## 2. API Deprecation & Sunset Headers

When retiring an API version, notify API consumers using standard IETF HTTP headers:
- **`Deprecation: true`**: Signals that the endpoint is deprecated.
- **`Sunset: Wed, 11 Nov 2026 00:00:00 GMT`**: Specifies the exact date when the endpoint will be permanently decommissioned.
- **`Link: <https://docs.api.com/migration>; rel="sunset"`**: Links to migration guides.

## Summary & Key Takeaways

- Standardize resource naming with plural nouns and kebab-case URIs.
- Implement RFC 7807 Problem Details for uniform error responses.
- URI path versioning (`/v1/`) provides the clearest developer experience.
- Use `Deprecation` and `Sunset` headers for graceful API retirement.

## Best Practices & Senior Guidance

1. **Maintain Backward Compatibility**: Add new optional fields rather than renaming existing properties to avoid breaking older mobile app versions.
