---
title: 'Generics'
description: 'Master Generics in TypeScript: generic functions, interfaces, type aliases, classes, generic constraints with extends, default parameters, and typed API responses.'
order: 13
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 40
prerequisites:
  - /learn/typescript/12-advanced-types
---

# Generics

In software engineering, writing reusable, maintainable code is a central goal. In untyped JavaScript, writing a reusable function is effortless because variables accept any value. However, in statically typed languages, writing a function that works across diverse types without sacrificing type safety can be challenging if you rely on `any` (which completely discards type checks).

**Generics** solve this fundamental problem. Generics allow you to write functions, interfaces, classes, and type aliases that accept **type parameters**—placeholders for types that are specified or inferred when the code is actually called. Generics provide maximum reusability while preserving 100% type fidelity.

```text
┌────────────────────────────────────────────────────────────┐
│                      Generic Contract                      │
│                                                            │
│  function wrapInResponse<T>( data: T ): ApiResponse<T>     │
│                          ▲          ▲                 ▲    │
│                          │          │                 │    │
│                     Type Param   Argument        Return Type│
│                       Capture      Type          Preserves T│
└────────────────────────────────────────────────────────────┘
```

## Generic Functions

A generic function introduces a type parameter within angle brackets (`<T>`) immediately preceding its parameter list:

```typescript
// Generic identity function: Returns the exact type passed in
function identity<T>(arg: T): T {
  return arg;
}

// Explicit type invocation:
const output1 = identity<string>("myString"); // type: string

// Type inference (TypeScript automatically infers T = number):
const output2 = identity(42); // type: number
```

### Practical Example: Array Utilities

```typescript
function getFirstElement<T>(array: readonly T[]): T | undefined {
  return array[0];
}

const numbers = [10, 20, 30];
const firstNumber = getFirstElement(numbers); // inferred as number | undefined

const names = ["Alice", "Bob", "Charlie"];
const firstName = getFirstElement(names);     // inferred as string | undefined
```

## Generic Interfaces and Type Aliases

Interfaces and type aliases can accept one or more generic type arguments, making data structures like trees, wrappers, and API responses reusable across your entire application:

```typescript
// Generic API Response Container
export interface ApiResponse<TData, TMeta = { page: number; total: number }> {
  status: "success" | "error";
  data: TData;
  meta?: TMeta;
  timestamp: Date;
}

// Domain Model
interface User {
  id: string;
  name: string;
  email: string;
}

// Using the generic interface with specific types:
const userResponse: ApiResponse<User[]> = {
  status: "success",
  data: [
    { id: "u1", name: "Ada", email: "ada@dev.org" },
    { id: "u2", name: "Alan", email: "alan@dev.org" }
  ],
  meta: { page: 1, total: 2 },
  timestamp: new Date(),
};
```

## Generic Classes

Classes can also parameterize their internal properties and method signatures using generics. A classic example is a type-safe generic Stack or Queue data structure:

```typescript
class DataQueue<T> {
  private items: T[] = [];

  public enqueue(item: T): void {
    this.items.push(item);
  }

  public dequeue(): T | undefined {
    return this.items.shift();
  }

  public peek(): T | undefined {
    return this.items[0];
  }

  public get size(): number {
    return this.items.length;
  }
}

const numberQueue = new DataQueue<number>();
numberQueue.enqueue(100);
numberQueue.enqueue(200);
const nextItem = numberQueue.dequeue(); // number | undefined
```

## Generic Constraints (`extends`)

Sometimes you want a function to be generic, but you still need to ensure that the passed type satisfies a minimum set of properties (such as having an `.id` property or a `.length` property). You restrict generic types using **Generic Constraints** via the `extends` keyword:

```typescript
interface HasId {
  id: string | number;
}

// T is constrained to types that have at least an 'id' property
function findEntityById<T extends HasId>(entities: T[], targetId: string | number): T | undefined {
  return entities.find(entity => entity.id === targetId);
}

const products = [
  { id: 1, title: "Mechanical Keyboard", price: 120 },
  { id: 2, title: "Wireless Mouse", price: 60 }
];

const found = findEntityById(products, 1); // found: { id: number; title: string; price: number; } | undefined
```

## Multiple Generic Parameters and `keyof` Constraints

You can define multiple comma-separated type parameters. A common pattern is constraining one type parameter to be a valid key of another type parameter using `K extends keyof T`:

```typescript
// Type-safe property getter
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = {
  id: "u_101",
  name: "Grace",
  age: 30,
  isActive: true,
};

const userName = getProperty(user, "name"); // type: string
const userAge = getProperty(user, "age");   // type: number

// Compile Error: Argument of type '"salary"' is not assignable to parameter of type '"id" | "name" | "age" | "isActive"'.
// getProperty(user, "salary");
```

## Default Generic Parameters

Just like function default arguments, generic type parameters can specify fallback default types:

```typescript
interface PaginatedResult<T, PaginationInfo = { page: number; limit: number; totalCount: number }> {
  items: T[];
  pagination: PaginationInfo;
}

// Uses default pagination metadata type:
type StandardUserPagination = PaginatedResult<User>;

// Uses custom cursor pagination metadata type:
type CursorUserPagination = PaginatedResult<User, { nextCursor: string; hasMore: boolean }>;
```

## Generic Factory and Builder Utilities

Generics enable type-safe builder patterns and immutable data updater utilities:

```typescript
function updateEntity<T extends { id: string }>(
  entity: T,
  updates: Partial<Omit<T, "id">>
): T {
  return {
    ...entity,
    ...updates,
  };
}

interface Article {
  id: string;
  title: string;
  content: string;
  published: boolean;
}

const original: Article = {
  id: "art_01",
  title: "TypeScript Mastery",
  content: "Deep dive into Generics...",
  published: false,
};

// Updating title safely (id cannot be updated):
const updated = updateEntity(original, { title: "TypeScript Mastery (2nd Ed)" });
```

## Summary

- Generics parameterize types across functions, interfaces, classes, and type aliases without sacrificing static type checking.
- TypeScript automatically infers generic type arguments at function call sites based on passed values.
- Generic constraints (`<T extends Constraint>`) guarantee that generic types contain required properties.
- Multiple generic parameters combined with `keyof` (`<T, K extends keyof T>`) enforce strict property-lookup safety.
- Default generic parameters (`<T = DefaultType>`) provide ergonomic fallbacks for consumer types.
- Generics form the foundation of type-safe API clients, collection stores, and data-access layers.

## Best Practices

1. **Use Meaningful Generic Names**: While `T`, `U`, `V`, and `K` are standard conventions for simple utilities, prefer descriptive names like `TEntity`, `TResponse`, `TKey` in complex enterprise types.
2. **Do Not Over-Genericize**: If a function only ever deals with a specific interface, use that interface directly instead of introducing unnecessary generic parameters.
3. **Constrain Generics Narrowly**: Use `extends` to enforce minimal requirements on type parameters rather than allowing unconstrained generics and type assertions.
4. **Leverage Type Inference**: Avoid explicitly passing type arguments (`identity<string>("hello")`) when TypeScript can infer them cleanly (`identity("hello")`).
