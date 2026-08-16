---
title: Fluid layouts and flexible units
description: Build the responsive foundation that needs no media queries — fluid units, max-width media, auto-fill grids, clamp() typography and dvh heights.
order: 2
difficulty: beginner
category: Layout
estimatedMinutes: 30
prerequisites:
  - learn/css/colors-and-units
---

## Introduction

The deepest layer of responsive design needs no media queries at all. It is made of fluid values: widths in percentages instead of pixels, grids that create and collapse columns automatically, images that never exceed their container, and typography that scales smoothly with `clamp()`. A layout built this way *is* responsive — the browser recalculates it at every width, and your media queries only handle the exceptions.

This lesson gives you the fluid toolkit. By the end, most of your pages will respond to every screen size without writing a single `@media` rule.

## The single most important line in CSS

An image wider than its container forces the page wider — and on a phone, that means horizontal scroll, the signature failure of unresponsive pages. One rule prevents it:

```css
img, video, svg, canvas {
  max-width: 100%;
  height: auto;
}
```

`max-width: 100%` says "never be wider than your parent". `height: auto` keeps the aspect ratio as the width shrinks. Add this early, globally, and a whole category of overflow bugs disappears before it starts. Remember that `max-width` is not `width`: `width: 100%` would *stretch* a small image to fill its container; `max-width: 100%` only caps it, letting the natural size win when it is smaller.

## Percentages and fr: fluid space

Fixed pixel widths are the enemy. A sidebar at `300px` overflows a 280px phone; a container at `960px` overflows almost every phone. Percentages adapt automatically because they resolve against the parent:

```css
.layout { display: flex; gap: 1rem; }
.sidebar { width: 25%; }          /* a quarter of the container, whatever it is */
.main    { flex: 1; }             /* takes the remaining space */
```

With flexbox and grid you rarely need explicit percentages at all. `flex: 1` and `flex-grow` distribute leftover space; `grid-template-columns: 1fr 2fr` splits tracks by fraction. The `fr` unit is relative — it cannot overflow, because the browser sizes tracks to fit the container.

## The page container

The classic page shell is a fluid container: full width on small screens, centred and capped on large ones.

```css
.page {
  width: 100%;                    /* fills the phone */
  max-width: 72rem;               /* but never wider than this */
  margin-inline: auto;            /* centres it when space remains */
  padding-inline: 1rem;           /* breathing room at the edges */
}
```

On a phone the container hugs the edges with a small padding. On a desktop it stops growing at 72rem and centres itself. This one pattern is the skeleton of nearly every professional page — it is also exactly how this site you are reading is laid out.

## Self-reflowing grids with minmax()

You met CSS Grid in the CSS stage. `minmax()` plus `auto-fill` is the single most powerful fluid pattern in CSS, because the grid *creates and destroys columns itself* as space allows:

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
}
```

At 1000px wide, the browser fits four columns of at least 240px. At 500px, it fits two. At 320px, one. No media query anywhere — the columns emerge naturally from the available width. The minimum (`240px`) sets the floor below which a card becomes unusable; `1fr` lets each track share the leftover space equally.

Two variants are worth knowing. `auto-fit` behaves like `auto-fill` but collapses empty tracks — with a single card on a wide screen, `auto-fit` lets it stretch full width where `auto-fill` would leave it at 240px. And a fixed-and-fluid pair is the classic sidebar layout:

```css
.shell {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;  /* content + fixed sidebar */
}
```

## Typography that scales: clamp()

`clamp(MIN, VAL, MAX)` clamps a value between two bounds, with the middle value usually a viewport-relative one. It is the modern way to make type scale smoothly between phone and desktop without a single media query:

```css
h1 { font-size: clamp(1.75rem, 1.25rem + 3vw, 3.5rem); }
p  { font-size: clamp(1rem, 0.9rem + 0.4vw, 1.125rem); }
```

Read it as: at least `1.75rem`, at most `3.5rem`, and in between, `1.25rem + 3vw` — growing with the viewport. The same idea works for spacing, gaps, and any size that should breathe: `padding: clamp(1rem, 0.5rem + 3vw, 3rem)` gives a hero generous padding on desktop that shrinks gracefully on phones.

Two cautions. Prefer `clamp()` for *headings and spacing* rather than body text — body copy should stay at a stable, comfortable size (`1rem`) for readability. And keep the middle formula simple: `Xrem + Yvw` is easy to reason about; complex formulas are not.

## dvh: viewport heights that respect mobile

`100vh` means "the height of the visible viewport" — but on mobile browsers, the visible area changes constantly as the URL bar appears and disappears. A hero set to `100vh` suddenly jumps when the user scrolls, showing a flash of content below. The fix is the *dynamic* viewport unit:

```css
.hero { min-height: 100dvh; }
```

`dvh` tracks the actual visible height in real time — it grows when the browser chrome collapses and shrinks when it expands. Use `dvh` for any full-screen section on mobile; `vh` still works, but `dvh` is the modern, mobile-safe default. For a section that should fit on screen without forcing scroll on desktop either, `min-height: 100dvh` is the reliable choice.

## Combining the toolkit

A genuinely fluid page uses all of these together. A hero, a card grid, and a footer — no media queries:

```css
img, video { max-width: 100%; height: auto; }

.hero {
  min-height: 100dvh;
  padding: clamp(2rem, 1rem + 4vw, 5rem);
  font-size: clamp(1.75rem, 1.25rem + 3vw, 3.5rem);
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
}

.page { width: 100%; max-width: 72rem; margin-inline: auto; padding-inline: 1rem; }
```

At 320px: one card column, tight hero padding, readable type. At 1440px: four columns, generous hero, comfortable type. Nothing snapped, nothing overflowed, no queries needed.

## Common mistakes

Forgetting `max-width: 100%` on images and discovering a horizontal scrollbar on phones — the most common responsive bug in existence. Using `width: 100%` where you meant `max-width: 100%`, stretching small images and pixelating them. Setting fixed pixel widths (`960px`) on containers or fixed font sizes on headings, which break at every width. Using `100vh` for heroes and getting the jumping mobile URL-bar bug. And using `clamp()` on body text, where stability matters more than scaling.

## Best practices

- Add `img, video { max-width: 100%; height: auto; }` globally before anything else.
- Prefer relative sizing: `%`, `fr`, `flex: 1`, `minmax()` — never fixed widths for layout.
- Build the page container as `width: 100%; max-width: 72rem; margin-inline: auto`.
- Use `repeat(auto-fill, minmax(Xpx, 1fr))` for reflowing grids.
- Scale headings and spacing with `clamp()`, keep body text stable in `rem`.
- Use `100dvh` for full-height sections on mobile.
- Treat every fixed pixel as a potential overflow: ask "what happens at 320px?"

## Summary

Fluid layouts are responsiveness without queries: `max-width: 100%` keeps media inside their containers, `%` and `fr` adapt space to the parent, `minmax()` grids create and collapse columns by themselves, `clamp()` scales type and spacing smoothly, and `dvh` makes viewport heights mobile-safe. A page built on this foundation already works at every width — media queries become the exception-handler, not the main course.

## Practice

Take any page you built in the CSS stage — or build a small one: a header, a hero, a grid of six cards, a footer. Apply the full toolkit: global `max-width: 100%` on media, a fluid page container (`max-width: 72rem`, `margin-inline: auto`, `padding-inline: 1rem`), a `repeat(auto-fill, minmax(240px, 1fr))` card grid, a heading sized with `clamp()`, and a `100dvh` hero. Open DevTools device mode and sweep from 320px to 1440px without touching a single media query. The layout should reflow the whole way. Then hunt for horizontal scroll — DevTools highlights it with a small bar at the bottom of the viewport — and fix any offender by making it fluid.