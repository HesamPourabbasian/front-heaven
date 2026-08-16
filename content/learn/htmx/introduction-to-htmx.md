---
title: 'Introduction to HTMX & Hypermedia'
description: 'Learn HTMX: drive AJAX, WebSockets, and CSS transitions directly in HTML attributes without writing client JavaScript.'
order: 1
difficulty: 'beginner'
category: 'HTMX Fundamentals'
estimatedMinutes: 20
prerequisites:
  - /learn/html/forms
---

## What is HTMX?

**HTMX** gives you access to AJAX, CSS Transitions, WebSockets and Server Sent Events directly in HTML, using attributes.

---

## The Core Attributes

```html
<!-- Issue a GET request on click and replace #result with returned HTML -->
<button hx-get="/api/clicked" hx-target="#result" hx-swap="outerHTML">
  Click Me
</button>

<div id="result">Waiting...</div>
```

---

## Summary & Key Takeaways

- HTMX returns server-rendered HTML fragments rather than JSON.
- Simplifies application architecture by keeping state on the server.
