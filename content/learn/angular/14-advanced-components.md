---
title: 'Advanced Components, Lifecycle & Queries'
description: 'Master advanced Angular component capabilities: lifecycle hooks (ngOnInit, ngOnDestroy, afterNextRender), content projection (<ng-content>), view queries (viewChild, viewChildren), and dynamic component instantiation.'
order: 14
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 45
prerequisites: ['/learn/angular/13-beginner-projects']
---

# Advanced Components, Lifecycle & Queries

As applications grow in complexity, standard component templates and simple property bindings are no longer sufficient. Enterprise systems require advanced component patterns: projecting dynamic content, querying child DOM elements and component instances, executing post-render DOM operations safely, and instantiating components dynamically at runtime.

Modern Angular provides a refined set of reactive primitives for querying views and managing render lifecycles. Functions like `viewChild()`, `contentChild()`, and `afterNextRender()` replace legacy decorators with signal-integrated, SSR-safe APIs.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Advanced Component Architecture             │
│                                                             │
│  Parent Component Template                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ <app-card>                                            │  │
│  │   <h2 card-header>User Profile</h2>  <!-- Projected -->│  │
│  │   <p>Body Content</p>                <!-- Projected -->│  │
│  │   <button card-footer>Save</button>  <!-- Projected -->│  │
│  │ </app-card>                                           │  │
│  └───────────────────────────────────────────────────────┘  │
│                             │                               │
│                             ▼                               │
│  Child Component (app-card) Template                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ <div class="card-header"><ng-content select="[card-header]"/></div>│
│  │ <div class="card-body"><ng-content /></div>              │
│  │ <div class="card-footer"><ng-content select="[card-footer]"/></div>│
│  └───────────────────────────────────────────────────────┘  │
│                             │                               │
│                             ▼                               │
│  Signal Queries: viewChild('inputRef'), contentChildren()   │
│  Render Hooks: afterNextRender(() => initChart())           │
└─────────────────────────────────────────────────────────────┘
```

## 1. Content Projection with `<ng-content>`

Content Projection (similar to "slots" in Vue or "children" in React) allows a parent component to inject arbitrary HTML markup, components, or templates into designated slots within a child component's template.

### Multi-Slot Content Projection

By adding the `select` attribute to `<ng-content>`, you can create named slots targeted by CSS selectors:

```typescript
// src/app/ui/modal-dialog.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-modal-dialog',
  standalone: true,
  template: `
    <div class="modal-backdrop">
      <div class="modal-window">
        <header class="modal-header">
          <!-- Slot 1: Header content -->
          <ng-content select="[dialog-title]" />
        </header>

        <section class="modal-body">
          <!-- Default Slot: Any unselected body content -->
          <ng-content />
        </section>

        <footer class="modal-footer">
          <!-- Slot 3: Action buttons -->
          <ng-content select="[dialog-actions]" />
        </footer>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: grid; place-items: center; }
    .modal-window { background: white; border-radius: 8px; width: 500px; padding: 1.5rem; }
    .modal-header { font-size: 1.25rem; font-weight: bold; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5rem; }
    .modal-footer { margin-top: 1rem; display: flex; justify-content: flex-end; gap: 0.5rem; }
  `]
})
export class ModalDialogComponent {}
```

Usage in parent template:

```html
<app-modal-dialog>
  <h3 dialog-title>Confirm Deletion</h3>
  <p>Are you sure you want to permanently delete this project? This action cannot be undone.</p>
  <div dialog-actions>
    <button class="btn-cancel">Cancel</button>
    <button class="btn-danger">Delete</button>
  </div>
</app-modal-dialog>
```

## 2. Modern View & Content Queries (`viewChild`, `contentChild`)

Modern Angular provides signal-based queries: `viewChild()`, `viewChildren()`, `contentChild()`, and `contentChildren()`. These functions return `Signal<ElementRef | Component | undefined>`, eliminating timing issues and manual lifecycle null checks.

```typescript
import { Component, ElementRef, viewChild, viewChildren, afterNextRender } from '@angular/core';

@Component({
  selector: 'app-auto-focus-search',
  standalone: true,
  template: `
    <input #searchInput type="search" placeholder="Type to search..." />
    <button (click)="clearInput()">Clear</button>
  `
})
export class AutoFocusSearchComponent {
  // Query child DOM element by template reference variable '#searchInput'
  readonly searchInput = viewChild.required<ElementRef<HTMLInputElement>>('searchInput');

  constructor() {
    // Safe DOM interaction after browser paint
    afterNextRender(() => {
      this.searchInput().nativeElement.focus();
    });
  }

  clearInput(): void {
    this.searchInput().nativeElement.value = '';
    this.searchInput().nativeElement.focus();
  }
}
```

## 3. Safe Post-Render Lifecycle: `afterNextRender` and `afterEveryRender`

In SSR (Server-Side Rendering) environments, standard browser DOM APIs (`window`, `document`, `localStorage`, `IntersectionObserver`, Canvas) do not exist on the server and will crash the Node.js process if executed during component initialization.

Modern Angular introduces **`afterNextRender`** and **`afterEveryRender`**. These lifecycle functions **only execute in the browser after Angular has rendered the DOM**:

```typescript
import { Component, ElementRef, viewChild, afterNextRender } from '@angular/core';

@Component({
  selector: 'app-chart-widget',
  standalone: true,
  template: `<canvas #chartCanvas></canvas>`
})
export class ChartWidgetComponent {
  readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('chartCanvas');

  constructor() {
    afterNextRender(() => {
      // Guaranteed to run ONLY in the browser after DOM is ready
      const ctx = this.canvasRef().nativeElement.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(10, 10, 150, 100);
      }
    });
  }
}
```

## 4. Dynamic Component Instantiation (`ViewContainerRef`)

When you need to dynamically render components on the fly (e.g. dynamic toast alerts, modal dialogs, or plugin widgets):

```typescript
import { Component, ViewContainerRef, inject, Type } from '@angular/core';

@Component({
  selector: 'app-dynamic-host',
  standalone: true,
  template: `
    <button (click)="loadWidget()">Load Dynamic Widget</button>
  `
})
export class DynamicHostComponent {
  private vcr = inject(ViewContainerRef);

  async loadWidget(): Promise<void> {
    this.vcr.clear();
    // Dynamically import component chunk
    const { AlertBannerComponent } = await import('./alert-banner.component');
    // Instantiate component in view container
    const compRef = this.vcr.createComponent(AlertBannerComponent);
  }
}
```

## Summary & Key Takeaways

- Multi-slot Content Projection (`<ng-content select="...">`) creates highly flexible, reusable container components.
- Modern `viewChild()` and `contentChild()` queries return typed Signals, providing clean reactive access to DOM elements and child components.
- `afterNextRender()` is the SSR-safe standard for DOM manipulation and third-party library initialization in the browser.
- `ViewContainerRef.createComponent()` dynamically instantiates components at runtime for modals, toasts, and plugins.

## Best Practices & Senior Guidance

1. **Never Access DOM in Constructor or `ngOnInit`**: Access DOM references inside `afterNextRender()` to prevent SSR crashes and null pointer exceptions.
2. **Use `viewChild.required()` for Guaranteed Elements**: If a template element is statically present, use `viewChild.required()` to avoid unnecessary `undefined` union checks.
3. **Prefer Content Projection Over Complex Flag Logic**: Instead of passing 10 boolean flags to configure a card layout, use `<ng-content>` slots to allow the caller to define the inner structure.
