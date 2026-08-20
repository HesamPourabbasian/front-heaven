---
title: 'State Management: Signals, NgRx & SignalStore'
description: 'Master state management in Angular: local vs shared state, Signal-based store patterns, NgRx Store (Actions, Reducers, Selectors, Effects), and modern @ngrx/signals SignalStore.'
order: 20
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 50
prerequisites: ['/learn/angular/15-advanced-signals']
---

# State Management: Signals, NgRx & SignalStore

As web applications expand to encompass multi-step workflows, concurrent data streams, real-time collaboration, and complex UI interactions, managing application state cleanly becomes paramount. State management involves deciding where state lives, how it is mutated, and how UI components subscribe to updates.

In modern Angular, state management ranges from lightweight **Signal Services** (ideal for small-to-medium applications) to **NgRx SignalStore** (modern, declarative, signal-first) and classic **NgRx Redux Store** (global immutable store with actions, reducers, and effects for massive enterprise systems).

```text
┌─────────────────────────────────────────────────────────────┐
│                 Angular State Management Spectrum           │
├───────────────────┬───────────────────┬─────────────────────┤
│ Pattern           │ Complexity        │ Best Fit            │
├───────────────────┼───────────────────┼─────────────────────┤
│ Signal Service    │ Low               │ Simple feature/app  │
│ (Custom Signals)  │ Minimal code      │ Shared UI state     │
├───────────────────┼───────────────────┼─────────────────────┤
│ NgRx SignalStore  │ Medium            │ Modern enterprise   │
│ (@ngrx/signals)   │ Modular & Typed   │ Scalable apps       │
├───────────────────┼───────────────────┼─────────────────────┤
│ NgRx Redux Store  │ High (Redux)      │ Massive distributed │
│ (Actions/Effects) │ Strict immutability teams, audit logs   │
└───────────────────┴───────────────────┴─────────────────────┘
```

## 1. Lightweight Signal-Based Store Pattern

For most feature modules, an `@Injectable` service maintaining private writable signals and exposing public read-only signals provides a simple, boilerplate-free state store:

```typescript
// src/app/features/cart/cart.store.ts
import { Injectable, signal, computed } from '@angular/core';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  isLoading: false,
  error: null
};

@Injectable({ providedIn: 'root' })
export class CartService {
  // Master state signal
  private readonly _state = signal<CartState>(initialState);

  // Selectors (Computed signals)
  readonly items = computed(() => this._state().items);
  readonly isLoading = computed(() => this._state().isLoading);
  readonly error = computed(() => this._state().error);

  readonly totalCount = computed(() =>
    this._state().items.reduce((acc, item) => acc + item.quantity, 0)
  );

  readonly totalPrice = computed(() =>
    this._state().items.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  );

  // Actions (Mutations)
  addItem(product: { id: string; name: string; price: number }): void {
    this._state.update(state => {
      const existing = state.items.find(i => i.id === product.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
          )
        };
      }
      return {
        ...state,
        items: [...state.items, { ...product, quantity: 1 }]
      };
    });
  }

  removeItem(id: string): void {
    this._state.update(state => ({
      ...state,
      items: state.items.filter(i => i.id !== id)
    }));
  }
}
```

## 2. Modern NgRx SignalStore (`@ngrx/signals`)

NgRx SignalStore is the state-of-the-art state management library created by the NgRx team specifically for modern Signal-based Angular. It uses a composable functional syntax to define state, computed selectors, and asynchronous methods with zero boilerplate:

```typescript
// src/app/features/users/users.store.ts
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface UsersState {
  users: User[];
  filter: string;
  isLoading: boolean;
}

export const UsersStore = signalStore(
  { providedIn: 'root' },
  withState<UsersState>({
    users: [],
    filter: '',
    isLoading: false
  }),
  withComputed(({ users, filter }) => ({
    filteredUsers: computed(() => {
      const currentFilter = filter().toLowerCase();
      return users().filter(u => u.name.toLowerCase().includes(currentFilter));
    }),
    userCount: computed(() => users().length)
  })),
  withMethods((store, http = inject(HttpClient)) => ({
    setFilter(filter: string) {
      patchState(store, { filter });
    },
    loadUsers: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() =>
          http.get<User[]>('/api/users').pipe(
            tapResponse({
              next: (users) => patchState(store, { users, isLoading: false }),
              error: (err) => {
                console.error(err);
                patchState(store, { isLoading: false });
              }
            })
          )
        )
      )
    )
  }))
);
```

Using the SignalStore in a Component:

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { UsersStore } from './users.store';

@Component({
  selector: 'app-users-list',
  standalone: true,
  template: `
    <h2>Users List ({{ store.userCount() }})</h2>
    <input (input)="store.setFilter($any($event.target).value)" placeholder="Filter by name..." />

    @if (store.isLoading()) {
      <p>Loading users...</p>
    } @else {
      <ul>
        @for (user of store.filteredUsers(); track user.id) {
          <li>{{ user.name }} ({{ user.email }})</li>
        }
      </ul>
    }
  `
})
export class UsersListComponent implements OnInit {
  readonly store = inject(UsersStore);

  ngOnInit() {
    this.store.loadUsers();
  }
}
```

## Summary & Key Takeaways

- Signal-based services provide lightweight, type-safe state management with zero dependencies.
- NgRx SignalStore (`@ngrx/signals`) is the modern standard for scalable, modular signal state.
- Keep state mutations immutable using `patchState()` or pure object spread operations.
- Computed selectors memoize derived state calculations automatically.

## Best Practices & Senior Guidance

1. **Avoid Over-Engineering with Global Redux**: For 80% of applications, Signal Services or NgRx SignalStore are vastly superior to classic Redux boilerplate.
2. **Co-locate Feature State**: Keep feature stores inside their respective feature folder (`src/app/features/feature-name/`) rather than dumping all state in a global root folder.
3. **Never Mutate State In-Place**: Always produce new object references when modifying arrays or nested state trees.
