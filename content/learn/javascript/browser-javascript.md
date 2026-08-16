---
title: Browser JavaScript
description: Combine browser APIs and event handlers to build interactive page behavior.
order: 21
difficulty: beginner
category: Level 7 - DOM and Browser APIs
estimatedMinutes: 30
prerequisites:
  - learn/javascript/dom
---

## Events and browser APIs

Events represent user and browser activity. Register handlers with `addEventListener`, inspect the event object, and use event delegation when many children share behavior.

```js
document.querySelector('form').addEventListener('submit', event => {
  event.preventDefault()
  console.log(new FormData(event.currentTarget))
})
```

In a traditional event-handler function, `this` is the element on which the listener runs; `event.currentTarget` communicates that relationship more explicitly. Arrow handlers inherit `this` from their surrounding scope, so use `event.currentTarget` instead of expecting the element receiver.

The browser also exposes APIs for storage, timers, location, history, clipboard, media and more. Feature-detect capabilities and account for permissions and asynchronous results.

## Summary

Browser JavaScript is event-driven. Keep handlers small, preserve accessibility, and treat browser APIs as environment-dependent capabilities.

## Practice

Create an event-delegated list and add a keyboard-accessible form handler. Test clicks, Enter, Escape and a missing optional browser API.
