---
title: 'Tailwind Configuration & Design Tokens'
description: 'Master Tailwind configuration: tailwind.config.js, theme.extend, custom color palettes, typography fonts, custom spacing, breakpoints, shadows, and design tokens.'
order: 10
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 45
prerequisites: ['/learn/tailwindcss/09-beginner-projects']
---

# Tailwind Configuration & Design Tokens

While Tailwind's default design system is comprehensive, professional enterprise applications require customization to match exact corporate brand guidelines, bespoke color palettes, custom typography, and unique elevation scales.

The **`tailwind.config.js`** file is the central control hub of your Tailwind setup. Understanding the distinction between replacing the theme and extending it via **`theme.extend`** allows you to introduce custom **Design Tokens** without losing Tailwind's default utility ecosystem.

```text
┌─────────────────────────────────────────────────────────────┐
│                 theme vs theme.extend in Config             │
├──────────────────────────────┬──────────────────────────────┤
│ theme: { colors: { ... } }   │ theme: { extend: { ... } }   │
├──────────────────────────────┼──────────────────────────────┤
│ Wipes out ALL default        │ Preserves ALL default        │
│ Tailwind colors (red, blue,  │ Tailwind colors and adds     │
│ slate). Only your custom     │ your custom brand tokens     │
│ colors exist.                │ seamlessly.                  │
└──────────────────────────────┴──────────────────────────────┘
```

## 1. Enterprise `tailwind.config.js` Setup

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,vue,html}',
    './components/**/*.{js,ts,vue}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          900: '#312e81',
          950: '#1e1b4b',
        },
        surface: {
          light: '#ffffff',
          dark: '#0f172a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      boxShadow: {
        'glow': '0 0 25px -5px rgba(99, 102, 241, 0.4)',
      },
      borderRadius: {
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}
```

Now, classes like `bg-brand-600`, `shadow-glow`, and `rounded-4xl` are available across your entire codebase with full IntelliSense autocompletion!

## Summary & Key Takeaways

- `tailwind.config.js` customizes colors, fonts, spacing, shadows, and breakpoints.
- Always place custom tokens inside `theme.extend` to preserve default utilities.
- Brand color palettes scale from 50 to 950 for seamless dark mode adaptation.

## Best Practices & Senior Guidance

1. **Map Custom Colors to Semantic Token Names**: Name colors by function (e.g. `primary`, `surface`, `accent`) rather than raw names (`indigo`, `purple`) so themes can be modified without refactoring template markup.
