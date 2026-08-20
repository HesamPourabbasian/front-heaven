---
title: 'Arrays'
description: 'Master JavaScript arrays: creation, indexing, mutation methods (push, pop, shift, unshift, splice), non-mutating methods (slice, concat, join), searching (includes, indexOf), and memory characteristics.'
order: 8
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 30
prerequisites:
  - /learn/javascript/07-strings
---

# Arrays

Arrays in JavaScript are ordered collections of values. In JavaScript, arrays are not primitive data types but high-level, list-like `Object` instances whose prototype (`Array.prototype`) provides an extensive suite of traversal, searching, and mutation methods.

Unlike low-level languages where arrays have fixed sizes and store homogeneous data types in contiguous memory blocks, JavaScript arrays are dynamically resizable and can contain heterogeneous values (numbers, strings, objects, and nested arrays simultaneously). Behind the scenes, modern JavaScript engines optimize dense, single-type arrays into fast contiguous memory vectors while smoothly handling sparse or mixed structures.

In this lesson, we will explore creating arrays, indexing and length mechanics, mutating operations (`push`, `pop`, `shift`, `unshift`, `splice`), non-mutating transformations (`slice`, `concat`, `join`), searching (`includes`, `indexOf`), and array cloning strategies.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        Array Method Categories                         │
├───────────────────────────────────┬────────────────────────────────────┤
│ Mutating Methods (In-Place)       │ Non-Mutating Methods (Pure Copy)   │
├───────────────────────────────────┼────────────────────────────────────┤
│ • .push(val)     (Add to end)     │ • .slice(start, end)               │
│ • .pop()         (Remove from end)│ • .concat(array2)                  │
│ • .unshift(val)  (Add to start)   │ • .join(separator)                 │
│ • .shift()       (Remove start)   │ • .includes(val), .indexOf(val)    │
│ • .splice(start, count, ...items) │ • [...array, newItem] (Spread)     │
└───────────────────────────────────┴────────────────────────────────────┘
```

## Creating Arrays and Indexing

Arrays are commonly created using array literal syntax `[]` or the `Array` constructor. Elements are zero-indexed, meaning the first element resides at index `0` and the final element at index `array.length - 1`.

Like strings, ES2022 introduced `.at()` on arrays to simplify negative index access:

```javascript
// Array literal instantiation
const fruits = ["Apple", "Banana", "Cherry", "Date"];

console.log(fruits.length); // 4
console.log(fruits[0]);     // "Apple"
console.log(fruits.at(-1)); // "Date" (last item)

// Modifying an element by index
fruits[1] = "Blueberry";
console.log(fruits); // ["Apple", "Blueberry", "Cherry", "Date"]
```

## Mutating Arrays: Stack and Queue Operations

JavaScript arrays feature built-in methods that operate directly on the original array in place (mutating the array):

- **`push(...items)`**: Appends one or more elements to the end of the array and returns the new array `.length`.
- **`pop()`**: Removes the final element from the array and returns that element.
- **`unshift(...items)`**: Inserts one or more elements at the beginning of the array (re-indexing all subsequent elements) and returns the new `.length`.
- **`shift()`**: Removes the first element from the array and returns that element.

```javascript
const stack = [];

// Push (LIFO - Last In First Out)
stack.push("Page 1");
stack.push("Page 2");
stack.push("Page 3");

const currentPage = stack.pop();
console.log(currentPage); // "Page 3"
console.log(stack);       // ["Page 1", "Page 2"]

// Queue operations (FIFO - First In First Out)
const queue = ["Customer A", "Customer B"];
queue.push("Customer C");
const served = queue.shift();
console.log(served); // "Customer A"
```

## The Swiss-Army Knife: `splice()`

The `splice()` method is a powerful mutating method capable of simultaneously deleting, replacing, and inserting elements at arbitrary positions within an array.

Syntax: `array.splice(startIndex, deleteCount, ...itemsToAdd)`

It returns an array containing any deleted elements.

```javascript
const items = ["Item 1", "Item 2", "Item 3", "Item 4"];

// Delete 1 item at index 1
const deleted = items.splice(1, 1);
console.log(deleted); // ["Item 2"]
console.log(items);   // ["Item 1", "Item 3", "Item 4"]

// Insert items at index 1 without deleting anything
items.splice(1, 0, "Inserted A", "Inserted B");
console.log(items); // ["Item 1", "Inserted A", "Inserted B", "Item 3", "Item 4"]

// Replace 1 item at index 3
items.splice(3, 1, "Replaced 3");
console.log(items); // ["Item 1", "Inserted A", "Inserted B", "Replaced 3", "Item 4"]
```

## Non-Mutating Methods: `slice()`, `concat()`, and `join()`

In modern reactive frameworks (such as Vue, React, and Svelte), mutating arrays directly can lead to difficult-to-track bugs. Non-mutating methods create new arrays, preserving data integrity:

- **`slice(startIndex, endIndex)`**: Extracts a shallow copy of a portion of an array without modifying the original.
- **`concat(...arraysOrValues)`**: Merges two or more arrays into a new array.
- **`join(separator)`**: Concatenates all array elements into a single string separated by the specified delimiter.

```javascript
const original = [10, 20, 30, 40, 50];

// Non-mutating slice
const subArray = original.slice(1, 4);
console.log(subArray); // [20, 30, 40]
console.log(original); // [10, 20, 30, 40, 50] (Unmodified)

// Non-mutating concat & spread
const merged = original.concat([60, 70]);
const modernMerged = [...original, 60, 70];

// join elements into a formatted string
const breadcrumbs = ["Home", "Products", "Electronics", "Audio"];
console.log(breadcrumbs.join(" > ")); // "Home > Products > Electronics > Audio"
```

## Searching Arrays: `includes()` and `indexOf()`

- **`includes(searchElement, fromIndex)`**: Determines whether an array includes a certain value among its entries, returning `true` or `false`.
- **`indexOf(searchElement, fromIndex)`**: Returns the first index at which a given element can be found in the array, or `-1` if it is not present.

Both methods use strict equality (`===`) for comparisons.

```javascript
const permissions = ["READ", "WRITE", "EXECUTE"];

console.log(permissions.includes("WRITE")); // true
console.log(permissions.includes("DELETE"));// false
console.log(permissions.indexOf("EXECUTE"));// 2
console.log(permissions.indexOf("ADMIN"));  // -1
```

## Summary

JavaScript arrays are dynamic, zero-indexed collections inheriting from `Array.prototype`. Mutating operations like `push`, `pop`, `shift`, `unshift`, and `splice` alter the array in place, while non-mutating operations like `slice`, `concat`, `join`, and spread cloning produce new array copies. For searching, `includes` yields intuitive boolean answers and `indexOf` returns element positions.

## Best Practices

1. **Prefer Non-Mutating Patterns**: In state-driven UI applications, use spread syntax (`[...arr, newItem]`) and `filter`/`slice` rather than mutating `push`/`splice`.
2. **Use `.at(-1)` for the Last Element**: Avoid verbose `arr[arr.length - 1]` syntax in favor of the cleaner `arr.at(-1)`.
3. **Be Mindful of `shift()` / `unshift()` Performance**: On huge arrays (millions of elements), `shift` and `unshift` require re-indexing every element, incurring $O(N)$ overhead compared to $O(1)$ `push`/`pop`.
4. **Use `Array.isArray()` for Validation**: Always verify array inputs using `Array.isArray(data)` before invoking array-specific methods.
5. **Clone Arrays Before Sorting**: Because `.sort()` mutates arrays in place, always clone first (`[...arr].sort()`) or use the modern non-mutating `.toSorted()` method.
