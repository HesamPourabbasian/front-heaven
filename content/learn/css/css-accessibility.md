---
title: 'CSS Accessibility (a11y)'
description: 'Design accessible styles: WCAG color contrast ratios, focus-visible states, screen reader utility classes (.sr-only), and reduced motion.'
order: 35
difficulty: 'advanced'
category: 'Level 3 - Advanced CSS'
estimatedMinutes: 25
prerequisites:
  - /learn/css/advanced-typography
---

## CSS Accessibility Rules

Accessibility is not just HTML—CSS plays a massive role in visual and cognitive accessibility.

---

## 1. Accessible Screen Reader Utility (`.sr-only`)

Visually hides text while keeping it fully announced by screen readers:

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

## 2. Color Contrast Ratios (WCAG 2.2 AA)

- **Normal body text**: Minimum **4.5:1** contrast ratio against background.
- **Large text (18pt+ or 14pt bold)**: Minimum **3.0:1** contrast ratio.
- **UI controls & borders**: Minimum **3.0:1** contrast ratio.

---

## 3. Never Hide Keyboard Focus Outlines

```css
/* BAD: Breaks keyboard navigation completely */
*:focus { outline: none; }

/* GOOD: Accessible focus outline for keyboard users */
:focus-visible {
  outline: 2px solid #0ea5e9;
  outline-offset: 3px;
}
```

---

## Summary & Key Takeaways

- Use `.sr-only` for screen-reader-only descriptive text.
- Maintain at least 4.5:1 color contrast on body copy.
- Always provide prominent `:focus-visible` states.

---

## Practice Challenge

Audit a dark theme color palette using an online contrast checker to verify all text passes WCAG AA standards.
