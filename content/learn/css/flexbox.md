---
title: 'Flexbox'
description: 'The layout system that ended float-driven hacks. Arrange, align and distribute elements in one dimension with confidence.'
order: 6
difficulty: 'beginner'
category: 'Layout'
estimatedMinutes: 30
prerequisites:
  - learn/css/display-and-position
---

## Introduction

Before flexbox, arranging elements horizontally — a row of buttons, a navbar, a card grid — meant fighting `float` with clearfix hacks and brittle percentage widths. Flexbox changed everything in 2015, and it has been the daily layout tool of front-end development ever since. It is a **one-dimensional** layout system: it lays out a container's children in a single row or a single column, with sophisticated control over sizing, alignment and distribution.

This lesson teaches flexbox the way professionals actually think about it: from the outside in. The container declares `display: flex` and decides the direction; the children (flex items) then respond to a small set of powerful properties. Once you internalise the main axis versus cross axis, every flexbox behaviour — and every flexbox bug — becomes predictable.

## The container: display and direction

Flexbox starts with a single declaration on a container: `display: flex`. Its direct children become *flex items*, and the container gains two new layout powers: the **main axis** (the direction of the row or column) and the **cross axis** (perpendicular to it). The `flex-direction` property chooses the main axis: `row` (left to right, the default), `row-reverse`, `column` (top to bottom), `column-reverse`.

```css
.nav {
  display: flex;
  flex-direction: row;      /* horizontal: main axis = left→right */
  gap: 1rem;
}
```

The one-line `gap` property is worth pausing on: it sets the space between items in both axes, and it finally replaced the margin-hack era (`margin-left: 10px` on everything except the first). Flexbox with `gap` is the cleanest way to space a row or column of items that exists in CSS.

## Wrapping

By default, flex items squeeze onto one line — they shrink, and if they cannot shrink enough, they overflow. The `flex-wrap` property changes that: `flex-wrap: wrap` lets items flow onto multiple lines when the container runs out of space. This single property is what makes navbars, icon rows and card rows degrade gracefully at any screen width.

```css
.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
```

With `wrap`, the row becomes a two-dimensional-ish grid of its own — but note that each wrapped line is independent; flexbox does not align items across different lines the way grid does. If you need rows *and* columns aligned together, that is a signal to reach for CSS Grid, which you will learn next.

## Justify-content: the main axis

`justify-content` distributes items along the main axis. Its values cover every common arrangement: `flex-start` (default, packed to the start), `flex-end` (packed to the end), `center`, `space-between` (first and last flush with edges, equal gaps between), `space-around` (equal space around each item) and `space-evenly` (equal space everywhere). This is the property behind centring a button in a header and the "links spread across the navbar" pattern.

```css
.nav {
  display: flex;
  justify-content: space-between;   /* brand left, links right */
}
```

A crucial detail: `justify-content: center` centres items along the main axis *only when they have spare space to distribute*. If the items are wider than the container, centring causes overflow at both edges — the classic "centred but clipped on mobile" bug. The modern fix is `justify-content: center; margin-inline: auto;` on items, which lets overflow escape safely instead.

## Align-items: the cross axis

`align-items` aligns items along the *cross* axis — perpendicular to the main direction. The values: `stretch` (the default — items fill the cross-axis height, which is why flex items in a row become equal-height columns), `flex-start`, `flex-end`, `center`, and `baseline` (aligning text baselines, ideal for label/input pairs). Vertical centring — for so long the holy grail of CSS — is simply `display: flex; align-items: center` on the container.

```css
.card-header {
  display: flex;
  align-items: center;      /* icon and title vertically centred */
  gap: 0.75rem;
}
```

When a flex container has a height (say `min-height: 400px` for a hero), `align-items: center` centres the children vertically while `justify-content: center` centres them horizontally — together they give you the perfectly centred content block that used to require table displays and negative margins.

## The flex property: sizing the items

Where layout gets interesting is item sizing. Each flex item has a base size (`flex-basis`), a grow factor (`flex-grow`) and a shrink factor (`flex-shrink`) — and the shorthand `flex: grow shrink basis` combines them. The rules of thumb professionals use:

```css
.sidebar { flex: 0 0 260px; }     /* fixed: no grow, no shrink, always 260px */
.content { flex: 1 1 0; }         /* fluid: grow to fill leftover space */
.logo    { flex: 0 1 auto; }      /* natural: never grow, shrink if needed */
```

`flex: 1` (equivalent to `1 1 0`) is the workhorse of fluid layouts: every item with `flex: 1` shares the leftover space equally, so two of them split the container in half and three split it into thirds. `flex: 0 0 260px` pins a sidebar at exactly 260px. Understanding grow/shrink/basis lets you describe any proportional layout — the "70/30 split" is just two items with `flex: 7` and `flex: 3` on a `flex: 1 1 0` basis.

## Align-self and order

Two item-level properties complete the system. `align-self` overrides `align-items` for a single item — one item can be bottom-aligned while its siblings centre. `order` re-arranges items visually without touching the HTML — `order: -1` moves an item to the front. Both are useful, and both should be used sparingly: `align-self` for occasional exceptions, `order` for responsive re-arrangements (like moving a sidebar below content on mobile) where the HTML itself should stay logical.

```css
.cta { align-self: flex-end; }    /* pin this item to the bottom */

/* On mobile, sidebar comes after content visually */
@media (max-width: 768px) {
  .sidebar { order: 2; }
  .content { order: 1; }
}
```

The caveat about `order`: it changes visual order only, not keyboard order or screen-reader order. If the visually-first element is not the DOM-first element, a screen-reader user tabbing through will experience a different sequence than a sighted user — an accessibility hazard. Prefer reordering in the HTML; use `order` for genuinely visual-only tweaks.

## Real-world usage

Flexbox is the default layout of the modern interface. Navbars (brand left, links right, CTA far right) are `space-between` rows. Buttons with icons are `inline-flex` with `align-items: center` and `gap`. Cards with a header, body and footer use `flex-direction: column` with `flex: 1` on the body so footers align across a row of cards. Hover states use `justify-content` and `align-items` changes. Modal centring, tag clouds, form rows, toast stacks, chat bubbles — flexbox is the answer to "how do I lay out a row (or column) of things", which turns out to be most of layout. When you meet frameworks, every component library you use is built on this exact system.

## Common mistakes

The beginner trinity of flexbox bugs: (1) `justify-content` and `align-items` swapped — items centre in the wrong axis because the main axis was forgotten; (2) using `justify-content: center` on a row of overflowing items, which clips them symmetrically instead of allowing scroll — fix with `margin-inline: auto` on the items or `flex-wrap: wrap`; (3) expecting flex to align across multiple wrapped lines — it cannot; that is grid's job. Also common: forgetting that `gap` only spaces *direct* children, applying `flex` properties to the container instead of the items, and setting `width` on flex items without understanding that `flex-basis` controls the main-axis size (in a row, `flex-basis` beats `width`).

## Best practices

- Start every row/column with `display: flex` and `gap` — before any other property.
- Choose `flex-direction` deliberately: `row` for navbars and button groups, `column` for stacked cards.
- Use `flex: 1` for fluid items and `flex: 0 0 <width>` for fixed ones.
- Remember `align-items: center` + `justify-content: center` = the centring tool.
- Use `flex-wrap: wrap` liberally on toolbars and navbars for graceful mobile behaviour.
- Keep `order` and `align-self` rare; they are exceptions, not patterns.
- When items should align across multiple rows, switch to grid.
- Verify main axis vs cross axis in DevTools — the flex inspector draws them for you.

## Summary

Flexbox lays out a container's children along one axis. The container's `flex-direction` picks the main axis; `justify-content` distributes along it, `align-items` aligns across it, and `gap` spaces items. `flex-wrap` allows multiple lines. Items size themselves through `flex-grow`, `flex-shrink` and `flex-basis` — `flex: 1` for fluid shares, `flex: 0 0 Npx` for fixed widths. `align-self` and `order` handle individual exceptions. It is one-dimensional, powerful, and the default answer to row-and-column layout across the modern web.

## Practice

Build a professional-style navbar with `display: flex`, brand on the left and three links plus a button on the right using `space-between` and `gap`. Below it, build a card row: three cards in a `flex` row with `flex: 1` on each, `align-items: stretch` so their heights match, and `flex-direction: column` inside each card with the footer pinned to the bottom via `flex: 1` on the body. Then break one card by giving it `flex: 0 0 300px` and watch the row overflow — add `flex-wrap: wrap` and watch it flow. Finally, open the DevTools flex inspector and hover over each item to see its grow/shrink/basis in action.