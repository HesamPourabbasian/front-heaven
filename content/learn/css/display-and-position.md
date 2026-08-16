---
title: 'Display and Position'
description: 'Control how boxes flow and where they sit. Master block and inline behavior, and the five position modes that place elements.'
order: 5
difficulty: 'beginner'
category: 'Layout'
estimatedMinutes: 25
prerequisites:
  - learn/css/box-model
---

## Introduction

The box model tells you how large an element is; the `display` and `position` properties tell you how it *behaves*. Every element has a default `display` that determines whether it flows like a paragraph or sits inline with text, and every element can be `position`ed to sit exactly where a design demands. These two properties — plus their modern companions `flex` and `grid`, covered in the next lessons — are the complete vocabulary of CSS layout.

This lesson teaches the flow-based layout system: block versus inline behaviour, the `display` family, and the five `position` values. Understanding flow first matters because flexbox and grid are *replacements* for flow — and you can only appreciate what replaces something by understanding what it replaces.

## Block and inline: the two default personalities

Every element is born with a `display` value, and the two originals are `block` and `inline`. A **block** element — `div`, `p`, `h1`, `ul`, `section`, `article` — is a full-width rectangle: it starts on a new line and pushes everything after it to a new line. Blocks stack vertically like boxes in a warehouse. An **inline** element — `span`, `a`, `strong`, `em`, `code` — is a word inside a line of text: it does not start a new line, it flows with the surrounding text, and it ignores `width`, `height` and vertical margins.

```html
<p>This is a <span class="highlight">block</span> paragraph with an inline element inside.</p>
```

The `<span>` sits inside the sentence because it is inline; the `<p>` pushes to the next line because it is block. This distinction explains the most common beginner bewilderment: "why is my `width` doing nothing?" — because the element is `inline`, and inline elements ignore width and height entirely. The answer is almost always `display: inline-block`, which combines the best of both: it respects width, height and margins *while* flowing inline.

```css
.btn {
  display: inline-block;
  width: 140px;
  padding: 10px 16px;
  vertical-align: middle;
}
```

## The display family

Modern `display` has grown far beyond block and inline. The value can take two parts — an outer role (block or inline) and an inner role (flow, flex, grid): `display: inline-flex` means "an inline-level element whose children are laid out with flexbox". The main values you will use are:

```css
display: block;            /* full-width box, stacked */
display: inline;           /* flows inside text */
display: inline-block;     /* inline position, block sizing */
display: none;             /* removed entirely — no space */
display: flex;             /* children laid out in a flexible row/column */
display: grid;             /* children laid out on a grid */
display: inline-flex;      /* inline-level flex container */
```

Two notes. First, `display: none` removes the element completely — no space, no visibility; the *different* `visibility: hidden` keeps the space but hides the box, and `opacity: 0` keeps everything and just fades it. Knowing which one you want — gone, hidden-but-present, or faded — prevents real bugs. Second, `display` only styles the element's own box; flexbox and grid are properties of the *container* that rearrange its *children*. You will meet both systems in the next two lessons; here, keep the distinction: `display` is about a box's role in the flow.

## Position: static and relative

The `position` property has five values, and four of them are simple once you know the mental model. `position: static` is the default: the element stays exactly where flow puts it, and `top`/`right`/`bottom`/`left` do nothing. `position: relative` keeps the element in the flow but lets you nudge it with offsets — `top: 4px` moves it 4px down from where it would have been. Critically, `relative` also becomes the **positioning context** for absolutely-positioned descendants: an element with `position: relative` is the "containing block" that its absolute children will anchor to.

```css
.badge {
  position: relative;
  top: -2px;               /* nudge up 2px, keeping its flow space */
}
```

Relative positioning is the gentle tool: a small correction, a stacking context, or an anchor for what comes next. It never rearranges neighbours because the element keeps its original space — the visual shift is just a translation.

## Position: absolute

`position: absolute` removes the element from the flow entirely — its space disappears and siblings close over it — and then places it relative to its nearest *positioned* ancestor (an ancestor with `relative`, `absolute` or `fixed`), or the page if none exists. This is the power tool for overlays: badges pinned to card corners, tooltips floating over content, dropdowns, modals.

```html
<div class="card">
  <span class="badge">New</span>
</div>
```

```css
.card {
  position: relative;
}
.badge {
  position: absolute;
  top: 8px;
  right: 8px;
}
```

The `.card` is `relative` so it becomes the anchor; the `.badge` is pulled out of the flow and pinned 8px from the top-right corner of the card. Without the `relative` on the card, the badge would anchor to the next positioned ancestor — or the page — which is the classic "why is my badge in the wrong corner" bug. The rule to remember: **absolute children belong to relative parents.** If you never set `position: relative` on the container, absolute positioning will hunt for a context and often find the wrong one.

## Position: fixed and sticky

`position: fixed` removes the element from the flow and anchors it to the *viewport* — the visible window. It stays put while the page scrolls: this is how navbars, floating action buttons and cookie banners work. `position: sticky` is the hybrid genius: the element behaves normally in the flow, but once scrolling reaches its `top` offset, it "sticks" — freezing in place until its container scrolls past. Sticky is how table headers and section labels stay visible, and it needs only a `top` value and a parent that is taller than it.

```css
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.section-label {
  position: sticky;
  top: 0;               /* sticks once it reaches the top */
}
```

Both create stacking contexts and both remove elements from consideration for layout — so a fixed navbar overlays content unless you give the content top padding or margin equal to the navbar height. The `z-index` property decides which overlapping element paints on top; it only matters between positioned elements (or flex/grid children), and higher values win.

## The stacking context

When positioned elements overlap, `z-index` resolves who is visible — but the resolution happens inside **stacking contexts**. A positioned element with a `z-index`, an element with `opacity` less than 1, `transform`, `filter` or `will-change` each creates its own mini-layering world: children of a stacking context cannot leap above siblings of their parent. This explains the infamous bug "my modal is behind the navbar even though its z-index is huge": the modal lives inside a stacking context that is itself below the navbar.

```css
/* The dropdown's huge z-index cannot escape the card's context */
.card { position: relative; z-index: 1; }        /* context */
.dropdown { position: absolute; z-index: 9999; } /* trapped inside */
```

The practical lessons: keep `z-index` values modest (10s, not 10,000s), avoid stacking contexts you did not intend (be careful with `transform` on layout ancestors), and when something refuses to come to the front, ask which stacking context is holding it prisoner rather than escalating the `z-index` arms race.

## Real-world usage

Positioning powers the floating web: sticky headers that compress on scroll, sticky table headers, fixed live-chat buttons, absolute-positioned notification badges, tooltips, dropdown menus and modals. Modern apps lean heavily on `sticky` for section navigation and on `absolute` inside `relative` for overlay composition. And `display` choices run through everything: `inline-block` for icon-in-button layouts, `display: none` for tabs and accordions, `inline-flex` for pill buttons with icons. When you move to flexbox and grid next, remember that positioning is still the tool for *overlay* situations — flexbox and grid are for *flow* arrangements.

## Common mistakes

The top five position mistakes are: absolute positioning without a relative parent (badges fleeing to the wrong corner); `z-index` escalation to escape a stacking context that cannot be escaped; fixed elements covering content (forgetting to reserve space with padding); `height: 100%` chains that collapse (fixed and absolute need explicit dimensions); and `position: sticky` silently failing because a parent has `overflow: hidden` — overflow clips the sticky's tracking. On the display side: `width` on inline elements doing nothing, and `display: none` versus `visibility: hidden` confusion. And the eternal one: setting `position: absolute` on a hero's child expecting it to respect the hero's width — it does not; absolute elements size to their content.

## Best practices

- Give absolute children a `relative` (or positioned) parent — always.
- Reserve space for `fixed` elements, or pad content accordingly.
- Use `sticky` instead of `fixed` whenever the element should travel with its section.
- Keep `z-index` small and consistent; investigate stacking contexts before escalating.
- Remember `overflow` on ancestors breaks sticky — check it when sticky "doesn't work".
- Prefer `inline-block` or `inline-flex` for inline elements that need sizing.
- Use `display: none` for truly-removed content, `visibility` for hidden-but-present, `opacity` for visual fades.
- Verify your layering with DevTools' layer and z-index inspection tools.

## Summary

`display` decides a box's role in the flow: block elements stack full-width, inline elements flow inside text, and the flex/grid variants hand layout over to their children. `position` decides a box's relationship to its context: `static` is flow, `relative` is nudge-and-anchor, `absolute` is removed-from-flow and pinned to a positioned ancestor, `fixed` is viewport-anchored, and `sticky` is flow-until-scrolled. `z-index` resolves overlaps inside stacking contexts. Together they compose every overlay, header and badge in the modern web.

## Practice

Build a product-card with three positioned elements: a `relative` container, an `absolute` "New" badge in the top-right corner, and a `sticky` price label that stays visible as the card content scrolls (make the card tall enough). First, deliberately omit `position: relative` on the container and observe where the badge lands — then fix it. Add a fixed bottom bar to the page and give the main content enough bottom padding that nothing hides behind it. Finally, create a stacking-context experiment: two overlapping boxes with `z-index: 1` and `z-index: 2`, then wrap the higher one in an element with `opacity: 0.99` and watch the context trap it.