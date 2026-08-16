---
title: 'Decorators'
description: 'Master modern Stage 3 ECMAScript and TypeScript 5.0+ decorators for classes, methods, and properties.'
order: 23
difficulty: 'advanced'
category: 'Level 6 - Classes & OOP'
estimatedMinutes: 20
prerequisites:
  - /learn/typescript/abstract-classes
---

## What is a Decorator?

A **Decorator** is a special kind of declaration that can be attached to a class, method, accessor, or property. Decorators use the form `@expression`, where `expression` evaluates to a function that is called at runtime with information about the decorated target.

In TypeScript 5.0+, TypeScript supports the official **Stage 3 ECMAScript Decorators Standard** natively without needing `experimentalDecorators: true`.

```ts
// Example decorator usage:
@loggedClass
class DataService {
  @logMethod
  fetchData() {
    return 'data'
  }
}
```

---

## 1. Class Decorators

A class decorator receives the class constructor function and context object:

```ts
function sealed(target: Function, context: ClassDecoratorContext) {
  Object.seal(target)
  Object.seal(target.prototype)
}

@sealed
class BugReport {
  type = 'report'
  title: string

  constructor(t: string) {
    this.title = t
  }
}
```

---

## 2. Method Decorators

Method decorators wrap, intercept, or modify method executions (ideal for logging, performance timing, caching, or access control):

```ts
function loggedMethod<This, Args extends any[], Return>(
  target: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>,
) {
  const methodName = String(context.name)

  return function (this: This, ...args: Args): Return {
    console.log(`[START]: Calling ${methodName} with args:`, args)
    const start = performance.now()
    const result = target.call(this, ...args)
    const duration = (performance.now() - start).toFixed(2)
    console.log(`[END]: ${methodName} returned in ${duration}ms`)
    return result
  }
}

class MathService {
  @loggedMethod
  fibonacci(n: number): number {
    if (n <= 1) return n
    return this.fibonacci(n - 1) + this.fibonacci(n - 2)
  }
}

const service = new MathService()
service.fibonacci(5)
```

---

## 3. Decorator Factories

A **Decorator Factory** is simply a function that returns the actual decorator function. This pattern allows you to pass custom configuration arguments to decorators:

```ts
function delay(ms: number) {
  return function <This, Args extends any[], Return>(
    target: (this: This, ...args: Args) => Promise<Return>,
    context: ClassMethodDecoratorContext,
  ) {
    return async function (this: This, ...args: Args): Promise<Return> {
      await new Promise(resolve => setTimeout(resolve, ms))
      return target.call(this, ...args)
    }
  }
}

class ApiClient {
  @delay(1000)
  async fetchProfile() {
    return { name: 'Hesam' }
  }
}
```

---

## Legacy vs Modern Decorators

- **Modern Decorators (TS 5.0+)**: Adheres to the Stage 3 TC39 JavaScript standard. Operates with context objects (`ClassMethodDecoratorContext`, etc.). Does not require compiler flags.
- **Legacy Experimental Decorators (`experimentalDecorators: true`)**: Used in older versions of Angular, NestJS, and TypeORM with `reflect-metadata`.

---

## Summary

- Decorators allow meta-programming and declarative cross-cutting concerns (logging, auth, performance).
- Attached with the `@decoratorName` syntax above declarations.
- Modern TypeScript 5.0+ decorators follow the official ECMAScript Stage 3 standard.
- Decorator factories return decorators configured with custom arguments.

## Practice

1. Write a method decorator `@logExecutionTime` that records how long an asynchronous method takes to complete.
2. Apply the decorator to a method `fetchData()` on a `DataFetcher` class and observe the logged execution time.
