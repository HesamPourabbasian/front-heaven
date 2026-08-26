---
title: 'Image & Font Optimization: Core Web Vitals Engineering'
description: 'Master asset optimization in Next.js: next/image, automatic WebP/AVIF compression, blur placeholders, LCP priority loading, next/font/google zero-CLS font hosting, and local font integration.'
order: 11
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 30
prerequisites:
  - /learn/nextjs/02-nextjs-fundamentals
---

# Image & Font Optimization: Core Web Vitals Engineering

Images and custom typography account for the majority of bytes transferred across the web and are the primary causes of poor **Largest Contentful Paint (LCP)** and **Cumulative Layout Shift (CLS)**. Next.js solves asset delivery performance at the framework level through the **`next/image`** and **`next/font`** modules.

In this lesson, you will master automated image compression, responsive sizing, blur-up placeholders, hero LCP priority loading, and self-hosted Google/local fonts.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Next.js Asset Optimization Pipeline                      │
├──────────────────────────────────────┬──────────────────────────────────────┤
│ next/image                           │ next/font                            │
├──────────────────────────────────────┼──────────────────────────────────────┤
│ • Converts PNG/JPG to modern AVIF/WebP│ • Downloads Google Fonts at BUILD time│
│ • Resizes dynamically based on device│ • Inlines font files with HTML/CSS   │
│ • Prevents layout shifts with width/h│ • ZERO external Google server requests│
│ • Lazy-loads offscreen images        │ • ZERO layout shift (CLS = 0)        │
└──────────────────────────────────────┴──────────────────────────────────────┘
```

---

## 1. The `next/image` Component

The `next/image` component extends standard HTML `<img>` with automatic image resizing, format conversion (AVIF/WebP), and lazy loading:

### Fixed Sized Image with Blur Placeholder:
```tsx
import Image from 'next/image';
import heroProfile from '@/public/hero-profile.jpg'; // Static import auto-calculates width/height & blur

export function Avatar() {
  return (
    <Image
      src={heroProfile}
      alt="Engineering Lead Portrait"
      width={120}
      height={120}
      placeholder="blur"
      className="rounded-full shadow-lg"
    />
  );
}
```

---

## 2. Responsive Full-Width Images (`fill` & `sizes`)

When the exact dimensions of an image are unknown (such as responsive hero banners or grid cards), use `fill` paired with a descriptive `sizes` attribute:

```tsx
import Image from 'next/image';

export function HeroBanner() {
  return (
    <div className="relative h-96 w-full overflow-hidden rounded-2xl">
      <Image
        src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809"
        alt="Abstract Gradient Background"
        fill
        priority // Preloads immediately because this is the LCP hero element!
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        className="object-cover"
      />
    </div>
  );
}
```

> **Senior Rule**: Always add the `priority` prop to above-the-fold hero images to instruct the browser to preload the image immediately, boosting LCP scores!

---

## 3. Zero-Layout-Shift Fonts with `next/font`

`next/font` downloads Google Fonts at build time and self-hosts them alongside your CSS assets. The browser never makes external network requests to Google servers:

### Google Fonts Integration:
```tsx
// app/layout.tsx
import { Inter, Space_Grotesk } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
```

---

## Summary & Key Takeaways

- `next/image` converts media to modern AVIF/WebP formats and prevents Cumulative Layout Shift.
- Always add `priority` to above-the-fold hero images to optimize Largest Contentful Paint.
- Use `fill` with `sizes="..."` for responsive fluid containers.
- `next/font` self-hosts Google and local fonts at build time with zero external network roundtrips.

## Best Practices & Senior Guidance

1. **Always Specify `sizes` When Using `fill`**: Without `sizes`, `next/image` assumes 100vw on all screens, downloading oversized desktop images on mobile phones.
2. **Whitelist Remote Domains in `next.config.ts`**: Remote images from external URLs require explicit domain registration under `images.remotePatterns`.
