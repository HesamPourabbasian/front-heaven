---
title: 'TypeScript Fundamentals for Angular'
description: 'Master essential TypeScript features powering modern Angular: interfaces, type aliases, enums, generics, access modifiers, union types, and type narrowing.'
order: 2
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 35
prerequisites: ['/learn/angular/01-angular-fundamentals']
---

# TypeScript Fundamentals for Angular

Angular is uniquely built on TypeScript from its foundations. Every component, service, directive, pipe, and route is modeled as a TypeScript class or typed function. To be proficient in modern Angular, a developer must not merely understand basic JavaScript syntax, but master TypeScript's static type system, generic constraints, access control modifiers, and type narrowing patterns.

TypeScript provides compile-time type checking, auto-completion, refactoring tooling, and compile-time verification of HTML templates. When you bind component properties in Angular templates, the Angular Language Service verifies that the bound properties exist on the TypeScript class and that types match precisely.

```text
┌─────────────────────────────────────────────────────────────┐
│               TypeScript Static Safety in Angular           │
│                                                             │
│   Component Class (.ts)             Template (.html)        │
│  ┌────────────────────────┐       ┌──────────────────────┐  │
│  │ user: Signal<User>     │ ────> │ <h2>{{ user().name }}│  │
│  │ role: 'admin' | 'user' │       │ @if(user().isAdmin)  │  │
│  └────────────────────────┘       └──────────────────────┘  │
│               │                              │              │
│               └──────────────┬───────────────┘              │
│                              ▼                              │
│                 Angular Language Service                    │
│            (Compile-time Type Verification)                 │
└─────────────────────────────────────────────────────────────┘
```

## Types, Interfaces & Type Aliases

In Angular development, defining clean domain models is essential. Interfaces define object contracts, while type aliases create reusable union types, tuples, or primitive wrappers.

```typescript
// Domain model interface
export interface UserProfile {
  readonly id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string; // Optional property
}

// Type alias for union of allowed roles
export type UserRole = 'superadmin' | 'editor' | 'viewer';

// Type alias for API response wrapper
export type ApiResponse<T> = {
  data: T;
  status: number;
  timestamp: number;
};
```

## Enums vs Literal Unions

While TypeScript supports numeric and string `enum` structures, modern Angular best practices strongly favor string literal union types or `const` objects. String literal unions produce zero JavaScript runtime code and integrate cleanly with template type checking.

```typescript
// Recommended: Discriminated literal union
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Alternatively: Const object for grouping constants
export const APP_THEMES = {
  Light: 'light',
  Dark: 'dark',
  System: 'system',
} as const;

export type AppTheme = typeof APP_THEMES[keyof typeof APP_THEMES];
```

## Functions, Return Types & Arrow Functions

Typing function parameters and return types prevents accidental data mutations and clarifies service contracts.

```typescript
export function calculateDiscount(price: number, percentage: number): number {
  if (percentage < 0 || percentage > 100) {
    throw new Error('Invalid discount percentage');
  }
  return price - (price * (percentage / 100));
}

// Function signature types
export type FilterPredicate<T> = (item: T) => boolean;
```

## Classes & Access Modifiers

Angular components and services are implemented as TypeScript classes. TypeScript provides three access modifiers (`public`, `protected`, `private`) and the `readonly` modifier to control encapsulation.

```typescript
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SessionService {
  // private: Accessible only inside SessionService
  private readonly _authToken = signal<string | null>(null);

  // readonly public signal: Read-only access for components
  public readonly authToken = this._authToken.asReadonly();

  // protected: Accessible in this class and derived subclasses
  protected logActivity(action: string): void {
    console.info(`[Session] ${action} at ${Date.now()}`);
  }

  public setToken(token: string): void {
    this._authToken.set(token);
    this.logActivity('Token updated');
  }
}
```

## Generics in Angular Services & Components

Generics allow you to write reusable code that operates over a variety of types while preserving complete type safety. Angular's `HttpClient`, `Signal<T>`, and `FormGroup<T>` heavily utilize generics.

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GenericApiService {
  private http = inject(HttpClient);

  public fetchResource<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`/api/v1/${endpoint}`);
  }
}
```

## Union Types & Type Narrowing

When handling complex states, union types combined with type narrowing allow TypeScript to deduce the exact type inside conditional branches.

```typescript
export interface SuccessState<T> {
  kind: 'success';
  payload: T;
}

export interface ErrorState {
  kind: 'error';
  errorMessage: string;
}

export type ResourceState<T> = SuccessState<T> | ErrorState;

export function handleResponse<T>(state: ResourceState<T>): string {
  // Discriminated union narrowing via 'kind' property
  if (state.kind === 'success') {
    return `Loaded successfully with data`;
  } else {
    // TypeScript knows state is ErrorState here
    return `Failed: ${state.errorMessage}`;
  }
}
```

## Summary & Key Takeaways

- TypeScript is the foundational language of Angular, providing static type guarantees for both TypeScript code and HTML templates.
- Prefer string literal union types over TypeScript enums for zero-runtime footprint and better template compatibility.
- Use access modifiers (`private`, `protected`, `readonly`) to enforce encapsulation in services and component classes.
- Leverage Generics (`<T>`) to build reusable API services, state wrappers, and utility components.
- Use Discriminated Unions and Type Narrowing to handle asynchronous state cleanly without unsafe type casting.

## Best Practices & Senior Guidance

1. **Avoid `any` at All Costs**: Never use `any` as an escape hatch. Use `unknown` if the type is truly uncertain, followed by type narrowing or zod validation.
2. **Mark Signals as Read-Only**: When exposing signals from services, expose `signal.asReadonly()` to prevent external consumers from calling `.set()` directly.
3. **Use Interface for Objects, Types for Unions**: Use `interface` to declare data models and entities; use `type` for unions, intersections, and mapped types.
4. **Enable `strictTemplates`**: Ensure `angularCompilerOptions.strictTemplates: true` is configured in `tsconfig.json` to catch template binding errors at compile time.
