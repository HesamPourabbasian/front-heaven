---
title: 'ARIA: Roles, Attributes & Best Practices'
description: 'Master Accessible Rich Internet Applications (ARIA): First Rule of ARIA, aria-label, aria-labelledby, aria-hidden, and aria-live.'
order: 27
difficulty: 'intermediate'
category: 'Level 8 - Accessibility'
estimatedMinutes: 25
prerequisites:
  - /learn/html/accessible-images-and-media
---

## What is ARIA?

**ARIA (Accessible Rich Internet Applications)** is a set of special HTML attributes designed to add accessibility semantics to complex dynamic widgets (like modals, tabs, carousels, and accordions).

---

## The First Rule of ARIA

> **"If you can use a native HTML5 element or attribute with the semantics and behavior you require, then do so instead of re-purposing an element and adding ARIA."** — W3C WAI

```html
<!-- GOOD: Native HTML button (has keyboard click, role, focus for free) -->
<button type="button">Save</button>

<!-- BAD: ARIA recreation of a button -->
<div role="button" tabindex="0" onclick="save()">Save</div>
```

---

## Common ARIA Attributes

### 1. `aria-label` (Invisible Label)
Gives an accessible name to an element that has no visible text (like an icon-only button):

```html
<button type="button" aria-label="Close dialog window">
  <svg aria-hidden="true">...</svg>
</button>
```

### 2. `aria-labelledby` & `aria-describedby`
- `aria-labelledby`: Points to the `id` of another element that acts as this element's title.
- `aria-describedby`: Points to the `id` of an element providing detailed descriptions or error messages.

```html
<div role="dialog" aria-labelledby="dialog-title">
  <h2 id="dialog-title">Confirm Deletion</h2>
</div>
```

### 3. `aria-live` (Dynamic Announcements)
Informs screen readers to announce dynamic content updates (like toast notifications or cart badges) automatically:

```html
<!-- polite: announces after current speech finishes -->
<div aria-live="polite" class="cart-status">
  Item added to shopping cart!
</div>
```

---

## Summary & Key Takeaways

- Use native semantic HTML elements first before reaching for ARIA.
- Use `aria-label` for icon-only buttons.
- Use `aria-hidden="true"` to hide decorative icons from screen readers.
- Use `aria-live="polite"` for asynchronous status updates.

---

## Practice Challenge

Build an accessible modal dialog:
1. Add `role="dialog"` and `aria-modal="true"`.
2. Connect the modal heading using `aria-labelledby`.
3. Add a close icon button with an accessible `aria-label`.
