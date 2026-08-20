---
title: 'Production Quality, Tooling & Automated Audits'
description: 'Master Tailwind production quality: ESLint plugins (eslint-plugin-tailwindcss), Prettier class sorting (prettier-plugin-tailwindcss), automated accessibility audits (axe-core), and Playwright visual testing.'
order: 32
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 50
prerequisites: ['/learn/tailwindcss/28-performance']
---

# Production Quality, Tooling & Automated Audits

Maintaining high code quality across large development teams requires automated tooling. Without automation, class lists become disorganized, redundant utilities accumulate, and visual regressions slip into production.

The modern Tailwind quality stack combines: **`prettier-plugin-tailwindcss`** for deterministic class ordering, **`eslint-plugin-tailwindcss`** for linting, and **Playwright Visual Regression Testing**.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Tailwind CI/CD Quality Pipeline             │
│                                                             │
│  Git Commit ──> Pre-Commit Hook (Husky + lint-staged)       │
│                 ├── 1. Prettier sorts classes canonically   │
│                 └── 2. ESLint flags duplicate / banned util │
│                        │                                    │
│                        ▼                                    │
│  GitHub Actions CI (Pull Request Validation)                │
│  ├── 1. axe-core Accessibility Audit                        │
│  ├── 2. Playwright Visual Pixel Regression Tests            │
│  └── 3. CSS Bundle Budget Check (< 20KB)                    │
└─────────────────────────────────────────────────────────────┘
```

## 1. Automatic Class Sorting with Prettier

```bash
npm install -D prettier prettier-plugin-tailwindcss
```

In `.prettierrc`:

```json
{
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

Prettier automatically sorts classes canonically: Box Model -> Layout -> Typography -> Visual Effects -> State Modifiers (`hover:`, `dark:`).

## 2. Automated Accessibility Auditing with axe-core

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('landing page should have zero accessibility violations', async ({ page }) => {
  await page.goto('/');
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});
```

## Summary & Key Takeaways

- Prettier automatically sorts Tailwind classes canonically.
- ESLint catches invalid class names, duplicates, and shorthand conflicts.
- Automated axe-core and visual regression tests safeguard production quality.

## Best Practices & Senior Guidance

1. **Enforce Canonical Prettier Sorting on Every PR**: Eliminates team debates on class order and makes PR diffs clean and reviewable.
