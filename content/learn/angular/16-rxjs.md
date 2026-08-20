---
title: 'RxJS & Reactive Programming in Angular'
description: 'Master RxJS in Angular: Observables, Observers, Subscriptions, pipeable operators (map, filter, switchMap, mergeMap, concatMap, exhaustMap, debounceTime), Subjects, and memory leak prevention.'
order: 16
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 50
prerequisites: ['/learn/angular/15-advanced-signals']
---

# RxJS & Reactive Programming in Angular

**Reactive Extensions for JavaScript (RxJS)** is a library for composing asynchronous and event-based programs using observable sequences. While Angular Signals handle synchronous state and UI derivation, RxJS is the enterprise standard for handling asynchronous data streams, real-time WebSocket communication, event debouncing, rate limiting, and HTTP request orchestration.

Mastering RxJS requires understanding the lifecycle of Observables, the flattening strategies of higher-order operators (`switchMap`, `mergeMap`, `concatMap`, `exhaustMap`), Subject variations, and memory leak prevention using `takeUntilDestroyed`.

```text
┌─────────────────────────────────────────────────────────────┐
│                 RxJS Higher-Order Flattening Strategies     │
├────────────┬────────────────────────────────────────────────┤
│ Operator   │ Strategy & Behavior                            │
├────────────┼────────────────────────────────────────────────┤
│ switchMap  │ Cancels previous inner observable on new emit. │
│            │ Ideal for: Search typeahead, tab switching.    │
├────────────┼────────────────────────────────────────────────┤
│ mergeMap   │ Runs all inner observables concurrently.       │
│            │ Ideal for: Parallel uploads, independent fetches│
├────────────┼────────────────────────────────────────────────┤
│ concatMap  │ Queues inner observables sequentially.         │
│            │ Ideal for: Ordered saves, deterministic writes.│
├────────────┼────────────────────────────────────────────────┤
│ exhaustMap │ Ignores new emissions while inner is active.   │
│            │ Ideal for: Login buttons, non-repeatable clicks│
└────────────┴────────────────────────────────────────────────┘
```

## 1. Core RxJS Primitives

- **Observable**: A lazy, push-based collection of values delivered over time. Observables do nothing until subscribed to.
- **Observer**: A consumer object implementing `next(val)`, `error(err)`, and `complete()` callbacks.
- **Subscription**: Represents the ongoing execution of an Observable. Calling `subscription.unsubscribe()` tears down the stream and cancels listeners.

```typescript
import { Observable } from 'rxjs';

// Custom Observable emitting values over time
const customStream$ = new Observable<number>(subscriber => {
  subscriber.next(1);
  subscriber.next(2);
  const timer = setTimeout(() => {
    subscriber.next(3);
    subscriber.complete();
  }, 1000);

  // Teardown logic upon unsubscription
  return () => clearTimeout(timer);
});
```

## 2. Essential Pipeable Operators

Operators are pure functions that take an Observable as input and return a new transformed Observable.

```typescript
import { of, fromEvent } from 'rxjs';
import { map, filter, debounceTime, distinctUntilChanged, tap, catchError } from 'rxjs/operators';

// Data transformation pipeline
const processed$ = of(1, 2, 3, 4, 5).pipe(
  filter(n => n % 2 !== 0),         // Emit odd numbers: 1, 3, 5
  map(n => n * 10),                 // Multiply by 10: 10, 30, 50
  tap(n => console.log('Value:', n))// Side effect debugging
);
```

## 3. Higher-Order Flattening Operators

When an operator returns an Observable inside an Observable (`Observable<Observable<T>>`), flattening operators resolve the inner Observable to emit values directly:

```typescript
import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-user-search',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <input [formControl]="searchControl" placeholder="Search usernames..." />
  `
})
export class UserSearchComponent {
  private http = inject(HttpClient);
  readonly searchControl = new FormControl('');

  readonly searchResults$ = this.searchControl.valueChanges.pipe(
    debounceTime(300),              // Wait 300ms after last keystroke
    distinctUntilChanged(),         // Ignore identical consecutive values
    switchMap(query => {            // Cancel previous in-flight HTTP request
      if (!query?.trim()) return of([]);
      return this.http.get<any[]>(`/api/users?search=${encodeURIComponent(query)}`).pipe(
        catchError(() => of([]))     // Gracefully recover on API failure
      );
    })
  );
}
```

## 4. Subject Types: `Subject`, `BehaviorSubject`, `ReplaySubject`

- **`Subject`**: Multicasts values to existing subscribers. Does not hold past values.
- **`BehaviorSubject`**: Requires an initial value. Immediately emits its current/latest value to new subscribers.
- **`ReplaySubject(n)`**: Buffers the last `n` values and replays them to all new subscribers.
- **`AsyncSubject`**: Emits only the final value of the stream upon completion.

## 5. Preventing Memory Leaks: `takeUntilDestroyed`

Unmanaged subscriptions to infinite Observables (e.g. `interval()`, DOM events, WebSocket streams) keep component instances alive in memory, causing severe memory leaks. In modern Angular, use the **`takeUntilDestroyed`** operator:

```typescript
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';

@Component({
  selector: 'app-telemetry-poller',
  standalone: true,
  template: `<p>Polling active</p>`
})
export class TelemetryPollerComponent {
  constructor() {
    // Automatically unsubscribes when this component is destroyed
    interval(5000).pipe(
      takeUntilDestroyed()
    ).subscribe(() => {
      console.log('Fetching live telemetry snapshot...');
    });
  }
}
```

## Summary & Key Takeaways

- RxJS manages asynchronous streams, event handling, and HTTP request orchestration.
- Use `switchMap` for cancellable search requests, `concatMap` for sequential writes, `mergeMap` for concurrent fetches, and `exhaustMap` for non-repeatable button clicks.
- `BehaviorSubject` stores current state and replays it to new subscribers upon connection.
- `takeUntilDestroyed()` automatically tears down subscriptions when the enclosing component or service is destroyed.

## Best Practices & Senior Guidance

1. **Avoid Nested `.subscribe()` Calls**: Never call `.subscribe()` inside another `.subscribe()`. Use flattening operators like `switchMap` or `concatMap`.
2. **Always Unsubscribe**: Use `takeUntilDestroyed()` or the `AsyncPipe` (`| async`) in templates to guarantee zero memory leaks.
3. **Catch Errors Inside Flattening Streams**: Place `catchError()` inside the inner Observable within `switchMap()` to prevent the outer stream from dying permanently on network error.
