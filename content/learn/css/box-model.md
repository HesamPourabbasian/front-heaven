---
title: The Box Model
description: How every element measures its space. Master content, padding, border and margin — the four layers that size the web.
order: 4
difficulty: beginner
category: Layout
estimatedMinutes: 25
prerequisites:
  - learn/css/colors-and-units
---

## Introduction

Every element on a web page is a rectangle. Before any layout system arranges those rectangles — before flexbox, before grid, before positioning — the browser must know how large each one is, and that computation follows one universal algorithm: the **box model**. Four concentric layers surround every element's content: the content itself, padding, border and margin. Understanding how these layers combine is the difference between layouts that "just work" and the hour-long mystery of why a card is 12 pixels too wide.

This lesson teaches the box model from the inside out, the difference between `content-box` and `border-box`, how margins collapse and why, and the practical toolkit — `width`, `min-width`, `max-width` — that every real layout depends on.

## The four layers

Picture any element as an onion with four layers. At the centre is the **content** — the text, the image, the actual substance of the element. Around it, **padding** is the space *inside* the border: it pushes the content away from the edges, giving text breathing room. Around that, the **border** draws the edge of the element. And on the outside, **margin** is the space *between* this element and its neighbours — invisible, but it decides how elements sit relative to each other.

```css
.card {
  width: 300px;
  padding: 20px;        /* space inside the border */
  border: 2px solid #6366f1;
  margin: 16px;         /* space outside the border */
}
```

Reading the geometry: the content area is 300px wide. Padding adds 20px on each side; the border adds 2px on each side. So the element's *outer* width is 300 + 40 + 4 = 344px, and the margin adds 16px of separation from neighbours. Padding is like the cushion inside a picture frame; the border is the frame itself; margin is the gap between the frame and the next frame on the wall.

## The box-sizing revolution

Here is where nearly every beginner's layout breaks. By default — the `content-box` model — `width: 300px` means "the *content* is 300px", so padding and border are *added on top*, making the real element wider than you asked for. This is almost never what you want. The professional fix is a single, famous CSS rule that changes the default for every element:

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

With `border-box`, `width: 300px` means "the *entire* element, including padding and border, is 300px" — the width you specify is the width you get, always. Content shrinks to fit. This is the only sane mental model: you decide the size of the box; padding and border fit inside it. Every modern framework and reset stylesheet applies this rule by default, and you should apply it as the very first rule of your own stylesheets.

## Margin collapse: the surprise rule

Margins behave in a way that shocks everyone the first time. **Vertical margins collapse**: when two elements sit on top of each other, their adjacent margins merge into one — the *larger* of the two wins. Two paragraphs with `margin-bottom: 20px` and `margin-top: 20px` do not get 40px between them; they get 20px. Even more surprising: a child's top margin can collapse *through* its parent, pushing the parent down instead of staying inside it.

```html
<div class="card">
  <h2>Title</h2>
</div>
```

```css
.card { margin-top: 10px; }
.card h2 { margin-top: 24px; }   /* collapses: card moves down 24px */
```

This "margin through the parent" behaviour is why beginners see their parent suddenly shift, or their vertical gaps "not adding up". The practical toolkit: prefer padding on parents for internal spacing, use margin only where you truly want separation, and know that horizontal margins (left/right) never collapse — only vertical ones do. The standard professional spacing strategy is "paddings for containment, margins for separation", plus the collapsible-safe pattern of spacing *one direction* (for example, `margin-top` on every child except the first) rather than both sides.

## Width, min-width and max-width

Alongside the box model, three sizing properties govern widths. `width` sets an element's width. `max-width` caps it — the classic readable-text pattern is `max-width: 65ch` (65 characters), keeping paragraphs comfortable on huge monitors. `min-width` guarantees a minimum. The modern approach: give elements `width: 100%` (or nothing at all) and let `max-width` do the constraining, so the element stays fluid and never overflows.

```css
article {
  width: 100%;
  max-width: 65ch;      /* never wider than ~65 characters */
  margin-inline: auto;  /* centre the box horizontally */
}
```

`margin-inline: auto` is the modern shorthand for centring a block with a max-width — `margin-left: auto; margin-right: auto`. Blocks fill their container's width by default, so a width-limited block must explicitly centre itself; `auto` margins absorb the leftover space symmetrically. And note the shorthand family `margin-inline` / `margin-block` and their padding equivalents: they express "left-right" and "top-bottom" without caring about writing direction, which is the direction modern CSS is moving.

## Padding and margin shorthands

CSS offers four-value shorthands that beginners misread. `padding: 10px 20px` means "10px top-and-bottom, 20px left-and-right". `padding: 10px 20px 30px` means "10 top, 20 sides, 30 bottom". `padding: 10px 20px 30px 40px` means "10 top, 20 right, 30 bottom, 40 left" — **clockwise from the top**. The same rules apply to margins. If the four-value clockwise order trips you up, the modern alternative is equally valid and infinitely clearer: `padding-top: 10px; padding-inline: 20px;` — explicit, readable, and impossible to confuse.

```css
.btn {
  padding: 10px 24px;          /* two-value shorthand */
  margin-block: 8px;           /* 8px top and bottom */
  margin-inline: auto;         /* auto left and right */
}
```

## The height story

Heights deserve their own warning: do not set them. Content is the natural driver of height — an element grows to fit its content, and that is precisely what makes layouts robust. Setting `height: 300px` on a card whose content grows to 400px produces overflow; setting `height: 100%` on a child whose parent has no defined height produces a useless height of zero (percentage heights resolve against the parent's *computed* height). The professional pattern is to set heights only when truly fixed — and even then, prefer `min-height` so content can always grow:

```css
.sidebar {
  min-height: 100dvh;    /* at least screen height, grows with content */
  height: auto;          /* the default — let content decide */
}
```

Everything you set with `width` and `min-width` applies to height analogously; the difference is discipline: width is often fixed by design, height almost always belongs to content.

## Real-world usage

The box model runs under every layout you have ever seen. A card with a title, body and footer: padding inside for breathing room, borders for edges, margins between the grid of cards. A button: padding making it clickable-sized, border rounding its corners. A page container: `max-width` plus auto margins centring it. When you inspect any element in DevTools, the box-model diagram in the Computed panel — content, padding, border, margin as nested rectangles — is this lesson drawn live. Senior developers debug layout issues by reading that diagram first: "the gap is wrong — is it margin collapse? the width is off — is it border-box?"

## Common mistakes

Forgetting the `box-sizing: border-box` reset is mistake number one: widths silently grow with padding, and grids with `gap` misbehave. Setting both `width` and `margin: auto` without a `max-width` — no centring happens, because the element already fills its container. Applying `height: 100%` without a parent height — nothing happens. Double margins on both sides of adjacent elements — collapse gives half the intended gap, so spacing looks inconsistent. Adding padding *to a fixed-width container* — the layout overflows by exactly the padding amount. And the classic: `margin: auto` on a `display: inline` element — auto margins only centre *blocks*; inline elements ignore them.

## Best practices

- Apply `box-sizing: border-box` globally on the very first rule of your stylesheet.
- Use padding for internal space and margin for external separation.
- Space in one direction per context (for example `> * + * { margin-top: 1rem }`) to sidestep collapse.
- Set widths with `width: 100%` + `max-width`, and centre with `margin-inline: auto`.
- Prefer `min-height` over `height`; let content decide heights.
- Read the DevTools box-model diagram before debugging any layout issue.
- Use explicit longhands or two-value shorthands when the four-value order might confuse you.
- Keep spacing on a consistent scale (`4/8/12/16/24`) so the design feels intentional.

## Summary

Every element is four concentric rectangles: content, padding (inside the border), border (the edge) and margin (outside the edge). With `box-sizing: border-box`, declared widths include padding and border, making sizing predictable. Vertical margins collapse to the larger of two adjacent margins — a rule you must design around. Widths come from `width` + `max-width` with auto margins for centring; heights belong to content, so use `min-height` when you must bound them. The box model is the first of the two great layout systems — the second, how boxes get *arranged*, is flexbox and grid.

## Practice

Build a three-card row of cards with `border-box`, padding, borders and `max-width` containers, and add a `gap` between them using margins. Deliberately break it in three ways, then fix each: (1) remove the box-sizing reset and watch widths overflow; (2) give a parent card `height: 200px` and put 300px of content inside — observe the overflow; (3) create two stacked elements with `margin-bottom` and `margin-top` — measure the collapse in DevTools. For each bug, open the Computed panel's box diagram and point at the layer responsible before fixing it.