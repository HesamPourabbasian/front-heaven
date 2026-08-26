---
title: 'Next.js'
description: 'A three-level Next.js roadmap covering the App Router, React Server Components, Server Actions, caching, authentication, databases, testing, and production deployment.'
order: 15
difficulty: 'advanced'
estimatedHours: 120
status: 'available'
track: 'meta-framework'
parentFramework: 'react'
color: '#000000'
icon: 'nextjs'
prerequisites:
  - react
  - typescript
---

# Next.js Roadmap — 3 Difficulty Levels

> **Target:** Modern Next.js with the **App Router**, React Server Components, Server Actions, caching, SSR/SSG, authentication, databases, testing, and production deployment.

This roadmap is organised as a progression from building pages, to shipping complete full-stack applications, to designing production systems. Follow the lessons below in order and use the checklists to track the concepts you can explain and apply.

## 🟢 Level 1 — Beginner

### 1. Prerequisites

#### React

- [ ] JSX
- [ ] Components and composition
- [ ] Props and state
- [ ] Events and forms
- [ ] Hooks: `useState`, `useEffect`, `useContext`
- [ ] Conditional rendering and lists

#### TypeScript

- [ ] Types, interfaces, and type aliases
- [ ] Generics and union types
- [ ] Type narrowing
- [ ] Function types
- [ ] React types

### 2. Next.js Fundamentals

- [ ] What Next.js is and why it exists
- [ ] Next.js vs React
- [ ] Creating a project with `create-next-app`
- [ ] Project structure, `package.json`, and `next.config`
- [ ] Environment variables
- [ ] Development server, production build, and production server

### 3. App Router

- [ ] `app/` directory and file-based routing
- [ ] `page.tsx`, `layout.tsx`, and `template.tsx`
- [ ] `loading.tsx`, `error.tsx`, `not-found.tsx`, and `global-error.tsx`
- [ ] `default.tsx`

### 4. Routing and Layouts

- [ ] Basic, nested, dynamic, catch-all, and optional catch-all routes
- [ ] `[id]`, `[slug]`, `[...slug]`, and `[[...slug]]`
- [ ] Route groups: `(group)`
- [ ] Parallel routes basics
- [ ] Navigation with `Link`, `useRouter`, `usePathname`, and `useSearchParams`
- [ ] Root and nested layouts
- [ ] Shared UI and layout persistence
- [ ] Route-specific layouts
- [ ] Template vs layout

### 5. Server and Client Components

- [ ] React Server Components
- [ ] Server Components by default
- [ ] Client Components and `"use client"`
- [ ] Server Functions and `"use server"`
- [ ] Component boundaries and serializable props
- [ ] Passing data across server/client boundaries

### 6. Data Fetching and Rendering

- [ ] `fetch()` and async Server Components
- [ ] API requests and direct data access
- [ ] Loading and error states
- [ ] Parallel and sequential data fetching
- [ ] CSR, SSR, SSG, static, dynamic, and hybrid rendering
- [ ] Understanding when a page renders

### 7. Metadata, Styling, Images, and Fonts

- [ ] Static and dynamic metadata with `metadata` and `generateMetadata`
- [ ] Open Graph, Twitter metadata, robots, sitemap, and canonical URLs
- [ ] Global CSS, CSS Modules, Tailwind CSS, and Sass
- [ ] Responsive design and dark mode
- [ ] `next/image`, responsive sizing, optimization, and image priority
- [ ] `next/font`, local fonts, and Google fonts

### 8. Route Handlers and Environment Variables

- [ ] `route.ts` and Route Handlers
- [ ] GET, POST, PUT, PATCH, and DELETE
- [ ] Requests, responses, headers, and cookies
- [ ] `.env`, `.env.local`, `.env.development`, and `.env.production`
- [ ] Server-only variables, `NEXT_PUBLIC_*`, and secret management

### 9. Beginner Projects

- [ ] Portfolio
- [ ] Blog
- [ ] Documentation site
- [ ] News website
- [ ] Product catalog
- [ ] Simple dashboard
- [ ] Basic e-commerce frontend

## 🟡 Level 2 — Intermediate

### 1. Advanced Routing

- [ ] Dynamic nested routes and route groups
- [ ] Parallel and intercepting routes
- [ ] Modal routing
- [ ] Route-level loading and error boundaries
- [ ] Middleware/proxy concepts and advanced navigation

### 2. Data Fetching and Caching

- [ ] Server-side and client-side data fetching
- [ ] Database and external API access
- [ ] Parallel requests and request deduplication
- [ ] Streaming, Suspense, and loading UI
- [ ] Data Cache, Full Route Cache, and Client Router Cache
- [ ] Cache invalidation, time-based revalidation, and on-demand revalidation
- [ ] `revalidatePath`, `revalidateTag`, cache tags, and stale data

### 3. ISR and Server Actions

- [ ] Incremental Static Regeneration (ISR)
- [ ] Static generation and `generateStaticParams`
- [ ] Time-based and on-demand regeneration
- [ ] Server Actions and Server Functions
- [ ] Form actions, mutations, progressive enhancement, and optimistic updates
- [ ] Validation, authentication, database mutations, and error handling

### 4. Forms and Authentication

- [ ] FormData and server-side forms
- [ ] Client/server validation with Zod
- [ ] Form pending, error, and success states
- [ ] Sessions, cookies, and authentication flows
- [ ] Authorization, protected routes, and middleware/proxy
- [ ] OAuth, JWT, Auth.js, RBAC, and admin authentication

### 5. Databases and APIs

- [ ] PostgreSQL, MySQL, SQLite, and MongoDB
- [ ] Prisma and Drizzle
- [ ] Connections, models, relations, migrations, queries, and transactions
- [ ] REST APIs, external APIs, API clients, and validation
- [ ] Error responses, rate limiting, API versioning, and webhooks

### 6. Middleware, Performance, Errors, i18n, and Testing

- [ ] Request interception, redirects, rewrites, headers, and cookies
- [ ] Edge execution considerations
- [ ] Server Component minimization, code splitting, dynamic imports, and lazy loading
- [ ] Image/font optimization, bundle analysis, and Core Web Vitals
- [ ] Expected/unexpected errors, server/client errors, logging, and error boundaries
- [ ] Locale routing, translation files, RTL, Persian/Arabic layouts, and formatting
- [ ] Unit tests with Jest/Vitest and React Testing Library
- [ ] E2E tests with Playwright/Cypress, user flows, authentication, and API tests
- [ ] Server Component testing, mocking, integration tests, and test environments

### 7. Intermediate Projects

#### E-Commerce

- [ ] Catalog, search, filtering, cart, checkout, orders, and user dashboard
- [ ] Authentication, admin dashboard, PostgreSQL, and payment integration

#### SaaS Dashboard

- [ ] Authentication, organizations, roles, permissions, and dashboard
- [ ] Billing, notifications, API, database, and Server Actions

## 🔴 Level 3 — Advanced / Senior

### Architecture and Runtime

- [ ] App Router and server-first architecture
- [ ] Server/client and component boundaries
- [ ] Feature-based architecture and domain-driven frontend design
- [ ] Shared components, design systems, and monorepos
- [ ] RSC architecture, Flight/RSC payloads, serialization, streaming, Suspense, hydration, and mismatch debugging
- [ ] Static/dynamic rendering, streaming SSR, ISR, partial rendering, hybrid applications, and waterfall elimination

### Caching and Performance Engineering

- [ ] Data Cache, Full Route Cache, Router Cache, cache tags, and invalidation
- [ ] Cache lifetimes, profiles, consistency, and distributed caching
- [ ] LCP, INP, CLS, TTFB, server response time, and Core Web Vitals
- [ ] Bundle analysis, JavaScript reduction, streaming, CDN, edge caching, and database query optimization

### Data, Security, and Enterprise Authentication

- [ ] Connection pooling, transactions, indexes, N+1 prevention, read replicas, and production migrations
- [ ] Authentication, authorization, RBAC, ABAC, secure sessions/cookies, CSRF, XSS, CSP, and CORS
- [ ] SQL injection, SSRF, rate limiting, validation, output encoding, secrets, and dependency security
- [ ] OAuth 2.0, OpenID Connect, PKCE, SSO, SAML, MFA, passkeys, and token rotation
- [ ] Organization permissions and multi-tenancy

### APIs and Server Actions

- [ ] REST, GraphQL, tRPC, WebSockets, SSE, webhooks, and API gateways
- [ ] BFF architecture, API aggregation, rate limiting, idempotency, and versioning
- [ ] Authorized mutations, validation, transactions, optimistic updates, invalidation, and progressive enhancement

### Delivery and Operations

- [ ] Parallel/intercepting routes, modal routing, route caching, and route-level boundaries
- [ ] Vercel, Docker, Node.js, self-hosting, reverse proxies, Nginx, and production builds
- [ ] CI/CD, preview/staging environments, rollbacks, and environment configuration
- [ ] GitHub Actions, linting, type checking, unit/E2E tests, migrations, releases, and security scanning
- [ ] Structured logging, error monitoring, tracing, metrics, Core Web Vitals, alerting, and production debugging
- [ ] Turborepo/Nx, shared packages/configs, build caching, affected builds, and workspace architecture
- [ ] Multi-language architecture, locale SEO/metadata, RTL/LTR, currency, dates, and number formatting
- [ ] Testing strategy, integration/contract/E2E/visual/accessibility/performance testing, parallelization, and flaky-test management

### Advanced Projects

#### 🏆 Production E-Commerce

- [ ] App Router, RSC, Client Components, Server Actions, REST, authentication, PostgreSQL, Prisma/Drizzle
- [ ] Catalog, search, filtering, pagination, cart, accounts, orders, payments, admin/RBAC, and inventory
- [ ] SEO, SSR/ISR, caching, error handling, testing, CI/CD, CDN, and monitoring

#### 🏆 Multi-Tenant SaaS

- [ ] Organizations, teams, users, roles, permissions, billing, plans, and dashboards
- [ ] Audit logs, notifications, APIs, webhooks, multi-tenancy, security, and monitoring

#### 🏆 Enterprise Next.js Monorepo

- [ ] `apps/web`, `apps/admin`, `apps/docs`, and `apps/mobile-api`
- [ ] Shared UI, TypeScript, database, auth, design system, CI/CD, testing, build caching, and deployment pipelines

## 🎯 Complete Learning Path

```text
React → TypeScript → Fundamentals → App Router → Routing → Layouts
→ Server/Client Components → Data Fetching → Rendering → SEO
→ Route Handlers → Server Actions → Forms → Authentication → Database
→ Caching → ISR → Performance → Testing → Security → Deployment
→ RSC/Streaming/Hydration → Architecture → CI/CD → Observability
→ Monorepos → Enterprise Next.js
```

## ⭐ What Separates the Levels?

- **Junior:** I can build a website with routing, components, layouts, data fetching, APIs, styling, and SEO.
- **Mid-level:** I can ship a complete application with Server/Client Components, Server Actions, auth, a database, caching, rendering strategies, tests, performance work, and deployment.
- **Senior:** I can design a production system with deliberate architecture, RSC boundaries, rendering and caching strategies, database design, security, observability, CI/CD, and scalability.

**Highest-priority topics:** **App Router → Server/Client Components → data fetching → Server Actions → authentication → PostgreSQL/ORM → caching → SSR/ISR → performance → testing → deployment.**
