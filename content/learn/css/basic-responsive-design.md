---
title: 'Basic Responsive Design & Media Queries'
description: 'Understand viewport metadata, mobile-first design philosophy, media queries (@media), common breakpoints, and responsive images.'
order: 11
difficulty: 'beginner'
category: 'Level 1 - Beginner CSS'
estimatedMinutes: 25
prerequisites:
  - /learn/css/basic-css-functions
---

## What is Responsive Web Design?

**Responsive Web Design (RWD)** ensures websites adapt gracefully to any screen size, orientation, and resolution—from 320px smartphones to ultrawide 4K monitors.

---

## The Mobile-First Approach

In **mobile-first** CSS:
1. Write default styles targeting small mobile devices first (simplest single-column layout).
2. Use `min-width` media queries to progressively enhance layout as the screen grows wider.

```css
/* 1. Mobile Default: Single column */
.feature-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

/* 2. Tablet: 2 columns (768px and up) */
@media (min-width: 768px) {
  .feature-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

/* 3. Desktop: 3 columns (1024px and up) */
@media (min-width: 1024px) {
  .feature-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
}
```

---

## Common Responsive Breakpoints

| Device Category | Breakpoint Query |
| :--- | :--- |
| **Small Mobile** | Default styles (< 640px) |
| **Large Mobile / Small Tablet** | `@media (min-width: 640px)` |
| **Tablet** | `@media (min-width: 768px)` |
| **Laptop / Desktop** | `@media (min-width: 1024px)` |
| **Large Desktop** | `@media (min-width: 1280px)` |

---

## Summary & Key Takeaways

- Always build mobile-first using `min-width` media queries.
- Make images responsive using `max-width: 100%; height: auto;`.
- Test responsive designs in Chrome/Firefox Responsive Design Mode.

---

## Practice Challenge

Build a 3-card features section that displays:
1. 1 column on mobile screens.
2. 2 columns on tablet screens (min-width: 768px).
3. 3 columns on desktop screens (min-width: 1024px).
