---
title: "Advanced Testing & Mock Service Worker (MSW)"
technology: "react"
difficulty: "advanced"
estimatedMinutes: 30
order: 41
description: "Network-level API mocking with MSW, visual regression testing, integration test architecture, and CI automation."
---

# Advanced Testing & Mock Service Worker (MSW)

As applications grow, fragile unit tests that manually mock individual `fetch` or `axios` calls become a maintenance burden. When API endpoints change or internal implementation details shift, these mocks fail to catch real-world integration regressions.

**Mock Service Worker (MSW)** intercepts HTTP requests at the network layer using Service Workers (in the browser) and NodeJS network interceptors (in Vitest), providing seamless API mocking for both development and testing.

## Setting Up Mock Service Worker (MSW)

```typescript
// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('https://api.example.com/users/current', () => {
    return HttpResponse.json({
      id: 'usr-1',
      name: 'Hesam Pourabbasian',
      role: 'Staff Engineer',
    });
  }),
];
```

## Configuring MSW in Vitest

```typescript
// src/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);

// src/test/setup.ts
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## Best Practices

- **Mock at the Network Layer**: Use MSW instead of mocking internal fetch utility functions.
- **Test Error Scenarios**: Override MSW handlers in specific tests (`server.use(http.get(..., () => HttpResponse.error()))`) to test error boundary resilience.
- **Run Visual Regression Tests**: Use Playwright visual comparisons to catch unintended CSS layout regressions.

## Summary

Advanced testing relies on network-level request mocking with MSW and full user journey verification with Playwright.
