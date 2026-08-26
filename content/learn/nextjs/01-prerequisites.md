---
title: 'React & TypeScript Prerequisites for Modern Next.js'
description: 'Master essential React 18/19 and TypeScript foundations required for Next.js App Router: JSX, component composition, hooks, state management, interfaces, generics, and React typings.'
order: 1
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 35
prerequisites: []
---

# React & TypeScript Prerequisites for Modern Next.js

Modern **Next.js** built on the **App Router** leverages the latest features of **React (React 18 & 19)** and strict **TypeScript**. Before diving into server components, server actions, and file-based routing, you must have a solid foundation in core React concepts and TypeScript type systems.

In this lesson, you will review the critical React primitives (JSX, component hierarchy, props, state, hooks, and composition patterns) and TypeScript constructs (interfaces, generics, union types, type narrowing, and React element types) that form the building blocks of every Next.js application.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Next.js Prerequisite Foundations                         │
├──────────────────────────────────────┬──────────────────────────────────────┤
│ Core React Foundations               │ TypeScript Mastery                   │
├──────────────────────────────────────┼──────────────────────────────────────┤
│ • JSX & Virtual DOM                  │ • Interfaces & Type Aliases          │
│ • Component Composition              │ • Generics & Constraints             │
│ • Props & State Management           │ • Union Types & Discriminated Unions │
│ • Essential Hooks (useState, etc.)   │ • Type Narrowing & Guards            │
│ • Conditional Rendering & Lists      │ • React Types (ReactNode, Props)     │
└──────────────────────────────────────┴──────────────────────────────────────┘
```

---

## 1. Core React Foundations

### A. JSX & Component Composition
JSX is a syntax extension for JavaScript that allows you to write HTML-like structures directly inside code. Components are independent, reusable pieces of UI that accept arbitrary inputs called **props**:

```tsx
interface CardProps {
  title: string;
  badge?: string;
  children: React.ReactNode; // Composition container
}

export function Card({ title, badge, children }: CardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        {badge && (
          <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
            {badge}
          </span>
        )}
      </div>
      <div className="text-slate-600">{children}</div>
    </div>
  );
}
```

### B. State Management & Hooks (`useState`, `useEffect`, `useContext`)
In client-rendered components, React hooks manage lifecycle and state:

```tsx
'use client'; // Required in Next.js App Router for interactive client hooks

import { useState, useEffect } from 'react';

export function Counter() {
  const [count, setCount] = useState<number>(0);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setCount(prev => prev + 1)}
      className="rounded-lg bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-700"
    >
      Count: {count}
    </button>
  );
}
```

---

## 2. Essential TypeScript for Next.js

Next.js projects are written in strict TypeScript. Mastering interfaces, discriminated unions, and generic types is essential for type-safe routing, props, and server actions.

### A. Interfaces & Discriminated Unions

```typescript
// Discriminated union for asynchronous operation states
export type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

export interface UserProfile {
  id: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  createdAt: Date;
}
```

### B. Type Narrowing & Type Guards

```typescript
function renderState<T>(state: AsyncState<T>) {
  switch (state.status) {
    case 'idle':
      return 'Ready to fetch';
    case 'loading':
      return 'Loading data...';
    case 'success':
      return `Loaded: ${JSON.stringify(state.data)}`;
    case 'error':
      return `Error occurred: ${state.error}`;
  }
}
```

### C. Generics & React Types

Next.js frequently passes params and searchParams as typed objects:

```typescript
// Next.js Page Props Pattern
export interface PageProps<TParams = Record<string, string>, TSearchParams = Record<string, string | string[] | undefined>> {
  params: Promise<TParams>;
  searchParams: Promise<TSearchParams>;
}
```

---

## Summary & Key Takeaways

- Modern Next.js requires understanding component composition (`children: React.ReactNode`), controlled state, and hooks.
- Next.js App Router is built with strict TypeScript by default; mastering interfaces, generic types, and union types is required.
- Client interactivity (`useState`, `useEffect`, event handlers) requires explicit `'use client'` boundaries in the App Router.

## Best Practices & Senior Guidance

1. **Prefer `interface` for Object Shapes & `type` for Unions**: Use interfaces for extending component props and type aliases for unions, primitives, and mapped types.
2. **Favor Composition Over Prop Drilling**: Pass subcomponents as `children` or named slots rather than drilling dozens of nested props through parent containers.
