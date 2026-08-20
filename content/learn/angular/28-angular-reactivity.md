---
title: 'Angular Reactivity & Signal Graph Theory'
description: 'Master advanced Angular reactivity: push-pull reactivity algorithms, dirty marking and dynamic dependency tracking in signal graphs, glitch freedom, and avoiding reactive loops.'
order: 28
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 50
prerequisites: ['/learn/angular/27-change-detection']
---

# Angular Reactivity & Signal Graph Theory

Modern Angular is built on a **Push-Pull Reactivity Algorithm**. Unlike pure push-based reactivity systems (such as RxJS Observables, where every emission pushes values eagerly down the stream) or pure pull-based systems (like spreadsheet formula evaluation), Angular Signals combine the best properties of both models to achieve **Glitch-Free** and **Optimal-Performance** execution.

Understanding how the reactive graph resolves dependencies, propagates dirty flags, and memoizes values is essential for designing high-performance architectures and avoiding infinite reactive loops.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Signal Reactive Graph States                │
├───────────────┬─────────────────────────────────────────────┤
│ State         │ Meaning & Behavior                          │
├───────────────┼─────────────────────────────────────────────┤
│ Clean         │ Value is up to date. Reads return cached    │
│               │ value instantly (Zero computation cost).    │
├───────────────┼─────────────────────────────────────────────┤
│ Dirty         │ A direct dependency changed. Must           │
│               │ recompute when read by a consumer.          │
├───────────────┼─────────────────────────────────────────────┤
│ Check-Dirty   │ An indirect dependency changed. Must check  │
│               │ intermediate nodes before recomputing.     │
└───────────────┴─────────────────────────────────────────────┘
```

## 1. The Push-Pull Algorithm Explained

When a writable signal is updated via `count.set(5)`:
1. **Push Phase (Dirty Notification)**: The signal immediately pushes a lightweight "Dirty" or "Check-Dirty" notification down to all consumers in the reactive graph. No heavy computations are executed during this phase.
2. **Pull Phase (Lazy Evaluation)**: When a consumer (e.g. a DOM template binding or `computed()` signal) actually reads the value, it pulls the value, evaluating the derivation function only if the node is flagged dirty.

This design guarantees:
- **Zero Redundant Computations**: If a computed signal is modified 10 times in a loop but never read on screen, the computation function runs zero times.
- **Glitch Freedom**: Diamond dependency problems (where a computed signal depends on two intermediate signals derived from the same source) evaluate cleanly without intermediate invalid states.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Diamond Dependency Graph Resolution         │
│                                                             │
│                       [ Writable: A ]                       │
│                        /           \                        │
│                       /             \                       │
│             [ Computed: B ]     [ Computed: C ]             │
│                       \             /                       │
│                        \           /                        │
│                       [ Computed: D ]                       │
│                                                             │
│  In a glitch-free system: When A updates, D evaluates       │
│  exactly ONCE with both B and C updated synchronously.      │
└─────────────────────────────────────────────────────────────┘
```

## 2. Preventing Reactive Loops

A reactive loop occurs when an `effect()` reads a signal and modifies another signal that triggers the original effect, creating an infinite loop that freezes the browser:

```typescript
// DANGEROUS: Infinite Reactive Loop
effect(() => {
  const currentCount = this.count(); // Reads count
  this.step.set(currentCount * 2);   // Modifies step
});

effect(() => {
  const currentStep = this.step();   // Reads step
  this.count.set(currentStep + 1);   // Modifies count -> LOOP!
});
```

To resolve this:
- **Prefer `computed()` for Derived Values**: Replace synchronization effects with pure `computed()` signals: `readonly step = computed(() => this.count() * 2);`.
- **Use `untracked()`**: If an effect must read a value without reacting to it, wrap the read inside `untracked(() => ...)`.

## Summary & Key Takeaways

- Angular Signals use a Push-Pull reactivity model: dirty notifications push eagerly, evaluations pull lazily.
- The reactive graph maintains three node states: Clean, Check-Dirty, and Dirty.
- Push-pull reactivity guarantees glitch-free evaluations and zero wasted intermediate calculations.
- Avoid reactive cycles by using `computed()` for derived state rather than mutually triggering `effect()` calls.

## Best Practices & Senior Guidance

1. **Use `computed()` for Data Transformations**: Never use an `effect()` to set a second signal when a `computed()` signal can derive the value directly.
2. **Never Enable `allowSignalWrites` Lightly**: The `allowSignalWrites: true` option in `effect()` is a code smell that often signals architectural design flaws.
