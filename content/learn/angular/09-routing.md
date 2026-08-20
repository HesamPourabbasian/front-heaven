---
title: 'Angular Router & Navigation'
description: 'Master the Angular Router: route definitions, router outlet, routerLink directives, navigation, route parameters with component input binding, child routes, and redirects.'
order: 9
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 40
prerequisites: ['/learn/angular/08-services-and-dependency-injection']
---

# Angular Router & Navigation

In single-page applications (SPAs), users navigate between views, workflows, and pages without triggering full browser page reloads. The **Angular Router** is an enterprise routing engine that translates browser URL changes into component tree transitions, manages browser history, handles query parameters, and supports lazy loading.

In modern Angular with standalone architecture, the router is configured in `app.config.ts` using `provideRouter(routes)` alongside modern feature flags like `withComponentInputBinding()`, which automatically maps route parameters directly into component `input()` signals.

```text
┌─────────────────────────────────────────────────────────────┐
│                    Angular Router Architecture              │
│                                                             │
│  Browser URL: /products/42?tab=reviews                      │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    App Component                      │  │
│  │  <nav>                                                │  │
│  │    <a routerLink="/products" routerLinkActive="active"│  │
│  │  </nav>                                               │  │
│  │                                                       │  │
│  │  <router-outlet></router-outlet>                      │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │ ProductDetailComponent                          │  │  │
│  │  │ - id = input.required<string>()  // '42'        │  │  │
│  │  │ - tab = input<string>()          // 'reviews'   │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 1. Defining Routes & Configuring the Router

Routes are defined as an array of `Route` objects mapping URL path patterns to standalone components:

```typescript
// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full', // Exact URL match required for redirect
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component')
        .then(m => m.DashboardComponent),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./features/products/product-list.component')
        .then(m => m.ProductListComponent),
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./features/products/product-detail.component')
        .then(m => m.ProductDetailComponent),
  },
  {
    path: '**', // Wildcard route for 404 Not Found
    loadComponent: () =>
      import('./core/not-found/not-found.component')
        .then(m => m.NotFoundComponent),
  }
];
```

In `app.config.ts`:

```typescript
// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(), // Bind route params to component inputs
      withViewTransitions(),       // Native browser view transitions
    )
  ]
};
```

## 2. Rendering Routed Components: `<router-outlet>`

The `<router-outlet>` directive acts as a dynamic placeholder in your template where the router renders the active route component:

```typescript
// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="app-header">
      <nav>
        <a routerLink="/dashboard" routerLinkActive="active-nav">Dashboard</a>
        <a routerLink="/products" routerLinkActive="active-nav">Products</a>
      </nav>
    </header>

    <main class="main-content">
      <!-- Active route component renders here -->
      <router-outlet />
    </main>
  `,
  styles: [`
    .active-nav { font-weight: 700; color: #ef4444; border-bottom: 2px solid #ef4444; }
  `]
})
export class AppComponent {}
```

## 3. Reading Route Parameters via `input()` Signals

When `withComponentInputBinding()` is enabled, route parameters (e.g. `:id`), query parameters (e.g. `?tab=reviews`), and route data are bound directly to component `input()` signals:

```typescript
// src/app/features/products/product-detail.component.ts
import { Component, input, inject, effect } from '@angular/core';
import { ProductService } from './product.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  template: `
    <article>
      <h2>Product Details for ID: {{ id() }}</h2>
      <p>Active Tab: {{ tab() ?? 'overview' }}</p>
    </article>
  `
})
export class ProductDetailComponent {
  // Automatically populated from route path ':id'
  readonly id = input.required<string>();

  // Automatically populated from query parameter '?tab=...'
  readonly tab = input<string>();
}
```

## 4. Programmatic Navigation

To navigate programmatically in response to user actions or completed API requests, inject the `Router` service:

```typescript
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout-button',
  standalone: true,
  template: `<button (click)="proceedToPayment()">Pay Now</button>`
})
export class CheckoutButtonComponent {
  private router = inject(Router);

  proceedToPayment(): void {
    // Navigate programmatically with query parameters
    this.router.navigate(['/checkout', 'summary'], {
      queryParams: { step: 2, promo: 'SUMMER2026' }
    });
  }
}
```

## Summary & Key Takeaways

- The Angular Router enables client-side single-page navigation without page reloads.
- Standalone routes use `loadComponent` with dynamic `import()` statements for instant lazy loading.
- Enable `withComponentInputBinding()` to receive route parameters and query parameters directly as `input()` signals.
- Use `routerLink` for declarative navigation and `Router.navigate()` for programmatic navigation.
- The wildcard `**` route catches unmatched paths and displays 404 pages.

## Best Practices & Senior Guidance

1. **Always Lazy Load Route Components**: Use `loadComponent: () => import(...)` for all feature routes to keep initial bundle sizes minimal.
2. **Use `withComponentInputBinding()`**: Eliminate verbose `ActivatedRoute.snapshot.params` subscriptions by using signal inputs for route parameters.
3. **Always Include a Wildcard 404 Route**: Place the `{ path: '**', ... }` catch-all route at the very end of your routes array.
