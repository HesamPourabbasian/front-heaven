---
title: 'Advanced CSS Variables & Theming'
description: 'Master global design tokens, dynamic CSS variables, fallback chains, type-checked @property custom properties, and dark mode architecture.'
order: 29
difficulty: 'advanced'
category: 'Level 3 - Advanced CSS'
estimatedMinutes: 25
prerequisites:
  - /learn/css/cascade-and-specificity
---

## Design Token Architecture with CSS Variables

Professional design systems establish a tiered variable architecture:

1. **Tier 1: Global Primitive Tokens** (Raw color palettes, spacing units)
2. **Tier 2: Semantic Theme Tokens** (Surface, text, border, primary action)
3. **Tier 3: Component-Scoped Tokens** (Button padding, modal width)

```css
:root {
  /* Primitive */
  --color-blue-500: #0ea5e9;
  --color-slate-900: #0f172a;
  --color-slate-50: #f8fafc;

  /* Semantic Light */
  --bg-app: var(--color-slate-50);
  --text-main: var(--color-slate-900);
  --btn-primary-bg: var(--color-blue-500);
}

[data-theme="dark"] {
  /* Semantic Dark Override */
  --bg-app: var(--color-slate-900);
  --text-main: var(--color-slate-50);
}
```

---

## Type-Checked CSS Properties with `@property`

`@property` allows CSS variables to declare types, initial values, and inherit behavior, making them **animatable**!

```css
@property --gradient-angle {
  syntax: "<angle>";
  inherits: false;
  initial-value: 0deg;
}

.animated-border {
  background: conic-gradient(from var(--gradient-angle), #0ea5e9, #8b5cf6, #0ea5e9);
  animation: rotateAngle 3s linear infinite;
}

@keyframes rotateAngle {
  to {
    --gradient-angle: 360deg;
  }
}
```

---

## Summary & Key Takeaways

- Separate primitive tokens from semantic contextual tokens.
- Use `@property` to register type-safe, animatable custom properties.
- Implement theme switching by updating semantic CSS variables under `[data-theme="dark"]`.

---

## Practice Challenge

Build a rotating rainbow gradient card border using an animatable `@property --angle <angle>` rule.
