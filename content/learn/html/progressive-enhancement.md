---
title: 'Progressive Enhancement'
description: 'Build resilient web interfaces: HTML-first development, core functionality without JavaScript, and graceful degradation.'
order: 33
difficulty: 'intermediate'
category: 'Level 10 - HTML Best Practices'
estimatedMinutes: 20
prerequisites:
  - /learn/html/html-validation
---

## What is Progressive Enhancement?

**Progressive Enhancement** is a design strategy that builds web experiences in layers:

1. **Layer 1: Semantic HTML (Content & Core Functionality)** — The page works and provides information on any device, network speed, or browser, even if JavaScript fails.
2. **Layer 2: CSS (Visual Presentation)** — Enhances layout, colors, typography, and responsive aesthetics.
3. **Layer 3: JavaScript (Client-Side Interactivity)** — Enhances user experience with smooth transitions, instant client validation, and dynamic updates.

---

## Real-World Example: Form Submission

```html
<!-- Progressive Enhancement: Works with native HTTP POST if JS fails to load -->
<form id="feedback-form" action="/submit-feedback" method="POST">
  <label for="fb-msg">Your Message:</label>
  <textarea id="fb-msg" name="message" required></textarea>
  <button type="submit">Send Feedback</button>
</form>

<script>
  // Layer 3: If JS is available, hijack submission with AJAX for smooth UX
  const form = document.getElementById('feedback-form');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    // fetch API call...
  });
</script>
```

---

## Summary & Key Takeaways

- Progressive enhancement ensures core content is always accessible.
- Build forms that work with standard HTTP POST before adding JavaScript AJAX.
- Never rely on JavaScript alone for basic navigation or reading content.

---

## Practice Challenge

Build an expandable accordion or disclosure component using the native HTML5 `<details>` and `<summary>` elements that works with 0 lines of JavaScript.
