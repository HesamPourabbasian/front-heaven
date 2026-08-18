---
title: 'Testing Engineering & Advanced Test Strategies'
description: 'Master enterprise test engineering: Unit testing with Vitest, Component integration testing with Testing Library, End-to-End browser automation with Playwright, Visual Regression, Contract Testing, and Mutation Testing.'
order: 11
difficulty: 'advanced'
category: 'Senior Front-End Engineering'
estimatedMinutes: 50
prerequisites:
  - /learn/advanced-topics/10-ssr-and-rendering-architecture
---

# Testing Engineering & Advanced Test Strategies

In high-velocity software engineering organizations, automated testing is the foundational safety net that allows teams to ship dozens of deployments to production every single day with total confidence. Senior engineers design resilient test suites that verify real user behaviors rather than fragile internal implementation details.

In this lesson, we explore the modern **Testing Trophy/Pyramid**, unit testing with **Vitest**, integration testing with **Testing Library**, end-to-end browser automation with **Playwright**, **Visual Regression Testing**, **Contract Testing (Pact)**, and **Mutation Testing (Stryker)**.

```text
┌────────────────────────────────────────────────────────────┐
│                    The Testing Trophy                      │
├──────────────────────────────┬─────────────────────────────┤
│ 1. End-to-End (E2E)          │ Playwright / Cypress        │
│    (Critical User Journeys)  │ Real browser, real network  │
├──────────────────────────────┼─────────────────────────────┤
│ 2. Integration Tests (CORE)  │ Testing Library + MSW       │
│    (Component + State + API) │ Verified user behavior      │
├──────────────────────────────┼─────────────────────────────┤
│ 3. Unit Tests                │ Vitest / Jest               │
│    (Pure utils, algorithms)  │ Fast, isolated, deterministic│
├──────────────────────────────┼─────────────────────────────┤
│ 4. Static Analysis           │ TypeScript & ESLint         │
└──────────────────────────────┴─────────────────────────────┘
```

## 1. Unit Testing Pure Domain Functions with Vitest

Unit tests should focus on isolated, pure business logic, calculations, data transformations, and state reducers:

```typescript
import { describe, it, expect } from "vitest";
import { calculateOrderPricing } from "./pricingEngine";

describe("Pricing Engine", () => {
  it("applies tier discounts and tax rates correctly", () => {
    const result = calculateOrderPricing({
      subtotalCents: 10000, // $100.00
      discountCoupon: "PRO_MEMBER_20",
      taxRate: 0.08, // 8%
    });

    expect(result.discountCents).toBe(2000);
    expect(result.taxCents).toBe(640);
    expect(result.totalCents).toBe(8640); // $86.40
  });

  it("throws validation error on negative subtotals", () => {
    expect(() => calculateOrderPricing({ subtotalCents: -500, taxRate: 0.1 })).toThrowError(
      "Subtotal cannot be negative"
    );
  });
});
```

## 2. Component Integration Testing with Testing Library & MSW

Avoid testing internal component state or private methods. Test components from the user's perspective: finding elements by their **accessible role and label**, firing user events, and intercepting network requests via **Mock Service Worker (MSW)**:

```tsx
import { render, screen, waitFor } from "@testing-library/vue"; // or @testing-library/react
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import LoginForm from "./LoginForm.vue";

// 1. Setup Network Interception
const server = setupServer(
  http.post("/api/login", async ({ request }) => {
    const body: any = await request.json();
    if (body.email === "dev@test.org" && body.password === "secret123") {
      return HttpResponse.json({ user: { name: "Dev Engineer" } });
    }
    return new HttpResponse(null, { status: 401 });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("LoginForm Component", () => {
  it("allows user to log in and displays welcome message", async () => {
    const user = userEvent.setup();
    render(LoginForm);

    // Find inputs by accessible role & label (resilient to DOM refactors!)
    await user.type(screen.getByLabelText(/email address/i), "dev@test.org");
    await user.type(screen.getByLabelText(/password/i), "secret123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    // Verify user-visible output
    await waitFor(() => {
      expect(screen.getByText(/welcome back, dev engineer/i)).toBeInTheDocument();
    });
  });
});
```

## 3. End-to-End Browser Automation with Playwright

Playwright runs real Chromium, Firefox, and WebKit browsers in headless or headed mode, simulating end-to-end user journeys with automated retries, trace recordings, and network mocking:

```typescript
// tests/e2e/checkout.spec.ts
import { test, expect } from "@playwright/test";

test.describe("E-Commerce Checkout Flow", () => {
  test("guest user can add product to cart and complete checkout", async ({ page }) => {
    // 1. Visit Catalog Page
    await page.goto("/catalog");

    // 2. Add item to cart
    await page.getByRole("button", { name: /add ergonomic chair to cart/i }).click();
    await expect(page.getByTestId("cart-badge-count")).toHaveText("1");

    // 3. Open Cart & Checkout
    await page.getByRole("button", { name: /view cart/i }).click();
    await page.getByRole("link", { name: /proceed to checkout/i }).click();

    // 4. Fill Shipping Info
    await page.getByLabel(/full name/i).fill("Alex Engineer");
    await page.getByLabel(/shipping address/i).fill("100 Tech Blvd");
    await page.getByRole("button", { name: /place order/i }).click();

    // 5. Assert Confirmation Screen
    await expect(page.getByRole("heading", { name: /order confirmed!/i })).toBeVisible();
  });
});
```

## 4. Advanced Testing: Visual Regression, Contracts & Mutation Testing

- **Visual Regression Testing (Playwright / Percy / Chromatic)**: Takes pixel-perfect screenshots of components and pages, diffing them against baseline images to catch unintended CSS layout regressions.
- **Consumer-Driven Contract Testing (Pact)**: Verifies that frontend API requests match backend OpenAPI schemas and responses before deploying either service to staging.
- **Mutation Testing (Stryker Mutator)**: Injects intentional bugs (mutations) into your production source code (e.g., changing `>` to `<` or deleting an `if` block). If your test suite passes without catching the mutation, the test is marked as weak.

## Summary

- The Testing Trophy emphasizes Integration Tests (component + state + mock network) as the core sweet spot.
- Testing Library tests user-visible behavior using accessibility roles (`getByRole`) rather than fragile CSS classes.
- Mock Service Worker (MSW) intercepts network calls at the network layer without modifying application code.
- Playwright provides cross-browser end-to-end automation with auto-waiting and trace inspection.
- Visual regression, contract testing, and mutation testing guarantee enterprise quality across visual, network, and logic tiers.

## Best Practices

1. **Query Elements by Accessible Roles**: Use `getByRole('button', { name: /submit/i })` instead of `.btn-primary` or CSS selectors.
2. **Never Mock What You Can Run**: Test real component integration with stores and routers rather than mocking every child component.
3. **Use MSW for Network Mocking**: Intercept network requests transparently at the HTTP level instead of mocking global `fetch`.
4. **Capture Traces on E2E Test Failures**: Enable Playwright video and trace recordings in CI to diagnose flaky tests instantly.
