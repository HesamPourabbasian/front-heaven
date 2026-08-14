---
title: Responsive Design and Media Queries
description: One site, every screen. Learn the mobile-first mindset and the query syntax that adapts your layouts to any device.
order: 8
difficulty: beginner
category: Responsive
estimatedMinutes: 30
prerequisites:
  - learn/css/css-grid
---

## Introduction

More than half of the world's web traffic comes from phones — screens a fraction of the size of a laptop display, held at arm's length. A site that only looks right on a desktop is, by definition, broken for most of its users. Responsive design is the discipline of building pages that adapt: layouts reflow, images rescale, navigation collapses, and text stays readable at every size. It is not a feature — it is the baseline expectation of modern front-end development.

The good news is that most responsiveness is *structural*, and you already have the tools: fluid units (`%`, `rem`, `vw`), flexible layout (`flex-wrap`, `minmax`), and the `auto` margin trick. Media queries are the precision tool layered on top for the moments where pure fluidity is not enough. This lesson teaches the responsive mindset first, then the media query syntax and the modern additions that are replacing it.

## Fluid first: responsiveness without queries

The deepest layer of responsive design needs no media queries at all. Start with fluid values: widths in percentages or `fr` units instead of pixels, `max-width: 100%` on images, `rem` typography, `clamp()` for sizes that should scale. A layout built on `repeat(auto-fill, minmax(240px, 1fr))` from the grid lesson *is* responsive — the browser recalculates tracks at every width. A navbar with `flex-wrap: wrap` reflows when it runs out of room. This fluid foundation means your media queries handle exceptions, not the entire job.

```css
img, video { max-width: 100%; height: auto; }   /* media never overflows */
.card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }
```

The `max-width: 100%` rule for images is the single most important responsive line in CSS: without it, an image wider than its container forces horizontal overflow — the dreaded sideways scroll on phones. Fluid thinking also includes the page container itself: `max-width: 72rem` with `margin-inline: auto` means the page centres on a desktop and hugs the phone edge on mobile, never wider than the screen.

## The mobile-first mindset

The professional approach is **mobile-first**: write the styles for the smallest screen first, then add complexity for larger screens with `min-width` queries. There are two reasons. Practically, the mobile layout is the harder constraint — starting from a narrow, single-column baseline and progressively enhancing avoids fighting overflow bugs on the phone, and you naturally write simpler code first. Philosophically, mobile-first forces you to decide what a page's *core* content is — the single-column version is the essence — and the desktop layout becomes an enhancement of the essence rather than a shrinking of a complex design.

```css
/* Mobile first: single column, stacked */
.layout { display: grid; grid-template-columns: 1fr; gap: 1rem; }

/* Tablet+: two columns */
@media (min-width: 768px) {
  .layout { grid-template-columns: 1fr 1fr; }
}

/* Desktop+: sidebar layout */
@media (min-width: 1024px) {
  .layout { grid-template-columns: 240px 1fr; }
}
```

Note the direction: `min-width` queries express "when the screen is at least this wide, add this". The base styles apply everywhere; each query layers enhancement on top. This ordering — base, then progressive enhancement — is the reason mobile-first codebases are calmer: there is no "reset the mobile styles" step, because the base *is* the mobile styles.

## Media query syntax

The syntax is simple: `@media` followed by conditions, then a rule block. `(min-width: 768px)` applies the block when the viewport is at least 768px wide. `(max-width: 767px)` applies it below that width — the desktop-first mirror image. Conditions combine with `and`; the `not` and `or` (comma) operators cover the rest.

```css
@media (min-width: 768px) and (max-width: 1023px) {
  /* tablets: 768px to 1023px */
}

@media (hover: hover) and (pointer: fine) {
  /* devices with a precise pointer — show hover effects */
}
```

Two professional refinements: first, prefer *ranges* over fixed points — `(width >= 768px)` reads clearly and modern browsers support it; second, media queries are not just about width. The `(hover: hover)` query detects whether the device can hover (a mouse) versus touch — letting you ship hover effects to mouse users without frustrating touch users. The `prefers-reduced-motion` query respects users who ask for less animation. And `prefers-color-scheme` drives automatic dark mode — a modern front-end's favourite query.

## Breakpoints: choosing widths

A **breakpoint** is a width where the layout changes. The myth that breakpoints should match device names ("iPhone width", "iPad width") is exactly backwards: devices change constantly, and your layout should break where *your content* breaks. The professional practice: pick a few structural widths (commonly 640, 768, 1024, 1280) and let content decide. When text wraps awkwardly or a card gets cramped, *that* is your breakpoint. Design systems define shared breakpoints so every component follows the same rhythm.

```css
/* A practical, content-driven scale */
@media (min-width: 640px)  { /* two columns */ }
@media (min-width: 1024px) { /* sidebar appears */ }
@media (min-width: 1280px) { /* roomier type and gaps */ }
```

The number of breakpoints matters less than their consistency. Three well-chosen breakpoints — small phone, landscape phone/tablet, desktop — cover the overwhelming majority of experiences. What breaks a responsive design is not the *count* of queries but the lack of a fluid foundation underneath them: a design with 40 queries but no `minmax` is fragile; a design with 4 queries on a fluid base is robust.

## Navigation and component adaptation

The most visible responsive work is in components. Navigation is the classic case: a full link row on desktop, a hamburger button opening a drawer on mobile. The pattern is universal: both states exist in the markup, CSS shows one and hides the other by breakpoint, and the hamburger's open/close state is driven by a checkbox or JavaScript.

```css
.nav-links { display: none; }              /* mobile: hidden behind a button */
.nav-toggle { display: block; }

@media (min-width: 768px) {
  .nav-links { display: flex; }            /* desktop: visible row */
  .nav-toggle { display: none; }
}
```

Cards, tables and forms adapt too: card grids collapse to one column (already fluid with `minmax`); tables either scroll horizontally inside a container or switch to stacked card layouts on phones; forms widen their inputs and reflow their grid. The principle is the same everywhere — decide what each component looks like at the narrowest width, then enhance upward — and the container approach — wrap scrollable regions in `overflow-x: auto` — handles the data that cannot reflow.

## Beyond queries: container queries and modern techniques

The newest responsive tool changes the question itself. A **container query** (`@container`) responds to the *container's* size, not the viewport's. A card placed in a narrow sidebar or a wide main column adapts to whichever space it occupies — the same component, responsive to its context. This is the modern answer to component reusability: one component, no assumptions about where it lives.

```css
.card-wrap { container-type: inline-size; }

@container (min-width: 400px) {
  .card { display: grid; grid-template-columns: 120px 1fr; }
}
```

The card shows a vertical layout in a narrow container and a horizontal one once its container reaches 400px — regardless of the viewport. Container queries and viewport queries are not rivals; they divide the work. Viewport queries shape the page skeleton; container queries shape components within it. Modern responsive design uses both, plus `clamp()` for fluid type and `dvh` units for mobile-viewport-safe heights.

## Real-world usage

Responsive design is what users experience every time they pick up a phone. Every major site runs the same playbook: fluid container, collapsing nav, reflowing card grids, adaptive tables, larger touch targets on mobile. Tools like Chrome DevTools' device toolbar (the phone icon) let you simulate any screen, and the responsive design mode is where professionals spend a large share of their daily work. Framework toolkits like Tailwind encode the same breakpoint philosophy as utilities — `sm:`, `md:`, `lg:` — and component libraries ship every component in both mobile and desktop states.

## Common mistakes

The king of mistakes: forgetting `max-width: 100%` on images and letting horizontal overflow appear on phones — check `overflow-x` on the whole document when anything scrolls sideways. Fixed pixel widths on containers and typography that ignore `rem`/`clamp()` also cause overflow. Using desktop-first `max-width` queries exclusively makes mobile styles into a tangle of resets. Choosing device-specific breakpoints that go stale the moment new phones ship. Hiding content with `display: none` at breakpoints without considering what screen-reader users lose. And forgetting `dvh` — a `100vh` hero that jumps when the mobile URL bar collapses is a daily, visible bug.

## Best practices

- Build the fluid foundation first: fluid units, `minmax` grids, `max-width: 100%` media.
- Write mobile-first: base styles for the smallest screen, `min-width` queries upward.
- Choose content-driven breakpoints, kept consistent across the site.
- Use container queries for components, viewport queries for the page skeleton.
- Use `clamp()` for typography and spacing that should scale smoothly.
- Use `dvh` for viewport-height sections on mobile.
- Respect `prefers-reduced-motion` and design with touch targets ≥ 44px on mobile.
- Test at real sizes with DevTools' device mode — including landscape phones and foldables.

## Summary

Responsive design makes pages adapt to every screen. Its foundation is fluid: flexible units, self-adapting grids and non-overflowing media. Media queries layer precision on top — mobile-first `min-width` queries at content-driven breakpoints shape the skeleton, while container queries adapt components to their own context. The modern toolkit (`clamp`, `dvh`, `prefers-*` queries) makes responsiveness both more capable and less query-heavy. One site, every device — not as a feature, but as the baseline.

## Practice

Take the page skeleton you built in the grid lesson and make it fully responsive, mobile-first: start with a single-column layout and a hidden nav-links row with a visible hamburger-style toggle button; add `min-width` queries at 768px (two-column content) and 1024px (sidebar + full nav row). Ensure every image has `max-width: 100%`, typography uses `rem` and one `clamp()`, and the hero uses `dvh`. Then open DevTools device mode and sweep from 320px to 1440px, watching each breakpoint engage — and specifically hunt for any horizontal scrollbar along the way; `overflow-x: clip` on the body is not the fix — finding and fixing the offending element is.