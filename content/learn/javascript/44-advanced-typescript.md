---
title: 'Advanced TypeScript'
description: 'Master advanced TypeScript type-level programming: Type Inference, Generics with constraints, Conditional Types (T extends U ? X : Y), Mapped Types, Template Literal Types, Utility Types, Type Guards, Type Predicates (is), the infer keyword, and type architecture.'
order: 44
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 45
prerequisites:
  - /learn/javascript/43-observability
---

# Advanced TypeScript

TypeScript has become the industry-standard language for modern enterprise frontend and full-stack JavaScript development. Beyond basic type annotations (`string`, `number`, interfaces), TypeScript features a Turing-complete, type-level functional programming language that allows developers to compute, transform, extract, and validate types at compile time.

Mastering advanced TypeScript type engineering—including **Conditional Types**, **Mapped Types**, the **`infer` keyword**, **Template Literal Types**, and **Custom Type Predicates**—enables the creation of bulletproof API clients, type-safe state management stores, and resilient library interfaces.

In this lesson, we will explore advanced type inference, constrained generics, conditional types, mapped type transformations, template literal types, built-in and custom utility types, runtime narrowing via type predicates, and the `infer` keyword.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        Type-Level Computation Pipeline                 │
├────────────────────────────────────────────────────────────────────────┤
│ type EventName = "click" | "hover";                                    │
│                                                                        │
│ // Template Literal Type + Mapped Type                                 │
│ type EventHandlerMap = {                                               │
│   [E in EventName as `on${Capitalize<E>}`]: (event: Event) => void     │
│ };                                                                     │
│ // Resolves to: { onClick: (e) => void, onHover: (e) => void }         │
│                                                                        │
│ // Conditional Type + infer                                            │
│ type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;            │
│ type ResolvedData = UnwrapPromise<Promise<{ id: number }>>;            │
│ // Resolves to: { id: number }                                         │
└────────────────────────────────────────────────────────────────────────┘
```

## Generics with Constraints (`extends`)

Generics allow functions, interfaces, and classes to operate over parameterized types while preserving type safety. Generic constraints (`T extends SomeType`) restrict allowable types and guarantee that specific properties are available:

```typescript
// Generic constraint requiring an object with an 'id' property
interface Identifiable {
  id: string | number;
}

function findEntityById<T extends Identifiable>(collection: T[], targetId: string | number): T | undefined {
  return collection.find(item => item.id === targetId);
}

const users = [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }];
const user = findEntityById(users, 1); // Typed as { id: number, name: string } | undefined
```

## Conditional Types and the `infer` Keyword

**Conditional Types** evaluate type relationships using ternary syntax: `T extends U ? X : Y`.

The **`infer`** keyword allows you to declare a type variable within the condition to dynamically extract and infer an inner type:

```typescript
// Extract the return type of any function automatically
type CustomReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function createSession() {
  return { token: "secret_123", expiresAt: 3600 };
}

type SessionData = CustomReturnType<typeof createSession>;
// Resolves to: { token: string; expiresAt: number; }

// Unwrap element type from an array
type FlattenArray<T> = T extends Array<infer ItemType> ? ItemType : T;
type StringElement = FlattenArray<string[]>; // string
```

## Mapped Types and Key Remapping (`as`)

**Mapped Types** iterate over keys (using `keyof`) to generate new object types, modifying property modifiers (`readonly`, `?`) and remapping key names using **Template Literal Types**:

```typescript
interface UserProfile {
  id: number;
  name: string;
  email: string;
}

// 1. Making all properties deeply immutable
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

// 2. Key remapping: Generate getter methods for every property
type CreateGetters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type UserGetters = CreateGetters<UserProfile>;
// Resolves to: { getId: () => number; getName: () => string; getEmail: () => string; }
```

## Custom Type Predicates (`is` Operator)

TypeScript's compiler can only narrow types automatically for basic `typeof` and `instanceof` checks. For complex custom runtime validation, **Type Predicates (`param is Type`)** teach the compiler that a successful boolean return guarantees the exact type of a variable:

```typescript
interface AdminUser {
  role: "admin";
  permissions: string[];
}

interface MemberUser {
  role: "member";
}

type User = AdminUser | MemberUser;

// Custom Type Guard Predicate function
function isAdmin(user: User): user is AdminUser {
  return user.role === "admin" && Array.isArray((user as AdminUser).permissions);
}

function executeAdminTask(user: User) {
  if (isAdmin(user)) {
    // TypeScript compiler narrows 'user' strictly to AdminUser here!
    console.log("Admin permissions:", user.permissions.join(", "));
  } else {
    // 'user' is narrowed to MemberUser
    console.log("Standard member access only");
  }
}
```

## Advanced Utility Types

TypeScript provides essential built-in type-level utility functions:
- `Partial<T>`: Makes all properties optional.
- `Required<T>`: Makes all properties mandatory.
- `Readonly<T>`: Makes all properties read-only.
- `Pick<T, K>`: Extracts a subset of properties from `T`.
- `Omit<T, K>`: Removes a subset of properties from `T`.
- `Record<K, T>`: Constructs an object type with keys `K` and values `T`.
- `Exclude<T, U>`: Excludes from `T` those types assignable to `U`.
- `Extract<T, U>`: Extracts from `T` those types assignable to `U`.
- `NonNullable<T>`: Removes `null` and `undefined` from `T`.

```typescript
type AppEvents = "user:login" | "user:logout" | "order:created" | "order:cancelled";

// Exclude user-related events
type OrderEventsOnly = Exclude<AppEvents, `user:${string}`>;
// "order:created" | "order:cancelled"
```

## Summary

Advanced TypeScript provides a powerful type-level computation system. Generic constraints enforce structural contracts. Conditional types with `infer` unwrap and extract inner types dynamically. Mapped types and template literals transform and remap object interfaces. Type predicates (`user is AdminUser`) empower the compiler to narrow complex domain objects at runtime.

## Best Practices

1. **Avoid the `any` Escape Hatch**: Use `unknown` for unvalidated inputs, narrowing with type guards before access.
2. **Use Discriminated Unions for State**: Model state with a common discriminator field (`status: 'loading' | 'success' | 'error'`) for exhaustive compile-time checking.
3. **Use `const` Type Parameters**: Use `const T` type parameters in TS 5.0+ to infer narrow literal types automatically without requiring `as const`.
4. **Leverage Type Predicates for Safe API Validation**: Validate untrusted incoming JSON payloads using type predicate functions or Zod schemas.
5. **Keep Type Computations Readable**: Break complex nested conditional types into small, named utility types.
