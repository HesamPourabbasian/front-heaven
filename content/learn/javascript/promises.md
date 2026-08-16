---
title: 'Promises'
description: 'Model future values with pending, fulfilled and rejected promises.'
order: 26
difficulty: 'intermediate'
category: 'Level 9 - Asynchronous JavaScript'
estimatedMinutes: 30
prerequisites:
  - learn/javascript/callbacks
---

## Promise states

A promise is pending, fulfilled or rejected. `.then` handles fulfillment, `.catch` handles rejection and `.finally` runs either way. Each returns a new promise, enabling composition.

```js
getUser()
  .then(user => getPosts(user.id))
  .then(renderPosts)
  .catch(showError)
```

Use `Promise.all` for independent work, `Promise.allSettled` when every result matters, `Promise.race` for the first result and `Promise.any` for the first fulfillment. Always give rejection a deliberate owner.

## Summary

Promises flatten asynchronous sequences and make success and failure explicit.

## Practice

Run the same three operations with `Promise.all`, `allSettled`, `race` and `any`; record what happens when one rejects.
