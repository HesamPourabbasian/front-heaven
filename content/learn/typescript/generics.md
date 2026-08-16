---
title: 'Generics'
description: 'Master TypeScript generics to build reusable, flexible, and type-safe functions, interfaces, classes, and constraints.'
order: 18
difficulty: 'intermediate'
category: 'Level 5 - Functions & Generics'
estimatedMinutes: 25
prerequisites:
  - /learn/typescript/function-overloading
---

## Why Generics?

Consider an identity function that returns whatever value is passed to it.

Using `any` loses type safety completely:
```ts
function identity(arg: any): any {
  return arg
}

const res = identity('hello') // 'res' is type 'any' — we lost our string type!
```

**Generics** allow you to capture the incoming type as a **Type Variable** (traditionally named `T`, `U`, `V`), creating a contract between inputs and outputs:

```ts
function identity<T>(arg: T): T {
  return arg
}

const str = identity('hello') // 'str' is type 'string'
const num = identity(42)      // 'num' is type 'number'
```

---

## 1. Generic Functions

Generics can work with arrays, objects, and multiple type parameters:

```ts
function getFirstElement<T>(list: T[]): T | undefined {
  return list[0]
}

const firstNum = getFirstElement([10, 20, 30])       // Inferred as number | undefined
const firstStr = getFirstElement(['a', 'b', 'c'])     // Inferred as string | undefined

// Multiple type parameters:
function pair<A, B>(first: A, second: B): [A, B] {
  return [first, second]
}

const tuple = pair('score', 100) // [string, number]
```

---

## 2. Generic Interfaces & Type Aliases

Generics make data structures reusable across different payload models:

```ts
interface ApiResponse<TData> {
  statusCode: number
  success: boolean
  data: TData
  timestamp: string
}

type User = { id: string; name: string }
type Post = { id: number; title: string; content: string }

const userResponse: ApiResponse<User> = {
  statusCode: 200,
  success: true,
  data: { id: 'u_1', name: 'Ada' },
  timestamp: new Date().toISOString(),
}

const postsResponse: ApiResponse<Post[]> = {
  statusCode: 200,
  success: true,
  data: [{ id: 1, title: 'Generics Guide', content: '...' }],
  timestamp: new Date().toISOString(),
}
```

---

## 3. Generic Constraints (`extends`)

Sometimes you want a function to be generic, but you still require the type to possess certain properties (like `.length` or an `id` field). You restrict generic types using the **`extends`** keyword:

```ts
interface HasLength {
  length: number
}

function logWithLength<T extends HasLength>(item: T): T {
  console.log(`Item length is: ${item.length}`)
  return item
}

logWithLength('Hello world') // OK: string has .length
logWithLength([1, 2, 3, 4])  // OK: Array has .length
logWithLength({ length: 10, custom: true }) // OK

// Error: number has no .length property:
// logWithLength(42)
```

### Constraining with `keyof`
You can constrain one type parameter by the keys of another:

```ts
function getObjectProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

const laptop = { brand: 'Apple', ramGb: 32, inStock: true }
const brand = getObjectProp(laptop, 'brand') // string
const ram = getObjectProp(laptop, 'ramGb')   // number

// Error: 'weight' does not exist on laptop:
// getObjectProp(laptop, 'weight')
```

---

## 4. Default Generic Type Arguments

Just like default function parameters, generic parameters can specify defaults:

```ts
interface ResultContainer<T = string> {
  payload: T
  error?: string
}

// Defaults to ResultContainer<string>
const textResult: ResultContainer = {
  payload: 'Success message',
}

// Explicit override:
const numberResult: ResultContainer<number> = {
  payload: 404,
}
```

---

## Summary

- Generics create reusable functions, types, and classes that work across various types while retaining complete type safety.
- Type variables (like `<T>`) are placeholders for types provided at invocation or inferred automatically.
- Use `extends` to place constraints on what types can be passed.
- Combine generic parameters with `keyof` for type-safe property lookups.
- Supply default type arguments with `<T = DefaultType>`.

## Practice

1. Write a generic function `wrapInArray<T>(item: T): T[]`.
2. Write a generic class or interface `Queue<T>` with `push(item: T): void` and `pop(): T | undefined`.
3. Create a number queue and string queue to test your generic interface.
