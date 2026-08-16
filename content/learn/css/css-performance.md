---
title: 'CSS Performance & Rendering Pipeline'
description: 'Optimize CSS rendering: critical rendering path, layout reflow vs repaint, GPU compositing (will-change), and eliminating unused CSS.'
order: 36
difficulty: 'advanced'
category: 'Level 3 - Advanced CSS'
estimatedMinutes: 25
prerequisites:
  - /learn/css/css-accessibility
---

## The Browser Rendering Stages

1. **Recalculate Style**: Match selectors and compute CSS values.
2. **Layout (Reflow)**: Calculate geometry and box coordinates (Expensive!).
3. **Paint (Repaint)**: Fill pixels, borders, backgrounds (Moderate).
4. **Composite**: Assemble GPU layers onto the screen (Super fast!).

---

## Reflow Triggers vs. Composite Triggers

| Property Changed | Triggers Reflow? | Triggers Repaint? | Triggers Composite? | Performance Cost |
| :--- | :--- | :--- | :--- | :--- |
| `width`, `height`, `margin`, `top`, `left` | **YES** | **YES** | **YES** | 🔴 Expensive |
| `background-color`, `color`, `box-shadow` | No | **YES** | **YES** | 🟡 Moderate |
| **`transform`**, **`opacity`** | **No** | **No** | **YES** | 🟢 Blazing Fast (GPU) |

---

## The `will-change` Property

Promotes an element to its own GPU composite layer before animation starts:

```css
/* Use sparingly on actively animated elements only */
.sliding-drawer {
  will-change: transform;
}
```

> **Warning**: Overusing `will-change` consumes excessive GPU memory. Only apply it to elements with active or frequent animations!

---

## Summary & Key Takeaways

- Animate `transform` and `opacity` exclusively for smooth 60fps animations.
- Avoid animating `height`, `width`, or `top`/`left`.
- Remove unused CSS using tools like PurgeCSS or Tailwind JIT.

---

## Practice Challenge

Refactor a jerky `top/left` animation into a smooth GPU-accelerated `transform: translate()` animation.
