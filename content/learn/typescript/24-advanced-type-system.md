---
title: 'Advanced Type System'
description: 'Master advanced TypeScript type theory: distributive conditional types, recursive conditional evaluation, type variance (covariance/contravariance), structural typing, and branded nominal types.'
order: 24
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 45
prerequisites:
  - /learn/typescript/23-intermediate-projects
---

# Advanced Type System

At the highest level of TypeScript mastery, the type system behaves as a pure, Turing-complete, functional programming language executed entirely at compile time. Instead of operating on runtime values (such as strings, numbers, or objects), type-level programs operate on types themselves as inputs and produce transformed types as outputs.

In this lesson, we explore advanced type theory: **Distributive Conditional Types**, **Recursive Type-Level Evaluation**, **Type Variance** (Covariance, Contravariance, Invariance, Bivariance), **Structural Subtyping**, and **Nominal / Branded Types**.

```text
┌────────────────────────────────────────────────────────────┐
│                  Type-Level Functional Engine              │
├────────────────────────────────────────────────────────────┤
│ Distributive Evaluation:                                   │
│ ToArray<string | number> ──> string[] | number[]           │
│                                                            │
│ Recursive Type Computation:                                │
│ DeepReadonly<{ a: { b: number } }> ──> Fully Immutable     │
│                                                            │
│ Variance in Subtyping:                                     │
│ - Covariant: Array<Sub> assignable to Array<Super>         │
│ - Contravariant: (x: Super) => void assignable to (Sub)    │
│                                                            │
│ Nominal Typing (Branding):                                 │
│ type UserId = string & { readonly __brand: unique symbol } │
└────────────────────────────────────────────────────────────┘
```

## Distributive Conditional Types

When a conditional type acts on a naked generic type parameter `T` (i.e. `T extends U ? X : Y`), and a union type is passed as `T`, the conditional type **automatically distributes over each member of the union**:

```typescript
type ToArray<T> = T extends any ? T[] : never;

// When applied to a union 'string | number':
type StrOrNumArray = ToArray<string | number>;
// Evaluates to: ToArray<string> | ToArray<number>
// Result: string[] | number[] (NOT (string | number)[])
```

### Preventing Distribution with Tuples
If you want to prevent a conditional type from distributing over union members, wrap both sides of the `extends` keyword in square brackets `[T] extends [U]`:

```typescript
type NonDistributiveToArray<T> = [T] extends [any] ? T[] : never;

type CombinedArray = NonDistributiveToArray<string | number>;
// Result: (string | number)[]
```

## Recursive Conditional Types & String Parsing

TypeScript supports recursive type-level algorithms. A classic example is splitting a string literal type into an array of string tokens or trimming whitespace at compile time:

```typescript
// Recursive string trimmer at the type level
type TrimLeft<T extends string> = T extends ` ${infer Rest}` | `\t${infer Rest}` | `\n${infer Rest}`
  ? TrimLeft<Rest>
  : T;

type TrimRight<T extends string> = T extends `${infer Rest} ` | `${infer Rest}\t` | `${infer Rest}\n`
  ? TrimRight<Rest>
  : T;

type Trim<T extends string> = TrimRight<TrimLeft<T>>;

type Cleaned = Trim<"   Hello World, TypeScript!   \n">; // "Hello World, TypeScript!"
```

## Type Variance: Covariance, Contravariance, and Invariance

**Variance** describes how subtyping between complex types relates to subtyping between their component types.

Suppose `Dog` is a subtype of `Animal` (`Dog extends Animal`):

### 1. Covariance (Output Positions)
A type constructor `F<T>` is **covariant** if `F<Dog>` is assignable to `F<Animal>`. In TypeScript, object properties, array elements, and function return types are covariant:

```typescript
type Producer<T> = () => T;
// Producer<Dog> IS assignable to Producer<Animal> because a function returning Dog satisfies caller expecting Animal
```

### 2. Contravariance (Input / Parameter Positions)
A type constructor `F<T>` is **contravariant** if `F<Animal>` is assignable to `F<Dog>`. In TypeScript (with `"strictFunctionTypes": true`), function parameters are strictly contravariant:

```typescript
type Consumer<T> = (arg: T) => void;
// Consumer<Animal> IS assignable to Consumer<Dog> because a handler accepting any Animal can safely handle a Dog!
```

### 3. Invariance
`F<T>` is **invariant** if `F<Dog>` is neither assignable to `F<Animal>` nor vice versa. Mutable reference types with both reads and writes are conceptually invariant.

## Structural Typing vs Nominal Typing

TypeScript's type system is **structural** (often described as compile-time duck typing). If two types share the same property names and shapes, they are completely interchangeable, regardless of how or where they were declared:

```typescript
interface Point2D {
  x: number;
  y: number;
}

interface Vector2D {
  x: number;
  y: number;
}

let p: Point2D = { x: 10, y: 20 };
let v: Vector2D = p; // Completely valid in a structural type system!
```

## Nominal Typing & Branded Types

While structural typing is great for ergonomics, it can cause dangerous bugs when different domain concepts share the identical primitive type (such as passing a `UserId` string where an `OrderId` string is expected).

To achieve **Nominal Typing** (enforcing distinct identity regardless of structural equivalence), developers use **Branded Types**:

```typescript
// Define unique symbol brands
declare const BrandSymbol: unique symbol;

export type Brand<T, TBrandName extends string> = T & {
  readonly [BrandSymbol]: TBrandName;
};

// Distinct nominal primitive types:
export type UserId = Brand<string, "UserId">;
export type OrderId = Brand<string, "OrderId">;
export type UsdCents = Brand<number, "UsdCents">;

// Constructor helper functions (Smart Constructors)
export function makeUserId(id: string): UserId {
  return id as UserId;
}

export function makeOrderId(id: string): OrderId {
  return id as OrderId;
}

function cancelOrder(orderId: OrderId, requestedBy: UserId) {
  // Business logic...
}

const user = makeUserId("usr_991");
const order = makeOrderId("ord_404");

// Valid invocation:
cancelOrder(order, user);

// Compile Error: Type 'UserId' is not assignable to type 'OrderId'.
// cancelOrder(user, order); // Prevents catastrophic parameter swapping bugs!
```

## Summary

- Distributive conditional types unpack union members automatically across conditional branches.
- Wrapping naked generic types in tuples (`[T] extends [U]`) prevents unwanted union distribution.
- Recursive conditional types execute type-level string manipulation, tokenization, and tree traversals at compile time.
- Function return types are covariant (same direction); function parameters are contravariant (reversed direction) under `strictFunctionTypes`.
- TypeScript is structurally typed, matching types by shape rather than nominal declaration.
- Branded types (`T & { readonly [brand]: 'Name' }`) enforce strict nominal safety for primitive identifiers.

## Best Practices

1. **Brand Domain IDs and Raw Money Values**: Use branded types for IDs (`UserId`, `AccountId`) and currency integers to prevent accidental argument swapping.
2. **Enable `"strictFunctionTypes": true`**: Prevent unsafe bivariant function parameter assignments.
3. **Use Recursive Conditional Types for Parser DSLs**: Build compile-time route and template parsers with recursive string template conditionals.
4. **Prevent Distribution When Checking Exact Unions**: Use `[T] extends [U]` whenever checking if a generic parameter matches an exact union type as a whole.
