---
title: 'Enums'
description: 'Master TypeScript enums: numeric enums, string enums, const enums, runtime output, and modern alternatives like const objects and union literals.'
order: 7
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 30
prerequisites:
  - /learn/typescript/06-unions-and-literals
---

# Enums

Enums (short for enumerations) allow developers to define a set of named constants. TypeScript introduced enums early in its evolution (prior to the standardized adoption of `as const` and literal unions) to bring classical object-oriented enumerations from languages like C# and Java into the JavaScript world.

Unlike most TypeScript features which are purely erased during compilation, standard enums are one of the very few TypeScript constructs that generate actual JavaScript code at runtime. Understanding how enums compile, when they are useful, and why modern TypeScript teams often prefer union literals or `as const` objects is crucial for writing clean code.

```text
┌────────────────────────────────────────────────────────────┐
│                    TypeScript Enums                        │
├──────────────────────────────┬─────────────────────────────┤
│ Numeric Enum                 │ String Enum                 │
│ enum Direction {             │ enum Direction {            │
│   Up,    // 0                │   Up = 'UP',                │
│   Down,  // 1                │   Down = 'DOWN',            │
│   Left,  // 2                │   Left = 'LEFT',            │
│   Right  // 3                │   Right = 'RIGHT'           │
│ }                            │ }                           │
├──────────────────────────────┴─────────────────────────────┤
│ Modern Alternative: const Object + Union of Keys           │
│ const DIRECTION = {                                        │
│   Up: 'UP', Down: 'DOWN', Left: 'LEFT', Right: 'RIGHT'     │
│ } as const;                                                │
│ type Direction = (typeof DIRECTION)[keyof typeof DIRECTION];│
└────────────────────────────────────────────────────────────┘
```

## Numeric Enums

A **Numeric Enum** assigns an auto-incrementing integer value to each member, starting by default at `0` unless an explicit initial value is provided:

```typescript
enum Direction {
  Up,    // 0
  Down,  // 1
  Left,  // 2
  Right, // 3
}

const userMove: Direction = Direction.Up;
console.log(userMove); // Output: 0
```

You can initialize any member with a custom numeric starting offset, and all subsequent members will increment automatically from that value:

```typescript
enum StatusCode {
  Ok = 200,
  Created = 201,
  BadRequest = 400,
  Unauthorized, // 401 (automatically incremented from 400)
  Forbidden,    // 402
  NotFound = 404,
}
```

### Reverse Mapping in Numeric Enums

Numeric enums generate a **reverse mapping** in the compiled JavaScript output. This means you can look up both the numeric value from the member name and the member name from the numeric value:

```typescript
console.log(Direction.Up);        // Output: 0
console.log(Direction[0]);        // Output: "Up"
```

While reverse mapping is sometimes convenient, it produces larger JavaScript runtime bundles and can create unexpected behavior when iterating over enum keys with `Object.keys()`.

## String Enums

In a **String Enum**, every member must be explicitly initialized with a string literal or another string enum member. String enums do not auto-increment and do not generate reverse mappings:

```typescript
enum UserRole {
  Admin = "ADMIN",
  Editor = "EDITOR",
  Viewer = "VIEWER",
}

function checkAccess(role: UserRole) {
  if (role === UserRole.Admin) {
    console.log("Full administrative privileges granted.");
  }
}

checkAccess(UserRole.Admin); // Valid
```

String enums provide readable values in network payloads, database records, and log outputs, making debugging much easier than analyzing raw numeric integers.

## `const enum` (Compile-Time Inlining)

To avoid generating runtime JavaScript object boilerplate, TypeScript provides `const enum`. When code using a `const enum` is compiled, TypeScript completely erases the enum object and inlines the raw literal values directly at all call sites:

```typescript
const enum LogLevel {
  Debug = "DEBUG",
  Info = "INFO",
  Warn = "WARN",
  Error = "ERROR",
}

const currentLevel = LogLevel.Info;

// Compiled JavaScript Output (cleanly inlined with zero runtime overhead):
// const currentLevel = "INFO";
```

**Caveat with `const enum`**: Because `const enum` values are erased and inlined, they can cause compilation issues in projects that use isolated transpilations (such as Babel, SWC, or Vite with `isolatedModules: true`) or when published in library packages.

## When to Use Enums vs Modern Alternatives

In modern TypeScript (version 4.0+ and 5.0+), many engineering teams avoid standard `enum` in favor of **`as const` objects** and **literal unions**. Here is a comparison:

### Modern Pattern: `as const` Object + Type Alias

```typescript
// 1. Define a constant object with 'as const'
export const HttpMethod = {
  Get: "GET",
  Post: "POST",
  Put: "PUT",
  Delete: "DELETE",
} as const;

// 2. Extract the union type of values
export type HttpMethod = (typeof HttpMethod)[keyof typeof HttpMethod];
// Equivalent to: type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

// Usage in functions:
function makeApiCall(url: string, method: HttpMethod) {
  // Safe execution
}

makeApiCall("/api/items", HttpMethod.Get); // Clean object access
makeApiCall("/api/items", "GET");          // Also valid! No strict enum instance requirement
```

| Feature | Standard `enum` | `const enum` | `as const` Object + Union |
| :--- | :--- | :--- | :--- |
| **Runtime JS Code** | Generates Object + IIFE | Zero (Inlined literals) | Clean Standard JS Object |
| **Reverse Mapping** | Yes (numeric only) | No | No |
| **Tree-Shaking** | Poor (IIFE wrappers) | Complete | Excellent |
| **`isolatedModules` Support** | Yes | No (can fail) | Yes (100% compliant) |
| **Pass Raw Literals** | No (requires `Enum.Member`) | No | Yes (`"GET"` is accepted) |

## Summary

- Numeric enums provide auto-incrementing integers and generate bidirectional reverse mappings in runtime JavaScript.
- String enums assign explicit string values to members, improving debuggability in logs and network transfers.
- `const enum` inlines literal values at compile time, eliminating runtime object overhead but conflicting with `isolatedModules`.
- The modern idiomatic alternative is using an `as const` object combined with a `typeof` union type, offering superior tree-shaking and compatibility with modern bundlers (Vite, esbuild).

## Best Practices

1. **Prefer `as const` Objects or Literal Unions**: For new codebases, favor `const Obj = { ... } as const` over `enum` for cleaner runtime output and better tree-shaking.
2. **Never use Non-String Enums for Public APIs**: Numeric enums can lead to dangerous nominal type checks where arbitrary numbers bypass validation.
3. **Avoid `const enum` in Public Libraries**: Avoid publishing `const enum` in npm libraries to prevent breaking consumers using Babel or `isolatedModules`.
4. **Use String Enums When Enums Are Mandated**: If your team style guide mandates enums, always use explicit string enums instead of numeric enums.
