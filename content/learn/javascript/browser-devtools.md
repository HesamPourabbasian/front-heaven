---
title: Browser DevTools
description: Debug JavaScript, inspect memory and measure performance with professional browser tooling.
order: 34
difficulty: advanced
category: Level 12 - Memory and Performance
estimatedMinutes: 35
prerequisites:
  - learn/javascript/memory-management
  - learn/javascript/browser-javascript
---

## Inspect, debug and measure

Use Sources breakpoints, conditional breakpoints, watch expressions and the call stack to inspect execution. Use the Console to test assumptions, Network to inspect requests, and the Performance panel to find long tasks and layout work.

Heap snapshots reveal retained objects and detached DOM nodes. The Memory panel's allocation timeline shows what grows over time. Measure before optimizing: a performance profile is evidence, not a guess.

## Debugging issues, leaks and performance

Reproduce an issue before changing code, pause near the failure, inspect the call stack and values, then make one change. To debug memory leaks, compare heap snapshots after repeating the same interaction and inspect retaining paths for objects that should have disappeared. To debug performance, record the interaction in the Performance panel, identify long tasks and hot call frames, change the measured bottleneck, and profile again.

```js
console.time('render')
renderList(items)
console.timeEnd('render')
```

## Summary

DevTools connects language behavior, network activity, memory and performance. Reproduce, inspect evidence, make one change, and measure again.

## Practice

Debug a deliberate exception with a breakpoint, profile a slow loop, and take two heap snapshots around a component mount/unmount cycle.
