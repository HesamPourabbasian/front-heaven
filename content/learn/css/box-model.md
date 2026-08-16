---
title: 'The CSS Box Model'
description: 'Understand content, padding, border, margin, box-sizing: border-box, width, height, min-width, and max-width.'
order: 6
difficulty: 'beginner'
category: 'Level 1 - Beginner CSS'
estimatedMinutes: 20
prerequisites:
  - /learn/css/typography
---

## The Four Layers of the Box Model

Every visible HTML element is rendered as a rectangular box composed of four concentric layers:

1. **Content**: The inner area where text, images, or child elements render.
2. **Padding**: Transparent space surrounding the content inside the border.
3. **Border**: The frame wrapping the padding and content.
4. **Margin**: Transparent space outside the border separating this element from neighbors.

---

## `box-sizing: content-box` vs. `border-box`

- **`content-box` (Browser Default)**: The declared `width` and `height` apply *only* to the content. Adding padding and border makes the element physically wider on screen!
- **`border-box` (Modern Standard)**: The declared `width` and `height` include content, padding, and border.

```css
/* Universal Border-Box Reset (Recommended on EVERY website) */
*, *::before, *::after {
  box-sizing: border-box;
}
```

---

## Width and Height Constraints

- `width: 100%`: Takes up full parent container width.
- `max-width: 1200px`: Prevents the container from stretching too wide on massive displays.
- `margin: 0 auto`: Centers a block element horizontally with a defined max-width.

```css
.container {
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 1.5rem;
}
```

---

## Margin Collapsing

When two vertical block margins touch, they **collapse** into a single margin equal to the larger of the two values (horizontal margins never collapse).

---

## Summary & Key Takeaways

- Always apply `box-sizing: border-box` universally in your CSS reset.
- Padding sits inside the border; margin sits outside the border.
- Center fixed or max-width block containers using `margin: 0 auto`.

---

## Practice Challenge

Build a centered card component with:
1. `max-width: 450px` centered with `margin: 2rem auto`.
2. `padding: 1.5rem` on the inside.
3. A 1px border and custom border radius.
