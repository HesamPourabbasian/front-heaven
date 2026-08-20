---
title: 'API Testing: MSW, Contract Testing & Load Testing (k6)'
description: 'Master comprehensive API testing: Mock Service Worker (MSW) network mocking, Consumer-Driven Contract Testing with Pact, and performance/load testing with Grafana k6.'
order: 45
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 55
prerequisites: ['/learn/http-and-apis/44-api-contracts']
---

# API Testing: MSW, Contract Testing & Load Testing (k6)

Building resilient API ecosystems requires testing at multiple layers: mocking network traffic seamlessly in unit and component tests with **Mock Service Worker (MSW)**, verifying team contract integrity with **Consumer-Driven Contract Testing (Pact)**, and simulating thousands of concurrent users with **Grafana k6**.

```text
┌─────────────────────────────────────────────────────────────┐
│                 The API Testing Pyramid                     │
│                                                             │
│                    /  Load / Stress  \  (k6: 10,000 VUs)    │
│                   /───────────────────\                     │
│                  /  Contract Testing   \ (Pact: Verify Spec)│
│                 /───────────────────────\                   │
│                /   Integration / E2E     \ (Playwright)     │
│               /───────────────────────────\                 │
│              /  Unit / Component Mocking   \ (MSW / Vitest) │
│             /───────────────────────────────\               │
└─────────────────────────────────────────────────────────────┘
```

## 1. Network Mocking with Mock Service Worker (MSW)

Unlike traditional mocks that spy on `fetch()`, MSW intercepts requests at the network layer using Service Workers in the browser and native HTTP interceptors in Node.js:

```typescript
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

export const handlers = [
  http.get('https://api.front-heaven.com/v1/users/42', () => {
    return HttpResponse.json({
      id: '42',
      name: 'Hesam Pourabbasian',
      role: 'Lead Architect'
    });
  }),
  http.post('https://api.front-heaven.com/v1/checkout', () => {
    return new HttpResponse(null, { status: 429 }); // Test rate limit error handling!
  })
];

export const server = setupServer(...handlers);
```

## 2. Load Testing with Grafana k6

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 },  // Ramp up to 50 users
    { duration: '1m', target: 500 },  // Spike to 500 users
    { duration: '30s', target: 0 },   // Cool down
  ],
  thresholds: {
    http_req_duration: ['p(95)<200'], // 95% of requests must complete under 200ms
  },
};

export default function () {
  const res = http.get('https://api.front-heaven.com/v1/products');
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}
```

## Summary & Key Takeaways

- MSW intercepts network requests cleanly without mocking global `fetch`.
- Pact verifies contract compatibility between independent microservice teams.
- Grafana k6 validates P95 and P99 latency thresholds under peak load.

## Best Practices & Senior Guidance

1. **Use MSW for Both Unit Tests and Storybook**: Mocking at the network layer enables identical mock data across unit tests, E2E tests, and UI component playgrounds.
