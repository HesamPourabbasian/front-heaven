---
title: 'Memory Management'
description: 'Understand the memory lifecycle, reachability and garbage collection in JavaScript.'
order: 33
difficulty: 'advanced'
category: 'Level 12 - Memory and Performance'
estimatedMinutes: 30
prerequisites:
  - learn/javascript/scope-and-function-execution
  - learn/javascript/keyed-collections
---

## Lifecycle and garbage collection

The **memory lifecycle** has three stages: allocate memory, use the stored value, and release it when it is no longer needed. Garbage collection finds objects that are no longer reachable from roots such as globals, the stack and active closures. You do not free memory manually, but you can keep objects alive accidentally.

Common leaks include forgotten event listeners, uncleared timers, growing global caches and closures retaining large objects. Use `WeakMap` for metadata that should not retain its keys and remove listeners when a feature ends.

## Summary

Think in reachability, not manual frees. A memory leak is usually a long-lived reference to data that should have become unreachable.

## Practice

Create and remove a component repeatedly, inspect heap snapshots, then fix a deliberate timer or listener leak.
