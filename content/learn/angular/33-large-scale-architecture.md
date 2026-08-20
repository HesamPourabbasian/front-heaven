---
title: 'Large-Scale Enterprise Architecture & DDD'
description: 'Master large-scale enterprise Angular architecture: Feature-Driven modular structure, Domain-Driven Design (DDD), bounded contexts, Smart/Dumb component separation, and API abstraction facades.'
order: 33
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 55
prerequisites: ['/learn/angular/20-state-management']
---

# Large-Scale Enterprise Architecture & DDD

Building applications that scale to hundreds of developers, thousands of components, and millions of active users requires strict architectural discipline. Without clean boundaries, codebases inevitably degrade into tangled "spaghetti" architectures where modifying a single component causes cascading regressions across unrelated features.

Modern enterprise Angular architectures apply **Domain-Driven Design (DDD)** and **Feature-Sliced Architecture**, organizing code into isolated **Bounded Contexts** with strict unidirectional dependencies.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Enterprise DDD Folder Structure             │
│                                                             │
│  src/app/                                                   │
│  ├── core/                     # Application-wide singletons│
│  │   ├── auth/                 # Authentication & JWT tokens│
│  │   ├── http/                 # Interceptors & API client  │
│  │   └── layout/               # Shell header, nav, footer  │
│  ├── shared/                   # Universal dumb UI & utils  │
│  │   ├── ui/                   # Buttons, Badges, Modals    │
│  │   └── pipes/                # Currency, Date formatters  │
│  └── domains/                  # Isolated Bounded Contexts  │
│      ├── billing/              # Billing Domain             │
│      │   ├── data-access/      # Services, Stores, APIs     │
│      │   ├── feature-invoices/ # Smart Container Views      │
│      │   ├── ui-invoice-table/ # Presentational Dumb UI     │
│      │   └── billing.routes.ts # Feature routing definition │
│      └── inventory/            # Inventory Domain           │
└─────────────────────────────────────────────────────────────┘
```

## 1. The 4 Library/Folder Archetypes

In an enterprise architecture, every folder or library belongs to one of four strictly categorized types:

1. **`feature-*` (Smart Containers)**:
   - Routable pages and container components.
   - Injects domain facades/stores, coordinates workflow, and handles navigation.
2. **`ui-*` (Presentational Components)**:
   - Reusable, pure dumb components with zero service dependencies.
   - Accepts data via `input()` signals and emits events via `output()`.
3. **`data-access` (Domain Logic & State)**:
   - Contains API repositories, state stores (SignalStore), domain models, and validation rules.
4. **`util` (Pure Utilities)**:
   - Pure helper functions, custom date formatters, and utility types.

## 2. The Facade Pattern: Decoupling UI from State & APIs

A **Facade** provides a simplified, consolidated interface over complex underlying subsystems (HTTP services, caching stores, WebSocket connections):

```typescript
// src/app/domains/billing/data-access/billing.facade.ts
import { Injectable, inject } from '@angular/core';
import { BillingApiService } from './billing-api.service';
import { BillingStore } from './billing.store';

@Injectable({ providedIn: 'root' })
export class BillingFacade {
  private api = inject(BillingApiService);
  private store = inject(BillingStore);

  // Read-only state exposed to feature components
  readonly invoices = this.store.invoices;
  readonly isLoading = this.store.isLoading;
  readonly totalOutstanding = this.store.totalOutstanding;

  loadInvoices(): void {
    this.store.loadInvoices();
  }

  payInvoice(id: string): void {
    this.api.submitPayment(id).subscribe(() => {
      this.store.markAsPaid(id);
    });
  }
}
```

Feature components interact exclusively with the `BillingFacade`, remaining completely unaware of how state is stored or how API requests are structured.

## Summary & Key Takeaways

- Domain-Driven Design (DDD) separates massive applications into isolated bounded contexts.
- Code is structured into 4 archetypes: `feature`, `ui`, `data-access`, and `util`.
- The Facade pattern creates a clean abstraction boundary between UI components and backend state systems.
- Unidirectional dependencies ensure changes in one domain cannot break unrelated business domains.

## Best Practices & Senior Guidance

1. **Enforce Module Boundaries with ESLint**: Use `@nx/enforce-module-boundaries` to prevent features in Domain A from illegally importing internal logic from Domain B.
2. **Keep UI Components Completely Stateless**: Never inject `HttpClient` or global state stores into `ui-*` components.
3. **Co-locate Unit Tests with Source Code**: Keep `.spec.ts` files adjacent to their corresponding `.ts` implementations.
