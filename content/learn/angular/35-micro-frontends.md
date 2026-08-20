---
title: 'Micro-Frontends & Module Federation'
description: 'Master micro-frontends in Angular: Module Federation architecture, Host (Shell) and Remote application configuration, runtime integration, shared singleton dependencies, and cross-application communication.'
order: 35
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 55
prerequisites: ['/learn/angular/34-nx-and-monorepos']
---

# Micro-Frontends & Module Federation

As organizations scale to dozens of autonomous engineering squads, maintaining a single monolithic frontend deployment becomes an operational bottleneck. Deployments require extensive cross-team synchronization, merge conflicts proliferate, and a failure in one feature can bring down the entire application.

**Micro-Frontends** decompose a monolithic frontend into independent, loosely coupled applications developed and deployed autonomously by separate teams. Using **Webpack / Rspack Module Federation** (via `@angular-architects/module-federation`), Angular applications can dynamically load independently deployed remote chunks at runtime while sharing singleton framework dependencies (`@angular/core`, `rxjs`, `@angular/router`).

```text
┌─────────────────────────────────────────────────────────────┐
│                 Module Federation Architecture              │
│                                                             │
│  Host / Shell Application (Shell App: Port 4200)            │
│  ├── Global Navigation Bar & Theme Engine                   │
│  ├── Authentication & Session State                         │
│  └── Router with Dynamic Remote Routes                      │
│            │                                   │            │
│            ▼ (Runtime Dynamic Import)          ▼            │
│  ┌─────────────────────────┐       ┌──────────────────────┐ │
│  │ Remote 1: Billing App   │       │ Remote 2: Catalog App│ │
│  │ (Deployed on Port 4201) │       │ (Deployed Port 4202) │ │
│  │ - Standalone Routes     │       │ - Standalone Routes  │ │
│  │ - Invoices & Payments   │       │ - Search & Products  │ │
│  └─────────────────────────┘       └──────────────────────┘ │
│            │                                   │            │
│            └───────────────┬───────────────────┘            │
│                            ▼                                │
│  Shared Singletons: @angular/core, @angular/common, rxjs    │
└─────────────────────────────────────────────────────────────┘
```

## 1. Configuring Module Federation in Host & Remotes

Install the module federation plugin:

```bash
npm install @angular-architects/module-federation --save-dev
```

### Remote Application Configuration (`federation.config.js`)

The remote application exposes specific standalone routes or components:

```javascript
const { withModuleFederationPlugin, shareAll } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  name: 'billing_remote',
  filename: 'remoteEntry.js',
  exposes: {
    // Expose standalone routes object
    './Routes': './src/app/features/billing/billing.routes.ts',
  },
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
});
```

### Host / Shell Router Configuration

In the Host application's `app.routes.ts`, load the remote routes dynamically via `loadChildren`:

```typescript
import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'billing',
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'https://billing.internal.company.com/remoteEntry.js',
        exposedModule: './Routes'
      }).then(m => m.BILLING_ROUTES)
  }
];
```

## 2. Shared Dependencies & Singleton Coordination

To ensure that services decorated with `@Injectable({ providedIn: 'root' })` remain true singletons across both Host and Remote applications, all framework packages must be marked with `singleton: true` in the federation configuration.

## 3. Cross-Application Communication

Micro-frontends should remain as isolated as possible. When cross-application communication is strictly required (e.g. notifying the shell of session expiry):
- Use standard browser **`CustomEvent`** dispatched on `window`.
- Use the **`BroadcastChannel`** API for cross-tab or cross-iframe communication.
- Use a dedicated, versioned `@shared/event-bus` library.

## Summary & Key Takeaways

- Micro-frontends allow autonomous engineering squads to develop, test, and deploy independently.
- Module Federation loads remote code at runtime without requiring iframe wrappers.
- Shared singletons prevent loading duplicate copies of Angular core libraries.
- Decoupled routing allows seamless navigation between host and remote features.

## Best Practices & Senior Guidance

1. **Do Not Default to Micro-Frontends**: Micro-frontends introduce significant operational complexity. Use them only when organization size (>50 developers) necessitates independent release pipelines.
2. **Align Angular Major Versions**: Ensure host and remote applications share the same Angular major release to avoid runtime injection incompatibility.
