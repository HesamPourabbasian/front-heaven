---
title: 'Testing Strategies: Unit, Server Actions & Playwright E2E'
description: 'Master comprehensive testing in Next.js: unit testing with Vitest and React Testing Library, mocking Server Components and database calls, Server Action integration tests, and Playwright end-to-end user journeys.'
order: 28
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 40
prerequisites:
  - /learn/nextjs/06-server-and-client-components
  - /learn/nextjs/19-server-actions
---

# Testing Strategies: Unit, Server Actions & Playwright E2E

Building enterprise Next.js applications requires a comprehensive testing pyramid covering isolated unit tests for UI components, integration tests for Server Actions and database mutations, and **End-to-End (E2E) tests with Playwright** to verify multi-page user journeys across real browsers.

In this lesson, you will master unit testing with Vitest and React Testing Library, Server Action testing, and automated Playwright E2E suites.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Next.js Testing Pyramid Architecture                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  ▲  E2E Tests (Playwright)                                                  │
│  │  • Full browser execution, authentications, Stripe checkout flows        │
│  │                                                                          │
│  ├── Integration Tests (Vitest)                                             │
│  │   • Server Actions with real/mocked database mutations                  │
│  │                                                                          │
│  └── Unit / Component Tests (Vitest + React Testing Library)                │
│      • Client components, utility functions, Zod schema validation          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Unit Testing Client Components with Vitest

Test interactive client components using Vitest and `@testing-library/react`:

```tsx
// components/Counter.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Counter } from './Counter';

describe('Counter Component', () => {
  it('increments count when clicked', () => {
    render(<Counter />);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Count: 0');

    fireEvent.click(button);
    expect(button).toHaveTextContent('Count: 1');
  });
});
```

---

## 2. Integration Testing Server Actions

Directly test asynchronous Server Actions by mocking the database client:

```typescript
// app/actions/todos.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTodo } from './todos';
import { db } from '@/lib/db';

vi.mock('@/lib/db', () => ({
  db: {
    todo: {
      create: vi.fn(),
    },
  },
}));

vi.mock('@/lib/auth', () => ({
  getCurrentUser: vi.fn().mockResolvedValue({ id: 'user-123' }),
}));

describe('createTodo Server Action', () => {
  it('creates todo item and returns success', async () => {
    const formData = new FormData();
    formData.append('title', 'Ship Next.js App');

    const result = await createTodo(formData);

    expect(db.todo.create).toHaveBeenCalledWith({
      data: {
        title: 'Ship Next.js App',
        userId: 'user-123',
      },
    });
    expect(result).toEqual({ success: true });
  });
});
```

---

## 3. End-to-End Testing with Playwright

Verify critical user authentication and checkout flows across real Chromium and WebKit browsers:

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication Journey', () => {
  test('allows a user to log in and access protected dashboard', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[name="email"]', 'alex@enterprise.dev');
    await page.fill('input[name="password"]', 'SuperSecret123!');
    await page.click('button[type="submit"]');

    // Verify redirected to dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('h1')).toContainText('Executive Overview');
  });
});
```

---

## Summary & Key Takeaways

- Vitest and React Testing Library provide fast unit tests for client components and utilities.
- Server Actions can be tested directly in Node.js test runners by mocking database or authentication dependencies.
- Playwright provides end-to-end testing across real browsers with automatic trace recordings.

## Best Practices & Senior Guidance

1. **Use Playwright Storage State for Authenticated Tests**: Log in once in a setup project and save the authentication cookie to disk, allowing 50+ E2E tests to run without re-authenticating on every test case.
2. **Run E2E Tests Against Production Builds**: Always run `npm run build && npm run start` before executing Playwright tests to accurately test SSR, caching, and server actions.
