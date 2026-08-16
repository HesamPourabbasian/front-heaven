---
title: 'Modules in JavaScript'
description: 'Organize JavaScript with ES modules and understand the CommonJS module system.'
order: 31
difficulty: 'intermediate'
category: 'Level 11 - Modules and Advanced JavaScript'
estimatedMinutes: 30
prerequisites:
  - learn/javascript/working-with-apis
---

## ES modules

Modules have their own scope. Export named values or one default value and import only what a file needs:

```js
// math.js
export const add = (a, b) => a + b
// app.js
import { add } from './math.js'
```

Browser modules use `<script type="module">` and are deferred automatically. CommonJS uses `require` and `module.exports`, mainly in older Node.js code. Do not mix systems without understanding the runtime and package configuration.

## Summary

Modules make dependencies visible, isolate scope and give code a maintainable architecture.

## Practice

Split a script into three ES modules, add one default export, then inspect the equivalent CommonJS shape.
