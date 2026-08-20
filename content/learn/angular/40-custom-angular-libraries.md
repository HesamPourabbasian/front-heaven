---
title: 'Custom Angular Libraries & npm Packaging'
description: 'Master building custom Angular libraries: ng-packagr, Angular Package Format (APF), public API design (public-api.ts), semantic versioning (SemVer), npm publishing, and Storybook documentation.'
order: 40
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 50
prerequisites: ['/learn/angular/32-angular-cdk']
---

# Custom Angular Libraries & npm Packaging

In enterprise organizations, sharing UI component systems, authentication SDKs, and data access utilities across multiple applications is achieved by building and publishing **Custom Angular Libraries**.

Angular provides first-class library generation tooling powered by **`ng-packagr`**. `ng-packagr` compiles TypeScript and SCSS source code into the standardized **Angular Package Format (APF)**, ensuring full compatibility with modern bundlers (esbuild, Webpack, Vite, Rollup) and enabling seamless npm distribution.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Angular Package Format (APF) Output         │
│                                                             │
│  dist/my-ui-lib/                                            │
│  ├── fesm2022/                 # Flattened ES Modules       │
│  │   └── my-ui-lib.mjs         # Tree-shakable ES bundle    │
│  ├── index.d.ts                # Root TypeScript declarations│
│  ├── public-api.d.ts           # Public API signatures      │
│  └── package.json              # Exports map & metadata     │
└─────────────────────────────────────────────────────────────┘
```

## 1. Generating an Angular Library

```bash
# Generate a new library in workspace
ng generate library my-ui-lib --standalone
```

This scaffolds:
- `projects/my-ui-lib/src/public-api.ts`: The explicit public API contract.
- `projects/my-ui-lib/ng-package.json`: Configuration for `ng-packagr`.

## 2. Public API Encapsulation (`public-api.ts`)

A library must explicitly declare which components, directives, pipes, services, and types are public. Any internal helper function or private class omitted from `public-api.ts` remains hidden and inaccessible to consumers:

```typescript
// projects/my-ui-lib/src/public-api.ts

// Components
export * from './lib/components/button/button.component';
export * from './lib/components/badge/badge.component';
export * from './lib/components/modal/modal.component';

// Directives & Pipes
export * from './lib/directives/autofocus.directive';
export * from './lib/pipes/currency-formatter.pipe';

// Models & Types
export * from './lib/types/theme.types';
```

## 3. Building & Publishing to npm

```bash
# Compile library using ng-packagr
ng build my-ui-lib --configuration production

# Navigate to build output
cd dist/my-ui-lib

# Publish to private enterprise npm registry
npm publish --access restricted
```

## 4. Semantic Versioning (SemVer)

- **MAJOR (2.0.0)**: Breaking API changes (e.g. removing a component input or changing return types).
- **MINOR (1.1.0)**: Backward-compatible new features (e.g. adding a new optional input).
- **PATCH (1.0.1)**: Backward-compatible bug fixes.

## Summary & Key Takeaways

- `ng-packagr` packages Angular libraries into the official Angular Package Format (APF).
- `public-api.ts` defines the explicit public contract of your library.
- APF produces flattened ESM bundles optimized for tree-shaking and downstream compilation.
- Strict adherence to Semantic Versioning (SemVer) prevents breaking consumer applications.

## Best Practices & Senior Guidance

1. **Never Export Internal Implementation Details**: Keep internal calculation services and private helper classes unexported to preserve freedom to refactor internals.
2. **Provide Secondary Entry Points**: For large design systems, use `ng-packagr` secondary entry points (`my-ui-lib/button`, `my-ui-lib/table`) to allow consumers to import only what they need.
