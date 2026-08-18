---
title: 'Error Handling & Safety'
description: 'Master type-safe error handling in TypeScript: unknown catch variables, custom error classes, assertion functions, type guards, exhaustive checking, and Result monad patterns.'
order: 18
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 40
prerequisites:
  - /learn/typescript/17-modules
---

# Error Handling & Safety

In JavaScript, any value can be thrown using the `throw` statement—an `Error` instance, a string, a number, or even `null`. Consequently, inside a `catch (err)` block, the type of `err` is completely unpredictable at runtime. Prior to TypeScript 4.4, catch variables were implicitly typed as `any`, creating dangerous situations where developers called `err.message` on non-Error values, causing secondary runtime crashes inside error handlers.

In modern TypeScript, error handling is strictly enforced. By enabling `"useUnknownInCatchVariables": true` (included in `"strict": true`), catch variables are typed as `unknown`.

In this lesson, we explore type-safe error handling, custom error hierarchies, assertion functions (`asserts`), exhaustive switch verification, and functional `Result<T, E>` pattern architectures.

```text
┌────────────────────────────────────────────────────────────┐
│                    Type-Safe Error Flow                    │
│                                                            │
│  try {                                                     │
│    await executeOperation();                               │
│  } catch (err: unknown) {                                  │
│    // Type Narrowing Required                              │
│    if (err instanceof ApiHttpError) {                      │
│      console.log(err.statusCode, err.details);             │
│    } else if (err instanceof Error) {                      │
│      console.log(err.message);                             │
│    } else {                                                │
│      console.log('Unknown error:', String(err));           │
│    }                                                       │
│  }                                                         │
└────────────────────────────────────────────────────────────┘
```

## `unknown` vs `any` in Catch Clauses

When `"useUnknownInCatchVariables": true` is active, TypeScript forces you to narrow the error object before accessing any properties on it:

```typescript
function parseUserJson(jsonString: string): UserProfile | null {
  try {
    return JSON.parse(jsonString) as UserProfile;
  } catch (error: unknown) {
    // Direct access triggers compile error:
    // Error: 'error' is of type 'unknown'.
    // console.log(error.message);

    // Safe error message extraction:
    const message = error instanceof Error ? error.message : "Failed to parse JSON string";
    console.error(`[PARSE ERROR]: ${message}`);
    return null;
  }
}
```

## Creating Custom Error Classes

In enterprise applications, creating domain-specific error classes allows your application to distinguish between network timeouts, authorization failures, database constraints, and validation errors:

```typescript
export class DomainError extends Error {
  public readonly timestamp: Date;

  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = this.constructor.name;
    this.timestamp = new Date();
    // Maintain proper prototype chain across downlevel compilation
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ValidationError extends DomainError {
  constructor(message: string, public readonly invalidFields: string[]) {
    super(message, "VALIDATION_FAILED");
  }
}

export class NotFoundError extends DomainError {
  constructor(resourceName: string, id: string) {
    super(`${resourceName} with ID '${id}' was not found.`, "RESOURCE_NOT_FOUND");
  }
}
```

With custom error classes, consumer code can handle specific failures gracefully using `instanceof`:

```typescript
function handleGlobalError(err: unknown) {
  if (err instanceof ValidationError) {
    console.warn(`Validation failed on fields: ${err.invalidFields.join(", ")}`);
  } else if (err instanceof NotFoundError) {
    console.warn(`Resource missing: ${err.message}`);
  } else if (err instanceof Error) {
    console.error(`Unexpected system error: ${err.message}`);
  } else {
    console.error("Unknown non-error object thrown:", err);
  }
}
```

## Assertion Functions (`asserts condition`)

TypeScript supports **Assertion Functions**—special functions that throw an error if a condition is false. Once an assertion function is invoked, TypeScript narrows the type of the checked variable for the remainder of the containing scope:

```typescript
// Asserts that a condition is true
function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(`[ASSERTION FAILURE]: ${message}`);
  }
}

// Asserts that a value is defined (neither null nor undefined)
function assertIsDefined<T>(value: T, name: string): asserts value is NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error(`Expected '${name}' to be defined, but received ${value}`);
  }
}

function processOrder(userId?: string | null) {
  // 'userId' has type 'string | null | undefined'

  assertIsDefined(userId, "userId");

  // After assertion, TypeScript knows 'userId' is strictly 'string'!
  console.log(`Processing order for user: ${userId.toUpperCase()}`);
}
```

## Exhaustive Checking with `never`

When dealing with discriminated unions representing state or action types, exhaustive checking guarantees that every possible union branch is handled. If someone adds a new variant to the union in the future, the compiler raises an error at the unhandled `never` assignment:

```typescript
type PaymentMethod = "credit_card" | "paypal" | "apple_pay" | "crypto";

function processPaymentFlow(method: PaymentMethod, amount: number): string {
  switch (method) {
    case "credit_card":
      return `Charged $${amount} to Credit Card`;
    case "paypal":
      return `Redirected to PayPal for $${amount}`;
    case "apple_pay":
      return `Authorized Apple Pay for $${amount}`;
    case "crypto":
      return `Generated Crypto invoice for $${amount}`;
    default: {
      // If a new PaymentMethod (e.g., 'bank_transfer') is added without a case above,
      // TypeScript reports a compile error right here!
      const exhaustiveCheck: never = method;
      throw new Error(`Unhandled payment method: ${exhaustiveCheck}`);
    }
  }
}
```

## The Functional `Result<T, E>` Pattern (No Thrown Exceptions)

Throwing exceptions bypasses TypeScript's type system because function return types do not track thrown exceptions. Many modern TypeScript codebases adopt the functional **Result Pattern** (popularized by Rust) to make error states explicit in function signatures:

```typescript
export type Result<TData, TError = Error> =
  | { success: true; value: TData }
  | { success: false; error: TError };

export function ok<T>(value: T): Result<T, never> {
  return { success: true, value };
}

export function err<E>(error: E): Result<never, E> {
  return { success: false, error };
}

// Function signature explicitly advertises potential failure modes
function divideNumbers(numerator: number, denominator: number): Result<number, string> {
  if (denominator === 0) {
    return err("Cannot divide by zero.");
  }
  return ok(numerator / denominator);
}

// Consumer must handle both branches safely:
const outcome = divideNumbers(100, 4);
if (outcome.success) {
  console.log(`Calculated result: ${outcome.value}`);
} else {
  console.error(`Division failed: ${outcome.error}`);
}
```

## Summary

- Catch variables are typed as `unknown` under `"strict": true`, mandating runtime type checks.
- Custom error classes extending `Error` allow granular error categorization and type-safe `instanceof` branching.
- Assertion functions (`asserts value is T`) narrow types for the rest of a function's scope by throwing upon failure.
- Exhaustive switch checks using `never` prevent unhandled union variants when data models evolve.
- The functional `Result<T, E>` pattern makes errors explicit in function return types, eliminating surprise runtime exceptions.

## Best Practices

1. **Never Type Catch Variables as `any`**: Treat all caught exceptions as `unknown` and verify with `instanceof Error`.
2. **Always Call `super(message)` in Custom Errors**: Ensure custom error subclasses invoke `super(message)` and restore the prototype chain.
3. **Use Assertion Functions for Invariants**: Validate preconditions and non-null states at function entry points using `assertIsDefined()`.
4. **Prefer `Result<T, E>` for Expected Domain Failures**: Use thrown exceptions only for fatal, unexpected system crashes; use `Result<T, E>` for expected business logic validation errors.
