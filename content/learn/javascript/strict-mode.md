---
title: 'Strict Mode'
description: 'Use JavaScript''s stricter execution rules to expose accidental globals and unsafe legacy behavior.'
order: 18
difficulty: 'intermediate'
category: 'Level 6 - Scope and Execution'
estimatedMinutes: 20
prerequisites:
  - learn/javascript/scope-and-function-execution
---

## Enabling strict mode

`'use strict'` changes sloppy-mode behavior: assigning to an undeclared name throws, duplicate parameter names are rejected, and plain-function `this` is `undefined`. ES modules are strict automatically.

```js
'use strict'
total = 10 // ReferenceError
```

Strict mode does not make objects immutable or replace validation. Its value is early failure: mistakes become visible near their cause instead of silently modifying global state.

## Summary

Use modules or strict mode for predictable execution, and treat strict errors as useful feedback.

## Practice

Run the same script with and without strict mode. Compare undeclared assignment, `this` in a function and duplicate parameter behavior.
