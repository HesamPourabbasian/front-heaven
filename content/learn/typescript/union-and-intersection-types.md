---
title: 'Union & Intersection Types'
description: 'Learn how to compose types using unions (|), intersections (&), and build type-safe state machines with discriminated unions.'
order: 10
difficulty: 'intermediate'
category: 'Level 3 - Type Manipulation'
estimatedMinutes: 20
prerequisites:
  - /learn/typescript/type-assertions
---

## Union Types (`|`)

A **Union Type** describes a value that can be **one of several types**. You create a union type using the vertical pipe character (`|`):

```ts
type Identifier = string | number

function formatId(id: Identifier): string {
  if (typeof id === 'string') {
    return id.toUpperCase()
  }
  return `#${id.toString().padStart(6, '0')}`
}
```

### Accessing Common Members
When you have a union type, TypeScript only allows you to access members that are common to *all* types in the union before narrowing:

```ts
interface Bird {
  fly(): void
  layEggs(): void
}

interface Fish {
  swim(): void
  layEggs(): void
}

function handlePet(pet: Bird | Fish) {
  pet.layEggs() // OK: Shared by both Bird and Fish
  // pet.fly()  // Error: Property 'fly' does not exist on type 'Fish'
}
```

---

## Intersection Types (`&`)

An **Intersection Type** combines multiple types into **one comprehensive type** that has all properties of the combined members. You create an intersection using the ampersand (`&`):

```ts
interface HasTimestamps {
  createdAt: Date
  updatedAt: Date
}

interface HasAuthor {
  authorId: string
  authorName: string
}

type BlogPost = HasTimestamps & HasAuthor & {
  title: string
  content: string
}

const post: BlogPost = {
  title: 'TypeScript Compositions',
  content: 'Intersections combine properties cleanly...',
  authorId: 'auth_99',
  authorName: 'Ada Lovelace',
  createdAt: new Date(),
  updatedAt: new Date(),
}
```

---

## Discriminated (Tagged) Unions

A **Discriminated Union** (also called a *tagged union* or *algebraic data type*) is one of the most powerful patterns in TypeScript for modeling states, actions, and API payloads.

A discriminated union consists of:
1. Multiple object types that each share a common single-literal property (the **discriminant**).
2. A union containing those object types.

```ts
interface IdleState {
  status: 'idle'
}

interface LoadingState {
  status: 'loading'
}

interface SuccessState {
  status: 'success'
  data: string[]
}

interface ErrorState {
  status: 'error'
  error: Error
}

type NetworkState = IdleState | LoadingState | SuccessState | ErrorState
```

### Pattern Matching with `switch`
When you check the discriminant property in a `switch` or `if` statement, TypeScript narrows the object to the exact corresponding type:

```ts
function renderUi(state: NetworkState): string {
  switch (state.status) {
    case 'idle':
      return 'Press button to load'
    case 'loading':
      return 'Loading...'
    case 'success':
      return `Loaded ${state.data.length} items: ${state.data.join(', ')}`
    case 'error':
      return `Error: ${state.error.message}`
  }
}
```

---

## Summary

- Union types (`A | B`) represent a value that can be type `A` or type `B`.
- Intersection types (`A & B`) represent a value that contains all properties of both `A` and `B`.
- Discriminated unions use a shared literal property (discriminant) to model distinct states safely.
- TypeScript automatically narrows discriminated unions inside conditional and switch blocks.

## Practice

1. Define three event types for a shopping cart: `AddItemEvent`, `RemoveItemEvent`, `ClearCartEvent`, each with a `type: 'ADD_ITEM' | 'REMOVE_ITEM' | 'CLEAR_CART'` discriminant property.
2. Combine them into a union `CartEvent`.
3. Write a reducer function `handleCartEvent(event: CartEvent)` that logs the specific details for each event type.
