---
title: 'Internationalization (i18n), RTL Layouts & Localization'
description: 'Master internationalization in Next.js App Router: [lang] dynamic locale routing, dictionary loading, bidirectional RTL/LTR layouts (Persian/Arabic), and Intl date/currency formatting.'
order: 27
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 35
prerequisites:
  - /learn/nextjs/04-routing
  - /learn/nextjs/24-middleware-and-proxy
---

# Internationalization (i18n), RTL Layouts & Localization

Expanding applications globally requires supporting multiple languages, region-specific number and date formatting, and bidirectional text flow for **Right-to-Left (RTL)** languages such as Persian and Arabic. In the Next.js App Router, internationalization is implemented via **Sub-Path Routing (`app/[lang]/...`)** and server-side dictionary loading.

In this lesson, you will master locale routing, middleware language negotiation, RTL direction switching, and native JavaScript `Intl` formatting.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Next.js i18n Routing Architecture                        │
├─────────────────────────────────────────────────────────────────────────────┤
│  app/[lang]/layout.tsx (Sets <html lang={lang} dir={isRtl ? 'rtl' : 'ltr'}>)│
│    ├── app/[lang]/page.tsx (Loads dictionaries[lang] on server)             │
│    └── app/[lang]/about/page.tsx                                            │
│                                                                             │
│  URLs: /en/dashboard, /es/dashboard, /fa/dashboard                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Sub-Path Routing with `[lang]`

Organize all routes inside a top-level `[lang]` dynamic folder:

```typescript
// lib/dictionaries.ts
import 'server-only';

const dictionaries = {
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  fa: () => import('@/dictionaries/fa.json').then((module) => module.default),
  es: () => import('@/dictionaries/es.json').then((module) => module.default),
};

export const getDictionary = async (locale: 'en' | 'fa' | 'es') => {
  return (dictionaries[locale] || dictionaries.en)();
};
```

---

## 2. Dynamic RTL / LTR Direction in Root Layout

Inspect the active locale to set `<html dir="rtl">` for Arabic and Persian:

```tsx
// app/[lang]/layout.tsx
import { getDictionary } from '@/lib/dictionaries';

const RTL_LOCALES = ['fa', 'ar', 'he'];

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: 'en' | 'fa' | 'es' }>;
}) {
  const { lang } = await params;
  const isRtl = RTL_LOCALES.includes(lang);

  return (
    <html lang={lang} dir={isRtl ? 'rtl' : 'ltr'}>
      <body className={isRtl ? 'font-vazir' : 'font-inter'}>
        {children}
      </body>
    </html>
  );
}
```

---

## 3. Native Date & Currency Formatting with `Intl`

Never hardcode currency symbols or date formatting; use native Web `Intl` APIs:

```typescript
// lib/formatters.ts
export function formatCurrency(amount: number, locale: string, currency: string = 'USD') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatDate(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'long',
  }).format(date);
}
```

---

## Summary & Key Takeaways

- App Router i18n uses `[lang]` directory prefixes to isolate localized content.
- Dictionaries are loaded asynchronously on the server with 0KB client bundle overhead.
- `<html dir="rtl">` dynamically adjusts layout flow for Persian and Arabic.
- Standard `Intl.NumberFormat` and `Intl.DateTimeFormat` handle localized currencies and calendars.

## Best Practices & Senior Guidance

1. **Use CSS Logical Properties (`ms-*`, `me-*`, `ps-*`, `pe-*`) in Tailwind**: Logical spacing properties automatically flip between LTR and RTL without requiring duplicate CSS rules.
2. **Mark Dictionaries as `server-only`**: Prevents large translation JSON files from being accidentally bundled into client JavaScript.
