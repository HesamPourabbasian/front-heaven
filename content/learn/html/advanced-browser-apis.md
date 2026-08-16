---
title: 'Advanced Browser APIs & HTML'
description: 'Explore HTML integration with Web Storage (localStorage), Geolocation, Intersection Observer, and Drag-and-Drop APIs.'
order: 37
difficulty: 'advanced'
category: 'Level 11 - Advanced HTML'
estimatedMinutes: 25
prerequisites:
  - /learn/html/web-components
---

## Modern Web Platform APIs

HTML works hand-in-hand with browser APIs to build rich desktop-grade web applications.

---

## 1. Web Storage API (`localStorage` & `sessionStorage`)

Stores key-value data persistently in the user's browser:

```javascript
// Persist dark mode theme preference
localStorage.setItem('theme', 'dark');

// Retrieve stored preference
const currentTheme = localStorage.getItem('theme');
```

---

## 2. Intersection Observer API

Detects when an HTML element scrolls into the user's visible viewport (used for scroll animations and infinite scrolling):

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-fade-in');
    }
  });
});

document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
```

---

## 3. HTML5 Drag and Drop API

Make any HTML element draggable using the `draggable="true"` attribute:

```html
<div id="drag-item" draggable="true">Drag Me!</div>

<div id="drop-zone">Drop Here</div>

<script>
const item = document.getElementById('drag-item');
item.addEventListener('dragstart', (e) => {
  e.dataTransfer.setData('text/plain', e.target.id);
});
</script>
```

---

## Summary & Key Takeaways

- Use `localStorage` for long-term client preferences (themes, drafts).
- Use Intersection Observer for high-performance scroll triggers.
- Add `draggable="true"` to enable native drag-and-drop workflows.

---

## Practice Challenge

Build a Kanban card list that persists task reordering to `localStorage` using the Drag and Drop API.
