---
title: 'Memory Management'
description: 'Master JavaScript memory management: Stack vs Heap allocation, Generational Garbage Collection (Scavenger / Minor GC vs Mark-Sweep-Compact / Major GC), memory leak detection, detached DOM nodes, WeakMap, WeakSet, WeakRef, and FinalizationRegistry.'
order: 31
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 45
prerequisites:
  - /learn/javascript/30-javascript-engine-internals
---

# Memory Management

Memory management in JavaScript is automatic and abstracted by the engine's **Garbage Collector (GC)**. However, automated memory management does not mean that memory leaks and performance bottlenecks cannot occur. In large-scale single-page applications, retaining unintentional object references leads to unbounded heap expansion, high garbage collection pauses (GC jank), UI stuttering, and eventual browser tab crashes (`Out of Memory`).

Mastering memory lifecycle management requires understanding the distinction between **Stack and Heap** allocations, the internal mechanics of **Generational Garbage Collection**, diagnosing detached DOM memory leaks using Chrome DevTools, and utilizing modern weak memory references (**`WeakMap`**, **`WeakSet`**, **`WeakRef`**, and **`FinalizationRegistry`**).

In this lesson, we will dissect Stack versus Heap memory models, trace Generational Garbage Collection (Nursery / Minor GC vs Tenured / Major GC), analyze common memory leak root causes, master detached DOM node cleanup, and leverage Weak reference APIs.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        V8 Heap Memory Spaces                           │
├────────────────────────────────────────────────────────────────────────┤
│ New Space (Young Generation)          │ Old Space (Old Generation)     │
│  ├── Semi-space: From Space           │  ├── Old Pointer Space         │
│  └── Semi-space: To Space             │  └── Old Data Space            │
│  (Managed by Cheney's Scavenger GC)   │ (Managed by Mark-Sweep-Compact)│
│                                       │                                │
│ Code Space (JIT compiled machine code)│ Large Object Space (>1MB objs) │
└────────────────────────────────────────────────────────────────────────┘
```

## Stack vs Heap Memory Allocation

The JavaScript engine divides allocated memory into two primary regions:
1. **The Stack**: Used for static, fixed-size data. Stores active execution context stack frames, primitive values (`number`, `boolean`, `symbol`), and reference pointers pointing to heap addresses. Stack allocation is extremely fast and follows strict LIFO execution rules.
2. **The Heap**: A large, dynamically allocated memory space used for reference types (Objects, Arrays, Functions, Closures) whose size is variable and determined at runtime.

## Generational Garbage Collection in V8

V8's garbage collector is guided by **The Weak Generational Hypothesis**: *Most objects die young*. To optimize collection cycles, V8 divides the heap into two generations:

### 1. Young Generation (New Space)
- Stores newly instantiated objects. Typically small (1MB - 64MB).
- Managed by **Minor GC (Scavenger)** using Cheney's copying algorithm. The New Space is divided into two semi-spaces: *From Space* and *To Space*.
- When From Space fills, Minor GC copies surviving (live) objects to To Space and frees dead memory instantly. Objects that survive two Minor GC cycles are **promoted** (evacuated) to the Old Space. Minor GC runs frequently in sub-milliseconds without visible UI lag.

### 2. Old Generation (Old Space)
- Stores long-lived objects promoted from the New Space.
- Managed by **Major GC (Mark-Sweep-Compact)**:
  - **Marking**: Identifies reachable objects starting from root pointers.
  - **Sweeping**: Traverses the heap to add unreachable memory blocks to free-lists.
  - **Compacting**: Defragments memory by shifting live objects into contiguous memory blocks to prevent memory fragmentation.
- V8 utilizes **Concurrent and Incremental Marking** to interleave GC work with JavaScript execution, preventing multi-second main-thread freezes.

## Diagnosing Common Memory Leaks

A **Memory Leak** occurs when an application retains references to objects that are no longer needed by business logic, preventing the Garbage Collector from reclaiming their memory.

### Primary Memory Leak Culprits:
1. **Accidental Global Variables**: Undeclared identifiers bound to `window`.
2. **Uncleared Timers and Intervals**: `setInterval` callbacks retaining references to large closures.
3. **Forgotten Event Listeners**: Window/document listeners holding references to unmounted component scopes.
4. **Detached DOM Nodes**: A DOM node removed from the active document tree via `element.remove()`, but still referenced inside a JavaScript array or object.

```javascript
// Detached DOM Node Leak Pattern
let cachedButton = null;

function renderModal() {
  const modal = document.createElement("div");
  const button = document.createElement("button");
  modal.appendChild(button);
  document.body.appendChild(modal);

  // Leak: cachedButton retains memory pointer to button, preventing GC of modal & button
  cachedButton = button;
}

function closeModal() {
  const modal = document.querySelector("div");
  modal.remove(); // Removed from visible DOM, but stays in Heap because of cachedButton!
}
```

## Weak Collections: `WeakMap` and `WeakSet`

Standard `Map` and `Set` hold strong references to their keys and elements, preventing garbage collection even if all other external references are deleted.

- **`WeakMap`**: Key-value collection where **keys must be objects**, and keys are held **weakly**. If no other reference to the key object exists, the entry is automatically collected by the GC. `WeakMap` keys are not enumerable (no `.size` or `.keys()`). Ideal for private metadata and caching DOM state.
- **`WeakSet`**: Stores weakly held objects; entries are collected when unreferenced elsewhere.

```javascript
// Storing private component metadata with WeakMap without memory leaks
const privateStateMap = new WeakMap();

class SecureComponent {
  constructor(domNode) {
    // When domNode is removed from DOM and unreferenced, this entry is GC'd automatically!
    privateStateMap.set(domNode, { clickCount: 0, secretKey: "xyz" });
  }

  recordClick(domNode) {
    const state = privateStateMap.get(domNode);
    if (state) state.clickCount++;
  }
}
```

## Advanced Lifecycle Management: `WeakRef` and `FinalizationRegistry`

Introduced in ES2021:
- **`WeakRef`**: Holds a weak reference to a target object (called the *referent*), allowing you to maintain a pointer without preventing its garbage collection. You access the referent via `weakRef.deref()`, which returns `undefined` if collected.
- **`FinalizationRegistry`**: Registers a cleanup callback to be invoked after a target object has been reclaimed by the garbage collector.

```javascript
// Ephemeral Caching with WeakRef and FinalizationRegistry
const registry = new FinalizationRegistry((heldValue) => {
  console.log(`Resource for key '${heldValue}' was collected by the GC`);
});

class EphemeralCache {
  #cache = new Map();

  set(key, expensiveObject) {
    this.#cache.set(key, new WeakRef(expensiveObject));
    registry.register(expensiveObject, key);
  }

  get(key) {
    const ref = this.#cache.get(key);
    if (!ref) return undefined;
    const value = ref.deref();
    if (!value) {
      this.#cache.delete(key); // Cleanup dead reference
      return undefined;
    }
    return value;
  }
}
```

## Summary

JavaScript memory is allocated on the Stack (primitives and pointers) and Heap (objects and closures). Generational GC cleans the Young Generation via Minor GC (Scavenger) and Old Generation via Major GC (Mark-Sweep-Compact). Prevent memory leaks by cleaning up global event listeners, clearing timers, and eliminating references to detached DOM nodes. Use `WeakMap`, `WeakSet`, and `WeakRef` for leak-free metadata association and ephemeral caching.

## Best Practices

1. **Always Remove Global Event Listeners on Teardown**: Clean up window/document listeners in component unmount hooks.
2. **Use `WeakMap` for Associating State with DOM Elements**: Associating metadata with DOM nodes using `WeakMap` ensures automatic memory cleanup when the nodes are removed.
3. **Clear All `setInterval` Handles**: Store interval IDs and invoke `clearInterval()` as soon as the polling task completes.
4. **Use Chrome DevTools Heap Snapshots for Memory Audits**: Take three sequential heap snapshots (Before, Action, After) and filter for "Objects allocated between snapshots" to find leaks.
5. **Do Not Rely on `FinalizationRegistry` for Essential Business Logic**: GC execution timing is non-deterministic; never rely on finalizers to close database transactions or commit state.
