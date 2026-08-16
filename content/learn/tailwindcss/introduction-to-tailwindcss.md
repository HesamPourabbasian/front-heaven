---
title: 'Introduction to Tailwind CSS & Utility-First'
description: 'Understand the utility-first CSS philosophy, just-in-time compiler, responsive variants, and dark mode classes.'
order: 1
difficulty: 'intermediate'
category: 'Tailwind CSS Fundamentals'
estimatedMinutes: 20
prerequisites:
  - /learn/css/css-fundamentals
---

## The Utility-First Workflow

Instead of writing custom class names in external stylesheets, **Tailwind CSS** provides composable utility classes directly in your HTML:

```html
<div class="mx-auto max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
  <h3 class="font-bold text-slate-900 dark:text-white">Tailwind CSS</h3>
  <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
    Rapidly build modern websites without ever leaving your HTML.
  </p>
  <button class="mt-4 rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-600">
    Get Started
  </button>
</div>
```

---

## Summary & Key Takeaways

- Utility classes speed up UI development and keep production CSS bundles under 15kB.
