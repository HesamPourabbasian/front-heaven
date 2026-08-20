---
title: 'Dark Mode Architecture: Class Strategy & Persistence'
description: 'Master dark mode in Tailwind CSS: media strategy vs class strategy, dark: modifier, semantic color systems, theme switching toggles, and persisting user preferences.'
order: 13
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 45
prerequisites: ['/learn/tailwindcss/10-tailwind-configuration']
---

# Dark Mode Architecture: Class Strategy & Persistence

Providing a first-class **Dark Mode** is a standard requirement for modern web applications. Tailwind CSS provides built-in dark mode support via the **`dark:`** variant modifier.

Designing an enterprise-grade dark mode architecture requires choosing the right strategy (`class` vs `media`), constructing balanced high-contrast color palettes, implementing smooth theme-switching toggles, and persisting user preference across sessions.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Dark Mode Strategies Compared               │
├──────────────────────────────┬──────────────────────────────┤
│ Media Strategy (Default)     │ Class Strategy (Recommended) │
├──────────────────────────────┼──────────────────────────────┤
│ darkMode: 'media'            │ darkMode: 'class'            │
│                              │                              │
│ Automatically follows OS-    │ Applies dark: styles whenever│
│ level system preference.     │ the 'dark' class exists on   │
│ Cannot be overridden by an   │ the root <html> tag. Allows  │
│ in-app manual toggle button. │ manual toggling + OS sync!   │
└──────────────────────────────┴──────────────────────────────┘
```

## 1. Configuring Class-Based Dark Mode

In `tailwind.config.js`:

```javascript
module.exports = {
  darkMode: 'class', // Enable class-based dark mode
  content: ['./src/**/*.{html,js,vue,ts,tsx}'],
  // ...
}
```

## 2. Implementing Dark Styles in Markup

```html
<div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800
            p-8 rounded-2xl shadow-sm transition-colors duration-200">
  <h3 class="text-2xl font-bold text-slate-900 dark:text-white">
    System Metrics
  </h3>
  <p class="text-slate-600 dark:text-slate-400 mt-2">
    Real-time API throughput and server health diagnostics.
  </p>
  <div class="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
    <span class="text-emerald-600 dark:text-emerald-400 font-semibold">● Operational</span>
  </div>
</div>
```

## 3. Theme Toggle & Preference Persistence Script

```typescript
export function initThemeToggle() {
  const root = document.documentElement;

  // 1. Check localStorage or OS preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export function toggleTheme() {
  const root = document.documentElement;
  const isDark = root.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}
```

## Summary & Key Takeaways

- `darkMode: 'class'` enables manual in-app toggling alongside OS preference synchronization.
- Prefix any utility with `dark:` (e.g. `dark:bg-slate-900 dark:text-white`).
- Persist preferences in `localStorage` and apply to `<html>` before initial paint to prevent theme flashing (FOUC).

## Best Practices & Senior Guidance

1. **Never Use Pure `#000000` Black for Dark Mode Backgrounds**: Pure black causes harsh contrast glare; use deep slate/zinc tones like `dark:bg-slate-900` (`#0f172a`) or `dark:bg-zinc-900`.
2. **Prevent Flash of Light Theme (FOUC)**: Place a tiny inline script in your `<head>` to read `localStorage` and apply `.dark` to `<html>` before the body renders.
