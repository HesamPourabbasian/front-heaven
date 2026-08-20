---
title: 'Large-Scale Applications & Tailwind Monorepos'
description: 'Master Tailwind in large monorepos (Nx, Turborepo, pnpm workspaces): shared @org/tailwind-config packages, shared design token packages, multi-application theme syncing, and package exports.'
order: 29
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 50
prerequisites: ['/learn/tailwindcss/23-tailwind-architecture']
---

# Large-Scale Applications & Tailwind Monorepos

In enterprise engineering organizations maintaining dozens of web applications in a **Monorepo (Turborepo, Nx, or pnpm workspaces)**, duplicating Tailwind configurations or design tokens across every app leads to design drift and maintenance headaches.

Architecting a shared design system package (**`@company/ui`** and **`@company/tailwind-config`**) establishes centralized governance and ensures all frontend applications stay synchronized.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Enterprise Monorepo Architecture            │
│                                                             │
│  packages/                                                  │
│  ├── tailwind-config/ (Preset with design tokens & plugins) │
│  │   └── preset.js                                          │
│  ├── ui/ (Shared React/Vue Component Library + CVA)         │
│  │   └── src/Button.tsx, Card.tsx, Modal.tsx                │
│  └── tokens/ (Figma JSON Tokens -> CSS Variables)           │
│                                                             │
│  apps/                                                      │
│  ├── customer-web/ (Imports @company/ui & preset)           │
│  ├── admin-dashboard/ (Imports @company/ui & preset)        │
│  └── docs-portal/ (Imports @company/ui & preset)            │
└─────────────────────────────────────────────────────────────┘
```

## 1. Creating a Shared Tailwind Preset (`@company/tailwind-config`)

```javascript
// packages/tailwind-config/preset.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          500: '#6366f1',
          600: '#4f46e5',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
```

## 2. Consuming the Preset in Application Repositories

In `apps/customer-web/tailwind.config.js`:

```javascript
module.exports = {
  presets: [require('@company/tailwind-config/preset')],
  content: [
    './src/**/*.{html,ts,tsx,vue}',
    '../../packages/ui/src/**/*.{html,ts,tsx,vue}', // Scan shared UI package!
  ],
};
```

## Summary & Key Takeaways

- Shared presets (`presets: [...]`) centralize design tokens across monorepos.
- Shared UI component packages expose typed CVA primitives.
- Ensure the application `content` glob includes paths to external UI package files.

## Best Practices & Senior Guidance

1. **Always Include Shared Package Paths in `content`**: If `../../packages/ui/src` is omitted from the app's `content` array, classes inside shared components will not be generated!
