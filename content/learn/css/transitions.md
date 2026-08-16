---
title: 'CSS Transitions'
description: 'Master smooth state transitions: transition-property, transition-duration, transition-timing-function (cubic-bezier), delay, and hover states.'
order: 18
difficulty: 'intermediate'
category: 'Level 2 - Intermediate CSS'
estimatedMinutes: 20
prerequisites:
  - /learn/css/pseudo-elements
---

## What is a CSS Transition?

Transitions enable smooth, gradual property changes over time when an element changes state (e.g. on `:hover`, `:focus`, or class toggling).

---

## Transition Properties

```css
.button {
  background-color: #0ea5e9;
  color: #ffffff;
  transform: translateY(0);

  /* Transition properties */
  transition-property: background-color, transform, box-shadow;
  transition-duration: 200ms;
  transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1); /* Custom ease */
  transition-delay: 0ms;
}

/* Shorthand */
.button {
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.button:hover {
  background-color: #0284c7;
  transform: translateY(-2px);
}
```

---

## Performance: What to Animate

> **Performance Rule**: For 60 FPS / 120 FPS hardware-accelerated animations, **only animate `transform` and `opacity`**. Avoid animating layout properties like `width`, `height`, `top`, `left`, or `margin`, as they cause expensive layout reflows!

---

## Summary & Key Takeaways

- Always declare `transition` on the base rule, not just on the `:hover` rule, so the transition animates smoothly both on hover enter and hover leave.
- Specify exact properties (`transition: transform 0.2s`) rather than `transition: all`.
- Animate `transform` and `opacity` for GPU-accelerated performance.

---

## Practice Challenge

Build an interactive card that smoothly scales up (`transform: scale(1.03)`) and elevates its `box-shadow` on hover.
