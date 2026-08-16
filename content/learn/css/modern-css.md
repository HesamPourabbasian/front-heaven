---
title: 'Modern CSS Features'
description: 'Master CSS variables (custom properties), CSS nesting, cascade layers (@layer), @supports queries, logical properties, and modern color models (oklch).'
order: 23
difficulty: 'intermediate'
category: 'Level 2 - Intermediate CSS'
estimatedMinutes: 25
prerequisites:
  - /learn/css/images-and-media
---

## 1. CSS Custom Properties (Variables)

Declare reusable design tokens that can be updated at runtime:

```css
:root {
  --primary: #0ea5e9;
  --surface: #ffffff;
  --text: #0f172a;
}

[data-theme="dark"] {
  --surface: #0f172a;
  --text: #f8fafc;
}

.card {
  background-color: var(--surface);
  color: var(--text);
  border: 1px solid color-mix(in srgb, var(--primary) 20%, transparent);
}
```

---

## 2. Native CSS Nesting

Write nested selector blocks directly in vanilla CSS without needing Sass:

```css
.card {
  background: white;
  padding: 1.5rem;

  & .title {
    font-size: 1.5rem;
    font-weight: 700;
  }

  &:hover {
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);

    & .title {
      color: var(--primary);
    }
  }

  @media (min-width: 768px) {
    padding: 2rem;
  }
}
```

---

## 3. Logical Properties (Internationalization)

Replace physical directions (`left`, `right`) with logical writing-mode axes (`inline`, `block`):

```css
/* Physical (breaks in RTL languages like Arabic/Persian/Hebrew) */
.legacy-card {
  margin-left: 1rem;
  padding-top: 2rem;
}

/* Modern Logical (Works universally in LTR and RTL!) */
.modern-card {
  margin-inline-start: 1rem;
  padding-block-start: 2rem;
}
```

---

## Summary & Key Takeaways

- Use CSS variables for design system tokens and runtime theme switching.
- Native CSS nesting simplifies component styling syntax.
- Use logical properties (`inline` and `block`) for bulletproof RTL internationalization.

---

## Practice Challenge

Refactor a component stylesheet using native CSS nesting and CSS custom properties with light/dark mode support.
