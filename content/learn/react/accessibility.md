---
title: "React Accessibility (a11y)"
technology: "react"
difficulty: "intermediate"
estimatedMinutes: 25
order: 28
description: "WCAG standards, ARIA attributes, keyboard navigation, focus management, screen readers, and automated audits."
---

# React Accessibility (a11y)

Web accessibility (often abbreviated as **a11y**) ensures that digital experiences can be perceived, understood, navigated, and interacted with by everyone, including people with visual, auditory, motor, or cognitive disabilities. In React, accessibility is not an afterthought—it must be baked into component architecture from day one.

In this lesson, you will learn how to apply semantic HTML, manage focus in modals and dropdowns, use ARIA attributes correctly, and conduct automated accessibility audits.

## 1. Semantic Markup & Form Labels

The easiest way to make a React component accessible is using native HTML5 elements. Native buttons, inputs, and headings provide keyboard interaction and screen reader announcements automatically:

```jsx
// ✅ Accessible Form Control:
function SearchInput({ id, value, onChange }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-bold">Search Articles</label>
      <input
        id={id}
        type="search"
        value={value}
        onChange={onChange}
        className="input"
      />
    </div>
  );
}
```

## 2. Focus Management in Modals

When a modal dialog opens, keyboard focus must move inside the modal, stay trapped within it (Focus Trap), and return to the triggering button when closed:

```jsx
import { useEffect, useRef } from 'react';

export function AccessibleModal({ isOpen, onClose, title, children }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus(); // Focus modal on open
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div ref={modalRef} tabIndex={-1} className="modal-card outline-none">
        <h2 id="modal-title">{title}</h2>
        <div>{children}</div>
        <button onClick={onClose} aria-label="Close modal">✕</button>
      </div>
    </div>
  );
}
```

## 3. Announcing Dynamic Updates with ARIA Live Regions

When content updates dynamically on screen without a page reload (such as toast notifications or search results), screen readers must be informed using `aria-live`:

```jsx
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {statusMessage}
</div>
```

## Best Practices

- **Never Replace Native Buttons with Divs**: Avoid `<div onClick={...}>`. Native `<button>` tags provide Space/Enter key execution and focus outlines automatically.
- **Test with Keyboard Only**: Navigate your application using only the `Tab`, `Enter`, and `Escape` keys to ensure full interactive reachability.
- **Run Automated axe-core Audits**: Integrate `eslint-plugin-jsx-a11y` and Lighthouse to catch contrast and attribute issues automatically.

## Summary

Building accessible React components requires semantic HTML, keyboard focus management, and proper ARIA annotations. Accessible engineering ensures inclusive web applications that comply with WCAG 2.2 AA standards.
