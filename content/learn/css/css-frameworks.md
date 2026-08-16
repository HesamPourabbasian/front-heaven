---
title: 'CSS Frameworks & Tailwind CSS'
description: 'Understand CSS frameworks: utility-first (Tailwind CSS), component libraries (Bootstrap), custom theme configuration, and when NOT to use frameworks.'
order: 40
difficulty: 'advanced'
category: 'Level 3 - Advanced CSS'
estimatedMinutes: 25
prerequisites:
  - /learn/css/css-preprocessors-and-tooling
---

## The Modern CSS Framework Landscape

### 1. Utility-First (Tailwind CSS)
Instead of writing custom class names, you compose low-level utility classes directly in HTML:

```html
<div class="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md">
  <img class="size-12 rounded-full" src="avatar.jpg" alt="User avatar" />
  <div>
    <h4 class="text-base font-bold text-slate-900">Hesam</h4>
    <p class="text-xs text-slate-500">Frontend Engineer</p>
  </div>
</div>
```

### 2. Component-Based (Bootstrap)
Pre-styled, ready-to-use component classes (`.btn`, `.modal`, `.navbar`).

---

## When to Use vs. When NOT to Use Frameworks

- **Use Tailwind / Frameworks**: Fast-paced product teams, design system consistency, eliminating dead CSS.
- **Write Pure Vanilla CSS**: Learning fundamentals, lightweight micro-sites, custom creative agency animations, high-performance canvas/WebGL styling.

---

## Summary & Key Takeaways

- Frameworks accelerate prototyping and team alignment.
- Always master Vanilla CSS foundations first before relying on frameworks.

---

## Practice Challenge

Build a responsive user profile card using Tailwind CSS utility classes.
