---
title: 'Display & Visibility'
description: 'Master block, inline, inline-block, none, visibility: hidden, opacity, and handling overflow-x/overflow-y.'
order: 7
difficulty: 'beginner'
category: 'Level 1 - Beginner CSS'
estimatedMinutes: 20
prerequisites:
  - /learn/css/box-model
---

## The `display` Property

Controls how an element participates in page layout flow:

| Display Value | Starts on New Line? | Respects Width & Height? | Respects Top/Bottom Margins? |
| :--- | :--- | :--- | :--- |
| **`block`** | Yes | Yes | Yes |
| **`inline`** | No | No | No (horizontal only) |
| **`inline-block`** | No (flows with text) | Yes | Yes |
| **`none`** | Removed from layout | N/A | N/A |

---

## `display: none` vs `visibility: hidden` vs `opacity: 0`

- `display: none`: Completely removes the element from rendering flow. It takes up **zero space** on the page.
- `visibility: hidden`: Hides the element visually, but it **still takes up space** in the layout.
- `opacity: 0`: Makes element transparent, but it still takes up space and remains interactive/clickable.

---

## Handling Content `overflow`

When content exceeds the dimensions of its box:
- `overflow: visible` (default): Content spills outside the box.
- `overflow: hidden`: Clips excess content without scrollbars.
- `overflow: auto`: Adds scrollbars only when content exceeds boundaries.
- `overflow: scroll`: Always displays scrollbars.

```css
/* Horizontal scrolling code block */
pre {
  overflow-x: auto;
  max-width: 100%;
}
```

---

## Summary & Key Takeaways

- Use `inline-block` when you need width/height on inline elements (like buttons).
- `display: none` removes elements from document flow entirely.
- Use `overflow-x: auto` for mobile tables and code blocks.

---

## Practice Challenge

Build a horizontal scrolling tag pill container using `overflow-x: auto` and `white-space: nowrap`.
