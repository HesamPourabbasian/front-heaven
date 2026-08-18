---
title: 'Framework Internals: React Fiber, Vue Reactivity & Svelte Compiler'
description: 'Master the internal engine architectures of modern UI frameworks: React Fiber Reconciliation, Vue Proxy Reactivity & Compiler optimizations, and Svelte 5 Runes compile-time fine-grained signals.'
order: 9
difficulty: 'advanced'
category: 'Senior Front-End Engineering'
estimatedMinutes: 50
prerequisites:
  - /learn/advanced-topics/08-state-management
---

# Framework Internals: React Fiber, Vue Reactivity & Svelte Compiler

Senior front-end engineers do not view UI frameworks as magic black boxes. They understand the fundamental architectural trade-offs between **Runtime Virtual DOM Reconciliation (React)**, **Proxy-based Reactive Dependency Tracking (Vue)**, and **Compile-time Fine-Grained Signals (Svelte)**.

In this lesson, we dissect the internal rendering engines of **React Fiber**, **Vue 3 Composition Engine**, and **Svelte 5 Runes**.

```text
┌────────────────────────────────────────────────────────────┐
│              Framework Architecture Comparison             │
├──────────────┬───────────────────────────────┬─────────────┤
│ Framework    │ Core Engine Paradigm          │ VDOM / Diff │
├──────────────┼───────────────────────────────┼─────────────┤
│ React        │ Fiber Linked List Tree        │ Full VDOM   │
│ Vue 3        │ Proxy Dependency Tracking     │ Block Tree  │
│ Svelte 5     │ Compile-Time Fine-Grained     │ ZERO VDOM   │
└──────────────┴───────────────────────────────┴─────────────┘
```

## 1. React Internals: The Fiber Reconciliation Architecture

Before React 16, React used the recursive **Stack Reconciler**. If a large component tree was updating, the JavaScript call stack locked the browser main thread until the entire tree finished rendering, causing frame drops.

React **Fiber** reimagined the component tree as a mutable **doubly linked list of Fiber nodes**:

```text
       Parent Fiber
         │ (child)
         ▼
      Child 1 ──(sibling)──► Child 2 ──(sibling)──► Child 3
         │ (return)             │ (return)             │ (return)
         └──────────────────────┴──────────────────────┘
```

Each Fiber node represents a unit of work containing:
- `tag` & `type` (HTML element or component function).
- `child`, `sibling`, and `return` (parent) pointers.
- `memoizedState` (linked list of hook states: `useState`, `useEffect`).
- `flags` (Effect tags: `Placement`, `Update`, `Deletion`).
- `alternate`: Pointer to the matching Fiber in the alternate tree.

### The Double Buffering Technique:
React maintains two Fiber trees simultaneously:
1. **Current Tree**: Represents the UI currently painted on screen.
2. **WorkInProgress (WIP) Tree**: Asynchronously assembled in the background.

During the **Render Phase** (asynchronous & interruptible), React traverses the WIP tree, calculates diffs, and yields to the browser if high-priority user input arrives (via `MessageChannel`). Once the entire tree is computed, React executes the **Commit Phase** (synchronous & non-interruptible), applying all DOM mutations in one fast batch and swapping the pointer so the WIP tree becomes the Current tree!

## 2. Vue 3 Internals: Proxy Reactivity & The Block Tree Compiler

Unlike React's full-tree re-evaluations, Vue 3 uses a fine-grained, push-based **Proxy Reactivity Engine** combined with an optimizing compiler.

### The `track()` & `trigger()` Mechanism:
```javascript
// Conceptual Vue 3 Reactivity Core
let activeEffect = null;
const targetMap = new WeakMap(); // Target -> Key -> Set of Effects

export function track(target, key) {
  if (!activeEffect) return;
  let depsMap = targetMap.get(target);
  if (!depsMap) targetMap.set(target, (depsMap = new Map()));
  let dep = depsMap.get(key);
  if (!dep) depsMap.set(key, (dep = new Set()));
  dep.add(activeEffect);
}

export function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  const dep = depsMap.get(key);
  if (dep) {
    dep.forEach(effect => effect()); // Re-run only components that read this property!
  }
}

export function reactive(obj) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      track(target, key); // Automatically record dependency on read
      return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver);
      trigger(target, key); // Automatically notify listeners on write
      return result;
    },
  });
}
```

### Compiler Optimization: The Block Tree & Patch Flags
Vue's template compiler analyzes static vs dynamic content during build time. It generates **Patch Flags** (e.g., `/* TEXT */ 1`) and flattens dynamic nodes into a **Block Tree**, bypassing static subtrees entirely during VDOM diffing!

## 3. Svelte Internals: Zero VDOM & Runes Signals

Svelte takes a radically different approach: it is a **pure compiler**. Svelte generates concise, surgical imperative JavaScript that modifies DOM elements directly when state changes, completely eliminating Virtual DOM memory overhead.

In **Svelte 5**, reactivity is powered by **Runes** (`$state()`, `$derived()`, `$effect()`) built upon fine-grained **Signals**:

```javascript
// Compiled output concept of Svelte 5 $state
// Svelte compiles: let count = $state(0)
// into a reactive Signal with direct DOM text-node binding:
function updateCount(newVal) {
  count_signal.set(newVal);
  // Directly mutates textNode.data = newVal with 0 VDOM diffing overhead!
}
```

## Summary

- React Fiber uses a doubly linked list to enable time-sliced, interruptible asynchronous rendering.
- React's Double Buffering renders the WorkInProgress tree in the background before swapping in the Commit phase.
- Vue 3 tracks dependencies at property-level using `Proxy`, `track()`, and `trigger()`.
- Vue's Block Tree and Patch Flags skip static nodes during Virtual DOM patch cycles.
- Svelte operates as a compile-time compiler, updating DOM nodes directly via fine-grained signals with zero Virtual DOM overhead.

## Best Practices

1. **Keep Hook Counts and Ordering Identical in React**: Fiber stores hook state in an internal linked list; conditional hooks corrupt the pointer index.
2. **Never Destructure Vue Reactive Objects Without `toRefs`**: Destructuring breaks Proxy property getter access, causing loss of reactivity.
3. **Leverage Compile-Time Static Hoisting**: Write idiomatic templates so framework compilers can hoist static nodes outside render functions.
4. **Choose Frameworks Based on Architectural Match**: Select React for massive ecosystem versatility, Vue for developer ergonomics and automatic reactivity, or Svelte for ultra-lean bundle size and maximum performance.
