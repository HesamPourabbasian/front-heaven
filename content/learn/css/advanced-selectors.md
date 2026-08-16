---
title: 'Advanced Selectors & Modern Pseudo-Classes'
description: 'Master complex selector combinations, advanced :has() patterns, :is(), :where(), :not(), and attribute selector patterns.'
order: 27
difficulty: 'advanced'
category: 'Level 3 - Advanced CSS'
estimatedMinutes: 25
prerequisites:
  - /learn/css/advanced-layout
---

## Deep Dive: Advanced `:has()` Patterns

The `:has()` relational selector is the most transformative addition to CSS in a decade:

```css
/* 1. Target parent article only if it contains a featured badge */
article:has(.badge--featured) {
  border-color: #0ea5e9;
  box-shadow: 0 10px 25px -5px rgba(14, 165, 233, 0.15);
}

/* 2. Style next sibling based on preceding checked checkbox */
body:has(#mobile-menu-toggle:checked) {
  overflow: hidden; /* Prevent background scroll when mobile drawer is open */
}

/* 3. Empty state styling when list has no <li> items */
ul:not(:has(li)) {
  display: none;
}
```

---

## Specificity Control: `:is()` vs. `:where()`

- `:is(.a, #b, .c)`: Adopts the specificity of its **most specific argument** (here, `#b` = ID specificity).
- `:where(.a, #b, .c)`: Always has **zero (0,0,0) specificity**, allowing easy overrides without cascade battles.

```css
/* Zero-specificity baseline styles */
:where(h1, h2, h3, h4) {
  margin-block-end: 0.75rem;
  font-weight: 700;
}
```

---

## Summary & Key Takeaways

- Use `:has()` for conditional parent styling and layout adjustments based on dynamic child states.
- Use `:where()` for design system component defaults that must remain easily overridable.
- Combine `:not()` and `:has()` for powerful conditional UI logic in pure CSS.

---

## Practice Challenge

Build an accordion group where opening one item applies a muted opacity to all non-hovered sibling items using `:has()`.
