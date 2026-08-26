---
title: 'Web Accessibility (a11y) & WCAG Compliance in Bootstrap'
description: 'Master Bootstrap 5 web accessibility: semantic HTML, ARIA attributes, keyboard navigation traps, focus restoration in modals, accessible forms, color contrast (WCAG AA), screen-reader helpers (visually-hidden), and reduced motion.'
order: 25
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 35
prerequisites:
  - /learn/bootstrap/09-common-components
  - /learn/bootstrap/10-forms
---

# Web Accessibility (a11y) & WCAG Compliance in Bootstrap

Web accessibility ensures applications are usable by everyone, including people who navigate using screen readers, keyboard-only input, high-contrast displays, or reduced motion settings. Bootstrap 5 is designed around W3C WAI-ARIA authoring practices, but building fully compliant **WCAG 2.1 / 2.2 AA** applications requires understanding semantic HTML, focus trapping, and screen-reader utilities.

In this lesson, you will master accessible ARIA roles, keyboard focus trapping, accessible form error wiring, contrast ratios, and the `prefers-reduced-motion` media query.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Bootstrap Accessibility Architecture                     │
├───────────────────┬───────────────────────────┬─────────────────────────────┤
│ Semantic HTML     │ ARIA & Screen Readers     │ Focus & Motion              │
├───────────────────┼───────────────────────────┼─────────────────────────────┤
│ <button> vs <div> │ aria-expanded="true/false"│ .focus-ring                 │
│ <nav aria-label>  │ aria-controls="menuId"    │ Modal focus trapping        │
│ <main>, <header>  │ .visually-hidden          │ prefers-reduced-motion:     │
│ <fieldset>        │ role="alert" / live region│   reduce                    │
└───────────────────┴───────────────────────────┴─────────────────────────────┘
```

---

## 1. Screen Reader Utilities: `.visually-hidden`

When visual design omits visible text (e.g. icon-only buttons, badge counters), provide equivalent text for assistive technologies:

```html
<!-- Accessible Icon Button -->
<button class="btn btn-outline-danger" type="button">
  <i class="bi bi-trash" aria-hidden="true"></i>
  <span class="visually-hidden">Delete project permanently</span>
</button>

<!-- Skip Navigation Link -->
<a class="visually-hidden-focusable btn btn-primary position-absolute top-0 start-0 m-2 z-3" href="#main-content">
  Skip to main content
</a>
```

- `.visually-hidden`: Hides content visually while preserving it for screen readers.
- `.visually-hidden-focusable`: Becomes visible when focused via keyboard <kbd>Tab</kbd>.

---

## 2. Accessible Modals & Focus Trapping

When a Bootstrap modal opens:
1. Focus is trapped inside the modal container so keyboard users cannot accidentally interact with background elements.
2. The background is marked `aria-hidden="true"`.
3. When the modal closes, focus automatically restores to the trigger button that opened it.

```html
<div class="modal fade" id="accessibleModal" tabindex="-1" aria-labelledby="modalTitle" aria-describedby="modalDesc" aria-modal="true" role="dialog">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title fs-5" id="modalTitle">Confirm Account Deletion</h2>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close dialog"></button>
      </div>
      <div class="modal-body" id="modalDesc">
        All your data will be permanently removed. This action cannot be reversed.
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-danger">Confirm Delete</button>
      </div>
    </div>
  </div>
</div>
```

---

## 3. Accessible Forms & Error Association

Screen readers cannot see color changes from red borders. Always associate error messages with inputs using `aria-describedby` and `aria-invalid`:

```html
<div class="mb-3">
  <label for="cardNumber" class="form-label">Credit Card Number</label>
  <input 
    type="text" 
    class="form-control is-invalid" 
    id="cardNumber" 
    aria-describedby="cardError"
    aria-invalid="true"
    required
  >
  <div id="cardError" class="invalid-feedback">
    Card number must be 16 digits without hyphens.
  </div>
</div>
```

---

## 4. Reduced Motion (`prefers-reduced-motion`)

Bootstrap 5 automatically respects user OS accessibility settings for reduced motion. When a user enables "Reduce Motion" in their OS, Bootstrap's Sass mixins disable all CSS transitions, accordion slides, and carousel animations:

```scss
// Bootstrap internal reduced motion mixin
@mixin transition($transition...) {
  @if length($transition) == 0 {
    $transition: $transition-base;
  }

  @if $enable-transitions {
    @if $enable-reduced-motion {
      @media (prefers-reduced-motion: reduce) {
        transition: none;
      }
    }

    transition: $transition;
  }
}
```

---

## Summary & Key Takeaways

- Semantic HTML (`<button>`, `<nav>`, `<main>`) is the foundation of accessible interfaces.
- `.visually-hidden` and `.visually-hidden-focusable` provide screen-reader context without disrupting visual layouts.
- Bootstrap modals handle focus trapping and restore focus upon dismissal.
- Error states must use `aria-describedby` to guarantee assistive devices read error messages aloud.
- Bootstrap disables animation transitions automatically under `prefers-reduced-motion: reduce`.

## Best Practices & Senior Guidance

1. **Never Replace `<button>` with `<div onclick>`**: `<div>` elements are not keyboard focusable and do not respond to <kbd>Space</kbd> or <kbd>Enter</kbd> without extensive manual JS scripting.
2. **Verify Contrast Ratios with Light Text on Primary**: Ensure text on buttons satisfies the WCAG 2.1 minimum contrast ratio of 4.5:1 for standard text.
