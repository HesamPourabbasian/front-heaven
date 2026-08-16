---
title: 'Keyed Collections'
description: 'Use Map, WeakMap, Set and WeakSet for lookup, uniqueness and object-associated data.'
order: 15
difficulty: 'intermediate'
category: 'Level 5 - Data Structures'
estimatedMinutes: 30
prerequisites:
  - learn/javascript/data-structures
---

## Map and Set

`Map` stores key-value pairs with keys of any type and predictable insertion order. `Set` stores unique values. Their APIs communicate intent better than using objects as arbitrary dictionaries.

```js
const visits = new Map()
visits.set(user, 1)
const uniqueTags = new Set(['css', 'js', 'js'])
```

`WeakMap` and `WeakSet` hold object keys weakly, allowing garbage collection when no other reference remains. They are useful for private metadata and caches, but are not iterable.

## Summary

Use `Map` for keyed lookup, `Set` for uniqueness, and weak collections when metadata must not keep objects alive.

## Practice

Implement a tag deduplicator with `Set`, a user lookup with `Map`, and a private metadata store with `WeakMap`.
