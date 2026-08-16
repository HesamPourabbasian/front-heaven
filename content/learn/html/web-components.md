---
title: 'Web Components & Custom Elements'
description: 'Build native framework-free components with Custom Elements (customElements.define), Shadow DOM, template, and slot.'
order: 36
difficulty: 'advanced'
category: 'Level 11 - Advanced HTML'
estimatedMinutes: 25
prerequisites:
  - /learn/html/html-templates
---

## What are Web Components?

**Web Components** are a suite of browser-native standards that allow developers to create reusable, encapsulated custom HTML tags (like `<user-avatar>` or `<star-rating>`) that work in any frontend framework or pure HTML.

---

## The Three Core Pillars

1. **Custom Elements**: JavaScript APIs to define custom HTML tags and lifecycle callbacks.
2. **Shadow DOM**: Encapsulated DOM tree and CSS scoped strictly inside the component (styles cannot leak out or in).
3. **HTML Templates & Slots**: `<template>` and `<slot>` for declaring reusable templates and content injection points.

---

## Creating a Native Custom Element

```html
<!-- Using the custom HTML element in markup -->
<user-badge name="Hesam Pourabbasian" role="Frontend Architect"></user-badge>

<script>
class UserBadge extends HTMLElement {
  connectedCallback() {
    const name = this.getAttribute('name') || 'Guest';
    const role = this.getAttribute('role') || 'User';

    // Attach Shadow DOM for style encapsulation
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border-radius: 9999px;
          background: #0ea5e9;
          color: white;
          font-family: sans-serif;
          font-size: 12px;
        }
      </style>
      <div class="badge">
        <strong>${name}</strong>
        <span>(${role})</span>
      </div>
    `;
  }
}

// Register custom tag (tag name MUST contain a hyphen!)
customElements.define('user-badge', UserBadge);
</script>
```

---

## Summary & Key Takeaways

- Custom element tag names **must** contain a hyphen (e.g. `<my-card>`) to distinguish them from standard HTML elements.
- Shadow DOM prevents CSS style collisions across large applications.
- Web components run natively in all modern browsers without build tools.

---

## Practice Challenge

Build a custom `<star-rating value="4">` Web Component that displays 5 stars and highlights the active count using encapsulated Shadow DOM styles.
