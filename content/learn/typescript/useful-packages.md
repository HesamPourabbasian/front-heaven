---
title: 'Useful Packages'
description: 'Discover essential packages in the TypeScript ecosystem including Zod, Valibot, ts-pattern, type-fest, and ts-reset.'
order: 35
difficulty: 'intermediate'
category: 'Level 10 - Tooling & Ecosystem'
estimatedMinutes: 15
prerequisites:
  - /learn/typescript/linting
---

## Essential Packages in the TypeScript Ecosystem

TypeScript types exist purely at compile time. In production applications, you need tools for **runtime validation**, **pattern matching**, **extended utility types**, and **stricter standard library typings**.

---

## 1. Runtime Schema Validation: Zod & Valibot

TypeScript cannot validate data coming across network boundaries (API responses, form inputs, query parameters). **Zod** and **Valibot** validate data at runtime and automatically infer static TypeScript types from the schema.

### Zod
```bash
npm install zod
```

```ts
import { z } from 'zod'

// Define the runtime schema:
const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2),
  email: z.string().email(),
  age: z.number().int().positive().optional(),
})

// Automatically infer the TypeScript type:
type User = z.infer<typeof UserSchema>

// Safely parse unknown incoming JSON:
const result = UserSchema.safeParse(incomingData)
if (result.success) {
  console.log(result.data.email) // Fully typed and validated!
} else {
  console.error(result.error.issues)
}
```

### Valibot
**Valibot** is a lightweight, modular alternative to Zod designed for aggressive tree-shaking with a sub-1kb footprint.

---

## 2. Pattern Matching: `ts-pattern`

`ts-pattern` provides expressive, type-safe pattern matching with exhaustiveness checking:

```bash
npm install ts-pattern
```

```ts
import { match } from 'ts-pattern'

type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: string }
  | { status: 'error'; error: Error }

const message = match(state)
  .with({ status: 'idle' }, () => 'Press start')
  .with({ status: 'loading' }, () => 'Fetching...')
  .with({ status: 'success' }, ({ data }) => `Loaded: ${data}`)
  .with({ status: 'error' }, ({ error }) => `Failed: ${error.message}`)
  .exhaustive()
```

---

## 3. Extended Utility Types: `type-fest`

`type-fest` is a collection of essential, production-tested utility types curated by Sindre Sorhus:

```bash
npm install type-fest
```

```ts
import type { Except, Jsonify, SetRequired, Tagged } from 'type-fest'

// Nominal / branded types:
type UserId = Tagged<string, 'UserId'>
type OrderId = Tagged<string, 'OrderId'>

// Set specific fields required:
type LooseUser = { id?: string; name?: string; email?: string }
type ValidUser = SetRequired<LooseUser, 'id' | 'email'>
```

---

## 4. Better Standard Library Types: `@total-typescript/ts-reset`

TypeScript’s built-in definitions for `JSON.parse`, `fetch`, and `Array.includes` often default to `any` or broad types. `ts-reset` fixes these rules safely:

```bash
npm install @total-typescript/ts-reset
```

```ts
// globals.d.ts
import '@total-typescript/ts-reset'

// Now JSON.parse returns unknown instead of any!
const parsed = JSON.parse('...') // type: unknown
```

---

## Summary

- Use **Zod** or **Valibot** for runtime boundary validation and type inference.
- Use **`ts-pattern`** for declarative, exhaustive pattern matching.
- Use **`type-fest`** for advanced utility types.
- Use **`ts-reset`** to upgrade TypeScript's standard library to safer defaults (`JSON.parse` returning `unknown`).

## Practice

1. Install `zod` and define a schema for a `Product` with `title`, `price`, and `tags` array.
2. Infer the type `type Product = z.infer<typeof ProductSchema>`.
3. Validate a mock API response using `ProductSchema.parse()`.
