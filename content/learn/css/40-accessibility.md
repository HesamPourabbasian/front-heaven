---
title: 'CSS Accessibility Engineering, WCAG Compliance & Focus States'
description: 'Master CSS accessibility (a11y) engineering: WCAG 2.2 color contrast formulas, high-visibility :focus-visible indicators, prefers-reduced-motion motion damping, forced-colors, and 400% zoom testing.'
order: 40
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 30
prerequisites:
  - /learn/css/39-design-systems
---

# CSS Accessibility Engineering, WCAG Compliance & Focus States

Accessibility (**a11y**) is not merely an afterthought; it is a legal requirement and an engineering discipline. Senior front-end engineers author defensive CSS that respects user operating system accessibility settings, provides high-contrast visible keyboard focus indicators, respects motion sensitivity preferences via **`prefers-reduced-motion`**, and guarantees layout integrity when users zoom up to **400%**.

In this lesson, we explore **WCAG 2.2 AA/AAA CSS compliance**, styling robust **`:focus-visible`** rings, motion dampening, **`forced-colors`** high-contrast support, and 400% zoom testing.

```text
┌────────────────────────────────────────────────────────────┐
│                    WCAG 2.2 Contrast Ratio Standards       │
├──────────────────┬─────────────────────────────┬───────────┤
│ Element Type     │ Minimum AA Standard         │ AAA Target│
├──────────────────┼─────────────────────────────┼───────────┤
│ Body Text (<18pt)│ 4.5 : 1 contrast ratio      │ 7.0 : 1   │
│ Large Text (18pt+)│ 3.0 : 1 contrast ratio     │ 4.5 : 1   │
│ UI Controls & Box│ 3.0 : 1 contrast ratio      │ 4.5 : 1   │
│ Focus Indicators │ 3.0 : 1 against background  │ High vis. │
└──────────────────┴─────────────────────────────┴───────────┘
```

## 1. High-Visibility Focus Indicators with `:focus-visible`

Never write `outline: none` or `outline: 0` without an immediate high-contrast replacement. The **`:focus-visible`** pseudo-class displays focus rings exclusively when users navigate via keyboard `Tab` (hiding distracting rings during mouse clicks):

```css
/* Universal Accessible Focus Indicator */
:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 3px; /* Prevents focus ring from touching element border */
  border-radius: inherit;
}

/* On dark backgrounds, use high-contrast cyan / white */
[data-theme="dark"] :focus-visible {
  outline-color: #38bdf8;
}
```

## 2. Respecting Motion Sensitivity with `prefers-reduced-motion`

For users with vestibular motion disorders, large parallax effects, rotating carousels, or bouncing dialogs can cause physical nausea, dizziness, and migraines.

Respect the operating system reduced-motion preference:

```css
/* Disable or simplify animations when user requests reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## 3. Supporting Windows High Contrast Mode (`forced-colors`)

Windows High Contrast Mode overrides all authored background and text colors with user-defined high-contrast system palettes. Transparent borders, box shadows, and SVG icons often vanish completely in high-contrast mode unless defended:

```css
/* Ensure borders remain visible in High Contrast Mode */
.btn, .card, .input {
  border: 1px solid transparent; /* Becomes a crisp solid border in forced-colors! */
}

@media (forced-colors: active) {
  /* Use system semantic color keywords */
  .custom-checkbox:checked {
    background-color: SelectedItem;
    border-color: SelectedItemText;
  }
}
```

## 4. Supporting 400% Zoom & Text Reflow (WCAG 1.4.10)

WCAG requires that content can be zoomed up to **400%** on a standard 1280px desktop monitor without loss of content or functionality and without requiring horizontal scrolling:
- Avoid fixed pixel heights (`height: 300px`) on text containers; use `min-height` so boxes can expand vertically when text grows.
- Use `rem` units for typography and margins so zoom calculations scale gracefully.
- Test layouts with browser zoom set to 400% to ensure media queries trigger mobile single-column reflow mode.

## Summary

- WCAG 2.2 AA mandates a minimum 4.5:1 contrast ratio for body text and 3:1 for UI controls and focus rings.
- `:focus-visible` delivers crisp keyboard focus indicators while hiding rings during mouse interactions.
- `prefers-reduced-motion: reduce` dampens or removes animations for users with motion sensitivity.
- Transparent borders (`border: 1px solid transparent`) ensure container boundaries render in Windows High Contrast Mode.
- Using `rem` units and avoiding fixed container heights guarantees clean 400% zoom reflow.

## Best Practices

1. **Never Strip Focus Outlines**: Always provide high-contrast `:focus-visible` indicators.
2. **Include the Global `prefers-reduced-motion` Reset**: Ensure motion compliance across all custom animations.
3. **Audit Colors with Automated Contrast Checkers**: Verify all text meets 4.5:1 contrast standards.
4. **Test at 400% Browser Zoom**: Ensure no content is clipped or requires horizontal scrolling.
