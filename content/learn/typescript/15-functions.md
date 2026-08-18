---
title: 'Functions'
description: 'Master advanced function techniques in TypeScript: function overloads, generic functions, higher-order functions, callback types, this typing, callable interfaces, and construct signatures.'
order: 15
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 35
prerequisites:
  - /learn/typescript/14-utility-types
---

# Functions

In JavaScript and TypeScript, functions are first-class citizens. Functions can be assigned to variables, passed as arguments to other functions (callbacks), returned from functions (higher-order functions), and assigned dynamic execution contexts via `this`.

While basic function typing covers simple parameter and return types, real-world libraries require sophisticated patterns: **Function Overloads** for multi-signature functions, **Higher-Order Functions** for middleware, explicit **`this` Parameter Typing**, and **Callable / Construct Signatures** for factory objects.

```text
┌────────────────────────────────────────────────────────────┐
│                  Function Overload Pattern                 │
│                                                            │
│  function getItem(id: number): Product;       <── Overload 1│
│  function getItem(name: string): Product[];   <── Overload 2│
│  function getItem(query: number | string) {   <── Impl Body │
│    // Implementation details...                            │
│  }                                                         │
└────────────────────────────────────────────────────────────┘
```

## Function Overloads

In JavaScript, a single function can accept different combinations of arguments and return different types based on what was passed. In TypeScript, you model this behavior using **Function Overload Signatures**.

You write one or more *overload signatures* followed by a single *implementation signature*. Callers can only invoke the function using the overload signatures; the implementation signature is internal and not directly callable:

```typescript
// Overload signature 1: Passing a timestamp number returns a Date object
function parseDate(timestamp: number): Date;
// Overload signature 2: Passing year, month, day numbers returns a Date object
function parseDate(year: number, month: number, day: number): Date;
// Overload signature 3: Passing an ISO string returns a Date object
function parseDate(isoString: string): Date;

// Implementation signature (must accommodate all overload parameter variations)
function parseDate(arg1: number | string, arg2?: number, arg3?: number): Date {
  if (typeof arg1 === "string") {
    return new Date(arg1);
  } else if (typeof arg2 === "number" && typeof arg3 === "number") {
    return new Date(arg1, arg2, arg3);
  }
  return new Date(arg1);
}

// Type-safe invocations:
const d1 = parseDate("2026-08-18"); // Valid (Overload 3)
const d2 = parseDate(1755500000000); // Valid (Overload 1)
const d3 = parseDate(2026, 7, 18);   // Valid (Overload 2)
```

## Generic Functions and Type Inference

Generic functions adapt their behavior and return types based on argument types. When authoring generic functions, let TypeScript infer type parameters from function arguments rather than requiring callers to pass explicit generic parameters:

```typescript
function mapArray<TInput, TOutput>(
  items: readonly TInput[],
  transform: (item: TInput, index: number) => TOutput
): TOutput[] {
  const result: TOutput[] = [];
  for (let i = 0; i < items.length; i++) {
    result.push(transform(items[i]!, i));
  }
  return result;
}

const lengths = mapArray(["react", "typescript", "vue"], word => word.length);
// 'lengths' is automatically inferred as number[]
```

## Higher-Order Functions (HOCs & Decorators)

A **Higher-Order Function** is a function that accepts another function as an argument, returns a new function, or both. In TypeScript, higher-order functions must preserve the parameter types and return type of the wrapped function:

```typescript
// A type-safe execution time logger wrapper
function withPerformanceLogging<TArgs extends any[], TReturn>(
  fn: (...args: TArgs) => TReturn,
  operationName: string
): (...args: TArgs) => TReturn {
  return (...args: TArgs): TReturn => {
    const start = performance.now();
    const result = fn(...args);
    const duration = performance.now() - start;
    console.log(`[PERF] ${operationName} took ${duration.toFixed(2)}ms`);
    return result;
  };
}

function calculatePrimes(maxLimit: number): number[] {
  // Prime calculation logic...
  return [2, 3, 5, 7, 11];
}

const loggedCalculatePrimes = withPerformanceLogging(calculatePrimes, "calculatePrimes");
const primes = loggedCalculatePrimes(100); // inferred as number[] with exact parameter typing!
```

## Typing `this` in Functions

In JavaScript, the runtime value of `this` depends entirely on how a function is invoked. TypeScript allows you to declare an explicit `this` parameter at the very beginning of a function's parameter list to enforce correct execution contexts. The `this` parameter is purely a compile-time check and is erased during emission:

```typescript
interface DatabaseTable {
  tableName: string;
  rowCount: number;
}

function printTableStats(this: DatabaseTable, prefix: string): void {
  console.log(`${prefix}: Table '${this.tableName}' contains ${this.rowCount} rows.`);
}

const usersTable: DatabaseTable = {
  tableName: "users",
  rowCount: 14500,
};

// Calling with correct 'this' binding:
printTableStats.call(usersTable, "[INFO]"); // Valid

// Direct unbound invocation triggers compile error:
// Error: The 'this' context of type 'void' is not assignable to method's 'this' of type 'DatabaseTable'.
// printTableStats("[INFO]");
```

## Callable Object Signatures (Call Signatures)

In JavaScript, functions are objects and can hold properties in addition to being callable. You can type callable objects with properties using **Call Signatures** in an interface or type alias:

```typescript
// An interface for a function that also has attached properties
interface CounterFunction {
  (incrementStep?: number): number; // Call signature
  currentCount: number;             // Property
  reset: () => void;                // Method property
}

function createCounter(): CounterFunction {
  let count = 0;

  const counter = function (step: number = 1) {
    count += step;
    counter.currentCount = count;
    return count;
  } as CounterFunction;

  counter.currentCount = 0;
  counter.reset = () => {
    count = 0;
    counter.currentCount = 0;
  };

  return counter;
}

const myCounter = createCounter();
myCounter(5); // 5
console.log(myCounter.currentCount); // 5
myCounter.reset();
```

## Construct Signatures (`new`)

A **Construct Signature** describes a function that is intended to be called with the `new` operator (such as a class constructor or factory function):

```typescript
interface InstanceConstructor<TInstance> {
  new (...args: any[]): TInstance;
}

class UserSession {
  constructor(public sessionId: string) {}
}

function instantiateService<T>(ctor: InstanceConstructor<T>, ...args: any[]): T {
  return new ctor(...args);
}

const session = instantiateService(UserSession, "sess_9981"); // session: UserSession
```

## Function Intersections

When two function types are combined using an intersection operator (`&`), TypeScript treats them similarly to function overloads:

```typescript
type StringHandler = (x: string) => string;
type NumberHandler = (x: number) => number;

type CombinedHandler = StringHandler & NumberHandler;
```

## Summary

- Function overloads provide multiple distinct parameter/return signatures for a single unified implementation function.
- Generic functions capture and propagate parameter types dynamically to return types.
- Higher-order functions wrap functions and preserve original parameter tuples (`TArgs extends any[]`) and return types (`TReturn`).
- The explicit `this` parameter enforces correct execution context bindings at compile time.
- Call signatures allow objects to simultaneously have properties and be callable as functions.
- Construct signatures (`new (...args): T`) type class constructors and factory instantiations.

## Best Practices

1. **Order Overloads from Most Specific to Most General**: TypeScript evaluates overload signatures sequentially from top to bottom; put specific literal signatures before general primitive signatures.
2. **Prefer Union Arguments over Overloads When Possible**: If two overloads only differ in one parameter and return the same type, prefer a simple union (`arg: string | number`) over two separate overloads.
3. **Preserve Parameter Tuples with Rest Generics**: Use `(...args: TArgs) => TReturn` with `TArgs extends any[]` when authoring higher-order wrappers.
4. **Use Explicit `this` on Event and DOM Handlers**: Type `this` explicitly in functions attached as callbacks to DOM elements or database connections.
