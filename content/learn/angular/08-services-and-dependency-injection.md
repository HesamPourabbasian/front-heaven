---
title: 'Services & Dependency Injection'
description: 'Master Angular Services and Dependency Injection (DI): @Injectable, providedIn: 'root', modern inject() function, singleton lifecycles, and architectural separation of concerns.'
order: 8
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 40
prerequisites: ['/learn/angular/07-components-communication']
---

# Services & Dependency Injection

**Dependency Injection (DI)** is the architectural cornerstone of Angular. It is a design pattern in which a class requests dependencies from external sources rather than creating them directly with the `new` operator. In Angular, **Services** are classes that encapsulate business logic, API calls, data caching, authentication, and state management, keeping components focused purely on rendering the user interface.

Angular's DI framework maintains an internal hierarchical injector system. When a component or service requests a dependency, the injector resolves and delivers the required instance. If the dependency has already been created, the injector supplies the existing singleton instance; otherwise, it instantiates it and manages its lifecycle.

```text
┌─────────────────────────────────────────────────────────────┐
│               Angular Dependency Injection Architecture     │
│                                                             │
│    Root Injector (providedIn: 'root')                       │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  AuthService (Singleton)                              │  │
│  │  ProductService (Singleton)                           │  │
│  └───────────────────────────────────────────────────────┘  │
│               │                             │               │
│               ▼                             ▼               │
│  ┌────────────────────────┐   ┌──────────────────────────┐  │
│  │  NavbarComponent       │   │  ProductCatalogComponent │  │
│  │  inject(AuthService)   │   │  inject(ProductService)  │  │
│  └────────────────────────┘   └──────────────────────────┘  │
│                                                             │
│  Benefits:                                                  │
│  - Loose coupling & high modularity                         │
│  - Effortless unit testing via dependency mocking           │
│  - Automatic lifecycle management and lazy loading          │
└─────────────────────────────────────────────────────────────┘
```

## 1. Creating an Injectable Service

A service is declared as a TypeScript class adorned with the `@Injectable()` decorator. The `providedIn: 'root'` metadata configures the service as an application-wide singleton that is automatically available to all components and services without requiring manual provider configuration:

```typescript
import { Injectable, signal, computed } from '@angular/core';

export interface Product {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
}

@Injectable({
  providedIn: 'root' // Available application-wide as a singleton
})
export class ProductService {
  // Private writable signal
  private readonly _products = signal<Product[]>([
    { id: '1', name: 'Mechanical Keyboard', price: 120, inStock: true },
    { id: '2', name: '4K Monitor', price: 350, inStock: false },
    { id: '3', name: 'Wireless Mouse', price: 60, inStock: true },
  ]);

  // Public read-only signal
  public readonly products = this._products.asReadonly();

  // Derived computed state
  public readonly inStockCount = computed(() =>
    this._products().filter(p => p.inStock).length
  );

  addProduct(product: Product): void {
    this._products.update(list => [...list, product]);
  }

  toggleStock(id: string): void {
    this._products.update(list =>
      list.map(p => p.id === id ? { ...p, inStock: !p.inStock } : p)
    );
  }
}
```

## 2. Injecting Services: The Modern `inject()` Function

In modern Angular, the recommended way to inject dependencies is using the `inject()` function. The `inject()` function replaces traditional constructor parameter injection with cleaner, more composable syntax:

```typescript
import { Component, inject } from '@angular/core';
import { ProductService } from './product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  template: `
    <h2>Available Products (In Stock: {{ productService.inStockCount() }})</h2>
    <ul>
      @for (prod of productService.products(); track prod.id) {
        <li>
          <strong>{{ prod.name }}</strong> - \${{ prod.price }}
          <button (click)="productService.toggleStock(prod.id)">
            Toggle ({{ prod.inStock ? 'In Stock' : 'Out of Stock' }})
          </button>
        </li>
      }
    </ul>
  `
})
export class ProductListComponent {
  // Modern dependency injection
  readonly productService = inject(ProductService);
}
```

### Advantages of `inject()` over Constructor Injection:
1. **Cleaner Class Declarations**: No bulky constructor parameter lists or `super()` boilerplate in inherited classes.
2. **Type Inference**: Return types are inferred directly from the token: `inject(ProductService)` returns `ProductService`.
3. **Composable Functional Helpers**: You can write reusable functional utilities that call `inject()` internally (e.g. `injectAuth()`, `injectParams()`).

## 3. Singleton Services & Tree-Shaking

When a service specifies `providedIn: 'root'`, it achieves two critical architectural benefits:
- **Singleton Lifecycle**: Exactly one instance of the service exists in the browser memory for the entire duration of the user's session.
- **Automatic Tree-Shaking**: If no component, service, or route imports or injects the service, the Angular build optimizer completely excludes the service from the production JavaScript bundle.

## Summary & Key Takeaways

- Dependency Injection (DI) allows components to request dependencies declaratively without managing their lifecycle directly.
- Services encapsulate business logic, asynchronous data operations, and state management.
- `@Injectable({ providedIn: 'root' })` registers a service as an application-wide singleton that is tree-shakable.
- The `inject()` function is the modern standard for resolving dependencies in Angular components, services, and functions.

## Best Practices & Senior Guidance

1. **Keep Components Skinny**: Components should contain minimal business logic. Delegate API calls, calculations, and data mutations to services.
2. **Default to `providedIn: 'root'`**: Unless you explicitly need a new instance of a service per component lifetime, always use `providedIn: 'root'`.
3. **Encapsulate State in Services**: Keep internal state signals private (`private readonly _state = signal(...)`) and expose read-only signals to consumers.
