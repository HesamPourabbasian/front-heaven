---
title: 'Web Accessibility (a11y) & Angular CDK'
description: 'Master accessibility (a11y) in Angular: WCAG 2.2 standards, semantic HTML, ARIA landmarks, focus management (FocusTrap, FocusKeyManager), and the Angular CDK Accessibility module.'
order: 24
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 40
prerequisites: ['/learn/angular/03-components']
---

# Web Accessibility (a11y) & Angular CDK

**Web Accessibility (a11y)** ensures that web applications are usable by everyone, including people with visual, auditory, motor, or cognitive disabilities. In enterprise software, accessibility is not merely an optional feature—it is a legal requirement under global standards such as the **Web Content Accessibility Guidelines (WCAG 2.2 Level AA)** and Section 508.

Angular provides first-class accessibility tools through the **`@angular/cdk/a11y`** module. The CDK (Component Development Kit) provides headless primitives for focus trapping in modals, keyboard navigation in menus, screen-reader live announcements, and high-contrast mode detection.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Angular CDK Accessibility Primitives        │
├──────────────────────┬──────────────────────────────────────┤
│ CDK A11y Primitive   │ Responsibility & Purpose             │
├──────────────────────┼──────────────────────────────────────┤
│ FocusTrap            │ Traps keyboard Tab focus inside      │
│                      │ active modals and drawers.           │
├──────────────────────┼──────────────────────────────────────┤
│ LiveAnnouncer        │ Announces dynamic updates to screen  │
│                      │ readers via aria-live regions.       │
├──────────────────────┼──────────────────────────────────────┤
│ FocusKeyManager      │ Handles arrow-key keyboard navigation│
│                      │ in menus, listboxes, and dropdowns.  │
├──────────────────────┼──────────────────────────────────────┤
│ AriaDescriber        │ Associates accessible descriptions   │
│                      │ to elements via aria-describedby.    │
└──────────────────────┴──────────────────────────────────────┘
```

## 1. Focus Trapping in Modals (`cdkTrapFocus`)

When a modal dialog opens, keyboard focus must be trapped inside the dialog so pressing Tab does not escape to background elements:

```typescript
import { Component } from '@angular/core';
import { A11yModule } from '@angular/cdk/a11y';

@Component({
  selector: 'app-accessible-modal',
  standalone: true,
  imports: [A11yModule],
  template: `
    <div class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <!-- cdkTrapFocus traps Tab key inside this container -->
      <div class="modal-card" cdkTrapFocus [cdkTrapFocusAutoCapture]="true">
        <h2 id="modal-title">Update Profile Settings</h2>
        <input type="text" placeholder="Full Name" aria-label="Full Name" />
        <button (click)="close()">Save & Close</button>
      </div>
    </div>
  `
})
export class AccessibleModalComponent {
  close(): void {}
}
```

## 2. Screen Reader Announcements (`LiveAnnouncer`)

When data updates asynchronously without a page reload (e.g. notifications or items added to cart), visual users see the change, but screen-reader users remain unaware. Use `LiveAnnouncer` to announce messages:

```typescript
import { Component, inject } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-cart-button',
  standalone: true,
  template: `<button (click)="addToCart()">Add Item</button>`
})
export class CartButtonComponent {
  private liveAnnouncer = inject(LiveAnnouncer);

  addToCart(): void {
    // Perform cart addition logic...

    // Announce polite update to screen readers
    this.liveAnnouncer.announce('Item successfully added to your shopping cart', 'polite');
  }
}
```

## 3. Accessible Form Validation & ARIA Attributes

Always associate input fields with explicit labels and link error messages with `aria-describedby` and `aria-invalid`:

```html
<div class="form-group">
  <label for="user-email">Email Address</label>
  <input
    id="user-email"
    type="email"
    [formControl]="emailControl"
    [attr.aria-invalid]="emailControl.invalid && emailControl.touched"
    [attr.aria-describedby]="emailControl.invalid ? 'email-error-msg' : null"
  />
  @if (emailControl.invalid && emailControl.touched) {
    <p id="email-error-msg" class="error" role="alert">
      Please enter a valid email address.
    </p>
  }
</div>
```

## Summary & Key Takeaways

- Accessibility is an essential requirement under WCAG 2.2 guidelines.
- Use native semantic HTML elements (`<button>`, `<main>`, `<nav>`, `<header>`) before creating custom ARIA widgets.
- The `@angular/cdk/a11y` module provides `FocusTrap`, `LiveAnnouncer`, and `FocusKeyManager`.
- Always link form errors with `aria-invalid` and `aria-describedby`.

## Best Practices & Senior Guidance

1. **Never Replace Native Buttons with `<div>`**: Native `<button>` elements have built-in keyboard interaction (`Enter`, `Space`) and focusability out of the box.
2. **Audit with Automated Tools**: Integrate `@axe-core/playwright` into your CI/CD test suite to catch 50%+ of accessibility violations automatically.
3. **Test with Keyboard Only**: Ensure every interactive feature can be navigated using only `Tab`, `Shift+Tab`, `Enter`, `Escape`, and arrow keys.
