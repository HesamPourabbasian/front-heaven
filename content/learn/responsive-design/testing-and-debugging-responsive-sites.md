---
title: 'Testing and debugging responsive sites'
description: 'Sweep viewports, hunt horizontal overflow, inspect real devices and DevTools'' device mode, and build a testing habit that catches problems before users do.'
order: 10
difficulty: 'beginner'
category: 'Workflow'
estimatedMinutes: 30
prerequisites:
  - learn/responsive-design/mobile-first-development
---

## Introduction

A responsive site is only as good as the widths you actually tested. CSS is full of surprises — an unbreakable word, a fixed-width image, an iframe that refuses to shrink — and they all announce themselves at specific widths. The final skill of the responsive design stage is the *practice* of testing: sweeping every viewport, hunting overflow, checking real devices, and building the habit so problems are found before users find them.

## The viewport sweep

The core testing motion is a continuous sweep from the smallest realistic phone to a wide desktop:

1. Open DevTools and toggle device mode (the phone icon, `Cmd+Shift+M`).
2. Set the width to 320px — the narrowest mainstream phone (iPhone SE-class).
3. Slowly drag the viewport wider, or use the preset device list, watching every breakpoint engage.
4. Stop at the common sizes: 320, 375 (iPhone), 390, 414, 768 (tablet portrait), 834, 1024, 1280, 1440.

At each size, run the same checklist:

- **No horizontal scroll** — the single most important check.
- **No crushed content** — cards, text and tables readable, nothing squeezed.
- **No half-engaged states** — a layout between breakpoints that looks like neither state.
- **No orphaned elements** — a nav row that overflows by one link, a button that wraps to two lines.

The sweep catches the two classic failure families: overflow (an element wider than the viewport) and breakpoint gaps (a width where no query is doing its job). Both are easier to see in motion than at isolated sizes — which is why dragging continuously beats jumping between presets.

## Hunting horizontal overflow

Horizontal scroll is the signature mobile bug, and the fix is diagnostic discipline — never a blanket `overflow-x: hidden` on the body, which hides the symptom and can break sticky positioning and focus outlines. Find the offender:

1. In DevTools, open the **Elements** panel and select `body`.
2. Hover it — the page highlights; elements extending beyond the viewport show a blue overflow marker.
3. Alternatively, run this in the console to get the widest offending elements:

```js
const offenders = [...document.querySelectorAll('*')]
  .filter(el => el.scrollWidth > document.documentElement.clientWidth + 1)
  .map(el => `${el.tagName}.${el.className}`)
console.log([...new Set(offenders)])
```

The usual suspects: an image without `max-width: 100%`, a fixed-width container (`width: 960px`), a long unbreakable string (a URL, a code snippet — fix with `overflow-wrap: break-word` or `word-break`), a table without a scroll container, an iframe, a flex item refusing to shrink (fix with `min-width: 0` on grid/flex children), or a `100vw` element — note that `100vw` includes the scrollbar, so it can overflow by the scrollbar's width.

## Real devices and emulation

DevTools' device mode is excellent, but it emulates the *viewport*, not the physics: no real thumb, no real touch latency, no real mobile GPU, no actual network conditions. The professional habit is layered testing:

- **Device mode** for the fast sweep — minutes per page, catches the vast majority of layout bugs.
- **A real phone** (or the browser's device emulation with touch enabled) for interaction: tapping the nav, focusing inputs, rotating to landscape, watching the keyboard appear.
- **Throttled network** — DevTools' network tab can simulate 3G or "Slow 4G". Responsive is also about *speed*: a page that works at 320px but takes 10 seconds to load on a phone is still broken. Check the transferred size — this is where `srcset` from the media lesson pays off.
- **Physical devices when possible** — browsers differ subtly in rendering (Safari's 100vh behaviour, Android's overscroll), and there is no substitute for the real thing on the pages that matter.

A practical middle ground: keep a few common devices bookmarked (an iPhone, a mid-range Android, a small tablet) and test interaction there — layout on the sweep, interaction on hardware.

## The debugging toolbox

Four DevTools features carry most responsive debugging:

- **Device mode presets and rotation** (`Cmd+Shift+M`) — sweep widths, rotate to landscape, emulate touch.
- **The overflow indicator** — when an element overflows, DevTools draws a blue bar along the viewport edge; clicking it in the Elements panel jumps to the offender.
- **CSS grid/flex overlays** — in the Elements panel, clicking the `grid`/`flex` badges highlights tracks and gaps, showing exactly why a grid produced too many columns or a flex row overflowed.
- **The rendering panel's "media queries" view** — a ruler showing every `@media` rule in the page at its width; drag it to see queries engage in real time, and spot overlapping or gap-ridden queries instantly.

The same panel shows `prefers-reduced-motion`, `prefers-color-scheme` emulation, and even `forced-colors` — use them to test the `prefers-*` queries from the media queries lesson without changing your OS settings.

## Building the testing habit

Testing is not a phase — it is a rhythm. The professional workflow bakes responsiveness into every step:

- **As you build**: after every component, resize the window once and look for overflow. Ten seconds, ten times a day beats one hour of debugging at the end.
- **At breakpoints**: when you add a `min-width` query, sweep through it immediately — the width just below, at, and just above the breakpoint.
- **Before shipping**: the full sweep — 320px to 1440px, portrait and landscape, throttled network, keyboard-open form test, reduced-motion test.
- **On every regression**: when a bug report says "broken on mobile", the first question is which width — then sweep *to* that width and watch it break.

This last point matters most. A responsive codebase accumulates breakpoints and components; a change in one component can break another at a specific width. The sweep is cheap insurance — and the discipline of running it is what separates sites that "work on mobile" from sites that work *everywhere*.

## Common mistakes

Testing only the preset device list and missing the widths between them — presets skip the exact width where your layout breaks. Hiding overflow with `overflow-x: hidden` instead of finding the offender. Testing only in Chrome and being surprised by Safari's `100vh` or Android's overscroll. Testing layout but not interaction — the nav opens, but can a thumb actually use it? Forgetting landscape, the virtual keyboard, throttled networks, and reduced-motion. And treating testing as a final step instead of a daily habit — the ten-second resize costs nothing and catches everything.

## Best practices

- Sweep continuously from 320px to 1440px; stop at every breakpoint, just below and just above it.
- Check no horizontal scroll at every width — and find the offender, never mask it.
- Run the console overflow detector when an offender hides.
- Test interaction on real-ish hardware: taps, rotation, keyboard, throttled network.
- Use DevTools' media-query ruler to audit your query scale for gaps and overlaps.
- Emulate `prefers-reduced-motion` and dark mode in the rendering panel before shipping.
- Make the sweep a habit: resize after every component, not just before launch.

## Summary

Testing responsive sites is a practice, not a phase: sweep the viewport continuously from 320px to 1440px, hunt horizontal overflow to its source (never masking it), combine fast emulation sweeps with real-device interaction tests, and lean on DevTools' overlays, overflow indicators and media-query ruler. Back it with a daily habit — the ten-second resize after every component — and responsiveness stops being a risk and becomes a property of how you build.

## Practice

Take the most complex page you built in this stage and run it through a full audit. First, the continuous sweep from 320px to 1440px, and for each width record: no horizontal scroll, no crushed content, no half-engaged states. Second, run the console overflow detector and fix every offender at its source — if an image lacks `max-width: 100%`, fix the CSS; if a long URL breaks a card, apply `overflow-wrap`. Third, open the rendering panel's media-query ruler and check your breakpoints have no gaps or overlaps. Fourth, test on a real phone (or touch emulation): open the nav with a thumb, focus a form input and confirm no zoom, rotate to landscape, and enable reduced motion to confirm your animations die. Write your findings as a checklist you can reuse for every future page — and make the sweep part of how you build from now on.