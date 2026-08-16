---
title: Responsive grids and cards
description: Build card grids that reflow themselves, card components that adapt to any container, and layouts where the grid and the content share one story.
order: 6
difficulty: beginner
category: Layout
estimatedMinutes: 30
prerequisites:
  - learn/css/css-grid
  - learn/responsive-design/fluid-layouts-and-flexible-units
---

## Introduction

Card grids are the workhorse of the modern web — product shelves, blog listings, dashboards, galleries. On desktop they fan out in columns; on phones they stack neatly into one. The interesting part is how little CSS that takes: a well-built grid *reflows itself*, and a well-built card *adapts to whatever column it lands in*. This lesson turns the fluid `minmax()` pattern from the fluid layouts lesson into a complete, professional card system.

## The self-reflowing grid

The grid you met in the fluid layouts lesson is already responsive:

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
}
```

One column on a 320px phone, two or three at tablet widths, four on a desktop — created and destroyed by the browser as space allows, no media queries involved. The `240px` minimum is the card's *floor*: below that width, a card becomes unusable, so the grid would rather start a new row. That floor is a design decision — the minimum width at which your card's content still breathes.

## auto-fill versus auto-fit

The two keywords differ in one subtle, important way:

```css
/* auto-fill: creates as many tracks as fit, even empty ones */
.grid { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }

/* auto-fit: collapses empty tracks, letting cards stretch */
.grid { grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
```

With `auto-fill`, a single card sits at 240px on a wide desktop while empty tracks keep the rhythm. With `auto-fit`, that single card stretches to fill the row. Neither is "right" — product shelves look intentional with `auto-fill` (consistent card widths across rows), while hero sections and some dashboards want `auto-fit` (content expands into available space). Understanding the difference lets you choose deliberately instead of guessing.

## The card that adapts to its column

A grid is only as good as its card. A card is a `flex` or `grid` column that must do three jobs at any width: keep its image proportioned, keep its text readable, and keep its footer anchored to the bottom.

```css
.card {
  display: flex;
  flex-direction: column;
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid var(--border);
}

.card img { width: 100%; aspect-ratio: 16 / 9; object-fit: cover; }

.card-body { display: flex; flex-direction: column; gap: 0.5rem; padding: 1rem; flex: 1; }

.card-footer { margin-top: auto; }
```

The trio of `aspect-ratio` + `object-fit: cover` + `width: 100%` is the modern image solution: the image always fills a 16:9 box regardless of its natural dimensions, cropping to fit instead of distorting or overflowing. `margin-top: auto` on the footer pins it to the card's bottom so all cards in a row align, whatever their text length. `flex: 1` on the body makes that possible — the body absorbs the slack.

## Cards at every size: the layout that responds to its container

A card lives in many contexts: a 4-column grid on desktop, a 2-column grid on tablet, a full-width feature on mobile. The card itself should respond to the space it occupies — and this is exactly the job container queries were built for, which the container queries lesson covers in depth. The preview:

```css
.card-wrap { container-type: inline-size; }

@container (min-width: 400px) {
  .card { flex-direction: row; }
  .card img { width: 40%; aspect-ratio: auto; }
}
```

Inside a narrow container the card stacks vertically — image, then text. Inside a wide container it becomes horizontal — image left, content right. Same card, same markup, adapting to its own context rather than the viewport. Use viewport queries for the grid (how many columns), container queries for the card (how it arranges itself).

## Featured cards and asymmetric layouts

Not every card belongs in an even grid. Feature layouts — hero articles, "most popular" products — deliberately break the rhythm with span:

```css
.featured {
  grid-column: 1 / -1;             /* span the full row */
}

.grid-12 {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem;
}

.grid-12 .featured { grid-column: span 12; }
.grid-12 .half     { grid-column: span 6; }
.grid-12 .third    { grid-column: span 4; }

@media (max-width: 1023px) {
  .grid-12 .half  { grid-column: span 12; }
  .grid-12 .third { grid-column: span 6; }
}
```

A 12-column grid gives you fine-grained control — featured content spanning everything, regular cards in thirds — and on smaller screens the spans collapse. This is the pattern behind most editorial and marketing layouts you have ever admired. Note this is one of the few places a desktop-first `max-width` query is practical: a 12-column scheme is a desktop construct, and collapsing spans downward is simpler than building 12 columns from a 1-column base.

## The card grid's real-world shape

Every shop and dashboard you use runs this exact system: a `minmax()` grid for the shelf, `auto-fit` or `auto-fill` chosen deliberately, cards that pin their footers, images that crop to a consistent ratio, a featured card spanning the row, and container queries shaping each card to its slot. When you next browse a store, look at the shelf with developer eyes: count the columns at your window width, shrink the window, and watch the grid hand off — you are watching `minmax()` at work.

## Common mistakes

Setting a fixed column count (`grid-template-columns: repeat(4, 1fr)`) and letting cards get crushed on tablets instead of using `minmax()`. Forgetting `min-width: 0` on grid items — a card with long unbreakable content (a URL, a code snippet) can force its track wider than `1fr` intends. Using images without `aspect-ratio`, causing layout shift as they load. Making the card's footer hang at different heights because there is no `margin-top: auto` pin. And building the same card twice (one mobile, one desktop) instead of letting it adapt — duplicated markup is duplicated maintenance.

## Best practices

- Use `repeat(auto-fill, minmax(240px, 1fr))` as the default shelf; pick `auto-fit` when you want cards to stretch.
- Design the `minmax` minimum around your card's real content floor.
- Pin card footers with `margin-top: auto` inside a flex-column card.
- Crop images with `aspect-ratio` + `object-fit: cover` — never distort them.
- Let the card respond to its container (container queries), the grid to the viewport.
- Use 12-column grids for featured/asymmetric layouts, collapsing spans at smaller widths.
- Sweep-test every grid from 320px to 1440px, watching for crushed cards and overflow.

## Summary

Responsive card systems run on two cooperating layers: the viewport-level grid — `repeat(auto-fill, minmax(...))` columns that appear and disappear with available space, `auto-fill` or `auto-fit` chosen deliberately — and the container-level card, whose image, body and pinned footer adapt to whatever column it lands in. A featured card spans the row via a 12-column grid, collapsing at small widths. No duplicated markup, no fragile resets: the grid and the card each handle their own kind of responsiveness, and the shelf works at every width by construction.

## Practice

Build a product shelf from scratch: 8 cards in a `minmax(240px, 1fr)` grid with `auto-fill`, each card with a 16:9 cropped image, a title, a description, and a "Buy" button pinned to the bottom. Add one featured card spanning the full row, using a 12-column grid. Then change the grid to `auto-fit` and compare: when the window is wide with few cards, `auto-fill` keeps even widths while `auto-fit` stretches — decide which suits a shop and justify it in a comment. Finally, use container queries so the card's layout flips from vertical to horizontal inside a container wider than 400px — and verify the same card renders both ways when you place the grid in a narrow sidebar versus a wide main column.