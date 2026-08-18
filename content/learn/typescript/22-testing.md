---
title: 'Testing'
description: 'Master type-safe testing in TypeScript: Vitest, Jest, type-safe mocks with vi.fn(), Mocked interfaces, testing API responses, and custom type assertions.'
order: 22
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 35
prerequisites:
  - /learn/typescript/21-api-and-backend
---

# Testing

Testing is a cornerstone of professional software engineering. While TypeScript catches static type mismatches, syntax errors, and missing properties during compilation, it cannot test runtime business logic, mathematical algorithms, edge cases, or asynchronous race conditions.

Combining TypeScript with modern test runners—such as **Vitest** or **Jest**—gives you the ultimate testing experience: **Type-Safe Unit, Integration, and Component Testing**. In this lesson, we explore writing typed unit tests, creating type-safe mocks, verifying API payload schemas, and testing UI components with complete static safety.

```text
┌────────────────────────────────────────────────────────────┐
│                    Type-Safe Test Engine                   │
├────────────────────────────────────────────────────────────┤
│ Vitest / Jest Test Runner                                  │
│ - describe() & it() with TypeScript validation             │
│ - vi.fn<[id: string], Promise<User>>()                     │
│ - vi.mocked(apiService) ──> Full Mocked<T> Introspection   │
├────────────────────────────────────────────────────────────┤
│ Type Testing Assertions                                    │
│ - expectTypeOf<T>().toEqualTypeOf<U>()                     │
│ - assertType<T>(value)                                     │
└────────────────────────────────────────────────────────────┘
```

## Unit Testing with Vitest and TypeScript

Vitest is a modern, blazing-fast test runner powered by Vite that natively parses TypeScript files with zero configuration required.

```typescript
// src/utils/pricing.test.ts
import { describe, it, expect } from "vitest";

interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

function calculateOrderTotal(items: readonly CartItem[], taxRate: number = 0.08): number {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return Math.round((subtotal + subtotal * taxRate) * 100) / 100;
}

describe("calculateOrderTotal", () => {
  it("should calculate correct subtotal and tax for multiple items", () => {
    const sampleCart: CartItem[] = [
      { name: "Mechanical Keyboard", price: 100, quantity: 1 },
      { name: "Gaming Mouse", price: 50, quantity: 2 },
    ];

    const total = calculateOrderTotal(sampleCart, 0.1); // Subtotal: 200, Tax: 20
    expect(total).toBe(220);
  });

  it("should return zero when cart is empty", () => {
    expect(calculateOrderTotal([])).toBe(0);
  });
});
```

## Type-Safe Mocks: `vi.fn()` and `Mocked<T>`

In JavaScript, creating mock functions frequently involves untyped stubs that can drift out of sync with real interfaces. In Vitest and TypeScript, mock functions can be explicitly parameterized:

```typescript
import { describe, it, expect, vi } from "vitest";

interface PaymentGateway {
  chargeCard(token: string, amountCents: number): Promise<{ success: boolean; transactionId: string }>;
  refund(transactionId: string): Promise<boolean>;
}

describe("CheckoutService", () => {
  it("should invoke chargeCard with correct parameters", async () => {
    // Type-safe mock function with explicit parameter and return signatures:
    const mockCharge = vi.fn<PaymentGateway["chargeCard"]>().mockResolvedValue({
      success: true,
      transactionId: "tx_998124",
    });

    const mockGateway: PaymentGateway = {
      chargeCard: mockCharge,
      refund: vi.fn().mockResolvedValue(true),
    };

    // Execute service logic
    const result = await mockGateway.chargeCard("tok_visa", 4500);

    expect(result.success).toBe(true);
    expect(mockCharge).toHaveBeenCalledTimes(1);
    expect(mockCharge).toHaveBeenCalledWith("tok_visa", 4500);
  });
});
```

### Deep Module Mocking with `vi.mocked()`

When mocking an entire imported service module, `vi.mocked()` converts all methods into their corresponding mock types while preserving full IntelliSense:

```typescript
import { UserService } from "./services/UserService";
import { vi } from "vitest";

vi.mock("./services/UserService");

const mockedUserService = vi.mocked(UserService, true);

mockedUserService.getUserById.mockResolvedValue({
  id: "u1",
  name: "Ada Lovelace",
  email: "ada@dev.org",
});
```

## Static Type Testing (`expectTypeOf` and `assertType`)

Vitest includes built-in static type assertion utilities that run during test execution to verify that complex generic transformations produce the exact expected types:

```typescript
import { expectTypeOf, assertType, describe, it } from "vitest";

type ApiResponse<T> = { data: T; status: number };

describe("Static Type Checks", () => {
  it("should produce correct response structure types", () => {
    type UserResponse = ApiResponse<{ username: string }>;

    // Verify type identity statically:
    expectTypeOf<UserResponse>().toEqualTypeOf<{ data: { username: string }; status: number }>();

    // Assert that a value matches type:
    const payload = { data: { username: "alan" }, status: 200 };
    assertType<UserResponse>(payload);
  });
});
```

## Type-Safe Component Testing (Testing Library)

When testing React, Vue, or Svelte components with `@testing-library`, props passed into `render()` are strictly type-checked:

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { UserProfileCard } from "./UserProfileCard";

describe("UserProfileCard", () => {
  it("renders user information and responds to follow click", () => {
    const handleFollow = vi.fn<(userId: string) => void>();

    // Props passed to render are strictly type-checked against UserProfileCardProps
    render(
      <UserProfileCard
        user={{ id: "u_1", name: "Grace Hopper", isFollowed: false }}
        onFollowToggle={handleFollow}
      />
    );

    const button = screen.getByRole("button", { name: /follow/i });
    fireEvent.click(button);

    expect(handleFollow).toHaveBeenCalledWith("u_1");
  });
});
```

## Summary

- Vitest and Jest provide native TypeScript test execution.
- Typed mock functions (`vi.fn<Signature>()`) prevent mock signatures from drifting away from production interfaces.
- `vi.mocked(module, true)` provides deep type-safe mock reflection across imported modules.
- `expectTypeOf<T>()` and `assertType<T>()` test compile-time generic types alongside runtime behavior.
- UI component tests enforce strict prop validation at test authoring time.

## Best Practices

1. **Parameterize Mock Functions Explicitly**: Type `vi.fn<Interface['method']>()` to guarantee mock return values match production interfaces.
2. **Use `vi.mocked()` for Module Spies**: Wrap imported modules in `vi.mocked()` to avoid casting mocks as `any`.
3. **Include Static Type Tests for Complex Generic Utilities**: Use `expectTypeOf()` when authoring reusable mapped or conditional types in shared libraries.
4. **Co-locate Tests with Source Files**: Keep `MyComponent.test.ts` right next to `MyComponent.ts` for clean module resolution and maintenance.
