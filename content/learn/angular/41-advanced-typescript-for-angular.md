---
title: 'Advanced TypeScript for Angular Architects'
description: 'Master advanced TypeScript patterns for Angular: complex generics, conditional types, mapped types, template literal types, discriminated unions for state modeling, and strict compiler flags.'
order: 41
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 50
prerequisites: ['/learn/angular/02-typescript-fundamentals']
---

# Advanced TypeScript for Angular Architects

To architect robust enterprise Angular systems, developers must go beyond basic interfaces and primitive types. Senior engineers leverage TypeScript's advanced type-level meta-programming: **Conditional Types**, **Mapped Types**, **Template Literal Types**, **Discriminated Unions**, and **Recursive Type Definitions** to construct zero-runtime-cost, compile-time-guaranteed application architectures.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Advanced TypeScript Type System             │
├──────────────────────┬──────────────────────────────────────┤
│ Type Pattern         │ Enterprise Angular Use Case          │
├──────────────────────┼──────────────────────────────────────┤
│ Template Literals    │ Type-safe route paths & event names  │
│                      │ `api/${string}/v${number}`           │
├──────────────────────┼──────────────────────────────────────┤
│ Conditional (infer)  │ Extracting inner data payload types  │
│                      │ from Promises / Observables          │
├──────────────────────┼──────────────────────────────────────┤
│ Mapped & Key Remap   │ Creating Readonly / Signal state     │
│                      │ wrappers from entity interfaces      │
├──────────────────────┼──────────────────────────────────────┤
│ Discriminated Unions │ Bulletproof asynchronous API state   │
│                      │ (Idle | Loading | Success | Error)   │
└──────────────────────┴──────────────────────────────────────┘
```

## 1. Type-Safe State Modeling with Discriminated Unions

```typescript
export interface IdleState {
  status: 'idle';
}

export interface LoadingState {
  status: 'loading';
}

export interface SuccessState<T> {
  status: 'success';
  data: T;
}

export interface ErrorState {
  status: 'error';
  error: Error;
}

export type AsyncState<T> = IdleState | LoadingState | SuccessState<T> | ErrorState;
```

In your component template, Angular's template type checker narrows the type automatically:

```html
@switch (state().status) {
  @case ('loading') { <app-spinner /> }
  @case ('success') { <app-data-view [payload]="state().data" /> }
  @case ('error') { <app-error-banner [msg]="state().error.message" /> }
}
```

## 2. Conditional Types & the `infer` Keyword

Extracting the unwrapped value type of an `Observable` or `Promise`:

```typescript
// Unwraps Observable<T> -> T
export type UnpackObservable<T> = T extends Observable<infer U> ? U : T;

// Usage:
type ApiPayload = UnpackObservable<Observable<{ id: string; name: string }>>;
// Result: { id: string; name: string }
```

## 3. Template Literal Types for Type-Safe Navigation

```typescript
export type EntityType = 'users' | 'products' | 'orders';
export type ActionType = 'view' | 'edit' | 'create';

// Generates union: "users:view" | "users:edit" | "products:view" ...
export type PermissionString = `${EntityType}:${ActionType}`;

export function hasPermission(perm: PermissionString): boolean {
  return true;
}

// Compile Error: Argument of type '"billing:delete"' is not assignable to PermissionString
hasPermission('billing:delete');
```

## Summary & Key Takeaways

- Discriminated unions eliminate invalid asynchronous states by pairing status tags with specific payload types.
- Conditional types with `infer` extract wrapped generic payload types dynamically.
- Template literal types validate route patterns and permission strings at compile time.

## Best Practices & Senior Guidance

1. **Enable Strict Compiler Flags**: Always configure `"strict": true`, `"noImplicitOverride": true`, and `"noUncheckedIndexedAccess": true` in `tsconfig.json`.
2. **Never Cast with `as any`**: Use custom type guards (`val is User`) or type narrowing functions to prove types safely.
