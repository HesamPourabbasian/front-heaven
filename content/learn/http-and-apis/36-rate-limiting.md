---
title: 'Rate Limiting: Token Bucket, Sliding Window & 429'
description: 'Master API rate-limiting algorithms: Fixed Window, Sliding Window Log, Token Bucket, Leaky Bucket, Distributed Rate Limiting with Redis, HTTP 429 Too Many Requests, and Retry-After.'
order: 36
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 50
prerequisites: ['/learn/http-and-apis/04-status-codes']
---

# Rate Limiting: Token Bucket, Sliding Window & 429

Rate limiting is an essential defense mechanism for APIs. It protects backend databases from denial-of-service (DoS) attacks, prevents brute-force credential cracking, enforces tiered monetization pricing plans, and guarantees quality of service across multi-tenant infrastructures.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Rate Limiting Algorithms Compared           │
├───────────────────┬─────────────────────────────────────────┤
│ Algorithm         │ Mechanics & Best Use Case               │
├───────────────────┼─────────────────────────────────────────┤
│ Fixed Window      │ Resets count at fixed intervals (e.g.   │
│                   │ 100 req/min). Vulnerable to edge bursts.│
├───────────────────┼─────────────────────────────────────────┤
│ Sliding Window Log│ Stores timestamp of every request in    │
│                   │ Redis. 100% accurate, high memory cost. │
├───────────────────┼─────────────────────────────────────────┤
│ Token Bucket      │ Tokens added at constant rate up to max │
│ (Industry Standard│ capacity. Allows bursts, smooth refills.│
├───────────────────┼─────────────────────────────────────────┤
│ Leaky Bucket      │ Requests processed at fixed FIFO rate.  │
│                   │ Smooths traffic spikes completely.      │
└───────────────────┴─────────────────────────────────────────┘
```

## 1. The Token Bucket Algorithm

1. A bucket has a maximum capacity (e.g. $B = 50$ tokens).
2. Tokens refill continuously at a rate of $r$ tokens per second (e.g. 5 tokens/sec).
3. Each incoming API request consumes 1 token:
   - If tokens $> 0$: Request is accepted.
   - If tokens $= 0$: Request is rejected with **`429 Too Many Requests`**.

## 2. Standard Rate Limit Headers

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/problem+json
RateLimit-Limit: 100
RateLimit-Remaining: 0
RateLimit-Reset: 1771594800
Retry-After: 45

{
  "type": "https://errors.front-heaven.com/rate-limit-exceeded",
  "title": "Rate Limit Exceeded",
  "status": 429,
  "detail": "You have exceeded your plan limit of 100 requests per minute. Please wait 45 seconds before retrying."
}
```

## Summary & Key Takeaways

- Rate limiting protects APIs from abuse and guarantees infrastructure stability.
- The Token Bucket algorithm supports burst traffic while enforcing sustained rates.
- Always communicate rate limits via standard headers (`RateLimit-*` and `Retry-After`).

## Best Practices & Senior Guidance

1. **Implement Rate Limiting at the Edge / API Gateway**: Block excessive traffic at Cloudflare or AWS API Gateway before it consumes backend compute cycles.
2. **Respect `Retry-After` on Frontend Clients**: When receiving a 429, pause outgoing requests until the `Retry-After` duration has elapsed.
