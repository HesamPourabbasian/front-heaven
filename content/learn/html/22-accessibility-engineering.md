---
title: 'Accessibility Engineering, WCAG 2.2 & ARIA Patterns'
description: 'Master enterprise accessibility engineering: WCAG 2.2 compliance, Accessible Name and Description Computation, ARIA Authoring Practices Guide (APG), focus trapping algorithms, and automated Axe testing.'
order: 22
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 30
prerequisites:
  - /learn/html/21-advanced-performance
---

# Accessibility Engineering, WCAG 2.2 & ARIA Patterns

Senior accessibility engineering goes beyond simply adding `alt` tags to images; it involves designing resilient, keyboard-operable widget patterns according to the **W3C ARIA Authoring Practices Guide (APG)**, implementing focus trapping and focus restoration in complex modal systems, supporting high-contrast modes, and automating regression testing with **`axe-core`**.

In this lesson, we explore the **Accessible Name & Description Computation (AccName 1.2)** algorithm, focus management, complex composite keyboard interactions (Roving `tabindex`), and WCAG 2.2 Level AA compliance.

```text
┌────────────────────────────────────────────────────────────┐
│              Accessible Name Computation Priority          │
├────────────────────────────────────────────────────────────┤
│ 1. `aria-labelledby` (Highest Priority - References ID)    │
│       ▲                                                    │
│ 2. `aria-label`      (Direct string override)              │
│       ▲                                                    │
│ 3. Native Attributes (`<label>`, `alt`, `placeholder`)     │
│       ▲                                                    │
│ 4. Subtree Text      (Text content inside the element)     │
│       ▲                                                    │
│ 5. `title` Attribute (Lowest Priority Fallback)            │
└────────────────────────────────────────────────────────────┘
```

## 1. Accessible Name and Description Computation (AccName)

Every interactive element in the Accessibility Tree must have an **Accessible Name**. Assistive technologies calculate this name using a strict precedence order defined by the W3C AccName specification:

```html
<!-- Example 1: aria-label overrides inner button text -->
<button aria-label="Add item to shopping bag">
  <span aria-hidden="true">+</span>
</button>

<!-- Example 2: aria-labelledby combines multiple element texts -->
<div role="region" aria-labelledby="section-title section-subtitle">
  <h2 id="section-title">Billing Plans</h2>
  <p id="section-subtitle">Annual enterprise subscriptions</p>
</div>
```

## 2. Advanced Focus Management: Focus Traps & Restoration

When a modal dialog or full-screen drawer opens:
1. **Focus Capture**: Initial focus must be set to the first interactive element or dialog container.
2. **Focus Trapping**: Pressing `Tab` or `Shift+Tab` must cycle focus exclusively within the modal, never escaping to the background document.
3. **Focus Restoration**: When the modal closes (via `Escape` or Close button), focus **must be programmatically restored** to the original button that triggered the modal:

```typescript
export class AccessibleModalController {
  private openerElement: HTMLElement | null = null;

  public openModal(modalElement: HTMLElement, triggerElement: HTMLElement) {
    this.openerElement = triggerElement;
    modalElement.setAttribute("aria-hidden", "false");

    // Focus first interactive control
    const firstFocusable = modalElement.querySelector<HTMLElement>(
      'button, [href], input, [tabindex]:not([tabindex="-1"])'
    );
    firstFocusable?.focus();
  }

  public closeModal(modalElement: HTMLElement) {
    modalElement.setAttribute("aria-hidden", "true");
    // Restore focus to the original triggering button!
    this.openerElement?.focus();
  }
}
```

## 3. The Roving `tabindex` Pattern for Complex Composite Widgets

For composite widgets (tabs, toolbars, tree views, menus), tabbing should move **between widgets**, while arrow keys navigate **within the widget**:

```html
<div role="tablist" aria-label="Account Settings">
  <!-- Active tab: tabindex="0" (included in sequential tab order) -->
  <button role="tab" id="tab-1" aria-selected="true" tabindex="0">
    General
  </button>
  <!-- Inactive tabs: tabindex="-1" (navigated via ArrowLeft / ArrowRight) -->
  <button role="tab" id="tab-2" aria-selected="false" tabindex="-1">
    Security
  </button>
  <button role="tab" id="tab-3" aria-selected="false" tabindex="-1">
    Billing
  </button>
</div>
```

## 4. Automated Accessibility Testing with Playwright & Axe-Core

Automate accessibility audits in your continuous integration pipeline to catch 40-50% of WCAG violations automatically:

```typescript
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("homepage passes all WCAG 2.2 AA accessibility rules", async ({ page }) => {
  await page.goto("/");

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();

  expect(results.violations).toEqual([]);
});
```

## Summary

- The Accessible Name Computation algorithm resolves element names across ARIA, native labels, and text nodes.
- Modal dialogs must trap focus during display and restore focus to the trigger element upon dismissal.
- Roving `tabindex` coordinates arrow-key navigation within composite tablists and menus.
- Automated testing with `axe-core` in CI enforces strict WCAG 2.2 Level AA compliance.

## Best Practices

1. **Always Restore Focus Upon Modal Dismissal**: Prevent keyboard users from losing their navigation context.
2. **Implement Roving `tabindex` for Menus and Tabs**: Keep global sequential Tab navigation lean.
3. **Always Test with Screen Readers (VoiceOver / NVDA)**: Automated testing catches only 40-50% of a11y issues; manual testing is vital.
4. **Never Use `aria-hidden="true"` on Focused Elements**: Ensure all elements visible in the Accessibility Tree are navigable.
