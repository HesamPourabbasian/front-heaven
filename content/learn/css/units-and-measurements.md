---
title: 'Units & Measurements'
description: 'Master absolute (px) vs relative (rem, em, %, vw, vh, vmin, vmax, ch) CSS units for responsive, accessible layout scaling.'
order: 4
difficulty: 'beginner'
category: 'Level 1 - Beginner CSS'
estimatedMinutes: 20
prerequisites:
  - /learn/css/colors-and-backgrounds
---

## Absolute vs. Relative Units

- **Absolute Units (`px`, `cm`, `in`, `pt`)**: Fixed physical size. Does not scale when the user changes their browser root font size preference.
- **Relative Units (`rem`, `em`, `%`, `vw`, `vh`, `ch`)**: Scalable units computed relative to parent elements, root font sizes, or viewport dimensions.

---

## The Essential Relative Units

### 1. `rem` (Root EM) — The Standard for Typography & Spacing
Relative to the `font-size` of the root `<html>` element (typically default 16px).
- `1rem = 16px`
- `0.5rem = 8px`
- `1.5rem = 24px`
- `2rem = 32px`

> **Accessibility Rule**: Always use `rem` for typography, padding, and margins so layouts scale when visually impaired users increase default browser font sizes.

### 2. `em` (Element EM)
Relative to the font size of the **immediate parent or current element**. Useful for component padding that scales proportionally with button font size.

### 3. Viewport Units (`vw`, `vh`, `vmin`, `vmax`)
- `100vw`: 100% of the browser window's width.
- `100vh`: 100% of the browser window's height.
- `100dvh`: Dynamic viewport height accounting for mobile address bars!

### 4. Character Unit (`ch`)
Width of the character `0` in the current font. Ideal for limiting paragraph line lengths for optimal readability (`max-width: 65ch`).

---

## Summary & Key Takeaways

- Use `rem` for font sizes, margins, padding, and spacing systems.
- Use `ch` for paragraph line length limits (`60ch - 75ch` is optimal reading measure).
- Use `%` for responsive widths within parent containers.
- Use `px` sparingly (for 1px borders, subtle box shadows).

---

## Practice Challenge

Create an article layout where:
1. Font sizes use `rem` units.
2. Max paragraph width is constrained with `max-width: 65ch`.
3. The hero section fills `min-height: 80vh`.
