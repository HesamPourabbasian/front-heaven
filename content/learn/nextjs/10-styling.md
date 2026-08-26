---
title: 'Styling Strategies: Tailwind CSS, CSS Modules & Dark Mode'
description: 'Master styling architectures in Next.js App Router: Global CSS, CSS Modules, Tailwind CSS, Sass integration, CSS-in-JS limitations in React Server Components, and seamless dark mode theming.'
order: 10
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 30
prerequisites:
  - /learn/nextjs/02-nextjs-fundamentals
---

# Styling Strategies: Tailwind CSS, CSS Modules & Dark Mode

Styling in modern Next.js must accommodate both **React Server Components (RSC)** and interactive Client Components. Because Server Components render purely on the server without client runtime JavaScript, traditional runtime CSS-in-JS libraries (like styled-components or Emotion) are restricted to Client Components. Consequently, **Zero-Runtime CSS** solutions—specifically **Tailwind CSS** and **CSS Modules**—are the recommended standards in the Next.js ecosystem.

In this lesson, you will master Global CSS, CSS Modules, Tailwind CSS, Sass, and dark mode configuration using `next-themes`.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Next.js Styling Approaches Comparison                    │
├──────────────────────────────────────┬──────────────────────────────────────┤
│ Tailwind CSS (Recommended)           │ CSS Modules                          │
├──────────────────────────────────────┼──────────────────────────────────────┤
│ • Utility-first class names          │ • Locally-scoped `.module.css` files │
│ • Zero runtime overhead in browser   │ • Zero class name collisions         │
│ • Full RSC & Server Component support│ • Native CSS syntax                  │
│ • Production CSS bundle under 15KB   │ • Supported in both Server & Client  │
└──────────────────────────────────────┴──────────────────────────────────────┘
```

---

## 1. Tailwind CSS in App Router

Tailwind CSS compiles atomic utility classes directly into static CSS without any client-side JavaScript execution:

```tsx
// components/FeatureCard.tsx (Works seamlessly in Server Components!)
export function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-indigo-500 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600">
        {title}
      </h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{desc}</p>
    </div>
  );
}
```

---

## 2. CSS Modules (`.module.css`)

CSS Modules scope class names locally by generating unique hashes (e.g. `button_btn__a8z9x`), preventing global selector conflicts:

```css
/* components/Button.module.css */
.btnPrimary {
  background-color: #4f46e5;
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: background-color 0.2s;
}

.btnPrimary:hover {
  background-color: #4338ca;
}
```

```tsx
// components/Button.tsx
import styles from './Button.module.css';

export function Button({ children }: { children: React.ReactNode }) {
  return <button className={styles.btnPrimary}>{children}</button>;
}
```

---

## 3. Dark Mode Architecture with `next-themes`

Implement accessible dark mode with automatic system detection and `localStorage` persistence:

```bash
npm install next-themes
```

### A. Create a Theme Provider Wrapper:
```tsx
// components/ThemeProvider.tsx
'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  );
}
```

### B. Wrap Root Layout:
```tsx
// app/layout.tsx
import { ThemeProvider } from '@/components/ThemeProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

---

## Summary & Key Takeaways

- Zero-runtime styling solutions (Tailwind CSS and CSS Modules) are fully compatible with React Server Components.
- Traditional runtime CSS-in-JS requires Client Components (`'use client'`).
- `next-themes` provides zero-flicker dark mode switching with system preference detection.
- Add `suppressHydrationWarning` to `<html>` to prevent React hydration warnings when toggling themes.

## Best Practices & Senior Guidance

1. **Use `clsx` and `tailwind-merge` (`cn` helper)**: Combine conditional class names cleanly without duplicate Tailwind conflict bugs.
2. **Avoid Inline `style={{ ... }}` for Dynamic Values**: Use CSS Custom Properties (`style={{ '--custom-color': color } as React.CSSProperties}`) to preserve stylesheet optimization.
