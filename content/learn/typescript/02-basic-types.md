---
title: 'Basic Types'
description: 'Understand every primitive and special type in TypeScript: string, number, boolean, bigint, symbol, null, undefined, any, unknown, never, and void.'
order: 2
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 30
prerequisites:
  - /learn/typescript/01-typescript-fundamentals
---

# Basic Types

TypeScript provides a rich type system that mirrors all of JavaScript's runtime primitive values while introducing specialized top, bottom, and unit types to express complex program states. Understanding these building blocks is essential before constructing complex data models, generic interfaces, or enterprise domain layers.

In this lesson, we will examine every primitive type available in TypeScript, explore the critical distinctions between bottom types like `never` and top types like `unknown` and `any`, and learn when each type should be applied in modern development.

```text
┌────────────────────────────────────────────────────────┐
│               Top Type: any / unknown                  │
│  (Can hold any value; unknown enforces type narrowing) │
└───────────────────────────┬────────────────────────────┘
                            │
        ┌───────────────────┴───────────────────┐
        ▼                                       ▼
┌───────────────────────────────┐   ┌──────────────────────────────┐
│       Primitive Types         │   │         Unit Types           │
│ string, number, boolean,      │   │ void, undefined, null        │
│ bigint, symbol                │   │                              │
└───────────────────────────────┘   └──────────────────────────────┘
        │                                       │
        └───────────────────┬───────────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│                   Bottom Type: never                   │
│        (Represents values that can never occur)        │
└────────────────────────────────────────────────────────┘
```

## Primitive Types: `string`, `number`, and `boolean`

The three most common primitive types in TypeScript directly represent JavaScript's core primitive data:

1. **`string`**: Represents textual data encoded in UTF-16. Both single quotes, double quotes, and template literal strings are typed as `string`.
2. **`number`**: Represents double-precision 64-bit floating-point values conforming to IEEE 754. TypeScript does not distinguish between integers and floats; all integers, decimals, hexadecimal, binary, and octal notations belong to `number`.
3. **`boolean`**: Represents logical values that are either `true` or `false`.

```typescript
const authorName: string = "Grace Hopper";
const publicationYear: number = 1952;
const isPioneer: boolean = true;

// Template string interpolation preserves the 'string' type
const biography: string = `${authorName} published her compiler paper in ${publicationYear}.`;
```

## `bigint` and `symbol`

TypeScript provides full static type support for ES2020 `bigint` and ES2015 `symbol` primitives:

- **`bigint`**: Represents arbitrary-precision whole integers that exceed the safe integer limit of JavaScript numbers ($2^{53} - 1$, or `Number.MAX_SAFE_INTEGER`). A `bigint` is created using the `n` literal suffix or the `BigInt()` constructor. Note that `bigint` cannot be mixed directly with regular `number` values in arithmetic operations without explicit casting.
- **`symbol`**: Represents unique, immutable identifiers often used as private object property keys to avoid naming collisions.

```typescript
// BigInt for massive cryptographic or blockchain calculations
const satoshiSupply: bigint = 2100000000000000n;
const transactionId: bigint = BigInt("9007199254740995");

// Symbol for globally unique object keys
const UNIQUE_ID: symbol = Symbol("user_unique_identifier");
const systemConfig = {
  [UNIQUE_ID]: "SECURE_HASH_09124",
  systemName: "ClusterAlpha"
};
```

## `null` and `undefined`

In JavaScript, `null` represents the intentional absence of any object value, whereas `undefined` represents a variable that has been declared but not yet assigned a value.

In TypeScript, with the essential compiler flag `"strictNullChecks": true` enabled (which is turned on automatically by `"strict": true`), `null` and `undefined` each have their own discrete types and are not assignable to other types like `string` or `number`:

```typescript
let activeUser: string | null = null; // Can be a string or explicitly null
let sessionTimeout: number | undefined = undefined;

activeUser = "Ada Lovelace"; // Valid assignment
activeUser = null;           // Valid assignment

// Error if strictNullChecks is enabled:
// Type 'null' is not assignable to type 'number'.
let orderCount: number = null;
```

## The Top Types: `any` vs `unknown`

A "top type" in type theory is a type that can hold any value in the type system. TypeScript provides two top types: `any` and `unknown`. While they appear similar at first glance, their safety implications are polar opposites:

### `any`: The Safety Escape Hatch

The `any` type completely disables TypeScript's static type checker for that variable. You can access arbitrary properties, invoke it as a function, instantiate it as a class, or assign it to any other variable without receiving a single compiler warning:

```typescript
let untypedData: any = "Hello World";
untypedData.nonExistentMethod(); // No compile error! Crashes at runtime!
untypedData = 42;
let regularNumber: number = untypedData; // Assignable to number without safety checks
```

Using `any` undermines the fundamental purpose of TypeScript. It should only be used as a temporary escape hatch during legacy code migrations.

### `unknown`: The Type-Safe Alternative

The `unknown` type represents a value whose structure and type are completely unknown at compile time (such as parsed JSON from a network API or user input). Unlike `any`, TypeScript prohibits performing any operations on an `unknown` value until you verify and narrow its type using runtime checks:

```typescript
let rawApiResponse: unknown = JSON.parse('{"id": 101, "name": "Server Alpha"}');

// Compiler Error: 'rawApiResponse' is of type 'unknown'.
// rawApiResponse.name;

// Safe access after runtime type narrowing:
if (typeof rawApiResponse === "object" && rawApiResponse !== null && "name" in rawApiResponse) {
  console.log((rawApiResponse as { name: string }).name); // Safe!
}
```

## The Unit Type: `void`

The `void` type represents the absence of any returning value from a function. In JavaScript, a function without an explicit `return` statement implicitly returns `undefined`. In TypeScript, `void` is used as the return type to indicate that callers should not expect or use any returned value:

```typescript
function logSystemEvent(eventMessage: string): void {
  console.log(`[EVENT]: ${eventMessage}`);
  // No return value
}

const result = logSystemEvent("Server started");
// 'result' has type 'void'
```

## The Bottom Type: `never`

In type theory, a "bottom type" is a type that has no values and can never be instantiated. In TypeScript, `never` represents values that can never occur:

1. Functions that never return normally (because they throw an exception or enter an infinite loop).
2. Code branches that are logically impossible to reach (used extensively in exhaustive pattern matching).

```typescript
// A function that always throws an error returns 'never'
function throwCriticalError(errorMessage: string): never {
  throw new Error(`[FATAL]: ${errorMessage}`);
}

// Exhaustive checking with never
type TrafficLight = "red" | "yellow" | "green";

function handleLight(light: TrafficLight): string {
  switch (light) {
    case "red":
      return "Stop";
    case "yellow":
      return "Prepare to stop";
    case "green":
      return "Proceed";
    default: {
      // If a new light color is added to TrafficLight and not handled above,
      // TypeScript raises a compile error here!
      const exhaustiveCheck: never = light;
      return exhaustiveCheck;
    }
  }
}
```

## Summary

- Primitive types (`string`, `number`, `boolean`, `bigint`, `symbol`) represent JavaScript's standard runtime values.
- `null` and `undefined` represent uninitialized or empty values and are strictly enforced when `"strictNullChecks": true` is enabled.
- `any` disables all type safety and should be avoided in modern codebases.
- `unknown` is the type-safe top type that requires explicit narrowing before property access.
- `void` signifies that a function returns no usable value.
- `never` represents unreachable states or functions that never terminate normally, making it invaluable for exhaustive switch checks.

## Best Practices

1. **Prefer `unknown` over `any`**: When dealing with external APIs, network payloads, or third-party data of unknown structure, always use `unknown` combined with type guards.
2. **Enable `"strictNullChecks"`**: Always keep strict null checks enabled to avoid `TypeError: Cannot read properties of undefined` runtime crashes.
3. **Use `never` for Exhaustive Checks**: Always include a `default` case asserting against `never` in switch statements that handle union types.
4. **Distinguish `void` from `undefined`**: Use `void` for function return types where the caller shouldn't care about the return value; use `undefined` when a function explicitly returns the value `undefined`.
