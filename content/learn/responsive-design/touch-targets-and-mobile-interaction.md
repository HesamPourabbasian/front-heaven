---
title: Touch targets and mobile interaction
description: Design for thumbs and fingers — 44px targets, hover that never traps, orientation handling, motion that respects users, and viewport meta done right.
order: 9
difficulty: beginner
category: Interaction
estimatedMinutes: 25
prerequisites:
  - learn/responsive-design/media-queries
---

## Introduction

A desktop interface is designed for a mouse: a precise cursor, a hover state, and an infinite supply of clicking patience. A phone is different hardware with different physics — an imprecise thumb, no hover, and a user who is often walking. Responsive design is not complete until the *interaction* is responsive too: targets sized for fingers, states that make sense without hover, and motion that respects the user's preferences. This lesson covers the interaction layer — the part of responsive design users feel.

## Targets sized for thumbs

The human thumb covers roughly 44×44 pixels of touchscreen — that is not a suggestion, it is the physical reality that every platform's guidelines encode. Apple's Human Interface Guidelines, Google's Material Design and the WCAG accessibility standard all converge on the same minimum: interactive targets should be at least 44px (WCAG 2.2's target size criterion is 24px minimum, 44px recommended).

```css
button, a, .nav-toggle, input, select {
  min-height: 44px;
  min-width: 44px;
}
```

Two refinements matter in practice. Spacing is part of the target: two 40px buttons separated by 4px of gap have effective targets of 44px — but two 40px buttons touching are two cramped 40px targets. Give interactive elements breathing room. And padding-based sizing beats height-based sizing: `padding: 0.75rem 1rem` scales with your type size, while a hard `height: 44px` breaks the moment your font grows or shrinks. The plain-English test: can you tap each target with your thumb while holding the phone one-handed? If you hesitate, it is too small.

## The hover trap

`hover` works differently on touch: there is no hover — but the browser *simulates* one on the first tap, which creates the classic mobile bug. A CSS `:hover` rule changes a button's appearance; on a phone, the first tap triggers that hover state and, on some browsers, *sticks* — the button looks "hovered" forever, and the tap never registers as a click.

```css
/* The trap: hover styles applied to everyone */
.nav-item:hover { background: var(--surface-2); }

/* The fix: gate hover effects to devices that can actually hover */
@media (hover: hover) and (pointer: fine) {
  .nav-item:hover { background: var(--surface-2); }
}
```

This is the professional rule from the media queries lesson applied to interaction: hover affordances belong inside `(hover: hover) and (pointer: fine)`. Touch users get the same design minus the hover decorations — and minus the trap. For hover-like feedback on touch, use `:active` (pressed state) or `:focus-visible` instead; both map naturally to touch interaction.

## Orientation and viewport states

Phones rotate, and your layout should not break when they do. The `orientation` media query handles the physical side:

```css
@media (orientation: landscape) {
  /* short and wide: reconsider stacking, keep nav reachable */
}
```

The layout patterns themselves — fluid grids, `minmax`, container queries — usually survive rotation without extra work. The interaction concerns are the ones worth checking: a sticky header that eats the whole landscape height, a drawer that covers the entire short screen, touch targets that were designed for a portrait thumb. Test landscape explicitly on every page; it is the state that most designs forget.

Two viewport-level details matter on mobile. The **viewport meta tag** controls how the page maps to the screen:

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

This is what turns a desktop-width page into a phone-width page — without it, browsers render at a virtual 980px and shrink, producing the "tiny zoomed-out site" experience. It belongs in every page's `<head>`. Its companion, `user-scalable=no` and `maximum-scale=1`, is worth avoiding: disabling pinch-zoom is an accessibility failure (users with low vision cannot enlarge text) and Apple ignores it in Safari for exactly that reason.

And the **virtual keyboard**: when a form input focuses on mobile, the keyboard covers the lower half of the screen. `100vh` sections collapse behind it; `100dvh` adapts (from the fluid layouts lesson). Scroll-linked layouts and fixed footers are the common casualties — keep interactive elements reachable above the keyboard zone.

## Motion that respects users

Motion is an interaction too — and for many users, an unwelcome one. `prefers-reduced-motion` is the user's explicit statement that they want less animation, and respecting it is part of professional responsive design:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

The universal kill-switch is the standard first line of defence. It is heavy-handed by design — a blanket override — and it works. For richer projects, replace it with deliberate choices: animate only `transform` and `opacity` (the compositor-friendly properties that never jank layout), and keep essential motion (progress indicators, loading spinners) — those convey state and should stay, usually scaled down rather than removed.

## The tap feedback and touch-action

Touch interaction has two more native tools. **`:active`** gives instant pressed feedback — the mobile analogue of hover:

```css
.btn:active { transform: scale(0.97); }
```

And `touch-action` controls the browser's default touch gestures on an element — critical when you implement your own gestures (carousels, sliders, swipeable cards):

```css
.carousel {
  touch-action: pan-y;        /* let the browser handle vertical scroll */
  overflow-x: auto;           /* horizontal swipe is the browser's job */
}
```

The rule of thumb: never fight the browser's native gestures with `touch-action: none` unless you are genuinely implementing the gesture yourself — and even then, keep panning on the other axis (as `pan-y` does) so the page still scrolls.

## Common mistakes

Building every interactive element for a cursor and letting the first phone tap stick in a fake hover state. Targets smaller than 44px — or 44px targets packed so tightly they might as well be 30px. Disabling pinch-zoom with `user-scalable=no`, locking out low-vision users. Forgetting the viewport meta tag entirely, shipping the 980px shrunk experience. Animating layout properties (`width`, `top`, `margin`) that jank on phones instead of `transform`/`opacity`. Ignoring `prefers-reduced-motion` and forcing animation on users who asked for none. And testing only portrait, only in DevTools, never on a real device in landscape with a real thumb.

## Best practices

- Size all interactive targets to at least 44×44px, with real spacing between them.
- Gate hover effects inside `(hover: hover) and (pointer: fine)`; use `:active`/`:focus-visible` for touch feedback.
- Include the viewport meta tag on every page; never disable user zoom.
- Test landscape and with the virtual keyboard open.
- Use `100dvh` for viewport-height sections so the browser chrome never eats them.
- Animate only `transform`/`opacity`, and respect `prefers-reduced-motion` globally.
- Keep native touch gestures; use `touch-action` to delegate rather than fight.

## Summary

Responsive interaction is the layer users feel: targets of at least 44px with real spacing, hover effects gated to devices that can hover, `:active` feedback for taps, the viewport meta tag and `dvh` handling the phone's shifting viewport, `prefers-reduced-motion` respecting user preference, and `touch-action` delegating gestures instead of fighting them. Combined, these turn a page that merely *fits* a phone into one that feels *native* on it — the difference between a responsive site and a responsive product.

## Practice

Audit the page you built across the previous lessons as if it were an iOS or Android app: list every interactive element, measure its tap target, and fix anything under 44×44px or with less than 4px of effective spacing. Open it on a real phone (or DevTools with touch emulation) and try the hover trap — find every `:hover` rule and move it inside a `(hover: hover) and (pointer: fine)` query. Rotate to landscape and confirm nothing is lost. Add the viewport meta tag if missing, and confirm pinch-zoom still works. Finally, enable "reduced motion" in your OS accessibility settings and reload: every transition and animation should effectively disappear — if any remains, gate it with `prefers-reduced-motion`.