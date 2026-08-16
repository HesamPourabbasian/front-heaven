---
title: 'CSS Grid'
description: 'Two-dimensional layout, done right. Master grid tracks, areas and placement to build the layouts flexbox cannot.'
order: 7
difficulty: 'beginner'
category: 'Layout'
estimatedMinutes: 30
prerequisites:
  - learn/css/flexbox
---

## Introduction

Flexbox is one-dimensional: it lays out items along a row *or* a column. CSS Grid is two-dimensional: it lays out items in **rows and columns at the same time**, with control over both dimensions simultaneously. Where flexbox is the tool for navbars and button groups, grid is the tool for page skeletons, card galleries, dashboards and any layout that is genuinely a grid — which turns out to be most of the web's structure.

Grid's learning curve is different from flexbox's. Flexbox asks you to think about axes; grid asks you to think about *tracks* — the rows and columns of an invisible table you define — and then *places* items onto it. This lesson builds that model: the container declares `display: grid`, defines tracks with `grid-template`, and children position themselves with placement properties or names. By the end, you will be able to build a complete page skeleton with grid and know exactly when to reach for it.

## The container: tracks

`display: grid` turns an element into a grid container. Its direct children become grid items, and the container's grid is defined by its **tracks**: columns with `grid-template-columns` and rows with `grid-template-rows`. The simplest grids list a size per track:

```css
.gallery {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;   /* three equal columns */
  gap: 1rem;
}
```

Here `1fr` is the grid unit: one *fraction* of the remaining space. Three `1fr` columns split the container into three equal widths; `2fr 1fr` makes the first column twice as wide as the second. Fractions are why grid is so good at proportional layouts — no percentages, no math, the browser divides the space.

## The repeat function and minmax

Real layouts need more than three hand-typed columns. The `repeat()` function generates many tracks from a pattern: `repeat(12, 1fr)` builds a twelve-column grid — the classic 12-column layout system used by Bootstrap and every CSS framework that followed. And `minmax(min, max)` makes tracks *flexible between limits* — the workhorse of responsive grids:

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
}
```

Read this aloud: "Create as many columns as fit, each at least 240px wide, sharing the leftover space equally." This one line produces a card gallery that shows one column on a phone, two on a tablet and four on a desktop — *with zero media queries*. The browser counts how many 240px-minimum columns fit and distributes the space. `auto-fill` creates as many tracks as fit even if empty; `auto-fit` collapses empty tracks so items stretch to fill the row. The `minmax(240px, 1fr)` card-grid pattern is the most used grid recipe in existence.

## Placement: where items go

By default, grid items flow into tracks automatically — first item in the first cell, and so on, filling row by row. But grid's real power is *explicit placement*: you decide exactly which cell an item occupies. Placement uses line numbers — the edges between tracks are numbered from 1 — with the `grid-column` and `grid-row` properties:

```css
.sidebar { grid-column: 1 / 2; }        /* column lines 1 to 2 */
.content { grid-column: 2 / 4; }        /* spans columns 2 and 3 */
.banner  { grid-column: 1 / -1; }       /* full width: line 1 to the last line */
```

`1 / -1` is the beloved "span everything" idiom: from the first line to the *last* line, whatever the count. An item can span tracks (`grid-column: 1 / 3` occupies two columns) and the `span` keyword reads naturally too: `grid-column: span 2` means "occupy two columns, wherever you land". Placement gives you magazine-style layouts — a hero spanning the full width, a sidebar spanning the full height, features arranged in deliberate patterns.

## Named areas: the readable layout

Line-number placement is powerful but hard to read. **Named areas** fix that by giving regions names and describing the whole layout in one grid. The container names its areas with `grid-template-areas`; each item declares which area it belongs to with `grid-area`:

```css
.page {
  display: grid;
  grid-template-columns: 260px 1fr;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  min-height: 100dvh;
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }
```

The ASCII-art diagram *is* the layout: a header across both columns, a sidebar and main content underneath, a footer across both at the bottom. Reading the template — dots mean empty cells — tells you the entire page structure at a glance. This is the professional pattern for page skeletons: define the areas once, and the layout is both executed and documented.

## Auto rows and the implicit grid

Grid has a second, hidden system: the **implicit grid**. When items overflow the tracks you defined — or when rows are not declared at all — the browser creates implicit rows automatically, sized by the `grid-auto-rows` property. This is why you can write `grid-template-columns` alone and still get a working grid: rows appear as needed.

```css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  grid-auto-rows: minmax(160px, auto);   /* implicit rows: at least 160px */
  gap: 1rem;
}
```

The `auto` keyword inside `minmax` is important: it lets a track grow to fit its content. `minmax(160px, auto)` says "at least 160px tall, but never clip content". `grid-auto-flow: dense` is the bonus knob — it back-fills gaps so the gallery stays tight — at the cost of visual order, so use it when item order is not sacred.

## Grid versus flexbox: choosing

The eternal question: grid or flexbox? The professional answer is short: **flexbox for one dimension, grid for two.** If you are arranging a row or column — navbars, button groups, stacks — flexbox. If items must align across both rows and columns — galleries, page skeletons, dashboards — grid. The two coexist constantly: a grid skeleton with flexbox inside each cell, a flex navbar wrapping a grid dropdown. The rule of thumb used by layout experts: if your content is a sequence, flexbox; if your layout is a structure, grid.

```css
/* Page skeleton: grid */
.page { display: grid; grid-template-areas: "sidebar main"; }

/* Inside a card: flex column */
.card-body { display: flex; flex-direction: column; }
```

Grid can technically do everything flexbox does — with `display: contents` and single-column templates — but "technically can" is not "idiomatically should". A single-row flexbox is clearer than a one-row grid; a multi-line wrap (flex with `flex-wrap`) that must also align across lines is a grid. You will see hybrid code everywhere — that is not indecision, it is the correct division of labour.

## Real-world usage

Grid powers the skeletons of the modern web: documentation sites (sidebar + content), app dashboards (stat cards + chart + activity feed), admin panels, image galleries, pricing-page columns, and the "feature grid" sections of every landing page. The `repeat(auto-fill, minmax(...))` pattern alone accounts for countless card sections that adapt without media queries. Design systems define layout primitives around grid — the 12-column system — and grid areas are how whole page templates get designed in code. When you eventually learn frameworks, grid is the layout engine their component systems compile down to.

## Common mistakes

The most common grid mistakes mirror flexbox's: forgetting that `gap` spaces only direct children; placing items with line numbers that assume a fixed track count (breaking when the template changes); and mixing `fr` with fixed units without thinking — `grid-template-columns: 1fr 260px` is fine, but `1fr 100%` overflows because 100% of the container plus the fraction exceeds it. Also common: `grid-auto-rows: 1fr` on implicit rows, which collapses empty rows into nothing; and `grid-column: 1 / 3` written when the grid only has two columns — the item creates an implicit column and the layout breaks mysteriously. Finally, using named areas without naming every cell (areas must form a complete rectangle — every cell needs a name or a dot).

## Best practices

- Use `repeat(auto-fill, minmax(...))` for self-adapting galleries — no media queries needed.
- Prefer named areas (`grid-template-areas`) for page skeletons; they document the layout.
- Use `1fr` for proportional tracks; pair `fr` with `auto` and fixed sizes for structure.
- Let implicit rows do the work with `grid-auto-rows: minmax(...)`.
- Choose grid for two-dimensional structures, flexbox for one-dimensional sequences.
- Verify layouts in DevTools' grid inspector — it draws track lines and placement for you.
- Keep grid markup shallow; nested grids are fine, tangled grids are not.
- Remember `1 / -1` for full-width spans — the most useful line-number idiom there is.

## Summary

CSS Grid is two-dimensional layout: the container defines rows and columns as tracks — with `1fr` fractions, `repeat()` patterns and `minmax()` flexibility — and items flow automatically or place themselves explicitly by line number or named area. The `auto-fill`/`minmax` combo creates responsive galleries with no media queries, and `grid-template-areas` turns page skeletons into readable ASCII diagrams. Grid and flexbox divide the layout world cleanly: structure in two dimensions, sequences in one.

## Practice

Build a complete page skeleton with grid areas: header across the top, a 260px sidebar, main content, and a footer — using `grid-template-areas` and `grid-area`, with `min-height: 100dvh`. Inside the main region, build a self-adapting gallery with `repeat(auto-fill, minmax(200px, 1fr))` and `grid-auto-rows: minmax(120px, auto)`, and resize the window watching columns appear and disappear. Finally, add a full-width banner element using `grid-column: 1 / -1` and give one gallery item `grid-column: span 2` — then inspect the whole page with DevTools' grid overlay to see every track and line drawn on screen.