---
title: 'Responsive navigation'
description: 'Build the universal navigation pattern — a full link row on desktop, a hamburger menu on mobile — with accessible markup, CSS states and smooth JavaScript.'
order: 5
difficulty: 'beginner'
category: 'Components'
estimatedMinutes: 30
prerequisites:
  - learn/css/flexbox
  - learn/javascript/browser-javascript
---

## Introduction

Navigation is the most visible responsive component on any site — and the one users touch the most. The universal pattern: on desktop, a horizontal row of links; on mobile, a hamburger button that opens a drawer or dropdown. Getting it right means three things working together: semantic markup, CSS that shows the right state at the right size, and interaction code that handles focus, keyboard and screen readers correctly.

## The universal pattern

The pattern is everywhere because it works. Both states — the full nav row and the compact button — live in the same markup; CSS shows one and hides the other by breakpoint; and the toggle's open/close state is driven by a button (with a checkbox or JavaScript underneath).

```html
<header class="site-header">
  <a class="brand" href="/">My Site</a>

  <!-- The toggle: visible on mobile, hidden on desktop -->
  <button class="nav-toggle" aria-expanded="false" aria-controls="primary-nav">
    <span class="sr-only">Open menu</span>
    <!-- hamburger icon -->
  </button>

  <!-- The links: hidden behind the toggle on mobile, a row on desktop -->
  <nav id="primary-nav" class="nav">
    <ul class="nav-links">
      <li><a href="/">Home</a></li>
      <li><a href="/about">About</a></li>
      <li><a href="/blog">Blog</a></li>
      <li><a href="/contact">Contact</a></li>
    </ul>
  </nav>
</header>
```

The markup is identical at every size. Nothing is duplicated, nothing is removed — CSS just decides which part is visible. The `aria-controls` and `aria-expanded` attributes wire the button to the nav for assistive technology: they announce that the button controls the menu and whether it is currently open.

## The CSS: two states, one source of truth

Mobile-first: the compact state is the base, the full row appears at the desktop breakpoint.

```css
.nav-toggle { display: flex; }      /* base: button visible */
.nav-links  { display: none; }      /* base: links hidden */

@media (min-width: 768px) {
  .nav-toggle { display: none; }    /* desktop: button hidden */
  .nav-links  { display: flex; }    /* desktop: links in a row */
}
```

The `nav-links` row itself is a flex container so the links lay out horizontally with `gap`, wrap gracefully with `flex-wrap: wrap` when they barely overflow, and align vertically with the brand. On mobile, the hidden links still exist in the DOM — CSS `display: none` removes them from layout *and* from the accessibility tree, so screen reader users are not reading a hidden menu twice. That is exactly the behaviour you want for the closed state.

## Opening the menu: the checkbox trick

For menus without JavaScript, the classic trick is a hidden checkbox acting as the toggle: the label *is* the hamburger button, and `:checked` toggles the menu via the general sibling combinator. It is dependency-free and it just works — good for learning, and genuinely used in production for tiny sites.

```css
.nav-toggle-checkbox { position: absolute; opacity: 0; pointer-events: none; }

.nav-links { display: none; }

.nav-toggle-checkbox:checked ~ .nav .nav-links {
  display: flex;
  flex-direction: column;
}
```

With JavaScript, the same principle takes one line: flip a class (or the `hidden` attribute) when the button is clicked. The checkbox approach is worth understanding because it explains a pattern you will see in countless codebases; the JS approach is what most professional sites use, because it gives you control over focus and accessibility.

## The JavaScript: state, focus, and escape

A professional toggle does three jobs: flip the state, manage focus, and handle the keyboard.

```js
const toggle = document.querySelector('.nav-toggle')
const nav = document.querySelector('#primary-nav')

toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open')
  toggle.setAttribute('aria-expanded', String(open))
})
```

When the menu opens, focus should move into it — otherwise a keyboard user pressing Tab after opening the menu lands somewhere unexpected. When it closes, focus should return to the toggle. The Escape key should close an open menu:

```js
nav.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    nav.classList.remove('open')
    toggle.setAttribute('aria-expanded', 'false')
    toggle.focus()
  }
})
```

These three behaviours — `aria-expanded` reflecting the state, focus moving with the menu, Escape closing it — are the difference between a menu that works and one that works *for everyone*. The DOM lesson's event handling covers the pieces; this is their professional assembly.

## The animated hamburger

The hamburger icon itself is usually a button with three bars, commonly drawn with spans:

```html
<button class="nav-toggle" aria-expanded="false" aria-controls="primary-nav">
  <span class="bar"></span>
  <span class="bar"></span>
  <span class="bar"></span>
  <span class="sr-only">Menu</span>
</button>
```

```css
.bar {
  display: block;
  width: 24px; height: 2px;
  background: currentColor;
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.bar + .bar { margin-top: 5px; }

.nav.open .bar:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.nav.open .bar:nth-child(2) { opacity: 0; }
.nav.open .bar:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
```

The three bars morph into an X when the menu opens — the animation that tells users "this closes the menu". Note the pattern: the icon is drawn with `currentColor` so it inherits the header's colour, and the whole animation is a pure transform, which runs on the GPU and respects `prefers-reduced-motion` if you gate it.

## Sticky headers and safe areas

Two refinements separate beginner navbars from production ones. **Sticky headers** — the header stays at the top while content scrolls — are a single CSS property, but with mobile specifics:

```css
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--surface);
  padding: 1rem clamp(1rem, 4vw, 2rem);
}
```

On mobile, the header may sit under the status bar or the notch area. Safe-area insets (`env(safe-area-inset-*)`) add padding for devices with rounded corners and hardware notches — a small detail that iPhone users notice immediately:

```css
.site-header { padding-top: env(safe-area-inset-top, 0px); }
```

And the backdrop: a drawer that slides over content needs a dimmed overlay that closes it when tapped — one extra element and one click handler, but it is what makes the drawer feel like a drawer instead of a floating panel.

## Common mistakes

Showing both the toggle and the links at once at a breakpoint boundary. Hiding the nav links with `display: none` on mobile but leaving them in the tab order anyway (if you use `visibility: hidden`, remember it keeps focusability — use `display: none` or the `hidden` attribute for truly removed content). Forgetting `aria-expanded`, so screen readers cannot tell whether the menu is open. Making the hamburger smaller than 44px, so it fails touch testing. Animating the hamburger with `left`/`top` properties, which cause layout jank on phones, when a `transform` is smooth. And building the desktop row with fixed widths, which breaks the moment you add a fifth link.

## Best practices

- Keep both nav states in one markup source; let CSS choose what is visible.
- Mobile-first: the toggle is base, the link row appears at the desktop breakpoint.
- Use `display: none` for the hidden state so it leaves the accessibility tree cleanly.
- Reflect open/close state in `aria-expanded`; move focus into the menu on open and back to the toggle on close; close on Escape.
- Keep the hamburger a button (never a `<div>`), at least 44×44px.
- Animate with `transform`/`opacity` only, and gate motion with `prefers-reduced-motion`.
- Add safe-area insets for notched phones; add a backdrop to close drawers.

## Summary

Responsive navigation is one markup source with two CSS states: the base shows a hamburger toggle on mobile; a `min-width` query replaces it with a full link row on desktop. The `:checked` checkbox trick achieves this without JavaScript, and a few lines of JS professionalise it — flipping `aria-expanded`, moving focus on open and close, and closing on Escape. Sticky headers, safe-area insets and a closing backdrop complete the pattern. It is the single most visible responsive component, and now it is yours to build.

## Practice

Build a complete responsive header: a brand, a four-link nav, and a hamburger button with `aria-expanded` and `aria-controls`. Use the checkbox trick first so the menu works with zero JavaScript, then replace it with a JS toggle that also handles focus and Escape. Animate the three bars into an X with transforms, keep the header sticky, and add safe-area padding. Sweep from 320px to 1024px and verify exactly one state is visible at every width — never both. Then test with a screen reader or the accessibility tree in DevTools: the menu must announce as "Open menu", reflect its expanded state, and contain all links when open.
