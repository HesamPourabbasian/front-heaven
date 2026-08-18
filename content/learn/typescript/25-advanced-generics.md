---
title: 'Advanced Generics'
description: 'Master higher-order generics, variadic tuple types, generic recursion, type-safe builder patterns, and fluent API architectures in TypeScript.'
order: 25
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 45
prerequisites:
  - /learn/typescript/24-advanced-type-system
---

# Advanced Generics

In enterprise-scale software development and library architecture, standard generics are insufficient. Complex frameworks—such as ORMs (Prisma, Drizzle), state managers (Redux Toolkit, Pinia), and validation libraries (Zod)—require **Higher-Order Generics**, **Variadic Tuple Types**, and **Type-Safe Builder Patterns** to guide developers through multi-step method chains.

In this lesson, we explore advanced generic programming techniques that enable you to construct fluent, self-validating APIs with compile-time state tracking.

```text
┌────────────────────────────────────────────────────────────┐
│                  Advanced Generic Concepts                 │
├────────────────────────────────────────────────────────────┤
│ Variadic Tuple Types:                                      │
│ Concat<[1, 2], [3, 4]> ──> [1, 2, 3, 4]                    │
│                                                            │
│ Type-Safe Query Builder (State Accumulation):              │
│ builder.select('id').where('active').build()               │
│                                                            │
│ Generic Pipe Composition:                                  │
│ pipe(fn1, fn2, fn3) ──> Strictly typed pipeline output     │
└────────────────────────────────────────────────────────────┘
```

## Variadic Tuple Types (`...T`)

Introduced in TypeScript 4.0, **Variadic Tuple Types** allow tuples to spread generic type parameters (`...T`) at arbitrary positions (beginning, middle, or end). This allows you to write functions that concatenate, slice, or manipulate tuples without losing positional type information:

```typescript
// Generic tuple concatenation function
function concatTuples<T extends readonly unknown[], U extends readonly unknown[]>(
  tupleA: readonly [...T],
  tupleB: readonly [...U]
): [...T, ...U] {
  return [...tupleA, ...tupleB];
}

const coordinates = [10, 20] as const; // readonly [10, 20]
const metadata = ["PointAlpha", true] as const; // readonly ["PointAlpha", true]

const combined = concatTuples(coordinates, metadata);
// Type: [10, 20, "PointAlpha", true] (Exact literal types and indices preserved!)
```

## Labeled Tuple Elements

Variadic tuples can also use labeled elements to provide rich IntelliSense hints in function argument lists and return tuples:

```typescript
type Range = [start: number, end: number, step?: number];
type EventCallback<TData extends unknown[]> = [eventName: string, handler: (...args: TData) => void];
```

## Generic Function Composition (`pipe` and `compose`)

Function composition is the practice of combining multiple functions where the output of each function serves as the input to the next. Typing a generic `pipe` function across variable lengths requires variadic generics:

```typescript
// Type-safe unary pipeline
export function pipe<A>(a: A): A;
export function pipe<A, B>(a: A, fn1: (a: A) => B): B;
export function pipe<A, B, C>(a: A, fn1: (a: A) => B, fn2: (b: B) => C): C;
export function pipe<A, B, C, D>(a: A, fn1: (a: A) => B, fn2: (b: B) => C, fn3: (c: C) => D): D;
export function pipe(initialValue: unknown, ...functions: ((arg: any) => any)[]): unknown {
  return functions.reduce((acc, fn) => fn(acc), initialValue);
}

// Seamless type flow from string ──> number ──> boolean
const isLongLength = pipe(
  "TypeScript Architecture",
  str => str.length,        // number (23)
  len => len > 10           // boolean (true)
);
```

## The Type-Safe Fluent Builder Pattern

The **Builder Pattern** is widely used in SQL query builders, HTTP clients, and form generators. Using generic state accumulation, a builder class can track which fields have been set at compile time and prohibit `.build()` from being called until all mandatory fields are provided:

```typescript
interface HttpRequest<TBody = unknown> {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  headers: Record<string, string>;
  body?: TBody;
}

// Generic builder that tracks configured state in TState
class RequestBuilder<TState extends { hasUrl: boolean; hasMethod: boolean }, TBody = undefined> {
  private request: Partial<HttpRequest<TBody>> = {
    headers: {},
  };

  private constructor() {}

  public static create(): RequestBuilder<{ hasUrl: false; hasMethod: false }> {
    return new RequestBuilder();
  }

  public setUrl(url: string): RequestBuilder<Omit<TState, "hasUrl"> & { hasUrl: true }, TBody> {
    this.request.url = url;
    return this as any;
  }

  public setMethod(method: "GET" | "POST" | "PUT" | "DELETE"): RequestBuilder<Omit<TState, "hasMethod"> & { hasMethod: true }, TBody> {
    this.request.method = method;
    return this as any;
  }

  public setBody<TNewBody>(body: TNewBody): RequestBuilder<TState, TNewBody> {
    this.request.body = body as any;
    return this as any;
  }

  // '.build()' is only available when BOTH hasUrl=true AND hasMethod=true!
  public build(
    this: RequestBuilder<{ hasUrl: true; hasMethod: true }, TBody>
  ): HttpRequest<TBody> {
    return this.request as HttpRequest<TBody>;
  }
}

// Incomplete configuration:
const partialBuilder = RequestBuilder.create().setUrl("https://api.dev/users");
// Compile Error: Property 'build' does not exist on type 'RequestBuilder<{ hasUrl: true; hasMethod: false; }>'.
// partialBuilder.build();

// Complete configuration:
const validRequest = RequestBuilder.create()
  .setUrl("https://api.dev/users")
  .setMethod("POST")
  .setBody({ username: "ada" })
  .build(); // Valid and fully typed!
```

## Generic Recursion: Flattening Nested Arrays

Using recursive conditional types with variadic tuples allows you to unwrap deeply nested arrays of arbitrary depth into a flat tuple or element union:

```typescript
type DeepFlat<T> = T extends readonly (infer Element)[]
  ? DeepFlat<Element>
  : T;

type NestedNumbers = [1, [2, [3, [4, 5]]]];
type Flattened = DeepFlat<NestedNumbers>; // 1 | 2 | 3 | 4 | 5
```

## Summary

- Variadic tuple types (`...T`) enable type-safe concatenation, slicing, and spreading across tuple arguments.
- Labeled tuple elements provide descriptive autocomplete names for tuple index positions.
- Generic function pipelines (`pipe`) preserve return-to-parameter type chains across multi-step transformations.
- Generic state accumulation allows Builder APIs to enforce mandatory configuration steps at compile time.
- Generic recursion solves deep nested array and object unrolling operations.

## Best Practices

1. **Use State-Tracking Builders for Critical Entities**: Enforce that complex domain records cannot be instantiated until all required fields have been chained.
2. **Leverage Variadic Tuples for Event Payloads**: Type event emitters with `emit<TEvent extends keyof Events>(event: TEvent, ...args: EventArgs[TEvent])`.
3. **Keep Overloads for Composition Pipelines**: Provide explicit overloads for functions up to 6-8 steps before falling back to variadic generic loops.
4. **Constrain Tuple Generics with `readonly unknown[]`**: Always declare variadic constraints as `T extends readonly unknown[]` to support both mutable and `as const` readonly tuples.
