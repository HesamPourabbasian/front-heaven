---
title: 'Web Components, Shadow DOM & Custom Elements'
description: 'Master native Web Components: Custom Elements API, encapsulated Shadow DOM, HTML <template> and <slot> projections, component lifecycle callbacks, and Constructable Stylesheets.'
order: 26
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 30
prerequisites:
  - /learn/html/25-advanced-media
---

# Web Components, Shadow DOM & Custom Elements

**Web Components** are a suite of native browser platform technologies that allow developers to create reusable, fully encapsulated custom HTML elements—with their own markup structure, scoped CSS styles, and JavaScript behaviors—that work across all modern browsers and seamlessly integrate with any framework (Vue, React, Svelte, Angular, or Vanilla JS).

In this lesson, we explore the three pillars of Web Components: the **Custom Elements API**, the **Shadow DOM**, and the **HTML `<template>` and `<slot>`** system.

```text
┌────────────────────────────────────────────────────────────┐
│                    Web Components Architecture             │
├────────────────────────────────────────────────────────────┤
│ <user-card avatar="/avatar.jpg" role="Admin">              │
│   <span slot="username">Hesam Pourabbasian</span>          │
│                                                            │
│   ┌── #shadow-root (open) ───────────────────────────────┐ │
│   │ <style> :host { display: block; border: 1px solid } │ │
│   │ <img class="avatar" src="..." />                     │ │
│   │ <slot name="username"></slot>                        │ │
│   │ <span class="role-badge">Admin</span>                │ │
│   └──────────────────────────────────────────────────────┘ │
│ </user-card>                                               │
└────────────────────────────────────────────────────────────┘
```

## 1. Custom Elements & Lifecycle Callbacks

To create a Custom Element, extend `HTMLElement` and register it with `customElements.define()`:

```typescript
export class UserCardComponent extends HTMLElement {
  // 1. Observe specific attribute changes
  static get observedAttributes() {
    return ["avatar", "role"];
  }

  // 2. Lifecycle: Element is connected to the DOM
  connectedCallback() {
    this.render();
  }

  // 3. Lifecycle: Observed attribute modified
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  // 4. Lifecycle: Element disconnected / removed from DOM
  disconnectedCallback() {
    this.cleanupListeners();
  }

  private render() {
    const avatar = this.getAttribute("avatar") || "/default-avatar.png";
    const role = this.getAttribute("role") || "Member";

    this.innerHTML = `
      <div class="user-card">
        <img src="${avatar}" alt="User Avatar" width="48" height="48" />
        <span class="badge">${role}</span>
      </div>
    `;
  }

  private cleanupListeners() {}
}

// Custom element tag names MUST contain a hyphen (-) to prevent conflicts with standard HTML!
customElements.define("user-card", UserCardComponent);
```

Once registered, you can use `<user-card avatar="/img.jpg" role="Admin"></user-card>` anywhere in your HTML!

## 2. Encapsulated Styling with the Shadow DOM

By default, global CSS styles bleed into child components. The **Shadow DOM** provides complete DOM and CSS encapsulation:

```typescript
export class EncapsulatedCard extends HTMLElement {
  constructor() {
    super();
    // Attach Shadow Root in 'open' mode
    const shadow = this.attachShadow({ mode: "open" });

    shadow.innerHTML = `
      <style>
        /* Scoped to this component only! Cannot leak out or be overwritten by global CSS */
        :host {
          display: block;
          padding: 1rem;
          border-radius: 0.5rem;
          background: var(--card-bg, #ffffff);
        }
        h3 {
          color: #2563eb;
          margin: 0 0 0.5rem 0;
        }
      </style>
      <div class="card-body">
        <h3>Encapsulated Component</h3>
        <slot></slot> <!-- Projection slot for consumer content -->
      </div>
    `;
  }
}

customElements.define("encapsulated-card", EncapsulatedCard);
```

## 3. Slot Projections: `<template>` & `<slot>`

Use named slots to project external markup into specific areas of the shadow tree:

```html
<!-- Component Definition with Named Slots -->
<template id="dialog-template">
  <div class="dialog-box">
    <header><slot name="header">Default Header</slot></header>
    <main><slot>Default body text</slot></main>
    <footer><slot name="footer"></slot></footer>
  </div>
</template>
```

```html
<!-- Component Consumer -->
<custom-dialog>
  <h2 slot="header">Delete Account</h2>
  <p>This action cannot be undone.</p>
  <button slot="footer">Confirm</button>
</custom-dialog>
```

## 4. Constructable Stylesheets

Instead of duplicating `<style>` tags across 1,000 custom component instances, share a single compiled **Constructable Stylesheet**:

```typescript
const sharedSheet = new CSSStyleSheet();
sharedSheet.replaceSync(`
  :host { font-family: system-ui, sans-serif; }
  .badge { background: #3b82f6; color: white; border-radius: 9999px; }
`);

export class HighPerfWidget extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    // Adopt shared stylesheet across thousands of instances with 0 memory overhead!
    shadow.adoptedStyleSheets = [sharedSheet];
  }
}
```

## Summary

- Web Components create framework-agnostic custom HTML tags that run natively in the browser.
- Custom element tag names must always include a hyphen (e.g., `<user-card>`).
- The Shadow DOM provides complete DOM tree and CSS style encapsulation.
- `<slot>` elements project consumer markup into designated component insertion points.
- Constructable Stylesheets (`adoptedStyleSheets`) share CSS rules across instances with zero memory bloat.

## Best Practices

1. **Always Include a Hyphen in Custom Tag Names**: Ensure compatibility with browser specifications.
2. **Use CSS Custom Properties for Theming**: Allow consumers to customize styles through the Shadow DOM boundary (`var(--theme-color)`).
3. **Always Clean Up Listeners in `disconnectedCallback`**: Prevent memory leaks when components are removed.
4. **Provide Fallback Slot Content**: Ensure components look clean even when optional slots are omitted.
