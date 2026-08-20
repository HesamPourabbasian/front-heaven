---
title: 'Webhooks: Delivery, Signatures & Idempotency'
description: 'Master enterprise webhooks: event delivery pipelines, HMAC SHA-256 signature verification, replay attack prevention, exponential backoff retries, and consumer idempotency.'
order: 41
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 50
prerequisites: ['/learn/http-and-apis/34-api-security']
---

# Webhooks: Delivery, Signatures & Idempotency

**Webhooks** (often described as "Reverse APIs") enable a server to notify an external client application automatically whenever a specific event occurs (e.g. Stripe notifying your app that a payment succeeded, or GitHub notifying your CI server of a new commit).

Instead of the client polling the API every 5 seconds, the server sends an asynchronous **HTTP POST** request containing the event payload directly to the client's registered webhook URL.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Webhook Security & Verification             │
│                                                             │
│  Stripe / GitHub Server                                     │
│  ├── 1. Computes HMAC signature:                            │
│  │      signature = HMAC_SHA256(secret, timestamp + body)  │
│  └── 2. Sends HTTP POST with headers:                       │
│         Stripe-Signature: t=1771594800,v1=a8b2c3d4...       │
│             │                                               │
│             ▼                                               │
│  Your Backend Webhook Endpoint (/api/webhooks/stripe)       │
│  ├── 1. Reads RAW unparsed request body string              │
│  ├── 2. Computes local HMAC using shared Webhook Secret     │
│  ├── 3. Compares signatures using timingSafeEqual()         │
│  ├── 4. Checks idempotency key in Redis (Prevents duplicate)│
│  └── 5. Returns HTTP 200 OK immediately & processes in queue│
└─────────────────────────────────────────────────────────────┘
```

## 1. Verifying Webhook Signatures in Node.js / TypeScript

```typescript
import { createHmac, timingSafeEqual } from 'crypto';

export function verifyWebhookSignature(
  rawBody: string,
  signatureHeader: string,
  secretKey: string
): boolean {
  const [tPart, vPart] = signatureHeader.split(',');
  const timestamp = tPart.split('=')[1];
  const expectedSignature = vPart.split('=')[1];

  // 1. Replay attack check: reject if older than 5 minutes
  if (Math.abs(Date.now() / 1000 - parseInt(timestamp, 10)) > 300) {
    return false;
  }

  // 2. Compute local HMAC
  const payloadToSign = `${timestamp}.${rawBody}`;
  const computedSignature = createHmac('sha256', secretKey).update(payloadToSign).digest('hex');

  // 3. Timing-safe comparison to prevent timing attacks
  return timingSafeEqual(Buffer.from(computedSignature), Buffer.from(expectedSignature));
}
```

## Summary & Key Takeaways

- Webhooks provide real-time asynchronous event notifications via HTTP POST.
- Always verify HMAC SHA-256 signatures before processing payloads.
- Consumers must return `200 OK` quickly and offload heavy processing to background queues.
- Enforce idempotency using event IDs to handle retry duplicates safely.

## Best Practices & Senior Guidance

1. **Always Use the Raw Unparsed Body for Signature Verification**: Parsing JSON before verification modifies whitespace or key ordering, causing signature validation to fail.
