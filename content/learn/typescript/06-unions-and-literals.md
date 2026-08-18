---
title: 'Unions & Literals'
description: 'Master union types, intersection types, string/number/boolean literal types, and discriminated unions for type-safe state machines.'
order: 6
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 35
prerequisites:
  - /learn/typescript/05-objects
---

# Unions & Literals

In real-world applications, values are rarely unrestricted primitives. An application's network request is not just "any string"—it is specifically `"idle"`, `"loading"`, `"success"`, or `"error"`. Similarly, an entity ID might be represented as either a numeric database auto-increment ID or a UUID string.

TypeScript models these exact real-world scenarios through **Union Types**, **Literal Types**, and **Intersection Types**. When combined into **Discriminated Unions**, they form one of the most powerful paradigms in modern software engineering: making invalid state impossible to represent at compile time.

```text
┌─────────────────────────────────────────────────────────────┐
│ Union Type: A | B (Value can be either type A OR type B)    │
│ type ID = string | number;                                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Intersection: A & B (Value must satisfy BOTH type A AND B)  │
│ type AdminUser = UserProfile & Permissions;                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Discriminated Union: Discriminated by common 'status' key   │
│ type NetworkState =                                         │
│   | { status: 'idle' }                                      │
│   | { status: 'loading' }                                   │
│   | { status: 'success'; data: User[] }                     │
│   | { status: 'error'; error: Error }                       │
└─────────────────────────────────────────────────────────────┘
```

## Union Types (`|`)

A **Union Type** describes a value that can be one of several distinct types. The vertical pipe operator (`|`) separates each member of the union:

```typescript
type Identifier = string | number;

function printIdentifier(id: Identifier) {
  console.log(`Resource ID: ${id}`);
}

printIdentifier(101);             // Valid: number
printIdentifier("usr_87ab19");    // Valid: string
```

When interacting with a union type, TypeScript only allows you to access members that are common to *all* types in the union. If a method only exists on one specific member (such as `.toUpperCase()` on `string` but not `number`), you must first narrow the type using a type guard (such as `typeof`):

```typescript
function formatIdentifier(id: Identifier): string {
  // TypeScript enforces type narrowing:
  if (typeof id === "string") {
    return id.toUpperCase(); // In this branch, 'id' is guaranteed to be string
  }
  return id.toFixed(0);      // In this branch, 'id' is guaranteed to be number
}
```

## Literal Types: String, Number, and Boolean Literals

A **Literal Type** represents an exact specific primitive value rather than the broad set of all possible values. TypeScript supports three kinds of literal types:

### 1. String Literal Types

Instead of allowing any arbitrary string, you can constrain variables to exact allowed string values:

```typescript
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type Theme = "light" | "dark" | "system";

function sendRequest(url: string, method: HttpMethod) {
  // Only valid HTTP methods are permitted
}

sendRequest("/api/users", "GET");   // Valid

// Error: Argument of type '"OPTIONS"' is not assignable to parameter of type 'HttpMethod'.
sendRequest("/api/users", "OPTIONS");
```

### 2. Number Literal Types

Constrain numeric values to specific integers or configuration levels:

```typescript
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;
type HttpStatusCode = 200 | 201 | 400 | 401 | 403 | 404 | 500;

function handleStatusCode(code: HttpStatusCode) {
  // Handles strictly known HTTP status codes
}
```

### 3. Boolean Literal Types

Constrain a property strictly to `true` or `false`:

```typescript
type MustBeTrue = true;
// Useful in validation schemas and discriminated unions:
interface CompletedTask {
  title: string;
  isComplete: true;
  completedAt: Date;
}
```

## Intersection Types (`&`)

While a union type represents an *OR* relationship, an **Intersection Type** (`&`) combines multiple types into one single composite type representing an *AND* relationship. An object matching an intersection type must satisfy every property of all intersected types:

```typescript
interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
}

interface SoftDeletable {
  isDeleted: boolean;
  deletedAt?: Date;
}

interface UserAccount {
  id: string;
  email: string;
}

// Combine all three interfaces into an AuditedUser type:
type AuditedUser = UserAccount & Timestamps & SoftDeletable;

const activeUser: AuditedUser = {
  id: "usr_99",
  email: "dev@company.com",
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date(),
  isDeleted: false,
};
```

Intersection types are widely used for mixing base domain entities with metadata, audit logs, and permission scopes.

## Discriminated Unions (Tagged Unions)

A **Discriminated Union** (also called a tagged union or algebraic data type) is a pattern where every type in a union shares a single common literal property—known as the **discriminant** or **tag**. TypeScript's compiler can examine this tag in `switch` or `if` statements to narrow the entire object structure with 100% precision.

Consider modeling an asynchronous network request state. In naive JavaScript, developers often create a messy object with multiple boolean flags:

```typescript
// Anti-Pattern: Confusing, bug-prone state representation
interface NaiveNetworkState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  data: User[] | null;
  errorMessage: string | null;
}
// This allows impossible states: isLoading=true AND isSuccess=true simultaneously!
```

With Discriminated Unions, impossible states are mathematically eliminated:

```typescript
// The Discriminated Union Pattern: Clean, unambiguous state machines
interface IdleState {
  status: "idle";
}

interface LoadingState {
  status: "loading";
}

interface SuccessState {
  status: "success";
  data: string[];
  fetchedAt: Date;
}

interface ErrorState {
  status: "error";
  error: Error;
  retryCount: number;
}

type NetworkState = IdleState | LoadingState | SuccessState | ErrorState;

function renderUserInterface(state: NetworkState): string {
  switch (state.status) {
    case "idle":
      return "Press 'Fetch' to begin.";
    case "loading":
      return "Loading data from server...";
    case "success":
      // TypeScript knows 'state.data' exists ONLY on 'success'
      return `Loaded ${state.data.length} items on ${state.fetchedAt.toISOString()}`;
    case "error":
      // TypeScript knows 'state.error' exists ONLY on 'error'
      return `Failed: ${state.error.message} (Retries: ${state.retryCount})`;
  }
}
```

Because TypeScript's control flow analyzer understands the `"status"` discriminant, accessing `state.data` inside `case "loading"` immediately produces a compile-time error.

## Summary

- Union types (`A | B`) represent values that can belong to one of multiple types.
- Common properties of union members can be accessed directly; specific properties require type narrowing.
- Literal types (string, number, boolean) constrain variables to exact discrete values rather than arbitrary primitives.
- Intersection types (`A & B`) combine multiple types into a single composite type containing all properties.
- Discriminated unions combine a shared literal tag (discriminant) across objects to model reliable, type-safe state machines and eliminate impossible runtime states.

## Best Practices

1. **Use Discriminated Unions for Asynchronous States**: Never model API or UI states with independent boolean flags (`isLoading`, `hasError`, `data`). Use a discriminated union with a `status` tag.
2. **Prefer String Literals over Magic Strings**: Replace arbitrary string arguments in functions with focused string literal union types (`"horizontal" | "vertical"`).
3. **Use Descriptive Discriminant Key Names**: Standardize on `status`, `kind`, or `type` as the discriminant property across your domain models.
4. **Leverage Exhaustive Type Checking**: Pair discriminated unions with `switch` statements and `never` assertions to ensure all union variants are handled when adding new features.
