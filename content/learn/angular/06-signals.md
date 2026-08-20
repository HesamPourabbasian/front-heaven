---
title: 'Angular Signals & Fine-Grained Reactivity'
description: 'Master Angular Signals: signal(), reading and updating values, set(), update(), computed signals, side effects with effect(), and glitch-free reactivity guarantees.'
order: 6
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 40
prerequisites: ['/learn/angular/05-modern-control-flow']
---

# Angular Signals & Fine-Grained Reactivity

Introduced in Angular 16 and stabilized as the core reactivity foundation in Angular 17+, **Signals** represent the most significant paradigm shift in Angular's history. A Signal is a reactive wrapper around a value that notifies interested consumers whenever the underlying value changes. Signals bring fine-grained, synchronous, and glitch-free reactivity directly to the framework without requiring complex external state libraries or heavy RxJS boilerplate for synchronous UI state.

Before Signals, Angular relied exclusively on Zone.js for change detection. Zone.js monkey-patched browser asynchronous APIs (such as `setTimeout`, Promises, and DOM event listeners) and triggered top-down change detection across the entire component tree whenever an event completed. Signals provide surgical precision: Angular tracks exactly which components and DOM bindings read a signal and updates only the specific bindings that depend on that signal.

```text
┌─────────────────────────────────────────────────────────────┐
│                    Angular Signal Reactivity Graph          │
│                                                             │
│  Writable Signal               Computed Signal              │
│  ┌─────────────────┐           ┌──────────────────┐         │
│  │ count =         │ ────────> │ doubleCount =    │ ──────┐ │
│  │   signal(2)     │           │ computed(count*2)│       │ │
│  └─────────────────┘           └──────────────────┘       │ │
│           │                                               │ │
│           ▼                                               ▼ │
│  ┌─────────────────┐                           ┌──────────┴──────┐
│  │ effect(() =>    │                           │ Template DOM    │
│  │  console.log() )│                           │ <p>{{ double }} │
│  └─────────────────┘                           └─────────────────┘
│                                                             │
│  Key Property: Pure pull-based dependency tracking          │
│  Guarantees: Synchronous, glitch-free, memoized evaluations  │
└─────────────────────────────────────────────────────────────┘
```

## 1. Writable Signals: `signal()`

A writable signal is created using the `signal()` function. It holds a value and exposes methods to read and modify that value:

```typescript
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: `
    <section class="counter-box">
      <h2>Current Count: {{ count() }}</h2>
      <button (click)="increment()">+1</button>
      <button (click)="decrement()">-1</button>
      <button (click)="reset()">Reset</button>
    </section>
  `
})
export class CounterComponent {
  // Create a writable signal with initial value 0
  readonly count = signal<number>(0);

  increment(): void {
    // update() computes a new value based on the previous value
    this.count.update(current => current + 1);
  }

  decrement(): void {
    this.count.update(current => Math.max(0, current - 1));
  }

  reset(): void {
    // set() directly overrides the signal's value
    this.count.set(0);
  }
}
```

### Reading Signal Values
To read the current value of a signal, invoke it like a getter function: `count()`. When read inside a template, computed signal, or effect, Angular automatically registers the consumer as a reactive dependency.

## 2. Derived State with `computed()`

A computed signal is a read-only signal whose value is derived from other signals. Computed signals are declared using the `computed()` function:

```typescript
import { Component, signal, computed } from '@angular/core';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  template: `
    <div>
      <p>Items in cart: {{ itemCount() }}</p>
      <p>Subtotal: \${{ subtotal() }}</p>
      <p>Tax (8%): \${{ taxAmount() }}</p>
      <h3>Grand Total: \${{ grandTotal() }}</h3>
    </div>
  `
})
export class ShoppingCartComponent {
  readonly items = signal<CartItem[]>([
    { id: '1', name: 'Keyboard', price: 99, quantity: 1 },
    { id: '2', name: 'Mouse', price: 49, quantity: 2 },
  ]);

  // Derived state: automatically recalculates when `items` changes
  readonly itemCount = computed(() =>
    this.items().reduce((sum, item) => sum + item.quantity, 0)
  );

  readonly subtotal = computed(() =>
    this.items().reduce((sum, item) => sum + (item.price * item.quantity), 0)
  );

  readonly taxAmount = computed(() =>
    Math.round(this.subtotal() * 0.08 * 100) / 100
  );

  readonly grandTotal = computed(() =>
    this.subtotal() + this.taxAmount()
  );
}
```

### Important Characteristics of `computed()`:
1. **Lazy Evaluation**: The calculation function does not run until the computed signal is read by a consumer.
2. **Memoization**: Once calculated, the result is cached. Subsequent reads return the cached value until dependencies change.
3. **Dynamic Dependency Tracking**: Only signals actually read during the last evaluation are tracked. If a condition skips reading a signal, that signal is omitted from the dependency graph.

## 3. Side Effects with `effect()`

An `effect()` runs a side-effect function whenever one or more of the signals it depends on change. Effects are designed for synchronization tasks like writing to `localStorage`, logging analytics, or interacting with third-party DOM charting libraries:

```typescript
import { Component, signal, effect, inject } from '@angular/core';

@Component({
  selector: 'app-theme-switch',
  standalone: true,
  template: `
    <button (click)="toggleTheme()">
      Current Theme: {{ theme() }}
    </button>
  `
})
export class ThemeSwitchComponent {
  readonly theme = signal<'light' | 'dark'>('light');

  constructor() {
    // Effect must be registered in an injection context (like constructor)
    effect((onCleanup) => {
      const currentTheme = this.theme();
      document.body.setAttribute('data-theme', currentTheme);
      localStorage.setItem('user-theme', currentTheme);

      // Register cleanup handler
      onCleanup(() => {
        console.log(`Cleaning up previous theme: ${currentTheme}`);
      });
    });
  }

  toggleTheme(): void {
    this.theme.update(t => t === 'light' ? 'dark' : 'light');
  }
}
```

## Signals vs RxJS: When to Use Which?

| Feature | Angular Signals | RxJS Observables |
| :--- | :--- | :--- |
| **Primary Purpose** | Synchronous reactive state & UI values | Asynchronous streams & event pipelines |
| **Execution Model** | Synchronous, pull-based, memoized | Asynchronous or synchronous push-based |
| **Lifecycle Cleanup** | Automatic (handled by framework) | Manual unsubscribe or `takeUntilDestroyed` |
| **Value Access** | Always available synchronously via `s()` | Only accessible on next emission |
| **Ideal For** | Component state, derived values, inputs/models | WebSockets, HTTP requests, debounced search inputs |

## Summary & Key Takeaways

- Signals provide fine-grained, synchronous reactivity with automatic dependency tracking.
- `signal(initialValue)` creates a writable signal, updated via `.set(val)` or `.update(fn)`.
- `computed(() => ...)` defines derived, memoized read-only signals that re-evaluate lazily.
- `effect(() => ...)` executes side-effects (e.g. storage, logging, external DOM APIs) in response to signal changes.
- Signals simplify state management, removing the need for `BehaviorSubject` for local synchronous state.

## Best Practices & Senior Guidance

1. **Never Mutate Signal Values in Place**: Always produce new object references inside `update()`: `user.update(u => ({ ...u, name: 'New Name' }))`.
2. **Do Not Set Signals Inside `computed()` or `effect()`**: Effects should never mutate signals that trigger other effects, as this creates dangerous reactive cycles.
3. **Expose Signals as Read-Only from Services**: In services, keep `_state = signal(...)` private and expose `readonly state = this._state.asReadonly()`.
