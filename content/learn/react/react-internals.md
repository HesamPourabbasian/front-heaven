---
title: "React Internals: Fiber & Reconciliation"
technology: "react"
difficulty: "advanced"
estimatedMinutes: 30
order: 30
description: "Deep dive into React architecture: Fiber nodes, reconciliation algorithm, render phase vs commit phase, and scheduling."
---

# React Internals: Fiber & Reconciliation

To truly master React and debug intricate performance issues, you must understand how React executes under the hood. React is powered by an internal engine called **Fiber**, introduced in React 16 to enable incremental rendering, work prioritization, and concurrent scheduling.

In this lesson, you will explore the Fiber architecture, how the reconciliation diffing algorithm works, the critical separation between the Render Phase and Commit Phase, and how React schedules work.

## What is a Fiber?

In classical stack reconciliation (React 15 and earlier), updating the UI was recursive and synchronous. Once React began traversing a large component tree, it could not pause. If rendering took 50ms, the main thread was blocked, causing dropped frames and unresponsive user input.

A **Fiber** is a plain JavaScript object that represents a unit of work. Every React element corresponds to a Fiber node in an internal linked list tree:

```text
                 HostRootFiber
                      │
                      ▼
                 AppFiber
                 /       \
                /         \
           NavFiber ───► ContentFiber
                            │
                            ▼
                       SidebarFiber
```

Each Fiber holds:
- `type` and `key`: Component identifier.
- `stateNode`: Reference to the actual DOM node or class instance.
- `child`, `sibling`, `return`: Pointers forming the Fiber linked list tree.
- `memoizedProps` and `memoizedState`: Data from the previous render.
- `flags` (formerly effect tags): Bitwise indicators of what DOM mutations are needed (e.g. `Placement`, `Update`, `Deletion`).

## The Two Phases of React Execution

React splits work into two distinct phases:

### 1. The Render Phase (Asynchronous & Interruptible)
During the render phase, React traverses the Fiber tree, executes component functions, evaluates hooks, computes the new Virtual DOM, and generates a list of changes (the **Effect List**).
- **Non-blocking**: React can pause work in the render phase if higher-priority user events (like typing or clicking) arrive, then resume or restart work later.
- **Pure**: No real DOM mutations happen in this phase.

### 2. The Commit Phase (Synchronous & Non-Interruptible)
Once the render phase completes, React enters the commit phase.
- React takes the finished Fiber tree and applies all mutations (`appendChild`, `removeChild`, attribute updates) to the real browser DOM in a single synchronous batch.
- React runs `useLayoutEffect` synchronously after DOM mutations, followed by `useEffect` asynchronously after the browser paints.

## The Reconciliation Diffing Algorithm

Reconciliation uses an optimized $O(n)$ heuristic diffing algorithm based on two key assumptions:
1. **Two elements of different types produce different trees**: If a `<div>` changes to a `<span>`, React destroys the old subtree entirely and rebuilds the new one.
2. **Stable keys identify elements across renders**: Keys allow React to match existing children across array reorders rather than tearing down and reconstructing DOM nodes.

## Best Practices

- **Keep Render Functions Free of Side Effects**: Because the render phase can be executed multiple times or discarded in Concurrent React, render functions must remain strictly pure.
- **Never Change Component Types Conditionally**: Avoid toggling component wrappers dynamically (`const Comp = condition ? Div : Section`), as this forces React to destroy and remount the entire internal Fiber subtree.
- **Understand Key Stability**: Changing a component's `key` intentionally forces React to reset its internal Fiber state and remount it fresh.

## Summary

React Fiber transforms rendering into interruptible, prioritizable units of work. By decoupling the asynchronous render phase from the synchronous commit phase, Fiber enables concurrent features, fluid responsiveness, and high-performance UI reconciliation.
