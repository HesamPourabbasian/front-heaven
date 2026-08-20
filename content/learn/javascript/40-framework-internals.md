---
title: 'Framework Internals'
description: 'Deep dive into modern frontend framework internals: React (Fiber architecture, Reconciliation, Concurrent Mode, Suspense, RSCs, Hydration), Vue (Proxy Reactivity, Virtual DOM diffing, Compiler, Scheduler), and Svelte (Runes, Compile-time reactivity).'
order: 40
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 50
prerequisites:
  - /learn/javascript/39-advanced-architecture
---

# Framework Internals

Modern frontend frameworks—**React**, **Vue**, and **Svelte**—are masterpieces of software architecture and compiler engineering. While each framework offers declarative component paradigms, their underlying compilation strategies, reactivity models, and rendering pipelines differ fundamentally.

To optimize application performance, debug complex lifecycle bugs, and make informed architectural choices, senior engineers must understand how these frameworks function under the hood.

In this lesson, we will explore **React Fiber** architecture, reconciliation diffing, and Concurrent rendering; dissect **Vue's Proxy-based reactivity system**, compiler optimization flags, and job schedulers; and examine **Svelte's compile-time reactivity model** with Runes.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                     Reactivity & Rendering Paradigms                   │
├──────────────┬──────────────────────────┬──────────────────────────────┤
│ Framework    │ Reactivity Mechanism     │ Rendering Engine             │
├──────────────┼──────────────────────────┼──────────────────────────────┤
│ React        │ Explicit state (useState)│ Virtual DOM + Fiber Tree     │
│              │ Re-executes component fn │ Cooperative Concurrent Sched │
├──────────────┼──────────────────────────┼──────────────────────────────┤
│ Vue 3        │ Proxy-based Interception │ Virtual DOM + Compiler Block │
│              │ Fine-grained Dependency  │ Tree Patch Flags             │
├──────────────┼──────────────────────────┼──────────────────────────────┤
│ Svelte 5     │ Compile-time Signals     │ Zero Virtual DOM             │
│              │ (Runes: $state, $derived)│ Direct targeted DOM updates  │
└──────────────┴──────────────────────────┴──────────────────────────────┘
```

## React Fiber Architecture and Reconciliation

In React 15, reconciliation used a synchronous recursive tree traversal ("Stack Reconciler") that could not be paused, causing dropped frames on large updates.

React 16+ introduced **React Fiber**, a complete reimplementation of the core reconciliation algorithm using a mutable, singly-linked list of **Fiber Nodes**.

Each Fiber represents a unit of work containing pointers: `child`, `sibling`, and `return` (parent). Because Fiber work is organized as a linked list rather than a synchronous call stack, React can pause, yield, prioritize, or abort rendering work across browser animation frames.

```javascript
// Conceptual Fiber Node Structure
class FiberNode {
  constructor(tag, pendingProps, key) {
    this.tag = tag;               // FunctionComponent, HostComponent, etc.
    this.key = key;
    this.stateNode = null;        // Real DOM element reference
    this.child = null;            // First child pointer
    this.sibling = null;          // Sibling pointer
    this.return = null;           // Parent pointer
    this.memoizedState = null;    // Linked list of Hook states
    this.alternate = null;        // Double-buffering workInProgress pair
  }
}
```

## React Double-Buffering & Concurrent Rendering

React maintains two Fiber trees simultaneously:
- **`current` tree**: Represents the nodes currently rendered on screen.
- **`workInProgress` tree**: The alternate tree being constructed asynchronously in memory. Once work finishes, React swaps the root pointer in a single synchronous commit.

In Concurrent Mode, React prioritizes user inputs (typing in text inputs) over background rendering (filtering lists), keeping interfaces responsive.

## Suspense, Server Components (RSC), and Hydration

**React Server Components (RSCs)** execute exclusively on the server, streaming a serialized JSON-like component graph over the wire without shipping client JavaScript bundles.

**Hydration** attaches event listeners to pre-rendered server HTML on the client. Streaming SSR with Suspense allows selective hydration, hydrating interactive parts of the page before the entire document has finished downloading.

## Vue 3 Internals: Proxy-Based Fine-Grained Reactivity

Vue 3 uses JavaScript `Proxy` objects to intercept property accesses (`get`) and modifications (`set`):
- **`track()`**: When a reactive property is read during component rendering, Vue records the currently executing `activeEffect` in a global `WeakMap<Target, Map<Key, Set<Effect>>>` dependency graph.
- **`trigger()`**: When a property is modified, Vue looks up all subscribed effects in the dependency graph and schedules them to re-run.

```javascript
// Simplified Vue 3 Reactive Proxy implementation
let activeEffect = null;
const targetMap = new WeakMap();

function track(target, key) {
  if (!activeEffect) return;
  let depsMap = targetMap.get(target);
  if (!depsMap) targetMap.set(target, (depsMap = new Map()));
  let dep = depsMap.get(key);
  if (!dep) depsMap.set(key, (dep = new Set()));
  dep.add(activeEffect);
}

function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  const dep = depsMap.get(key);
  dep?.forEach(effect => effect());
}

function reactive(target) {
  return new Proxy(target, {
    get(obj, key) {
      track(obj, key);
      return obj[key];
    },
    set(obj, key, val) {
      obj[key] = val;
      trigger(obj, key);
      return true;
    }
  });
}
```

## Vue Compiler Optimizations: Block Trees and Patch Flags

Unlike naive Virtual DOM diffing that compares every node in the tree, Vue's compiler analyzes template ASTs at build time, identifying static nodes vs dynamic bindings.

The compiler attaches **Patch Flags** (e.g. `TEXT = 1`, `CLASS = 2`), enabling Vue to skip static subtrees entirely during reconciliation and update only dynamic bindings via fast bitwise checks.

## Vue's Asynchronous Job Scheduler

When multiple reactive properties update synchronously, re-rendering immediately for each change would waste CPU cycles.

Vue batches reactive updates into a microtask queue using an asynchronous **Scheduler**, ensuring that a component re-renders at most once per tick.

## Svelte 5 Internals: Compile-Time Reactivity and Runes

Svelte takes a radically different architectural approach by eliminating the Virtual DOM entirely:

- **Compile-Time Metaprogramming**: Svelte acts as a compiler that transforms component files (`.svelte`) into surgical, low-level JavaScript that directly manipulates DOM nodes when state changes.
- **Runes (Svelte 5)**: Uses fine-grained signals (`$state`, `$derived`, `$effect`) compiled into direct DOM mutation subscriptions without runtime diffing overhead.

Because there is no Virtual DOM reconciliation step, Svelte components achieve minimal memory footprints and instant updates.

## Summary

Modern frameworks achieve high performance through distinct architectural strategies. React utilizes the Fiber linked-list architecture with double-buffering and concurrent scheduling to manage work over the Virtual DOM. Vue 3 pairs fine-grained Proxy dependency tracking with compiler Patch Flags to skip static DOM diffing. Svelte eliminates runtime Virtual DOMs by compiling reactive signals into direct DOM mutation code.

## Best Practices

1. **Keep Component Render Functions Pure in React**: Never trigger side effects or mutate variables during render; use `useEffect`.
2. **Avoid Mutating Reactive State Directly in Vue**: Always update reactive refs through standard assignments (`ref.value = ...`) to ensure triggers execute.
3. **Use Stable Keys in Lists**: Always provide unique, stable `key` attributes when rendering lists across all frameworks to optimize reconciliation diffing.
4. **Leverage Compiler Optimizations**: Structure templates to maximize static hoisting and patch flag optimizations.
5. **Profile Framework Renders**: Use React DevTools Profiler or Vue DevTools Timeline to identify unnecessary component re-renders.
