---
title: 'Structured Data'
description: 'Model nested data and move it safely between JavaScript values and JSON text.'
order: 16
difficulty: 'intermediate'
category: 'Level 5 - Data Structures'
estimatedMinutes: 25
prerequisites:
  - learn/javascript/data-types
  - learn/javascript/data-structures
---

## Nested data

Real application data combines arrays and objects: an order has a customer, line items and totals. Destructure only when it keeps access clear, and validate data at API boundaries before using nested properties.

```js
const order = { customer: { name: 'Ada' }, items: [{ price: 10 }] }
const { customer: { name } } = order
```

JSON serializes a useful subset of JavaScript. Dates become strings, functions and `undefined` are omitted, and circular references cannot be serialized. Keep transport data separate from rich domain objects.

## Summary

Structured data is a modeling decision. Make nesting intentional and define how values cross the JSON boundary.

## Practice

Design an order object, serialize it, parse it back, and list every property whose type or value changed.
