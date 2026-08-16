---
title: Mobile-first development
description: Design for the smallest screen first and enhance upward. Learn the workflow, the content-driven breakpoint scale, and why the phone is the easier constraint.
order: 4
difficulty: beginner
category: Breakpoints
estimatedMinutes: 25
prerequisites:
  - learn/responsive-design/media-queries
---

## Introduction

Mobile-first is a workflow as much as a technique: write the styles for the smallest screen first, then add complexity for larger screens with `min-width` queries. It is the professional default because it produces calmer codebases and better products — and this lesson shows you why, plus the exact workflow and the breakpoint scale that replaces guessing at device names.

## Why the phone is the easier constraint

Building a page that fits a 320px phone is harder than building one that fits a 1440px laptop — harder in exactly the way that makes it a better foundation. The phone forces decisions:

- The single-column layout must carry the page's *core content* and nothing else — so you decide, first, what actually matters.
- There is no room for a sidebar, a row of nav links, or a five-column table — so every element must earn its place.
- Touch targets must be tappable, text must be readable without zoom, and nothing may overflow sideways.

Starting from this constraint means the mobile layout is not a squeezed version of the desktop — it is the essence, and the desktop layout is an enhancement of that essence. Philosophically, mobile-first forces you to design the content hierarchy before the layout decoration, which is why mobile-first products are not just better on phones; they are clearer on every screen.

## The mobile-first workflow

The workflow is a simple loop that you repeat for every component and every page:

1. **Design the narrowest state first.** One column, stacked sections, collapsed navigation, essential content only. This is your base CSS, written with no media query.
2. **Add the next state with `min-width`.** When the layout genuinely needs to change — when content wraps awkwardly or space goes to waste — that width is your breakpoint. Write `@media (min-width: WIDTH)` and enhance.
3. **Repeat upward.** Each query layers on the previous state: tablet at 768px, sidebar at 1024px, roomier spacing at 1280px.
4. **Sweep-test the whole range.** Resize continuously from 320px to 1440px, watching each state hand off smoothly, and hunt for overflow at every step.

```css
/* 1. Base: the phone layout */
.layout { display: grid; grid-template-columns: 1fr; gap: 1rem; }
.nav-links { display: none; }
.nav-toggle { display: block; }

/* 2. Tablet: two columns */
@media (min-width: 768px) {
  .layout { grid-template-columns: 1fr 1fr; }
}

/* 3. Desktop: sidebar + full nav */
@media (min-width: 1024px) {
  .layout { grid-template-columns: 240px 1fr; }
  .nav-links { display: flex; }
  .nav-toggle { display: none; }
}
```

Notice what never happens: there is no "reset the mobile styles" step. The base *is* the mobile styles, and every query only adds. That absence of resetting is the entire payoff — desktop-first codebases spend their lives undoing their own base, and mobile-first codebases simply grow.

## Choosing breakpoints: content-driven, not device-driven

A breakpoint is a width where the layout changes — and the choice of widths is where beginners go wrong. The myth is that breakpoints should match devices: "iPhone", "iPad", "common laptop". The reality is that devices change every season, there is no such thing as a canonical "phone width" anymore, and a layout tuned to last year's device breaks on this year's.

The professional practice is **content-driven breakpoints**: the layout should break where *your content* breaks. Watch your design as it narrows, and the breakpoints announce themselves:

- Text starts wrapping awkwardly, with lone words dangling on a line → widen columns here.
- A card's content gets cramped, buttons wrap onto two lines → this is your minimum.
- Space goes visibly to waste on one side of a long line → add a column or a sidebar here.
- A nav row that fits at 800px stops fitting at 780px → that is a real breakpoint.

In practice, the same handful of structural widths keeps appearing — 640, 768, 1024, 1280 — because content tends to break at similar points. What matters is *consistency*: pick a scale, define it once, and use the same widths across the whole site, so every component follows the same rhythm.

## A practical breakpoint scale

The classic three-tier scale covers the overwhelming majority of experiences:

```css
/* 640px  — small phone → landscape phone / tablet: more columns, roomier */
/* 1024px — tablet → desktop: sidebar appears, full navigation */
/* 1280px — desktop → large desktop: generous spacing and type */
```

Three tiers is usually enough. Resist adding a new breakpoint for every awkward layout — if something looks wrong between tiers, the fix is usually a fluid improvement (a `minmax`, a `clamp`), not another query. The number of queries matters less than their consistency: a design with 40 ad-hoc queries but no fluid foundation is fragile; a design with 4 queries on a fluid base is robust.

## Design tokens for breakpoints

In professional projects the breakpoint scale lives in one place, not scattered across the CSS. With custom properties, a single change ripples through the site:

```css
:root {
  --bp-sm: 640px;
  --bp-md: 768px;
  --bp-lg: 1024px;
  --bp-xl: 1280px;
}

@media (min-width: var(--bp-lg)) {
  .layout { grid-template-columns: 240px 1fr; }
}
```

Many teams also name their breakpoints in documentation ("narrow", "wide", "desktop") so designers and developers speak the same language. The exact names matter less than the discipline: one scale, defined once, used everywhere.

## Common mistakes

Choosing breakpoints from device lists that go stale within a year. Adding a new query for every visual complaint instead of fixing the fluid foundation. Using desktop-first `max-width` and inheriting a tangle of resets. Treating "mobile-first" as only about phones — the discipline applies to every component (a card in a sidebar deserves its own narrow-first treatment via container queries, which you will meet in a later lesson). And, most subtly, writing base styles that are *not* the mobile layout — for example, setting a desktop grid in the base and downgrading it with `max-width` — which quietly becomes desktop-first no matter what you call it.

## Best practices

- Write the narrowest state first, with no media query — it is your base.
- Add states upward with `min-width` queries only.
- Let content choose the breakpoints; keep the scale small and consistent (e.g. 640 / 768 / 1024 / 1280).
- When something looks wrong between breakpoints, fix the fluidity, not the queries.
- Store the breakpoint scale in one place and reuse it across the site.
- Sweep-test the full range from 320px to 1440px on every page.

## Summary

Mobile-first development builds the narrowest screen state as the base and layers enhancements upward with `min-width` queries. The phone is the harder constraint — and that is the point: it forces the content hierarchy to be decided first, and it makes the base styles the mobile styles, eliminating the desktop-first tangle of resets. Breakpoints are chosen where content breaks, kept consistent across a small scale, and stored in one place. The result is a codebase that grows cleanly from phone to desktop and a product that is clear at every size.

## Practice

Rebuild a page you built in the CSS stage from scratch, mobile-first, with the discipline enforced: start with a single-column layout, hidden nav links behind a toggle button, and the essential content only. Then add exactly three `min-width` queries — two-column content at 768px, sidebar and full nav at 1024px — and confirm that at no point between 320px and 1440px does the layout look "in between" or broken. Finally, justify each breakpoint in a comment or a notes file: what content condition made *this* width the breaking point? If you cannot articulate it, the breakpoint is a guess — find the real one by narrowing the viewport until something actually breaks.