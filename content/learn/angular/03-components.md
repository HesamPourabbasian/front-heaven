---
title: 'Components & Standalone Architecture'
description: 'Master Angular components: metadata, templates, styles, selectors, standalone components, lifecycle hooks, and smart/dumb component composition.'
order: 3
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 40
prerequisites: ['/learn/angular/02-typescript-fundamentals']
---

# Components & Standalone Architecture

In Angular, **Components** are the fundamental building blocks of the user interface. Every visual element on the screen—from a simple button or modal dialog to an entire analytics dashboard—is encapsulated within a component. A component combines a TypeScript class for state and logic, an HTML template for structural layout, and CSS/SCSS styles for presentation.

Modern Angular embraces a **Standalone-First** architecture. In previous versions of Angular, components had to be declared inside an `NgModule`. Today, standalone components declare their dependencies directly in their `@Component` decorator using the `imports` array. This makes components self-contained, easier to reason about, simple to lazy-load, and highly reusable across applications.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Angular Standalone Component                │
│                                                             │
│  @Component({                                               │
│    selector: 'app-user-card',                               │
│    standalone: true,                                        │
│    imports: [CommonModule, RouterLink, AvatarComponent],    │
│    templateUrl: './user-card.component.html',               │
│    styleUrls: ['./user-card.component.scss']                │
│  })                                                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ TypeScript Class (State & Logic)                      │  │
│  │  - Inputs, Signals, Methods, Computed values          │  │
│  └───────────────────────────────────────────────────────┘  │
│                             │                               │
│            ┌────────────────┴────────────────┐              │
│            ▼                                 ▼              │
│  ┌───────────────────┐             ┌─────────────────────┐  │
│  │   HTML Template   │             │   Component Style   │  │
│  │ (Structure & DOM) │             │ (Scoped CSS / SCSS) │  │
│  └───────────────────┘             └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Anatomy of the `@Component` Decorator

The `@Component` decorator attaches metadata to the TypeScript class, informing the Angular compiler how to process, instantiate, and render the component.

```typescript
import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="product-card">
      <h3>{{ title() }}</h3>
      <p class="price">\${{ price() }}</p>
      <button (click)="addToCart.emit(id())">Add to Cart</button>
    </article>
  `,
  styles: [`
    .product-card {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 1rem;
      transition: transform 0.2s ease;
      &:hover { transform: translateY(-2px); }
      .price { font-weight: 700; color: #059669; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
  // Modern Signal Inputs
  readonly id = input.required<string>();
  readonly title = input.required<string>();
  readonly price = input.required<number>();

  // Output event emitter
  readonly addToCart = output<string>();
}
```

## Component Selectors

The `selector` property defines the CSS selector Angular uses to identify and render this component within parent templates:

1. **Element Selector** (Default): `selector: 'app-user-badge'` -> Used in HTML as `<app-user-badge></app-user-badge>`.
2. **Attribute Selector**: `selector: '[appHighlight]'` -> Used in HTML as `<div appHighlight></div>`.
3. **Class Selector**: `selector: '.app-card'` -> Used in HTML as `<div class="app-card"></div>`.

## Component Lifecycle Overview

Angular manages the lifecycle of components as they are created, updated, and destroyed. Key lifecycle events include:

- **Constructor**: Class instantiation and dependency injection. No DOM or input signals should be manipulated here.
- **`ngOnInit()`**: Called once after Angular initializes inputs. Ideal for initial non-reactive setup.
- **`ngOnChanges()`**: Triggered when decorator inputs change (superseded by Signal effects and computeds in modern Angular).
- **`ngOnDestroy()`**: Called immediately before the component is removed from the DOM. Used for manual cleanup and closing subscriptions.
- **`afterNextRender()` & `afterEveryRender()`**: Modern callback functions executed after the browser paints the DOM.

## Smart (Container) vs Dumb (Presentational) Components

A foundational design pattern in Angular is the separation of components into two categories:

1. **Smart Components (Containers)**:
   - Aware of application state and services.
   - Inject services, dispatch actions, and fetch data from APIs.
   - Pass data down to child dumb components via inputs.
   - Handle output events and coordinate workflow.

2. **Dumb Components (Presentational)**:
   - Have zero dependencies on services or external state.
   - Receive data solely through `input()` signals.
   - Emit user intent solely through `output()` events.
   - Highly reusable, easily tested, and pure.

## Summary & Key Takeaways

- Components are the visual and functional heart of Angular applications.
- Modern Angular components are **Standalone by default**, explicitly listing their required imports in the `@Component` decorator.
- Component metadata configures the CSS selector, HTML template, scoped SCSS styles, and `OnPush` change detection.
- Component composition thrives on the Smart/Dumb pattern: Dumb components focus purely on UI and events, while Smart containers coordinate services and state.
- Modern Angular uses `input()` signals and `output()` emitters for clean, type-safe data flow.

## Best Practices & Senior Guidance

1. **Always Set `ChangeDetectionStrategy.OnPush`**: Configure every component with `changeDetection: ChangeDetectionStrategy.OnPush` to prevent unnecessary change detection cycles.
2. **Keep Presentational Components Pure**: Never inject global state services into presentational components; pass data in and emit events out.
3. **Colocate Component Files**: Keep `.ts`, `.html`, `.scss`, and `.spec.ts` files in the same directory using consistent kebab-case naming (`product-card.component.ts`).
4. **Use Single Responsibility Principle**: If a component exceeds 200–300 lines of template or TypeScript, break it down into smaller sub-components.
