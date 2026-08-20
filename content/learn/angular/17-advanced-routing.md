---
title: 'Advanced Routing, Guards & Resolvers'
description: 'Master advanced Angular routing: lazy-loaded standalone components and children, functional route guards (canActivate, canDeactivate), functional resolvers, route data, and preloading strategies.'
order: 17
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 45
prerequisites: ['/learn/angular/09-routing']
---

# Advanced Routing, Guards & Resolvers

In enterprise applications, the router is much more than a URL-to-component matcher. It acts as the navigation security boundary, data pre-fetcher, and performance optimization engine. Advanced routing entails protecting sensitive routes with authentication guards, warning users before discarding unsaved form changes, pre-fetching critical route data with resolvers, and fine-tuning chunk preloading strategies.

Modern Angular has deprecated legacy class-based route guards and resolvers in favor of **Functional Route Guards and Resolvers** (`CanActivateFn`, `CanDeactivateFn`, `ResolveFn`). Functional guards are concise, composable, and leverage `inject()` to access services directly.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Angular Route Navigation Lifecycle          │
│                                                             │
│  User clicks /admin link                                    │
│             │                                               │
│             ▼                                               │
│  1. Check canActivate / canMatch Guards (authGuard, rbacGuard)│
│     ├── Allowed: Continue                                   │
│     └── Denied: Redirect to /login or return false          │
│             │                                               │
│             ▼                                               │
│  2. Execute Resolvers (resolve: { data: productResolver })  │
│     └── Pre-fetch data before route activation              │
│             │                                               │
│             ▼                                               │
│  3. Lazy Load Component Chunk (loadComponent: () => import) │
│             │                                               │
│             ▼                                               │
│  4. Activate Route & Render inside <router-outlet>          │
└─────────────────────────────────────────────────────────────┘
```

## 1. Functional Route Guards (`CanActivateFn`)

A route guard decides whether a route can be activated. Modern functional guards are defined as simple functions returning `boolean`, `UrlTree`, or an `Observable`/`Promise` thereof:

```typescript
// src/app/core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirect unauthenticated users to login with return URL
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};
```

### Role-Based Access Control (RBAC) Guard

Guards can inspect static route `data` to enforce permission rules:

```typescript
// src/app/core/guards/role.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRole = route.data['requiredRole'] as string;

  if (authService.hasRole(requiredRole)) {
    return true;
  }

  return router.createUrlTree(['/unauthorized']);
};
```

## 2. Preventing Data Loss with `CanDeactivateFn`

The `CanDeactivateFn` guard warns users if they attempt to navigate away from a view with unsaved form changes:

```typescript
// src/app/core/guards/pending-changes.guard.ts
import { CanDeactivateFn } from '@angular/router';

export interface ComponentCanDeactivate {
  hasUnsavedChanges(): boolean;
}

export const pendingChangesGuard: CanDeactivateFn<ComponentCanDeactivate> = (component) => {
  if (component.hasUnsavedChanges()) {
    return confirm('You have unsaved changes. Are you sure you want to leave this page?');
  }
  return true;
};
```

## 3. Functional Route Resolvers (`ResolveFn`)

Resolvers pre-fetch data before the route is activated, guaranteeing that the target component renders with ready data:

```typescript
// src/app/features/products/product.resolver.ts
import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { ProductService, Product } from './product.service';
import { catchError, EMPTY } from 'rxjs';

export const productResolver: ResolveFn<Product> = (route) => {
  const productService = inject(ProductService);
  const router = inject(Router);
  const id = route.paramMap.get('id')!;

  return productService.fetchProductById(id).pipe(
    catchError(() => {
      router.navigate(['/products']);
      return EMPTY;
    })
  );
};
```

## 4. Assembling Advanced Routes Configuration

```typescript
// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { pendingChangesGuard } from './core/guards/pending-changes.guard';
import { productResolver } from './features/products/product.resolver';

export const routes: Routes = [
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { requiredRole: 'admin' },
    loadChildren: () =>
      import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
  },
  {
    path: 'editor/:id',
    canActivate: [authGuard],
    canDeactivate: [pendingChangesGuard],
    resolve: { product: productResolver },
    loadComponent: () =>
      import('./features/editor/editor.component').then(m => m.EditorComponent),
  }
];
```

## 5. Preloading Strategies

By default, lazy chunks load on demand when clicked. To improve perceived performance, configure a preloading strategy in `provideRouter`:

```typescript
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withPreloading(PreloadAllModules))
  ]
};
```

## Summary & Key Takeaways

- Functional Route Guards (`CanActivateFn`, `CanDeactivateFn`) secure navigation and prevent data loss.
- Guards can return a `UrlTree` to redirect unauthorized navigation smoothly.
- Functional Resolvers (`ResolveFn`) fetch critical data before component activation.
- `PreloadAllModules` loads lazy chunks in the background after initial app bootstrap.

## Best Practices & Senior Guidance

1. **Return `UrlTree` Instead of `false`**: Always return `router.createUrlTree(['/login'])` in guards so the router redirects cleanly instead of hanging.
2. **Keep Resolvers Lightweight**: Resolvers block route transitions until data returns. For heavy datasets, load skeleton screens in the component instead of blocking navigation in resolvers.
3. **Use `loadChildren` for Feature Sub-Trees**: Group feature sub-routes into dedicated `.routes.ts` files and lazy load them together with `loadChildren`.
