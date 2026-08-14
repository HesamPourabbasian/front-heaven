---
title: Modern CSS
description: The modern toolbox — custom properties, transitions, animations, container queries and cascade layers. CSS as a real programming language.
order: 9
difficulty: intermediate
category: Best Practices
estimatedMinutes: 35
prerequisites:
  - learn/css/responsive-design-and-media-queries
---

## Introduction

CSS in 2026 is a different language than the one beginners were taught a decade ago. It has variables, logical properties, layout engines, container queries, color math and even native nesting. This lesson is the bridge from "CSS that works" to "CSS that works the way the modern web is built" — a tour of the modern toolkit: custom properties (the CSS variables that power every design system), transitions and animations (the motion layer), container queries (already met, now formalised), and cascade layers (the final word on the specificity wars).

None of these are gimmicks. Every professional stylesheet you will encounter — from Tailwind's internals to the design systems of large companies — is built on these features. Learning them now means the frameworks and codebases you meet later will look familiar, not alien.

## Custom properties: CSS variables

Custom properties — usually called CSS variables — let you store values once and reference them everywhere. They are declared on any element with the `--` prefix and read with the `var()` function:

```css
:root {
  --color-primary: #6366f1;
  --space-md: 1rem;
  --radius-lg: 12px;
}

.btn {
  background: var(--color-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-md);
}
```

The `:root` selector (the document root) is the conventional home for global tokens. Change one value and every button, badge and accent in the product changes — this is exactly how design systems do rebrands and theming. The killer feature, though, is *inheritance and scoping*: custom properties inherit like normal properties, so a component can define a token locally and its children read it. The dark-mode pattern exploits this perfectly:

```css
:root { --surface: #ffffff; --text: #14151f; }
.dark { --surface: #0b0b11; --text: #eef0f8; }

body { background: var(--surface); color: var(--text); }
```

One class flips the theme — no media queries, no per-component rules. The `--` prefix is what makes them safe: it can never collide with a native property. And `var()` accepts fallbacks — `var(--missing, #000)` — which is how tokens stay forward-compatible.

## Transitions

Transitions animate property *changes*: when a value changes — from a hover, a class toggle or a state change — the browser interpolates smoothly instead of snapping. `transition` takes a property, a duration, a timing function and an optional delay:

```css
.btn {
  background: #6366f1;
  transform: translateY(0);
  transition: background 0.2s ease, transform 0.2s ease;
}
.btn:hover {
  background: #4f46e5;
  transform: translateY(-1px);
}
```

The shorthand `transition: all 0.2s` works but is a habit to break: animating `all` includes expensive properties (like `box-shadow` and `filter`) and makes changes unpredictable. List the properties explicitly. The `ease` timing family is right for most UI; `cubic-bezier` curves fine-tune. The essential rule of motion design: *changes should feel responsive, not slow* — 150–300ms is the professional range, and anything above half a second feels like the UI is thinking. Never transition `display` or `height: auto` (they are not animatable); use opacity, transform and colors, which are.

## Animations and keyframes

Where transitions animate *changes*, animations run on a *schedule*: from a defined state through keyframes, once or repeatedly, on page load or forever. The `@keyframes` rule defines the timeline; the `animation` shorthand configures it:

```css
@keyframes fade-up {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: none; }
}

.hero {
  animation: fade-up 0.6s ease-out both;
}
```

Keyframes use `from`/`to`, or percentage stops (`0%`, `50%`, `100%`) for multi-step timelines. The `animation` shorthand reads: name, duration, timing, then options — `infinite` for repetition, `alternate` to bounce back and forth, `delay` to start later, and `both` (the fill mode above) to apply the `from` state before the animation starts and hold the `to` state after it ends, preventing the element from flashing before or reverting after. The motion budget matters: a spinner, a toast slide-in, a skeleton shimmer — each is a keyframe. The professional discipline is *sparingness*: motion should explain state changes and draw attention, not decorate every pixel.

## Container queries, formalised

You met container queries in the responsive lesson; here they join the toolkit formally. The container establishes its own size-tracking context, and `@container` rules respond to it — a component adapting to the space it actually occupies rather than the viewport:

```css
.article-wrap { container-type: inline-size; container-name: article; }

@container article (min-width: 480px) {
  .article { display: grid; grid-template-columns: 200px 1fr; }
}
```

`container-type: inline-size` (or `size`) marks the element as a query container; `container-name` gives it a label for explicit targeting. Components built with container queries are genuinely reusable: drop the same card component into a sidebar, a full-width section or a dashboard panel, and it arranges itself correctly in each. This is the current frontier of component-based styling — and it pairs with the fluid grids you already know.

## Cascade layers

Cascade layers, introduced in the modern CSS reset era, bring explicit priority ordering to the cascade. You declare layers in order, and later layers always beat earlier ones — regardless of specificity or source order inside them:

```css
@layer reset, base, components, utilities;

@layer base {
  a { color: #6366f1; }
}
@layer components {
  .nav-link { color: #14151f; }
}
@layer utilities {
  .text-primary { color: #6366f1; }
}
```

A utility in the `utilities` layer beats a component style even if the component rule has higher specificity and appears later in the file — the layer order decides. This is the architectural fix for the specificity arms race: reset defaults live in the first layer, component styles in the middle, and one-off utility overrides last. Layer order is your *intent*; specificity accidents can no longer override it. (This site you are reading, incidentally, is built with exactly this architecture.)

## Nesting and logical properties

Two final modern conveniences. **CSS nesting** — writing child rules inside parent rules — arrived natively and mirrors how you already think about components:

```css
.card {
  padding: 1rem;
  & h2 { font-size: 1.25rem; }        /* descendant: .card h2 */
  &:hover { border-color: #6366f1; }  /* self state: .card:hover */
}
```

The `&` refers to the parent selector. Nesting keeps related rules together, reducing the "one rule per selector scattered through the file" sprawl that plagued pre-modern CSS — though it carries the same warning as all nesting: two levels is usually enough. And **logical properties** — `margin-inline`, `padding-block`, `border-start-start-radius` — replace the physical `left/right/top/bottom` family. They follow the text's writing direction, which makes layouts correct in right-to-left languages automatically and gives every modern codebase a principled, direction-aware spacing model.

## Real-world usage

This toolbox is the day-to-day of professional front-end work. Design systems define every color, spacing and radius as custom properties; dark mode is a variable swap; the "smooth hover lift" on every card is a transition; skeleton loaders, toast notifications and hero entrances are keyframes; card grids in dashboards are container-query components; and large codebases are organised into cascade layers. When you open a serious open-source stylesheet, you will find `:root` token blocks, `@keyframes` near their components, `@layer` declarations at the top, and `var()` everywhere — the exact patterns in this lesson.

## Common mistakes

Animating `all` or `height` (nothing animates, everything janks); transitions of 1s+ that make UI feel laggy; `animation` without a fill mode, causing elements to flash before or jump after; custom properties used only in `:root` when scoped tokens would be more powerful; forgetting the `--` prefix and wondering why `color: primary` does nothing; `var()` without fallbacks in fragile spots; container queries on elements that never become containers (forgetting `container-type`); and layer misuse — declaring layers in the `@layer` statement but never wrapping rules in them, which makes every rule unscoped and layers pointless.

## Best practices

- Define your design tokens as custom properties on `:root`; scope them per component when needed.
- Prefer `var()` and `color-mix()` over hard-coded values in component styles.
- Transition explicit properties at 150–300ms; reserve keyframe animations for real state changes.
- Use `both` as the default fill mode so animations never flash or revert.
- Use `@container` for reusable components; keep `@media` for the page skeleton.
- Organise the stylesheet into `@layer reset, base, components, utilities` and respect the order.
- Nest at most two levels; keep specificity flat so layers do the priority work.
- Use logical properties (`-inline`, `-block`) and test in a right-to-left language at least once.

## Summary

Modern CSS is a real engineering language. Custom properties bring theming and token systems; transitions animate change smoothly while keyframe animations run scheduled motion; container queries make components context-aware; cascade layers give authors explicit control over priority; and nesting plus logical properties make the code itself cleaner and more correct. Every future framework you learn will be styled on top of these primitives — which is why this lesson, more than any other, is the bridge from CSS beginner to CSS practitioner.

## Practice

Refactor a small page you have already built through this CSS stage: move every repeated color, spacing and radius into custom properties on `:root`; replace hard-coded values in component rules with `var()` references; add two transitions (hover lift on a card, colour shift on a button) and one keyframe animation (a fade-up entrance on the hero); wrap your rules in `@layer base, components, utilities`; and make one component container-query responsive. Then flip the theme by adding a `.dark` scope that overrides your surface and text tokens — and watch the entire page change from two lines of variables.