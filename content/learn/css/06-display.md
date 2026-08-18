---
title: 'The CSS Display Property & Formatting Contexts'
description: 'Master the CSS display property: block, inline, inline-block, none, flex, grid, table, contents, and the critical differences between display: none and visibility: hidden.'
order: 6
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 25
prerequisites:
  - /learn/css/05-box-model
---

# The CSS Display Property & Formatting Contexts

The `display` property is the most fundamental layout control in CSS. It determines how an element behaves in the normal document flow, how it interacts with sibling elements, and how its direct children are laid out internally.

In this lesson, we explore the primary `display` values: `block`, `inline`, `inline-block`, `none`, `flex`, `grid`, `contents`, and compare `display: none` with `visibility: hidden`.

```text
┌────────────────────────────────────────────────────────────┐
│                    Comparison of Core Display Values       │
├──────────────┬──────────────┬──────────────┬───────────────┤
│ Display Value│ Starts Line? │ Width/Height │ Margin/Pad    │
├──────────────┼──────────────┼──────────────┼───────────────┤
│ `block`      │ Yes (New Ln) │ Fully obeyed │ Fully obeyed  │
│ `inline`     │ No (Flows)   │ Ignored!     │ Horiz. only   │
│ `inline-block`│ No (Flows)  │ Fully obeyed │ Fully obeyed  │
│ `none`       │ Removed DOM  │ N/A          │ N/A           │
│ `contents`   │ Container gone│ Children flow│ Ignored       │
└──────────────┴─────────────────────────────┴───────────────┘
```

## 1. `block` vs `inline` vs `inline-block`

- **`display: block`**: The element starts on a new line and expands horizontally to fill 100% of its parent container. `width`, `height`, and all four margins/paddings are fully respected.
- **`display: inline`**: The element flows horizontally with surrounding text without breaking onto a new line. **Crucial Rule**: `width`, `height`, and vertical `margin-top` / `margin-bottom` are completely ignored on inline elements!
- **`display: inline-block`**: The best of both worlds. The element flows horizontally inline like text, but **fully obeys declared `width`**, `height`, and vertical padding/margin. Perfect for interactive button links and pill badges:

```css
/* Button link styled as inline-block */
a.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  margin-top: 1rem; /* Obeyed because display is inline-block! */
  background-color: #2563eb;
  color: white;
  text-decoration: none;
  border-radius: 0.375rem;
}
```

## 2. Formatting Context Engines: `flex` & `grid`

- **`display: flex`**: Establishes a 1-dimensional Flex formatting context for laying out child elements along a row or column axis.
- **`display: grid`**: Establishes a 2-dimensional Grid formatting context for aligning elements across simultaneous rows and columns.

## 3. The `contents` Value

`display: contents` removes the parent element's visual box from the layout tree completely, promoting its direct child elements to participate directly in the outer formatting context:

```html
<div class="grid-parent" style="display: grid; grid-template-columns: 1fr 1fr;">
  <!-- This wrapper div disappears visually, so Child 1 & Child 2 become direct grid items! -->
  <div class="wrapper" style="display: contents;">
    <div class="child-1">Child 1</div>
    <div class="child-2">Child 2</div>
  </div>
</div>
```

## 4. Hiding Elements: `display: none` vs `visibility: hidden` vs `opacity: 0`

- **`display: none`**: The element is **completely removed from the Render Tree**. It occupies zero physical space, and screen readers ignore it entirely.
- **`visibility: hidden`**: The element is invisible, but **remains in the Render Tree**, preserving its physical width, height, and layout box on screen.
- **`opacity: 0`**: The element is transparent, retains its layout box, and **remains interactive to mouse clicks and keyboard focus**.

```css
/* Accessible visually-hidden utility for screen reader only text */
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

## Summary

- `display: block` creates full-width line-breaking boxes.
- `display: inline` wraps text and ignores declared `width`/`height` and vertical margins.
- `display: inline-block` flows inline while respecting full box-model sizing and padding.
- `display: contents` makes the container box transparent to layout calculations.
- `display: none` removes elements from the Render Tree; `visibility: hidden` retains spatial geometry.

## Best Practices

1. **Use `inline-block` or `inline-flex` for Interactive Badges**: Ensure vertical padding is respected.
2. **Never Use `display: none` for Content Screen Readers Should Hear**: Use `.sr-only` clipping instead.
3. **Use `display: contents` to Avoid Extra DOM Wrapper Layout Issues**: Perfect for framework wrapper components.
4. **Use `display: flex` for 1D Toolbars and `display: grid` for 2D Layouts**: Match the formatting model to the use case.
