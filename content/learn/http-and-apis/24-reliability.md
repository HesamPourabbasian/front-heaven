---
title: 'API Reliability: Retries, Backoff & Circuit Breakers'
description: 'Master API reliability engineering: timeouts, automated retries, exponential backoff with full jitter, Circuit Breaker pattern, and graceful degradation.'
order: 24
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 50
prerequisites: ['/learn/http-and-apis/23-error-handling']
---

# API Reliability: Retries, Backoff & Circuit Breakers

In distributed networks, temporary network spikes or server hiccups are inevitable. If a frontend client retries a failed request instantly in a tight loop, it creates a **Thundering Herd Problem**, overwhelming the struggling server and causing total system collapse.

Building resilient network clients requires **Exponential Backoff with Full Jitter** and the **Circuit Breaker Pattern**.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Exponential Backoff with Jitter             │
│                                                             │
│  Attempt 1: Fails ──> Wait 1s + Random Jitter (e.g. 1.2s)   │
│  Attempt 2: Fails ──> Wait 2s + Random Jitter (e.g. 2.4s)   │
│  Attempt 3: Fails ──> Wait 4s + Random Jitter (e.g. 4.1s)   │
│                                                             │
│  Jitter desynchronizes concurrent retrying clients!         │
└─────────────────────────────────────────────────────────────┘
```

## 1. Implementing Exponential Backoff with Jitter in JavaScript

```typescript
export async function fetchWithRetry<T>(
  url: string,
  options: RequestInit = {},
  maxRetries = 3,
  baseDelayMs = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      // Only retry on transient 5xx errors or 429
      if (response.ok) return await response.json();
      if (![429, 502, 503, 504].includes(response.status) || attempt === maxRetries) {
        throw new Error(`HTTP Error ${response.status}`);
      }
    } catch (err) {
      if (attempt === maxRetries) throw err;
    }

    // Calculate exponential delay with full randomized jitter
    const exponentialDelay = baseDelayMs * Math.pow(2, attempt - 1);
    const jitteredDelay = Math.random() * exponentialDelay;
    await new Promise(resolve => setTimeout(resolve, jitteredDelay));
  }
  throw new Error('Max retries reached');
}
```

## 2. The Circuit Breaker Pattern

If a backend service is completely down, continuously sending requests wastes battery, bandwidth, and thread pools. A **Circuit Breaker** tracks failure rates:
- **Closed**: Requests flow normally.
- **Open**: When failures exceed threshold (e.g. 5 failures in 10s), the breaker trips; all requests immediately fail fast with cached fallback data.
- **Half-Open**: After a cooldown period, allows a trial request through to test if the server has recovered.

## Summary & Key Takeaways

- Exponential backoff doubles delay between retry attempts.
- Jitter randomizes retry intervals to prevent retry stampedes.
- Circuit breakers prevent hammering dead backend services.

## Best Practices & Senior Guidance

1. **Never Retry Non-Idempotent Mutations Blindly**: Only retry GET requests or requests tagged with an `Idempotency-Key` header.
