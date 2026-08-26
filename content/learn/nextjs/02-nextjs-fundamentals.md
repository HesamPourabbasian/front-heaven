---
title: 'Next.js Fundamentals, Architecture & CLI Workflows'
description: 'Master Next.js foundations: React SPA vs Next.js meta-framework, scaffolding projects with create-next-app, project file structure, next.config, environment configurations, dev and production build lifecycles.'
order: 2
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 30
prerequisites:
  - /learn/nextjs/01-prerequisites
---

# Next.js Fundamentals, Architecture & CLI Workflows

**Next.js** is the leading open-source React meta-framework created and maintained by Vercel. While standalone React is a client-side view library that produces Single Page Applications (SPAs), Next.js elevates React into a **Full-Stack Web Framework** providing server-side rendering (SSR), static site generation (SSG), React Server Components (RSC), zero-config TypeScript compilation, file-system based routing, route handlers, and automated asset optimization.

In this lesson, you will master the Next.js execution model, scaffold modern projects using `create-next-app`, navigate project architecture, configure `next.config.ts`, and master the production build and runtime lifecycles.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Standalone React SPA vs Next.js Framework                │
├──────────────────────────────────────┬──────────────────────────────────────┤
│ Client-Only React (Vite / CRA)       │ Modern Next.js (App Router)          │
├──────────────────────────────────────┼──────────────────────────────────────┤
│ • Empty initial HTML shell           │ • Rich pre-rendered HTML sent from   │
│ • Large JavaScript bundle downloaded │   server for instant First Paint     │
│ • Slower initial page load (FCP/LCP) │ • React Server Components (0KB JS)   │
│ • Requires external router & backend │ • Built-in file routing & API routes │
│ • Poor default SEO & Open Graph tags │ • Automated SEO, Open Graph & Fonts  │
└──────────────────────────────────────┴──────────────────────────────────────┘
```

---

## 1. Why Use Next.js?

1. **Hybrid Rendering Engine**: Choose between static pre-rendering, dynamic server rendering, streaming, or client rendering per route.
2. **React Server Components (RSC)**: Fetch data directly in server components without exposing API secrets or shipping heavy libraries to client browsers.
3. **Automated Optimizations**: Automatic image compression (`next/image`), zero-layout-shift web fonts (`next/font`), and script optimization (`next/script`).
4. **Full-Stack Capabilities**: Colocate server actions and RESTful Route Handlers with UI components.

---

## 2. Scaffolding with `create-next-app`

Initialize a new Next.js project using the official CLI:

```bash
npx create-next-app@latest my-next-app --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

### CLI Flag Breakdown:
- `--typescript`: Configures strict TypeScript (`tsconfig.json`, `@types/react`).
- `--tailwind`: Sets up Tailwind CSS out-of-the-box.
- `--eslint`: Adds Next.js recommended ESLint rules.
- `--app`: Initializes the modern **App Router** (`src/app/`).
- `--src-dir`: Places code inside a clean `src/` directory.
- `--import-alias "@/*"`: Sets path alias for clean imports (`import { Button } from '@/components/Button'`).

---

## 3. Project Directory Architecture

```text
my-next-app/
├── public/                 # Static assets (images, icons, robots.txt)
├── src/
│   ├── app/                # App Router routes, layouts, and pages
│   │   ├── favicon.ico
│   │   ├── globals.css     # Global CSS and Tailwind directives
│   │   ├── layout.tsx      # Root Layout (wraps all pages)
│   │   └── page.tsx        # Home page route (/)
│   ├── components/         # Reusable React components (Button, Navbar, etc.)
│   └── lib/                # Database clients, utility functions, auth config
├── .env.local              # Local environment variables (git-ignored)
├── next.config.ts          # Next.js compiler & server configuration
├── package.json            # Scripts & dependencies
├── tsconfig.json           # TypeScript configuration
└── tailwind.config.ts      # Tailwind styling configuration
```

---

## 4. Configuration (`next.config.ts`)

Configure compiler features, image domains, headers, and redirects in `next.config.ts`:

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  experimental: {
    // Optional cutting-edge compiler flags
  },
};

export default nextConfig;
```

---

## 5. Development & Production Build Lifecycle

```bash
# 1. Start local development server with Hot Module Replacement (HMR)
npm run dev

# 2. Compile optimized production build (typechecks, generates static HTML, tree-shakes)
npm run build

# 3. Start Node.js production server hosting the compiled build
npm run start
```

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       Next.js Build Pipeline Output                         │
├─────────────────────────────────────────────────────────────────────────────┤
│ Route (app)                              Size     First Load JS             │
│ ┌ ○ /                                    142 B          87.2 kB             │
│ ├ ○ /about                               135 B          87.2 kB             │
│ └ λ /dashboard                           2.4 kB         92.1 kB             │
│ + First Load JS shared by all            87.1 kB                            │
│                                                                             │
│ ○ (Static)   prerendered as static content                                  │
│ λ (Dynamic)  server-rendered on demand upon each incoming request          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Summary & Key Takeaways

- Next.js transforms React from a client-only view library into a full-stack meta-framework.
- `create-next-app` scaffolds projects with TypeScript, Tailwind CSS, ESLint, and the App Router.
- The `src/app/` directory uses file-system conventions (`page.tsx`, `layout.tsx`) to define routes.
- `npm run build` analyzes every route and outputs whether it is statically pre-rendered (`○`) or dynamically server-rendered (`λ`).

## Best Practices & Senior Guidance

1. **Always Use the `src/` Directory Structure**: Separates application logic from root configuration files (`package.json`, `.env`, `next.config.ts`), keeping large monorepos organized.
2. **Never Check `.env.local` into Source Control**: Store secret database passwords and API keys in `.env.local` and add it to `.gitignore`.
