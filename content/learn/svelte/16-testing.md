---
title: 'Testing Svelte 5 & SvelteKit Applications'
description: 'Complete guide to testing Svelte applications: unit testing with Vitest, component testing with @testing-library/svelte, testing Svelte 5 runes, testing load functions, and Playwright E2E.'
order: 16
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 35
prerequisites:
  - /learn/svelte/05-components
  - /learn/svelte/10-sveltekit
  - /learn/svelte/14-typescript
---

# Testing Svelte 5 & SvelteKit Applications

Automated testing is a cornerstone of professional software engineering. A comprehensive test suite empowers engineering teams to refactor code with confidence, upgrade dependencies, prevent regressions, and deploy features to production rapidly.

In modern Svelte 5 and SvelteKit engineering, testing is unified under **Vitest** (the Vite-native testing framework), **Testing Library for Svelte** (`@testing-library/svelte`), and **Playwright** for real-browser End-to-End (E2E) automation.

In this lesson, we will explore the frontend testing pyramid, configure Vitest, write component integration tests, test universal Svelte 5 Rune classes, test SvelteKit `load` functions and form actions, mock external API endpoints, and execute Playwright E2E tests.

## The Svelte Testing Pyramid

A resilient testing strategy combines three complementary tiers:
1. **Unit Tests (Fastest)**: Test isolated pure functions, mathematical algorithms, data formatting utilities, and Svelte 5 Rune classes directly in Node.js/jsdom in milliseconds.
2. **Component Integration Tests (Balanced Core)**: Render Svelte components using `@testing-library/svelte`, simulate user clicks, assert emitted callbacks, and verify that the component's rendered output matches expectations.
3. **End-to-End (E2E) Tests (Highest Fidelity)**: Launch a real browser (Chromium, Firefox, WebKit) via Playwright, execute complete user journeys (e.g. login $\rightarrow$ add to cart $\rightarrow$ checkout), and verify server database interactions.

## Configuring Vitest with Svelte

Vitest integrates natively with your existing `vite.config.ts` or `svelte.config.js`:

```bash
npm install -D vitest @testing-library/svelte @testing-library/jest-dom jsdom
```

Configure `vite.config.ts`:
```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
  },
})
```

In `src/setupTests.ts`:
```typescript
import '@testing-library/jest-dom/vitest'
```

Add test scripts to `package.json`:
```json
{
  "scripts": {
    "test": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

## Component Testing with `@testing-library/svelte`

Testing Library tests your components from the user's perspective, querying elements by their accessible roles and text rather than internal implementation details.

Let's test a `CounterCard.svelte` component:

```svelte
<!-- src/lib/CounterCard.svelte -->
<script lang="ts">
  interface Props {
    initialCount?: number
    maxLimit?: number
    onLimitReached?: (count: number) => void
  }

  let { initialCount = 0, maxLimit = 10, onLimitReached }: Props = $props()
  let count = $state(initialCount)

  function increment() {
    if (count >= maxLimit) {
      onLimitReached?.(count)
      return
    }
    count++
  }
</script>

<div class="counter-card">
  <span data-testid="count-val">Count: {count}</span>
  <button onclick={increment}>Increment</button>
</div>
```

```typescript
// src/lib/__tests__/CounterCard.test.ts
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/svelte'
import CounterCard from '../CounterCard.svelte'

describe('CounterCard.svelte', () => {
  it('renders initial count prop correctly', () => {
    render(CounterCard, { initialCount: 5 })

    expect(screen.getByTestId('count-val')).toHaveTextContent('Count: 5')
  })

  it('increments count on button click', async () => {
    render(CounterCard, { initialCount: 0 })

    const button = screen.getByRole('button', { name: /increment/i })
    await fireEvent.click(button)

    expect(screen.getByTestId('count-val')).toHaveTextContent('Count: 1')
  })

  it('calls onLimitReached callback when reaching maxLimit', async () => {
    const handleLimit = vi.fn()
    render(CounterCard, { initialCount: 10, maxLimit: 10, onLimitReached: handleLimit })

    const button = screen.getByRole('button', { name: /increment/i })
    await fireEvent.click(button)

    expect(handleLimit).toHaveBeenCalledWith(10)
  })
})
```

## Testing Universal Svelte 5 Rune State Classes

Because Svelte 5 Runes work in standalone `.svelte.ts` files, testing shared domain state requires zero component mounting:

```typescript
// src/lib/stores/cart.svelte.ts
export interface CartItem {
  id: string
  price: number
  qty: number
}

export class CartStore {
  items = $state<CartItem[]>([])
  totalPrice = $derived(this.items.reduce((sum, i) => sum + i.price * i.qty, 0))

  addItem(item: CartItem) {
    const existing = this.items.find(i => i.id === item.id)
    if (existing) {
      existing.qty += item.qty
    } else {
      this.items.push(item)
    }
  }

  removeItem(id: string) {
    this.items = this.items.filter(i => i.id !== id)
  }
}
```

```typescript
// src/lib/stores/__tests__/cart.test.ts
import { describe, it, expect } from 'vitest'
import { CartStore } from '../cart.svelte'

describe('CartStore (Svelte 5 Runes)', () => {
  it('adds items and derives total price correctly', () => {
    const cart = new CartStore()
    expect(cart.totalPrice).toBe(0)

    cart.addItem({ id: 'p1', price: 25, qty: 2 })
    expect(cart.totalPrice).toBe(50)

    cart.addItem({ id: 'p1', price: 25, qty: 1 }) // increments qty
    expect(cart.totalPrice).toBe(75)
  })

  it('removes item from store', () => {
    const cart = new CartStore()
    cart.addItem({ id: 'p1', price: 25, qty: 1 })
    cart.removeItem('p1')
    expect(cart.items.length).toBe(0)
  })
})
```

## Testing SvelteKit `load()` Functions and Form Actions

Because SvelteKit `load` functions and form actions are pure async JavaScript functions, you can unit-test them directly by mocking the `RequestEvent`:

```typescript
// src/routes/articles/__tests__/pageServer.test.ts
import { describe, it, expect, vi } from 'vitest'
import { load } from '../+page.server'

describe('Articles PageServerLoad', () => {
  it('returns articles and auth status from cookies', async () => {
    const mockCookies = {
      get: vi.fn().mockReturnValue('mock_session_123'),
    }

    const mockEvent = {
      url: new URL('http://localhost/articles'),
      cookies: mockCookies,
    } as any

    const result = await load(mockEvent)

    expect(result).toHaveProperty('articles')
    expect(result).toHaveProperty('isLoggedIn', true)
    expect(mockCookies.get).toHaveBeenCalledWith('session_id')
  })
})
```

## End-to-End (E2E) Testing with Playwright

Playwright automates real browser journeys, validating full network and database workflows:

```typescript
// e2e/authFlow.test.ts
import { test, expect } from '@playwright/test'

test('user can fill login form and navigate to dashboard', async ({ page }) => {
  await page.goto('http://localhost:5173/auth')

  await page.fill('input[name="email"]', 'hesam@front-heaven.dev')
  await page.fill('input[name="password"]', 'Password123!')
  await page.click('button[type="submit"]')

  // Verify URL redirection and welcome message
  await expect(page).toHaveURL('http://localhost:5173/dashboard')
  await expect(page.locator('h1')).toContainText('Welcome to your dashboard')
})
```

## Best Practices

- **Test User Behavior, Not Implementation**: Query elements with `screen.getByRole('button', { name: /save/i })` rather than inspecting internal state variables.
- **Unit Test Rune Classes in Isolation**: Extract complex domain calculations into `.svelte.ts` classes for fast, headless unit testing.
- **Mock Network Boundaries**: Use `vi.spyOn(globalThis, 'fetch')` to mock external API requests during component tests.
- **Maintain High Coverage on Server Actions**: Always unit-test SvelteKit form actions and `load()` functions to catch authentication and validation bugs early.

## Summary

Testing Svelte 5 and SvelteKit applications guarantees software stability and accelerates feature delivery. By combining Vitest for ultra-fast unit and rune testing, Testing Library for accessible component integration tests, and Playwright for real-browser E2E coverage, you can engineer enterprise Svelte applications with uncompromising quality.
