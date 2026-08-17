---
title: 'Testing Vue 3 Applications'
description: 'Complete guide to testing Vue 3 applications: unit testing with Vitest, component testing with Vue Test Utils, mocking APIs, testing Pinia stores, composables, and Playwright E2E.'
order: 17
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 35
prerequisites:
  - /learn/vue/05-components
  - /learn/vue/09-composition-api
  - /learn/vue/13-state-management-pinia
---

# Testing Vue 3 Applications

Testing is an indispensable practice in professional software engineering. Automated test suites give engineering teams the confidence to refactor code, upgrade dependencies, deploy to production rapidly, and prevent software regressions. In the modern Vue 3 ecosystem, testing is fast, intuitive, and unified under **Vitest** (the Vite-native test runner) and **Vue Test Utils**.

In this lesson, we will explore the frontend testing pyramid, configure Vitest, write component integration tests using Vue Test Utils, test custom composables and Pinia stores, mock HTTP network requests, and execute End-to-End (E2E) tests with Playwright.

## The Vue Testing Pyramid

A balanced frontend testing strategy consists of three tiers:
1. **Unit Tests (Fastest & Highest Volume)**: Test isolated pure functions, mathematical algorithms, data transformations, and utilities in milliseconds without rendering UI.
2. **Component / Integration Tests (Balanced Core)**: Mount Vue components in a virtual DOM environment (jsdom/happy-dom), simulate user clicks and form inputs, assert emitted events, and verify that components interact correctly with child components, composables, and stores.
3. **End-to-End (E2E) Tests (Slowest & Highest Fidelity)**: Launch a real browser instance (Chromium, Firefox, WebKit) via Playwright or Cypress, execute full end-to-end user journeys (login → add to cart → checkout), and verify server database integration.

## Setting Up Vitest with Vue 3

**Vitest** shares the exact same configuration, plugins, and transform pipeline as your Vite dev server (`vite.config.ts`), eliminating the complex Babel/Jest configuration headaches of the past.

Install Vitest, Vue Test Utils, and a DOM simulation environment:

```bash
npm install -D vitest @vue/test-utils jsdom
```

Configure `vite.config.ts`:

```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
```

Add the test runner script in `package.json`:
```json
{
  "scripts": {
    "test": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

## Component Testing with Vue Test Utils

Vue Test Utils (`@vue/test-utils`) is the official library for mounting and interacting with Vue components in a test environment.

### Testing Props, Rendering, and Events
Let's test a `CounterCard.vue` component:

```vue
<!-- src/components/CounterCard.vue -->
<script setup lang="ts">
const props = defineProps<{
  initialCount?: number
  maxLimit?: number
}>()

const count = defineModel<number>({ default: 0 })

const emit = defineEmits<{
  limitReached: [val: number]
}>()

function increment() {
  if (props.maxLimit !== undefined && count.value >= props.maxLimit) {
    emit('limitReached', count.value)
    return
  }
  count.value += 1
}
</script>

<template>
  <div class="counter-card">
    <span data-testid="count-display">Current: {{ count }}</span>
    <button data-testid="increment-btn" @click="increment">+1</button>
  </div>
</template>
```

```typescript
// src/components/__tests__/CounterCard.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CounterCard from '../CounterCard.vue'

describe('CounterCard.vue', () => {
  it('renders initial count prop correctly', () => {
    const wrapper = mount(CounterCard, {
      props: {
        modelValue: 5,
      },
    })

    const display = wrapper.find('[data-testid="count-display"]')
    expect(display.text()).toContain('Current: 5')
  })

  it('increments count and updates v-model when button is clicked', async () => {
    const wrapper = mount(CounterCard, {
      props: {
        modelValue: 0,
      },
    })

    const button = wrapper.find('[data-testid="increment-btn"]')
    await button.trigger('click')

    // Verify emitted update:modelValue event
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([1])
  })

  it('emits limitReached event when exceeding maxLimit', async () => {
    const wrapper = mount(CounterCard, {
      props: {
        modelValue: 10,
        maxLimit: 10,
      },
    })

    await wrapper.find('[data-testid="increment-btn"]').trigger('click')

    expect(wrapper.emitted('limitReached')).toBeTruthy()
    expect(wrapper.emitted('limitReached')![0]).toEqual([10])
  })
})
```

## Testing Form Inputs and `flushPromises`

When testing asynchronous state updates or form inputs, user events must be awaited, and any pending asynchronous promises (like API fetch operations) must be flushed using `flushPromises()` from `@vue/test-utils`:

```typescript
import { mount, flushPromises } from '@vue/test-utils'
import LoginForm from '../LoginForm.vue'
import { vi } from 'vitest'

it('submits form payload after filling inputs', async () => {
  const wrapper = mount(LoginForm)

  // Find inputs and set values
  await wrapper.find('input[type="email"]').setValue('hesam@front-heaven.dev')
  await wrapper.find('input[type="password"]').setValue('SecurePassword123!')

  // Trigger form submit
  await wrapper.find('form').trigger('submit.prevent')

  // Wait for all microtasks and promises to resolve
  await flushPromises()

  expect(wrapper.text()).toContain('Login Successful')
})
```

## Testing Custom Composables

Because composables frequently rely on Vue's reactivity system and lifecycle hooks (`onMounted`, `onUnmounted`), testing composables that use lifecycle hooks requires executing them within an active Vue component context.

Create a lightweight test helper function:

```typescript
// src/test-utils/withSetup.ts
import { createApp } from 'vue'

export function withSetup<T>(composable: () => T): [T, ReturnType<typeof createApp>] {
  let result: T
  const app = createApp({
    setup() {
      result = composable()
      return () => {}
    },
  })
  app.mount(document.createElement('div'))
  return [result!, app]
}
```

```typescript
// src/composables/__tests__/useCounter.spec.ts
import { describe, it, expect } from 'vitest'
import { withSetup } from '@/test-utils/withSetup'
import { useCounter } from '../useCounter'

describe('useCounter composable', () => {
  it('increments and decrements reactive count', () => {
    const [counter] = withSetup(() => useCounter(10))

    expect(counter.count.value).toBe(10)
    counter.increment()
    expect(counter.count.value).toBe(11)
    counter.decrement()
    expect(counter.count.value).toBe(10)
  })
})
```

## Testing Pinia Stores with `@pinia/testing`

Pinia provides dedicated testing utilities (`@pinia/testing` or `createPinia`) to instantiate fresh, isolated stores for each unit test, preventing state bleeding between tests:

```bash
npm install -D @pinia/testing
```

```typescript
// src/stores/__tests__/cart.spec.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from '../cart'

describe('Cart Store', () => {
  beforeEach(() => {
    // Fresh pinia instance before every test
    setActivePinia(createPinia())
  })

  it('adds items and computes subtotal correctly', () => {
    const cart = useCartStore()
    expect(cart.totalItemCount).toBe(0)

    cart.addItem({ id: 'p1', title: 'Vue 3 Course', price: 50 })
    cart.addItem({ id: 'p1', title: 'Vue 3 Course', price: 50 }) // increases qty

    expect(cart.totalItemCount).toBe(2)
    expect(cart.subtotal).toBe(100)
  })

  it('removes items cleanly', () => {
    const cart = useCartStore()
    cart.addItem({ id: 'p1', title: 'Vue 3 Course', price: 50 })
    cart.removeItem('p1')
    expect(cart.isCartEmpty).toBe(true)
  })
})
```

## Mocking API Calls with `vi.fn()` and `vi.spyOn()`

Never make real HTTP requests during unit or component tests. Use Vitest's mocking utilities to mock service functions or Axios clients:

```typescript
import { vi, describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import UserListView from '@/views/UserListView.vue'
import { userService } from '@/services/userService'

describe('UserListView', () => {
  it('fetches and renders users from API', async () => {
    // Mock the service method
    vi.spyOn(userService, 'getUsers').mockResolvedValueOnce([
      { id: '1', name: 'Alice' },
      { id: '2', name: 'Bob' },
    ])

    const wrapper = mount(UserListView)
    
    // Initial loading indicator
    expect(wrapper.text()).toContain('Loading users...')

    await flushPromises()

    // Assert rendered data
    expect(wrapper.text()).toContain('Alice')
    expect(wrapper.text()).toContain('Bob')
  })
})
```

## End-to-End (E2E) Testing with Playwright

Playwright tests the complete running web application in real browser engines:

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test('user can log in and view dashboard', async ({ page }) => {
  await page.goto('http://localhost:5173/login')

  await page.fill('input[type="email"]', 'developer@front-heaven.dev')
  await page.fill('input[type="password"]', 'Password123!')
  await page.click('button[type="submit"]')

  // Assert redirection and page elements
  await expect(page).toHaveURL('http://localhost:5173/dashboard')
  await expect(page.locator('h1')).toContainText('Welcome back, Developer')
})
```

## Best Practices

- **Test Behavior, Not Implementation**: Test what the user sees and interacts with (text, buttons, emitted events) rather than private internal variables.
- **Use `data-testid` Selectors**: Select elements using `wrapper.find('[data-testid="submit-btn"]')` rather than CSS class names (`.btn-primary`) that can change during visual redesigns.
- **Isolate Test State**: Always reset Pinia stores, mocks (`vi.clearAllMocks()`), and timers (`vi.useRealTimers()`) in `beforeEach` / `afterEach` hooks.
- **Enforce Coverage Thresholds**: Aim for >80% code coverage on core domain logic, composables, and Pinia stores.

## Summary

Automated testing is the ultimate safety net for scalable Vue 3 applications. By combining Vitest for lightning-fast unit tests, Vue Test Utils for component integration tests, mock services for network boundaries, and Playwright for real-browser E2E flows, you can ship production features with unwavering quality and confidence.
