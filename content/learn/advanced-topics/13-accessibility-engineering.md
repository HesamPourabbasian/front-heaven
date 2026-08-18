---
title: 'Accessibility Engineering & WCAG Compliance'
description: 'Master enterprise accessibility (a11y): WCAG 2.2 AA standards, ARIA authoring practices, focus traps, roving tabindex, keyboard navigation, and automated axe-core testing.'
order: 13
difficulty: 'advanced'
category: 'Senior Front-End Engineering'
estimatedMinutes: 45
prerequisites:
  - /learn/advanced-topics/12-testing-automation
---

# Accessibility Engineering & WCAG Compliance

Accessibility (**a11y**) is an essential legal, ethical, and engineering requirement. Over 1.3 billion people worldwide live with disabilities (visual, motor, auditory, or cognitive). Building accessible software ensures that all users—including those navigating via screen readers (VoiceOver, NVDA), switch devices, or keyboard-only navigation—can use your product seamlessly.

In this lesson, we explore **WCAG 2.2 Level AA** compliance, semantic markup supremacy over ARIA, building accessible modal dialogs with focus trapping, implementing **Roving `tabindex`** for complex widgets, and automating a11y tests with **`axe-core`**.

```text
┌────────────────────────────────────────────────────────────┐
│                    WCAG 2.2 Four Core Principles           │
├──────────────┬─────────────────────────────────────────────┤
│ Perceivable  │ Text alternatives, color contrast (≥ 4.5:1) │
│ Operable     │ 100% Keyboard accessible, no focus traps    │
│ Understandable│ Predictable navigation, input error labels │
│ Robust       │ Valid semantic HTML, screen reader support  │
├──────────────┴─────────────────────────────────────────────┤
│ First Rule of ARIA: "Don't use ARIA if native HTML works!" │
└────────────────────────────────────────────────────────────┘
```

## 1. The First Rule of ARIA: Native HTML First

The W3C First Rule of ARIA states: *If you can use a native HTML element or attribute with the semantics and behavior you require already built in, do so instead of re-purposing an element and adding ARIA.*

```html
<!-- ❌ Bad: Div soup attempting to recreate a button -->
<div class="btn" onclick="submitForm()" role="button" tabindex="0">
  Submit
</div>

<!-- ✅ Good: Native semantic HTML with built-in keyboard focus & space/enter handlers -->
<button type="submit">
  Submit
</button>
```

Native `<button>`, `<input>`, `<dialog>`, and `<details>` elements automatically provide accessible roles, keyboard event handlers (`Enter` and `Space`), and focus ring styling for free across all operating systems.

## 2. Accessible Modal Dialogs & Focus Trapping

When a modal opens, keyboard focus must be trapped inside the modal container so that pressing `Tab` cannot accidentally focus elements hidden behind the backdrop:

```typescript
export class FocusTrap {
  private focusableElements: HTMLElement[] = [];
  private previousActiveElement: HTMLElement | null = null;

  constructor(private container: HTMLElement) {}

  public activate() {
    this.previousActiveElement = document.activeElement as HTMLElement;
    this.updateFocusableElements();

    if (this.focusableElements.length > 0) {
      this.focusableElements[0].focus();
    }

    this.container.addEventListener("keydown", this.handleKeyDown);
  }

  public deactivate() {
    this.container.removeEventListener("keydown", this.handleKeyDown);
    if (this.previousActiveElement) {
      this.previousActiveElement.focus(); // Restore focus to trigger element!
    }
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Tab") {
      const firstEl = this.focusableElements[0];
      const lastEl = this.focusableElements[this.focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus(); // Wrap around to last element
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus(); // Wrap around to first element
      }
    }
  };

  private updateFocusableElements() {
    this.focusableElements = Array.from(
      this.container.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    );
  }
}
```

Modern browsers now support the native `<dialog>` element, which handles focus trapping, backdrop dimming, and `Escape` key dismissal natively via `.showModal()`!

## 3. Roving `tabindex` for Composite Widgets (Toolbars & Menus)

In composite widgets like tabs, radio groups, and menus, only **one** item should be reachable via `Tab`. Arrow keys (`ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown`) navigate between sibling items, updating `tabindex="0"` on the active item and `tabindex="-1"` on inactive items:

```html
<div role="tablist" aria-label="Account Settings">
  <!-- Only active tab is in the sequential tab order (tabindex="0") -->
  <button role="tab" id="tab-1" aria-selected="true" aria-controls="panel-1" tabindex="0">
    General
  </button>
  <!-- Inactive tabs reachable via Arrow keys (tabindex="-1") -->
  <button role="tab" id="tab-2" aria-selected="false" aria-controls="panel-2" tabindex="-1">
    Security
  </button>
  <button role="tab" id="tab-3" aria-selected="false" aria-controls="panel-3" tabindex="-1">
    Billing
  </button>
</div>
```

## 4. Color Contrast & Motion Preferences

- **Color Contrast (WCAG AA)**: Normal text must have a minimum contrast ratio of **4.5:1** against its background; large text (≥ 18pt / 24px) requires **3:1**.
- **Reduced Motion**: Respect users with vestibular disorders by disabling large animations when `prefers-reduced-motion` is enabled:

```css
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

## 5. Automated Accessibility Testing with `axe-core`

Integrate `axe-core` into your Vitest and Playwright CI test suites to automatically catch 40-50% of common accessibility violations:

```typescript
// tests/a11y/homepage.spec.ts
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("homepage has zero WCAG AA accessibility violations", async ({ page }) => {
  await page.goto("/");

  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```

## Summary

- The First Rule of ARIA dictates using native semantic HTML elements before applying ARIA attributes.
- Modal dialogs must trap keyboard focus and restore focus to the trigger button upon dismissal.
- Roving `tabindex` ensures composite widgets (tabs, toolbars) navigate cleanly using arrow keys without cluttering the main `Tab` sequence.
- WCAG AA mandates a minimum 4.5:1 color contrast ratio for normal text.
- `axe-core` automates accessibility regression scanning inside Playwright and Vitest CI pipelines.

## Best Practices

1. **Always Associate Form Labels with Inputs**: Use explicit `<label for="id">` or wrap inputs inside `<label>`.
2. **Never Remove Focus Outlines Without Replacement**: If removing `outline: none`, always provide a high-contrast custom focus ring (`:focus-visible`).
3. **Respect `prefers-reduced-motion`**: Disable rapid zooming and parallax animations for users with motion sensitivity.
4. **Test with Screen Readers Regularly**: Validate critical checkout and authentication journeys using VoiceOver (macOS) and NVDA (Windows).
