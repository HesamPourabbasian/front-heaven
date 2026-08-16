---
title: DOM
description: Read and update the document tree with DOM APIs.
order: 20
difficulty: beginner
category: Level 7 - DOM and Browser APIs
estimatedMinutes: 30
prerequisites:
  - learn/javascript/introduction-to-javascript
  - learn/javascript/data-types
---

## DOM APIs

The DOM is the browser's object representation of HTML. Query elements with `querySelector`, read text and attributes, change classes, and create or remove nodes.

```js
const button = document.querySelector('button')
button.textContent = 'Saved'
button.classList.add('is-success')
```

Prefer semantic HTML and `textContent` for untrusted text. Batch changes when possible, and keep DOM access at the edges of your logic so the core remains testable.

## Summary

DOM code translates application state into visible document state. Query narrowly, mutate intentionally and avoid `innerHTML` for untrusted content.

## Practice

Build a list from an array of objects using `createElement`, `textContent` and `append`. Add a remove button to each item.
