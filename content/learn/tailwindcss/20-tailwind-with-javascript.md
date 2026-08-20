---
title: 'Tailwind with JavaScript: clsx, tailwind-merge & CVA'
description: 'Master dynamic styling with JavaScript: template literal pitfalls, conditional classes, clsx, resolving Tailwind class specificity collisions with tailwind-merge, and Class Variance Authority (CVA).'
order: 20
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 50
prerequisites: ['/learn/tailwindcss/19-component-architecture']
---

# Tailwind with JavaScript: clsx, tailwind-merge & CVA

When building production component libraries, components must accept dynamic props and custom `className` overrides. However, dynamically concatenating Tailwind classes with string interpolation introduces two critical bugs:
1. **The JIT Purging Bug**: Interpolating class names dynamically (`text-${color}-500`) hides classes from the JIT scanner, causing them to be excluded from the generated CSS.
2. **The CSS Specificity Collision**: In CSS, order of appearance in the stylesheet determines specificity, not the order in the `class=""` string. If a component defaults to `p-4` and a consumer passes `p-6`, both classes exist, and `p-4` might unexpectedly win!

The enterprise solution is the trio: **`clsx`**, **`tailwind-merge`**, and **Class Variance Authority (`cva`)**.

```text
┌─────────────────────────────────────────────────────────────┐
│                 The Class Variance Authority (CVA) Flow     │
│                                                             │
│  <Button variant="outline" size="sm" className="p-4" />     │
│             │                                               │
│             ▼                                               │
│  [CVA Engine] (Resolves Variant Classes)                    │
│  ├── Base: "font-semibold rounded-lg inline-flex"           │
│  ├── Variant: "border border-slate-300 text-slate-700"      │
│  └── Size: "px-3 py-1.5 text-xs"                            │
│             │                                               │
│             ▼                                               │
│  [tailwind-merge] (cn() Helper)                             │
│  └── Overrides "py-1.5" with passed "p-4" correctly!        │
└─────────────────────────────────────────────────────────────┘
```

## 1. The Standard `cn()` Helper Function

```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## 2. Type-Safe Component Variants with `cva`

```typescript
// src/components/Button.tsx
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-semibold rounded-xl transition-all focus:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm',
        secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
        outline: 'border border-slate-300 bg-transparent text-slate-700 hover:bg-slate-50',
        destructive: 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm',
      },
      size: {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2.5 text-sm',
        lg: 'px-6 py-3.5 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button: React.FC<ButtonProps> = ({ className, variant, size, ...props }) => {
  return <button className={cn(buttonVariants({ variant, size, className }))} {...props} />;
};
```

## Summary & Key Takeaways

- Never use dynamic string interpolation (`bg-${color}-500`); always use complete static class names.
- `clsx` handles conditional class logic.
- `tailwind-merge` intelligently resolves utility class collisions (`p-4` vs `p-6`).
- `cva` creates type-safe, multi-variant component APIs (used by shadcn/ui).

## Best Practices & Senior Guidance

1. **Always Export `cn()` in Component Libraries**: Combine `clsx` and `tailwind-merge` into a universal `cn()` utility across all frontend projects.
