---
title: 'HTML Accessibility Fundamentals'
description: 'Master web accessibility (a11y) essentials: POUR principles, screen reader testing, keyboard navigation, and semantic foundations.'
order: 24
difficulty: 'beginner'
category: 'Level 8 - Accessibility'
estimatedMinutes: 25
prerequisites:
  - /learn/html/generic-containers
---

## What is Web Accessibility (a11y)?

**Web Accessibility** means ensuring that websites and digital tools are designed and developed so that people with disabilities can perceive, understand, navigate, and interact with them effectively.

---

## The Four POUR Principles (WCAG 2.2)

1. **Perceivable**: Information must be presentable to users in ways they can perceive (e.g., text alternatives for images, captions for audio).
2. **Operable**: Interface components must be operable via keyboard alone without requiring a mouse.
3. **Understandable**: Information and UI operations must be clear, predictable, and readable.
4. **Robust**: Content must be compatible across a wide variety of user agents, modern browsers, and assistive technologies.

---

## Keyboard Navigation & Focus

Many users with motor disabilities navigate entirely using the **Tab** key, Enter, Space, and Arrow keys:

```html
<!-- GOOD: Native interactive elements have built-in keyboard accessibility -->
<button type="button" onclick="openModal()">Open Modal</button>
<a href="/login">Log In</a>

<!-- BAD: <div> has no keyboard focus or screen reader announcement -->
<div class="custom-btn" onclick="openModal()">Open Modal</div>
```

### Managing Tab Order with `tabindex`
- `tabindex="0"`: Places an element into the normal natural tab order.
- `tabindex="-1"`: Removes element from tab order, but allows programmatic focus via JavaScript (`element.focus()`).
- *Avoid positive values* (`tabindex="1"`): Alters natural reading order and confuses screen readers.

---

## Summary & Key Takeaways

- Semantic HTML is the number one foundation of web accessibility.
- Always use native `<button>` and `<a>` tags for interactive triggers.
- Ensure all interactive controls are fully navigable using only the keyboard.

---

## Practice Challenge

Audit a web page using only your keyboard:
1. Unplug or disable your mouse.
2. Navigate the page using only Tab, Shift+Tab, Enter, and Space.
3. Check if every button and link displays a visible focus outline.
