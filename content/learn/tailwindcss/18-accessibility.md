---
title: 'Web Accessibility (a11y) in Tailwind CSS'
description: 'Master web accessibility (a11y) with Tailwind: semantic HTML, focus rings (focus-visible), screen reader utilities (sr-only, not-sr-only), ARIA states, color contrast compliance, and reduced motion.'
order: 18
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 45
prerequisites: ['/learn/tailwindcss/06-states']
---

# Web Accessibility (a11y) in Tailwind CSS

Building accessible web applications is not optional—it is a legal requirement, an ethical imperative, and standard engineering practice. Over 15% of the world's population lives with some form of visual, motor, or cognitive disability.

Tailwind CSS provides built-in accessibility utilities: **Screen Reader Exclusions (`sr-only`)**, **Keyboard Focus Rings (`focus-visible`)**, **ARIA State Styling (`aria-*`)**, and **Motion Preferences (`motion-reduce`)**.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Core Accessibility Utilities in Tailwind    │
├───────────────────┬─────────────────────────────────────────┤
│ Utility           │ Accessibility Purpose                   │
├───────────────────┼─────────────────────────────────────────┤
│ sr-only           │ Visually hides element but keeps it     │
│                   │ readable for screen readers (NVDA/JAWS).│
├───────────────────┼─────────────────────────────────────────┤
│ not-sr-only       │ Undoes sr-only at larger breakpoints.   │
├───────────────────┼─────────────────────────────────────────┤
│ focus-visible:ring│ High-contrast focus outline for keyboard│
│                   │ navigation users only.                  │
├───────────────────┼─────────────────────────────────────────┤
│ motion-reduce:    │ Disables heavy animations for users with│
│                   │ motion sensitivity.                     │
└───────────────────┴─────────────────────────────────────────┘
```

## 1. Screen Reader Utilities (`sr-only`)

When creating icon-only buttons (e.g. Close `X` or Social Icons), sighted users understand the visual icon, but blind users hear nothing unless a hidden text label is provided:

```html
<!-- Accessible Icon-Only Button -->
<button class="p-2 text-slate-500 hover:text-slate-900 rounded-lg">
  <svg class="w-5 h-5" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
  </svg>
  <!-- Hidden visually, announced by screen readers: -->
  <span class="sr-only">Close modal window</span>
</button>
```

## 2. Accessible Skip-to-Content Link

```html
<!-- Hidden until focused via keyboard Tab key! -->
<a href="#main-content"
   class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50
          focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded-lg">
  Skip to main content
</a>
```

## Summary & Key Takeaways

- Use `sr-only` to provide text labels for icon-only buttons and visual-only content.
- Use `focus-visible:ring` to guarantee clear keyboard navigation paths.
- Add `aria-hidden="true"` to decorative SVGs so screen readers skip them.

## Best Practices & Senior Guidance

1. **Verify WCAG AA 4.5:1 Color Contrast**: Never use light gray text like `text-slate-400` on white backgrounds for body copy; use `text-slate-600` or `text-slate-700` to satisfy minimum contrast ratios.
