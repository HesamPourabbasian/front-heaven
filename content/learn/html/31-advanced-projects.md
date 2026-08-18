---
title: 'Advanced Projects: Enterprise Systems & PWA Architecture'
description: 'Build enterprise-grade HTML systems: Accessible Design System Web Components, Offline-First Progressive Web App (PWA), and High-Performance SSR News Platform.'
order: 31
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 35
prerequisites:
  - /learn/html/30-validation-and-tooling
---

# Advanced Projects: Enterprise Systems & PWA Architecture

To complete the **Level 3 (Advanced)** HTML engineering journey, you must synthesize every discipline covered in this curriculum—browser rendering pipelines, Core Web Vitals optimization, WAI-ARIA authoring practices, Web Components, security CSP headers, and offline Service Workers—into production-ready enterprise systems.

In this capstone lesson, we construct two complete advanced architectural blueprints: an **Enterprise Design System Custom Element Suite** and a **Complete Offline-First Progressive Web App (PWA)** with Service Worker caching and Web Manifest metadata.

```text
┌────────────────────────────────────────────────────────────┐
│                 Level 3 Advanced Capstone Matrix           │
├────────────────────────────────────────────────────────────┤
│ 1. Enterprise Design System Custom Element                 │
│ (Shadow DOM, Constructable Stylesheets, Keyboard APG)      │
├────────────────────────────────────────────────────────────┤
│ 2. Offline-First Progressive Web App (PWA)                 │
│ (Web App Manifest, Service Worker Cache-First, Offline UI) │
└────────────────────────────────────────────────────────────┘
```

## Project Blueprint 1: Accessible Modal Web Component (`enterprise-modal.ts`)

```typescript
// components/enterprise-modal.ts
const modalStyles = new CSSStyleSheet();
modalStyles.replaceSync(`
  :host {
    display: contents;
  }
  dialog {
    border: none;
    border-radius: 12px;
    padding: 24px;
    background: #0f172a;
    color: #f8fafc;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    max-width: 500px;
    width: 90vw;
  }
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
  }
  .header-slot {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 12px;
  }
  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
  }
`);

export class EnterpriseModal extends HTMLElement {
  private dialogElement!: HTMLDialogElement;
  private openerElement: HTMLElement | null = null;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.adoptedStyleSheets = [modalStyles];

    shadow.innerHTML = `
      <dialog id="native-dialog" aria-modal="true">
        <div class="header-slot"><slot name="title">Modal Title</slot></div>
        <div class="body-slot"><slot>Default modal content</slot></div>
        <form method="dialog" class="actions">
          <slot name="actions">
            <button value="cancel">Close</button>
          </slot>
        </form>
      </dialog>
    `;

    this.dialogElement = shadow.querySelector("#native-dialog")!;
  }

  connectedCallback() {
    this.dialogElement.addEventListener("close", () => {
      this.openerElement?.focus(); // Automatic focus restoration!
      this.dispatchEvent(new CustomEvent("modal-closed", { detail: this.dialogElement.returnValue }));
    });
  }

  public open(trigger?: HTMLElement) {
    this.openerElement = trigger || null;
    this.dialogElement.showModal();
  }

  public close() {
    this.dialogElement.close();
  }
}

customElements.define("enterprise-modal", EnterpriseModal);
```

## Project Blueprint 2: Offline-First Progressive Web App (`index.html`)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Front-Heaven Offline Reader — Progressive Web App</title>
    <meta name="description" content="Offline-first curriculum reader for web developers." />

    <!-- Web App Manifest for Native OS Installation -->
    <link rel="manifest" href="/manifest.webmanifest" />
    <meta name="theme-color" content="#0f172a" />
    <link rel="apple-touch-icon" href="/icons/icon-192.png" />

    <!-- Performance Preloads -->
    <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin />
  </head>
  <body>
    <header>
      <nav aria-label="Main PWA Navigation">
        <h1>Front-Heaven PWA</h1>
        <span id="network-badge" class="badge">Online</span>
      </nav>
    </header>

    <main id="main">
      <article>
        <h2>Offline-Ready Learning Modules</h2>
        <p>This entire application runs without an internet connection once cached.</p>
      </article>
    </main>

    <!-- Register Service Worker -->
    <script type="module">
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', async () => {
          try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('PWA ServiceWorker registered with scope:', registration.scope);
          } catch (err) {
            console.error('ServiceWorker registration failed:', err);
          }
        });
      }

      // Real-Time Online / Offline Detection
      const updateNetworkStatus = () => {
        const badge = document.getElementById('network-badge');
        if (navigator.onLine) {
          badge.textContent = 'Online';
          badge.className = 'badge badge-success';
        } else {
          badge.textContent = 'Offline (Cached Mode)';
          badge.className = 'badge badge-warning';
        }
      };
      window.addEventListener('online', updateNetworkStatus);
      window.addEventListener('offline', updateNetworkStatus);
    </script>
  </body>
</html>
```

## Summary

- The Enterprise Modal Web Component encapsulates styles in the Shadow DOM and automates focus restoration.
- Progressive Web Apps leverage Web Manifests and Service Workers to deliver instant offline experiences.
- Online/offline event listeners give users transparent feedback about network connectivity state.
- Combining native dialogs, preloaded fonts, and service worker caches yields 100/100 Lighthouse scores.

## Best Practices

1. **Adopt Constructable Stylesheets in Web Components**: Prevent memory overhead when rendering thousands of instances.
2. **Always Restore Focus in Component Lifecycle**: Ensure keyboard navigation continuity after modal dismissal.
3. **Provide High-Resolution Icons in Web Manifests**: Supply 192x192 and 512x512 PNG icons for mobile homescreens.
4. **Test Offline Mode in Chrome DevTools**: Validate that the application functions seamlessly with network throttling set to "Offline".
