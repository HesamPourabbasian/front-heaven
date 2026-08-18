---
title: 'Narrowing'
description: 'Master TypeScript type narrowing: control-flow analysis, typeof, instanceof, in operator, equality and truthiness checks, and custom type predicates.'
order: 8
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 35
prerequisites:
  - /learn/typescript/06-unions-and-literals
---

# Narrowing

In TypeScript, a variable can begin with a broad, flexible type—such as `string | number | Date` or `unknown`. However, before you can safely invoke specific methods or pass that variable to functions expecting a narrower type, you must reduce its broad possibilities down to a more specific type. This process is called **Type Narrowing**.

TypeScript utilizes an advanced **Control-Flow Analysis** engine. As your code branches through `if` conditions, `switch` statements, ternaries, and loops, the compiler constantly tracks the possible types of each variable at every single execution point, ensuring absolute runtime safety.

```text
┌────────────────────────────────────────────────────────────┐
│              Broad Type: string | number | null            │
└─────────────────────────────┬──────────────────────────────┘
                              │
                    if (value === null) return;
                              │
┌─────────────────────────────▼──────────────────────────────┐
│                  Type: string | number                     │
└─────────────────────────────┬──────────────────────────────┘
                              │
                    if (typeof value === "string")
                              │
             ┌────────────────┴────────────────┐
             ▼                                 ▼
┌─────────────────────────┐       ┌─────────────────────────┐
│      Type: string       │       │      Type: number       │
│  value.toUpperCase()    │       │     value.toFixed(2)    │
└─────────────────────────┘       └─────────────────────────┘
```

## 1. `typeof` Type Guards

The `typeof` operator is built into JavaScript and returns a string identifying the primitive type of an operand (`"string"`, `"number"`, `"boolean"`, `"bigint"`, `"symbol"`, `"undefined"`, `"object"`, `"function"`). TypeScript recognizes these checks and automatically narrows the variable within matching conditional branches:

```typescript
function padLeft(padding: number | string, input: string): string {
  if (typeof padding === "number") {
    // In this branch, TypeScript knows 'padding' is strictly 'number'
    return " ".repeat(padding) + input;
  }
  // In this branch, TypeScript knows 'padding' is strictly 'string'
  return padding + input;
}
```

*Note*: Because `typeof null` returns `"object"` in JavaScript, checking `typeof value === "object"` does not eliminate `null`. You must also verify `value !== null`.

## 2. Truthiness Narrowing

JavaScript coerces values to booleans inside conditional expressions (`if`, `&&`, `||`, `!`). The values `0`, `NaN`, `""` (empty string), `0n`, `null`, `undefined`, and `false` all coerce to `false` (falsy), while all other values coerce to `true` (truthy).

TypeScript uses truthiness checks to filter out `null` and `undefined`:

```typescript
function printUsers(users?: string[] | null) {
  if (users) {
    // Both 'undefined' and 'null' are eliminated here!
    // TypeScript knows 'users' is strictly 'string[]'
    console.log(`Found ${users.length} registered users.`);
  } else {
    console.log("No user list provided.");
  }
}
```

## 3. Equality Narrowing (`===`, `!==`, `==`, `!=`)

TypeScript analyzes equality checks and switch statements to narrow types. When two variables are compared with strict equality (`===`), TypeScript understands that their types must intersect:

```typescript
function compareValues(x: string | number, y: string | boolean) {
  if (x === y) {
    // The only type common to both 'string | number' and 'string | boolean' is 'string'
    // Inside this branch, both 'x' and 'y' are narrowed to 'string'!
    console.log(x.toUpperCase(), y.toLowerCase());
  }
}
```

Equality checks are also ideal for eliminating `null` or `undefined` specifically:

```typescript
function processContent(content: string | null) {
  if (content !== null) {
    console.log(content.trim()); // content is string
  }
}
```

## 4. The `in` Operator Narrowing

JavaScript's `in` operator checks whether an object or its prototype chain contains a property with the specified name. TypeScript uses the `in` operator to narrow union types containing different object shapes:

```typescript
interface AdminUser {
  name: string;
  role: "admin";
  manageDatabase: () => void;
}

interface StandardUser {
  name: string;
  role: "user";
  viewDashboard: () => void;
}

type Account = AdminUser | StandardUser;

function authenticateAndExecute(account: Account) {
  if ("manageDatabase" in account) {
    // TypeScript narrows 'account' to 'AdminUser'
    account.manageDatabase();
  } else {
    // TypeScript narrows 'account' to 'StandardUser'
    account.viewDashboard();
  }
}
```

## 5. `instanceof` Narrowing

The `instanceof` operator checks if an object is an instance of a specific constructor class or built-in prototype (such as `Date`, `RegExp`, `Error`, or custom classes):

```typescript
function formatTimestamp(input: Date | string | number): string {
  if (input instanceof Date) {
    // 'input' is strictly 'Date'
    return input.toISOString();
  } else if (typeof input === "number") {
    // 'input' is strictly 'number'
    return new Date(input).toISOString();
  }
  // 'input' is strictly 'string'
  return new Date(Date.parse(input)).toISOString();
}
```

## 6. Custom Type Predicates (`is`)

Standard JavaScript operators cannot always determine complex nested object contracts. For these scenarios, TypeScript allows you to author **Custom Type Predicate functions**. A type predicate uses the syntax `parameterName is Type` as the function return type:

```typescript
interface ApiSuccessResponse<T> {
  status: "success";
  data: T;
}

interface ApiErrorResponse {
  status: "error";
  message: string;
  code: number;
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Custom Type Guard with Type Predicate
function isSuccessResponse<T>(response: ApiResponse<T>): response is ApiSuccessResponse<T> {
  return response.status === "success" && "data" in response;
}

function handleResponse(res: ApiResponse<string[]>) {
  if (isSuccessResponse(res)) {
    // Inside this block, 'res' is guaranteed to be 'ApiSuccessResponse<string[]>'
    console.log(`Fetched items: ${res.data.join(", ")}`);
  } else {
    // Outside, 'res' is guaranteed to be 'ApiErrorResponse'
    console.error(`Request failed (${res.code}): ${res.message}`);
  }
}
```

## 7. Control-Flow Analysis and Unreachable Code

TypeScript's control-flow analysis continually evaluates variable assignments and early return statements (`return`, `throw`, `break`, `continue`). When all possible types in a union have been narrowed and eliminated, any remaining code branch is assigned the bottom type `never`:

```typescript
function processDirection(direction: "north" | "south") {
  if (direction === "north") {
    return "Going North";
  } else if (direction === "south") {
    return "Going South";
  }

  // At this point, all possibilities have been exhausted
  // 'direction' is inferred as 'never'
  const unreachable: never = direction;
  return unreachable;
}
```

## Summary

- Type narrowing refines a broad union or unknown type down to a precise type using runtime checks.
- `typeof` guards narrow primitive types (`string`, `number`, `boolean`).
- Truthiness checks eliminate `null` and `undefined`.
- Equality operators (`===`, `!==`) and switch statements narrow intersecting types.
- The `in` operator differentiates object shapes by property presence.
- `instanceof` validates class and prototype instances (`Date`, `Error`, `HTMLElement`).
- Custom type predicates (`arg is Type`) empower developers to build reusable runtime validation guards.
- Control-flow analysis tracks code execution paths and assigns `never` to impossible branches.

## Best Practices

1. **Use Early Returns for Guard Clauses**: Narrow out `null`, `undefined`, or error states at the top of functions with early returns to avoid deeply nested `if` blocks.
2. **Build Type Predicates for Complex DTOs**: Create dedicated `isType(val): val is Type` helper functions when validating data from untyped sources (e.g., localStorage or API responses).
3. **Beware of `typeof null === "object"`**: Always combine object checks with a null check: `typeof val === "object" && val !== null`.
4. **Use Discriminated Unions with Switch for Complex State**: Prefer discriminated union property checks (`state.status === "ready"`) over manual multi-property `in` checks.
