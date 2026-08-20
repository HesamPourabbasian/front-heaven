---
title: 'API Error Handling & Correlation IDs'
description: 'Master resilient API error handling: RFC 7807 Problem Details, domain error codes, retryable vs non-retryable errors, Correlation IDs (X-Correlation-ID), and global error handlers.'
order: 23
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 45
prerequisites: ['/learn/http-and-apis/04-status-codes']
---

# API Error Handling & Correlation IDs

In distributed systems, failures will happen: network connections drop, databases timeout, validation fails, and payment gateways encounter transient errors. The hallmark of a professional API is how gracefully and consistently it reports errors to client applications.

Combining **RFC 7807 Problem Details** with **Correlation IDs (`X-Correlation-ID` / `X-Request-ID`)** enables instant end-to-end debugging across frontend clients, API gateways, and microservice server logs.

```text
┌─────────────────────────────────────────────────────────────┐
│                 End-to-End Tracing with Correlation IDs     │
│                                                             │
│  1. Frontend Client generates: X-Correlation-ID: req_abc123│
│             │                                               │
│             ▼                                               │
│  2. API Gateway logs request with ID req_abc123             │
│             │                                               │
│             ▼                                               │
│  3. Microservices propagate ID through all internal calls   │
│             │                                               │
│             ▼                                               │
│  4. Server throws 500 error & returns ID in response payload│
│             │                                               │
│             ▼                                               │
│  5. Support engineer searches req_abc123 in Datadog/Sentry   │
│     and finds the exact database stack trace in 2 seconds!  │
└─────────────────────────────────────────────────────────────┘
```

## 1. Categorizing Errors: Retryable vs Non-Retryable

- **Retryable Errors**: Transient failures where retrying the request after a short delay is likely to succeed (e.g. `503 Service Unavailable`, `504 Gateway Timeout`, `429 Too Many Requests`, network drops).
- **Non-Retryable Errors**: Semantic errors where retrying will produce the identical failure (e.g. `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `422 Unprocessable Entity`).

## 2. Standard Problem Details Payload

```json
{
  "type": "https://errors.front-heaven.com/validation-error",
  "title": "Invalid Request Parameters",
  "status": 422,
  "detail": "The email address provided is already registered.",
  "correlationId": "req_8f1b2c3d4e5f"
}
```

## Summary & Key Takeaways

- Standardize error responses using RFC 7807 Problem Details.
- Pass `X-Correlation-ID` headers to trace requests across microservices.
- Classify errors as retryable or non-retryable before triggering retry policies.

## Best Practices & Senior Guidance

1. **Display User-Friendly Messages, Not Raw Server Errors**: Map error codes (`ERR_INSUFFICIENT_FUNDS`) to localized, helpful UI error alerts on the frontend.
