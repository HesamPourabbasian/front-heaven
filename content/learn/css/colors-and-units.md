---
title: Colors and Units
description: Speak the language of visual design. Master color systems, contrast, and the modern CSS units that scale with your design.
order: 3
difficulty: beginner
category: Fundamentals
estimatedMinutes: 25
prerequisites:
  - learn/css/selectors-and-specificity
---

## Introduction

Two deceptively simple subjects decide whether a design looks professional or accidental: color and measurement. Color determines mood, hierarchy and readability — the difference between a page you trust and a page that hurts your eyes. Units determine whether your layout scales gracefully from a watch face to a television screen. Neither is hard to *write*; both are hard to choose well. This lesson teaches the CSS syntax for both — every colour system and every major unit — and the judgement behind them.

## The color property

The `color` property sets the text colour of an element; `background-color` paints its background. CSS accepts many colour notations, and modern CSS favours ones that are both readable and powerful.

```css
p { color: red; }                                  /* keyword */
p { color: #ff0000; }                              /* hex */
p { color: rgb(255, 0, 0); }                       /* rgb channels */
p { color: rgba(255, 0, 0, 0.5); }                 /* rgb + alpha */
p { color: hsl(0, 100%, 50%); }                    /* hue, saturation, lightness */
p { color: hsl(0 100% 50% / 0.5); }                /* modern space-separated + alpha */
```

Hex (`#ff0000`) is the classic workhorse: six hexadecimal digits for red, green and blue, or three when each pair repeats (`#f00`). `rgb()` and `rgba()` express the same channels with numbers and add an alpha channel for transparency. `hsl()` thinks in terms designers actually use — hue (the colour wheel position, 0–360), saturation (vividness) and lightness — which makes it dramatically easier to reason about: "make this red a bit darker and less saturated" is a two-second edit in `hsl`, and a guessing game in hex.

## The modern color functions

Modern CSS adds two notations worth knowing now because you will meet them constantly: `oklch()` — the perceptually-uniform colour space used by every serious design system today — and `color-mix()`, which blends two colours mathematically. `oklch(0.7 0.15 250)` reads as lightness, chroma (intensity) and hue, and it is the rare colour space where adjusting lightness actually looks like adjusting lightness.

```css
.btn-primary {
  background: oklch(0.55 0.24 262);
  color: oklch(0.99 0 0);
}
.badge {
  background: color-mix(in oklch, var(--primary) 15%, white);
}
```

`color-mix()` is the tool behind the "tinted background" look everywhere on the modern web: take the brand colour, mix it with white at 15%, and you have a soft badge background that stays perfectly in sync with the brand — no manual hex hunting. Both functions combine beautifully with custom properties, which you will learn in the modern CSS lesson.

## Contrast: the design responsibility

Colour choice is not just taste; it is accessibility law. The WCAG guidelines define contrast ratios between text and its background — roughly 4.5:1 for normal text and 3:1 for large text — and browsers, auditors and hiring committees check them. A ratio is computed from the relative luminance of the two colours; you do not need to compute it by hand, because DevTools displays the ratio the moment you pick a colour in the Styles panel. What you do need is the habit: whenever you choose a text colour, verify its contrast against the background.

```css
/* Roughly: dark slate text on light background — passes 4.5:1 */
p {
  color: #14151f;
  background: #ffffff;
}
```

The practical rules: light background, dark text (or the reverse) with generous separation; never grey-on-grey; never rely on colour alone to convey meaning (a red error label must also say "error"); and remember that contrast applies to borders, icons and placeholder text too. When your design system defines "muted" text, define its colour so that it still passes contrast on every surface it can appear on.

## Absolute units and the pixel

Units answer the question "how much?". The pixel (`px`) is the unit everyone starts with and the right default for fixed-size things: borders, shadows, and measurements that should not scale. One `px` in CSS corresponds to one device pixel group — on high-density "Retina" screens, one CSS pixel is typically two or three physical pixels, which is why text stays crisp everywhere.

```css
.box {
  border: 1px solid #e2e4ee;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
```

Other absolute units — `pt`, `cm`, `in` — come from print and are virtually unused on screen. The beginner error is measuring *typography* in pixels: `font-size: 14px` everywhere. It works, but it makes your site ignore the user's browser font-size preference — an accessibility failure for the many users who enlarge their default text. That is precisely the problem the relative units below solve.

## Relative units: em and rem

Relative units scale with something else, and typography wants exactly that. The `em` unit is relative to the element's own font size: `padding: 1em` on an element whose text is `2rem` gives padding twice its text size. The `rem` unit is relative to the **root** font size — the `html` element's `font-size`, usually the browser default of 16px. So `1rem` is 16px, `1.5rem` is 24px, and — crucially — if a user sets their browser's default font size to 20px, your entire `rem`-based site scales up with them.

```css
html { font-size: 100%; }        /* respect user preferences — never hardcode */

h1 { font-size: 2.25rem; }       /* 36px at the default 16px root */
p  { font-size: 1rem; }          /* 16px */
p  { line-height: 1.6; }         /* unitless line-height inherits perfectly */
.card { padding: 1.25rem; }      /* 20px */
```

The professional convention: use `rem` for almost everything — font sizes, paddings, margins, gaps, widths — because it makes the entire site respond to the user's default text size. Reserve `em` for things that should scale with their own context, like padding around an element with a different font size. A unitless `line-height` (1.6) is the only correct way to write it: it scales with whatever font size the text has.

## Viewport units and modern lengths

The last family measures the viewport — the visible browser window. `vw` is 1% of the viewport width, `vh` is 1% of the height. A full-height hero is `min-height: 100vh`... with a modern correction: `100dvh` (dynamic viewport height), which accounts for mobile browser toolbars that show and hide. Viewport units are also the basis of *fluid typography* — text that scales smoothly with the screen using `clamp()`:

```css
.hero { min-height: 100dvh; }

h1 {
  font-size: clamp(2rem, 5vw + 1rem, 4rem);
}
```

`clamp(min, preferred, max)` is the modern replacement for a dozen media queries: the headline never goes below 2rem, scales fluidly with the viewport in between, and never exceeds 4rem. You will see `clamp()` used for spacing and typography in every serious modern stylesheet — a single line doing what used to take a breakpoint table.

## Real-world usage

Colour systems run entire products. Design teams define brand palettes in `oklch` or `hsl`, store them in custom properties, and derive hover states, disabled states and shadows with `color-mix()` — so a rebrand changes one variable instead of two hundred files. Dark mode is the same system with a different surface palette, which is why "design tokens" (named colour variables) are the backbone of every design system from Material to Tailwind. Units drive the same scale: a responsive design's spacing scale, typography scale and breakpoints are all unit decisions. When a design system ships "spacing: 4, 8, 12, 16, 24" in `rem`, it is declaring: "this scales with the user."

## Common mistakes

Hex-colour blindness: picking colours in hex and never checking contrast, producing grey-on-grey text that auditors flag. `#000`-on-`#fff` is not "great contrast" by default — it is often *too harsh*, while the real failures are the mid-greys. Sizing everything in `px`, especially font sizes, so users who enlarge their browser text get a site that ignores them. Mixing `em` and `rem` without knowing which is which, producing surprises where padding scales with the wrong context. Forgetting the `/` syntax when using alpha in modern `hsl()`, and using `rgba()` where `color-mix()` or opacity would be clearer. And writing `100vh` heroes that jump when the mobile address bar hides — the exact bug `dvh` fixes.

## Best practices

- Verify contrast for every text colour against its background (DevTools shows the ratio).
- Prefer `hsl()` or `oklch()` for reasoning about colour; use hex for fixed brand tokens.
- Use `color-mix()` for derived tints instead of hand-picked hexes.
- Size typography in `rem`; set `html { font-size: 100% }` and let users decide.
- Use `em` only when sizing relative to a local context.
- Use `clamp()` for fluid type and spacing instead of stacked media queries.
- Use `dvh` for viewport-height layouts; avoid fixed `px` for layout-critical sizes.
- Keep a design-token palette: define your colors and scale once, reference everywhere.

## Summary

CSS offers a full colour toolbox — keywords, hex, `rgb()`, `hsl()`, and modern `oklch()` with `color-mix()` — and the responsible use of it centres on contrast. Units split into absolute (`px`) and relative (`em`, `rem`, viewport units); professional CSS sizes text and spacing in `rem` so sites respect user preferences, uses `clamp()` for fluid scale and `dvh` for screen-filling sections. Choosing notation for readability and units for scale is the difference between a stylesheet you maintain and one you fight.

## Practice

Create a mini design-token page: define three custom properties (not yet covered — simply use normal classes) — actually, define a palette as CSS custom properties in `:root` using `oklch()`: a primary, a surface and a text colour. Build a button and a badge using those tokens, deriving the badge background with `color-mix()`. Set your typography entirely in `rem`, your hero in `dvh`, and add one `clamp()`-based headline. Then open DevTools, click on your text colour, and read the contrast ratio it reports against its background — adjust until it passes 4.5:1. Finally, change your browser's default font size to 20px and watch your `rem` layout scale with it.