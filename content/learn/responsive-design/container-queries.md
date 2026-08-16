---
title: Container queries
description: Make components respond to their own space, not the viewport. Learn @container, container-type, container units, and when to reach for them instead of media queries.
order: 8
difficulty: beginner
category: Modern Techniques
estimatedMinutes: 30
prerequisites:
  - learn/css/modern-css
  - learn/responsive-design/responsive-grids-and-cards
---

## Introduction

Every responsive technique so far answers one question: *how wide is the viewport?* But a component does not live in the viewport — it lives in a container. A card in a narrow sidebar and the same card in a wide main column occupy totally different spaces on the same screen, at the same viewport width. **Container queries** answer the question the component actually cares about: *how wide is my own container?*

They are the modern answer to component reusability — one component, no assumptions about where it lives. This lesson teaches the syntax, the units, and the judgment of when container queries beat media queries.

## The problem media queries cannot solve

Consider a card component used in three places: a full-width hero, a two-column grid, and a narrow sidebar. Its layout should differ in each — wide in the hero, medium in the grid, stacked in the sidebar. With viewport media queries you have two options, both bad: write the card's queries at three different viewport widths (which breaks the moment layouts change), or ship three variants of the component (three times the maintenance).

The root cause is that the viewport is the wrong reference frame. The card's behaviour should depend on the card's own space. Container queries provide exactly that reference frame.

## The basic pattern

Container queries need two pieces: a **container** that establishes the reference frame, and the `@container` rule that queries it.

```css
/* 1. Declare the container: this element becomes the reference */
.card-grid {
  container-type: inline-size;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
}

/* 2. Query it: these styles apply when THIS container is wide enough */
@container (min-width: 500px) {
  .card {
    display: grid;
    grid-template-columns: 120px 1fr;
  }
}
```

`container-type: inline-size` marks the element as a container and enables querying its inline (horizontal) size. Then `@container (min-width: 500px)` behaves like `@media (min-width: 500px)` — but measures the *container*, not the viewport. The card is vertical in a narrow container, horizontal once *its own space* reaches 500px, regardless of the screen. Put the grid in a sidebar and the card stacks; move it to the main column and it flips. Same markup, same CSS, zero duplication.

## container-type: what it does and what it costs

`container-type` has three values:

```css
.container { container-type: inline-size; }  /* query horizontal size */
.container { container-type: size; }         /* query both axes — rare */
.container { container-type: normal; }       /* not a container */
```

The important detail: `container-type: inline-size` applies `contain: layout style inline-size` to the element — the browser promises the container's inline size depends only on itself, which is what makes the query cheap and safe. A container is also a layout boundary: content inside it cannot affect the page outside, and its size is calculated independently. In practice this is what you want for cards and panels, and the containment is why you might occasionally need to give a container an explicit `min-height` — the containment relaxes intrinsic sizing interactions with the page.

Use `inline-size` almost always. `container-type: size` queries both axes but requires the container to have explicit dimensions — it is rarely worth it.

## Naming containers and nesting

With several containers on a page, queries need to know which one to listen to. `container-name` disambiguates:

```css
.sidebar   { container-type: inline-size; container-name: sidebar; }
.card-grid { container-type: inline-size; container-name: shelf; }

@container shelf (min-width: 500px) {
  .card { grid-template-columns: 120px 1fr; }
}
```

Named queries only respond to the named container. Unnamed `@container` queries respond to the *nearest* ancestor container — useful for a card that should adapt to whatever shelf it lands in, wherever that is. Containers also nest: a card inside a grid inside a sidebar is queried against the nearest matching container by default, or against a named ancestor explicitly. The mental model: like media queries, but with a family tree instead of a global viewport.

## Container query units

Container queries come with their own units, which work like `vw`/`vh` but measure the container: `cqw` (container query width), `cqh` (height), `cqi` (inline size), `cqb` (block size), `cqmin`/`cqmax` (smaller/larger of the two).

```css
@container (min-width: 500px) {
  .card {
    font-size: 2cqi;   /* 2% of the container's inline size */
    padding: 4cqi;
  }
}
```

The typical use: type and spacing that scale with the component's own size — a card in a wide column gets proportionally larger text, the same card in a sidebar gets compact text, both without any viewport query. For a card that should scale its whole design relative to its slot, `cqi` is the closest thing to "responsive by nature" that CSS offers.

## Container queries and media queries: the division of labour

They are not rivals; they divide the work. The professional rule of thumb:

- **Media queries** shape the page skeleton — how many columns the main grid has, where the sidebar sits, what the navigation looks like. Page-level decisions, viewport-scale reference.
- **Container queries** shape components — how a card arranges itself, how a panel's type scales — container-scale reference.

```css
/* Viewport: the page skeleton */
@media (min-width: 1024px) {
  .shell { grid-template-columns: 240px 1fr; }
}

/* Container: the component inside */
.sidebar { container-type: inline-size; }
@container (min-width: 300px) {
  .panel { padding: 2cqi; }
}
```

The component lives anywhere without breaking: drop the sidebar into a modal, a drawer, or a two-column layout, and the panel still sizes itself correctly. This is the reusability payoff — the same component, responsive to its context, with zero assumptions about where it lives.

## Browser support and graceful degradation

Container queries are supported in every modern browser (Chrome 105+, Safari 16+, Firefox 110+). But defensive design costs nothing: write the base (vertical) card styles normally, then layer the container-query enhancement — a browser without container query support simply keeps the base styles, which are always the safe narrow-state layout.

```css
.card { display: flex; flex-direction: column; }  /* base: works everywhere */

@container (min-width: 500px) {
  .card { flex-direction: row; }                   /* enhancement */
}
```

This mirrors the mobile-first pattern from the media queries lesson: the base is the narrow state, the query is enhancement. Sites that support it get the adaptive component; older browsers get a fully functional vertical card.

## Common mistakes

Putting `container-type` on the element you are trying to restyle, then querying it — the container must be an *ancestor* of the queried element. Using `container-type: size` without explicit dimensions and wondering why nothing queries. Querying an unnamed container when several exist, and getting the nearest-ancestor surprise. Writing `@container` where the browser expects the plain element to also have containment, so the query silently never matches. And — the most common — reaching for container queries to do a *page-skeleton* job that belongs to media queries, or vice versa. The division is simple: skeleton → viewport, component → container.

## Best practices

- Mark reusable components' wrappers as containers (`container-type: inline-size`).
- Name containers when a page has several; use unnamed queries for nearest-ancestor adaptation.
- Write the narrow-state styles as the base, container-query styles as enhancement.
- Use `cqi` for component-scaled type and spacing inside queries.
- Let media queries own the skeleton, container queries own the components.
- Keep the base styles functional without container-query support — graceful degradation is free.

## Summary

Container queries make components respond to their own space instead of the viewport: `container-type: inline-size` on a wrapper establishes the reference frame, and `@container (min-width: ...)` queries it. Named containers disambiguate nested hierarchies, and `cqi` units scale type and spacing with the component's own size. They do not replace media queries — the division of labour is viewport for the page skeleton, container for the components within it. One component, responsive to its context, reusable anywhere: that is the promise, and it delivers.

## Practice

Take the card system from the responsive grids lesson and retrofit it with container queries: mark the grid a named container (`shelf`) and convert the card's vertical-to-horizontal flip from a media query to `@container shelf (min-width: 500px)`. Add a second, unnamed container (a sidebar) that holds the same card markup — confirm the card renders stacked in the sidebar and horizontal in the grid at the *same* viewport width, which is the one thing media queries could never do. Then scale the card's title with `cqi` inside the query and sweep from 320px to 1440px, verifying the card never looks wrong at any viewport width because it never cares what the viewport is.