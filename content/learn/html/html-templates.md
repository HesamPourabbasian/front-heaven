---
title: 'HTML Templates & Dynamic Content'
description: 'Learn how to use the template element, template content DocumentFragment, and cloneNode for dynamic client-side rendering.'
order: 35
difficulty: 'advanced'
category: 'Level 11 - Advanced HTML'
estimatedMinutes: 20
prerequisites:
  - /learn/html/html-performance
---

## The `<template>` Element

The `<template>` tag is a mechanism for holding client-side HTML that is **not rendered** when the page loads, but can be instantiated and inserted dynamically at runtime using JavaScript.

```html
<!-- Template definition (hidden from layout) -->
<template id="user-card-template">
  <div class="user-card">
    <h3 class="user-name"></h3>
    <p class="user-email"></p>
    <button type="button" class="btn-follow">Follow</button>
  </div>
</template>

<!-- Container where cloned cards will be inserted -->
<div id="user-list" class="grid gap-4"></div>
```

---

## Instantiating Templates with JavaScript

```javascript
const template = document.getElementById('user-card-template');
const container = document.getElementById('user-list');

const users = [
  { name: 'Alex Johnson', email: 'alex@example.com' },
  { name: 'Maria Garcia', email: 'maria@example.com' },
];

users.forEach(user => {
  // Clone the template content (DocumentFragment)
  const clone = template.content.cloneNode(true);
  
  // Populate dynamic data safely with textContent (avoids XSS)
  clone.querySelector('.user-name').textContent = user.name;
  clone.querySelector('.user-email').textContent = user.email;
  
  container.appendChild(clone);
});
```

---

## Summary & Key Takeaways

- `<template>` content is parsed by the browser but not rendered or executed until cloned.
- Cloning with `template.content.cloneNode(true)` creates high-performance DOM fragments.
- Using `textContent` when populating templates protects against Cross-Site Scripting (XSS).

---

## Practice Challenge

Build a dynamic notification toast system using a `<template>` that inserts alert boxes into a container when a button is clicked.
