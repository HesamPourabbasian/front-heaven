---
title: 'Testing'
description: 'Master JavaScript testing strategies: Unit testing, Vitest, Jest, assertions, test suites, mocking, spies, fixtures, component testing, integration testing, and End-to-End (E2E) testing with Playwright and Cypress.'
order: 27
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 40
prerequisites:
  - /learn/javascript/26-browser-apis
---

# Testing

Automated testing is an indispensable discipline in professional software engineering. A comprehensive automated test suite provides regression protection, enables fearless refactoring, documents intended system behavior, and enforces software architecture contracts throughout continuous integration (CI/CD) pipelines.

Modern JavaScript testing follows the **Testing Pyramid** model: a broad foundation of fast, deterministic **Unit Tests**, a middle tier of **Integration and Component Tests**, and an apex of full-stack **End-to-End (E2E) Tests**.

In this lesson, we will explore the JavaScript testing landscape, write unit tests with **Vitest** and **Jest**, master assertions and matchers, implement test doubles (Mocks, Stubs, Spies), utilize test fixtures, write integration tests, and execute E2E browser automation with **Playwright** and **Cypress**.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                          The Testing Pyramid                           │
├────────────────────────────────────────────────────────────────────────┤
│                    ▲                                                   │
│                   / \     E2E Tests (Playwright / Cypress)             │
│                  /   \    - Full browser, real backend, slow/high cost │
│                 /─────\                                                │
│                / Integr\  Integration & Component Tests                │
│               /  -ation \ - Multiple units, DOM rendering              │
│              /───────────\                                             │
│             / Unit Tests  \ Unit Tests (Vitest / Jest)                 │
│            /───────────────\- Pure functions, fast, deterministic      │
└────────────────────────────────────────────────────────────────────────┘
```

## Unit Testing with Vitest and Jest

**Vitest** (built natively on Vite) and **Jest** are the premier test runners in modern JavaScript. They provide test runner engines, assertion libraries, mock environments, and code coverage reporting out of the box.

Tests are organized into logical test suites using `describe()`, with individual test cases defined using `test()` or `it()`:

```javascript
// mathEngine.js
export function calculateCartDiscount(subtotal, promoCode) {
  if (subtotal < 0) throw new RangeError("Subtotal cannot be negative");
  if (promoCode === "SAVE20") return subtotal * 0.80;
  if (promoCode === "SAVE50") return subtotal * 0.50;
  return subtotal;
}
```

```javascript
// mathEngine.test.js - Unit Test Suite
import { describe, it, expect } from "vitest";
import { calculateCartDiscount } from "./mathEngine.js";

describe("calculateCartDiscount()", () => {
  it("should apply 20% discount on valid promo code", () => {
    const result = calculateCartDiscount(100, "SAVE20");
    expect(result).toBe(80);
  });

  it("should return unchanged subtotal when promo code is invalid", () => {
    const result = calculateCartDiscount(100, "INVALID");
    expect(result).toBe(100);
  });

  it("should throw RangeError when subtotal is negative", () => {
    expect(() => calculateCartDiscount(-50, "SAVE20")).toThrow(RangeError);
  });
});
```

## Matchers and Assertions

Assertion libraries evaluate whether a test condition passes or fails:
- Equality: `expect(a).toBe(b)` (strict `===`), `expect(obj).toEqual(expectedObj)` (deep equality).
- Truthiness: `expect(val).toBeTruthy()`, `expect(val).toBeNull()`, `expect(val).toBeUndefined()`.
- Numerical: `expect(num).toBeGreaterThan(10)`, `expect(num).toBeCloseTo(0.3, 5)` (for floating point math).
- Strings: `expect(str).toMatch(/regex/)`, `expect(str).toContain("sub")`.
- Arrays: `expect(arr).toContain(item)`, `expect(arr).toHaveLength(3)`.

## Mocking, Stubs, and Spies

When unit testing a function that depends on external services (APIs, databases, file system, random number generators), you should **mock** the dependency to keep tests fast, isolated, and deterministic:

- **Spy (`vi.spyOn` / `jest.spyOn`)**: Wraps an existing method, recording call counts, arguments, and return values without necessarily altering its behavior.
- **Mock Function (`vi.fn()` / `jest.fn()`)**: Creates a simulated function with custom mock implementations.

```javascript
import { describe, it, expect, vi } from "vitest";
import * as NotificationService from "./NotificationService.js";
import { processOrder } from "./OrderProcessor.js";

describe("OrderProcessor Integration", () => {
  it("should send email notification upon successful order", async () => {
    // Spy on external notification service and mock its resolved return
    const spy = vi.spyOn(NotificationService, "sendEmail").mockResolvedValue({ status: "SENT" });

    const order = { id: 101, customerEmail: "client@test.com", total: 45.00 };
    await processOrder(order);

    // Verify spy was invoked with exact required parameters
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("client@test.com", expect.stringContaining("Order #101"));

    spy.mockRestore(); // Restore original implementation
  });
});
```

## Component and Integration Testing

Integration tests verify that multiple modules work together correctly. In frontend applications, component testing libraries (Testing Library for Vue/React) render components in a virtual DOM environment (jsdom/happy-dom), firing realistic user events and asserting on rendered text.

## End-to-End (E2E) Testing with Playwright

**Playwright** controls real headless or headful Chromium, Firefox, and WebKit browser engines to simulate true end-to-end user journeys:

```javascript
// e2e/checkout.spec.js - Playwright Test
import { test, expect } from "@playwright/test";

test("User can add item to cart and complete checkout", async ({ page }) => {
  await page.goto("http://localhost:3000/store");

  // Click 'Add to Cart' button
  await page.click('button[data-testid="add-to-cart-101"]');

  // Verify Cart badge updates to 1
  const badge = page.locator(".cart-badge");
  await expect(badge).toHaveText("1");

  // Navigate to checkout
  await page.click("a.checkout-link");
  await expect(page).toHaveURL("http://localhost:3000/checkout");
});
```

## Summary

Testing guarantees code reliability across production environments. Unit tests evaluate isolated pure functions quickly using Vitest or Jest. Spies and mocks isolate units from external dependencies. Component tests verify UI interactions in virtual DOMs. End-to-End tests (Playwright, Cypress) automate real browsers to validate critical business user flows.

## Best Practices

1. **Follow the AAA Pattern**: Structure every test into **Arrange** (setup state), **Act** (execute function), and **Assert** (verify results).
2. **Test Behavior, Not Implementation Details**: Write tests from the perspective of external consumers rather than asserting on private internal variables.
3. **Avoid Over-Mocking**: Only mock true external boundaries (network, timers, disk I/O); test internal units together whenever practical.
4. **Ensure Deterministic Tests**: Eliminate test flakiness by avoiding random numbers, un-mocked clocks, or dependency on network availability.
5. **Run Tests in CI on Every Pull Request**: Automate test execution in GitHub Actions to catch regressions before merging code.
