---
title: 'Advanced Signals, Computed State & RxJS Interop'
description: 'Master advanced Angular Signals: derived state graphs, signal inputs and outputs, model signals, equality comparison functions, untracked reads, and RxJS interop with toSignal and toObservable.'
order: 15
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 45
prerequisites: ['/learn/angular/14-advanced-components']
---

# Advanced Signals, Computed State & RxJS Interop

While basic Signals provide intuitive state tracking, building large-scale enterprise applications requires a deep understanding of advanced Signal mechanics. This includes constructing complex derived dependency graphs, configuring custom equality functions to prevent unnecessary downstream re-computations, executing untracked reads, and bridging seamlessly between Angular Signals and RxJS streaming pipelines.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Angular Signal & RxJS Interoperability      │
│                                                             │
│   RxJS Stream (Push / Async)         Angular Signal (Pull)  │
│  ┌───────────────────────────┐      ┌─────────────────────┐ │
│  │ websocket$.pipe(...)      │ ───> │ toSignal(source$)   │ │
│  │ (Events, Time, Streaming) │      │ (Synchronous Read)  │ │
│  └───────────────────────────┘      └─────────────────────┘ │
│                ▲                               │            │
│                │                               │            │
│  ┌───────────────────────────┐                 │            │
│  │ toObservable(mySignal)    │ <───────────────┘            │
│  │ (Debounce, SwitchMap)     │                              │
│  └───────────────────────────┘                              │
└─────────────────────────────────────────────────────────────┘
```

## 1. Custom Equality Functions in Signals

By default, Angular Signals compare values using JavaScript's `Object.is()` (reference equality). If a signal receives a new object with identical content, all downstream `computed()` signals and template bindings will re-evaluate. You can pass a custom `equal` comparator to prevent unnecessary propagation:

```typescript
import { signal, computed } from '@angular/core';

export interface Coordinates {
  x: number;
  y: number;
}

// Custom equality comparator: Only emit if coordinate values actually change
const areCoordsEqual = (a: Coordinates, b: Coordinates): boolean =>
  a.x === b.x && a.y === b.y;

export class MapController {
  readonly position = signal<Coordinates>({ x: 0, y: 0 }, { equal: areCoordsEqual });

  updatePosition(newX: number, newY: number): void {
    // If coordinates match previous values, downstream computeds WILL NOT run
    this.position.set({ x: newX, y: newY });
  }
}
```

## 2. Untracked Reads: `untracked()`

Inside a `computed()` signal or an `effect()`, you may want to read the current value of a signal *without* subscribing to its changes. The `untracked()` utility executes a read without registering a dependency in the reactive graph:

```typescript
import { Component, signal, effect, untracked } from '@angular/core';

@Component({
  selector: 'app-analytics-logger',
  standalone: true,
  template: `<button (click)="actionCount.update(c => c + 1)">Click</button>`
})
export class AnalyticsLoggerComponent {
  readonly actionCount = signal(0);
  readonly currentUserId = signal('user_123');

  constructor() {
    effect(() => {
      // We want this effect to trigger ONLY when actionCount changes
      const count = this.actionCount();

      // Read currentUserId WITHOUT tracking it as a reactive dependency
      const userId = untracked(() => this.currentUserId());

      console.log(`[Telemetry] User ${userId} triggered action #${count}`);
    });
  }
}
```

## 3. RxJS Interoperability: `toSignal()`

The `toSignal()` utility converts any RxJS `Observable<T>` into a `Signal<T>`. It automatically manages the underlying subscription, subscribing when instantiated and unsubscribing when the enclosing injection context (component or service) is destroyed:

```typescript
import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-stock-ticker',
  standalone: true,
  template: `
    <h3>Live Price: \${{ price() }}</h3>
  `
})
export class StockTickerComponent {
  private http = inject(HttpClient);

  // Convert timer observable to signal with initial fallback value
  readonly price = toSignal(
    interval(1000).pipe(map(() => (100 + Math.random() * 10).toFixed(2))),
    { initialValue: '100.00' }
  );
}
```

### Options in `toSignal`:
- `initialValue`: Value returned before the Observable emits its first item.
- `requireSync`: If `true`, enforces that the Observable emits synchronously upon subscription; otherwise throws a runtime error.
- `rejectErrors`: If `true`, propagates errors to Angular's `ErrorHandler` rather than rethrowing inside the signal.

## 4. Converting Signals to Observables: `toObservable()`

When you need to perform complex asynchronous operations like debouncing user input or cancellation, convert a Signal into an Observable using `toObservable()`:

```typescript
import { Component, signal, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-live-search',
  standalone: true,
  template: `
    <input (input)="query.set($any($event.target).value)" placeholder="Search..." />
    <ul>
      @for (item of searchResults(); track item.id) {
        <li>{{ item.name }}</li>
      }
    </ul>
  `
})
export class LiveSearchComponent {
  private http = inject(HttpClient);
  readonly query = signal<string>('');

  // 1. Convert signal to observable
  private readonly searchResults$ = toObservable(this.query).pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(term => this.http.get<any[]>(`/api/search?q=${encodeURIComponent(term)}`))
  );

  // 2. Convert result stream back to signal for clean template consumption
  readonly searchResults = toSignal(this.searchResults$, { initialValue: [] });
}
```

## Summary & Key Takeaways

- Custom equality functions (`equal`) prevent unnecessary signal re-evaluations for complex objects and arrays.
- `untracked(() => signal())` allows reading signal values without establishing a reactive subscription inside computeds or effects.
- `toSignal(observable$)` seamlessly converts RxJS streams to Angular Signals with automatic unsubscription.
- `toObservable(signal)` allows applying RxJS operators (`debounceTime`, `switchMap`) to reactive signal changes.

## Best Practices & Senior Guidance

1. **Use Signals for State, RxJS for Async Pipelines**: Do not choose one exclusively. Use Signals for component/UI state and RxJS for debouncing, WebSockets, and asynchronous coordination.
2. **Always Provide `initialValue` in `toSignal`**: Supplying an `initialValue` prevents your signal type from becoming `Signal<T | undefined>`.
3. **Keep `computed()` Free of Side Effects**: A `computed()` function must be a pure mathematical transformation of inputs to outputs. Never call API endpoints or mutate external state inside `computed()`.
