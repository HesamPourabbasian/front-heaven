---
title: 'Advanced Responsive Design'
description: 'Master advanced media queries, container queries intro, fluid sizing with clamp(), mobile-first vs desktop-first architectures, and responsive typography.'
order: 15
difficulty: 'intermediate'
category: 'Level 2 - Intermediate CSS'
estimatedMinutes: 25
prerequisites:
  - /learn/css/css-grid
---

## Beyond Basic Breakpoints

Modern responsive design is about building components that adapt to their parent container and device capabilities, rather than relying solely on global screen widths.

---

## Modern Media Query Syntax (Range Syntax)

Modern CSS supports mathematical comparison operators in media queries:

```css
/* Modern Range Syntax */
@media (width >= 768px) and (width <= 1200px) {
  .sidebar { display: block; }
}

/* Equivalent to legacy: (min-width: 768px) and (max-width: 1200px) */
```

---

## Media Queries for User Preferences

```css
/* Dark Mode Preference */
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0f172a;
    --text: #f8fafc;
  }
}

/* Reduced Motion (Accessibility) */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

/* Touch vs Mouse Pointer Capability */
@media (hover: hover) and (pointer: fine) {
  /* Enhanced hover states for desktop mouse users only */
  .card:hover {
    transform: translateY(-4px);
  }
}
```

---

## Summary & Key Takeaways

- Use modern range syntax (`width >= 768px`) for clean queries.
- Always support `prefers-reduced-motion` for accessibility.
- Check `@media (hover: hover)` to avoid sticky hover states on mobile touchscreens.

---

## Practice Challenge

Implement a theme-aware, motion-sensitive card component that disables animations if the user has requested reduced motion.
