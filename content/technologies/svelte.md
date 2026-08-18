---
title: 'Svelte'
description: 'Cybernetically enhanced web apps. Compile components into surgical vanilla JavaScript with zero virtual DOM overhead, Svelte 5 Runes, and full-stack SvelteKit.'
order: 13
difficulty: 'intermediate'
estimatedHours: 40
status: 'available'
track: 'frontend-framework'
color: '#f97316'
icon: 'svelte'
prerequisites:
  - javascript
  - typescript
---

# Svelte & SvelteKit Curriculum & Career Roadmap

**Svelte** is a revolutionary compile-time framework for building high-performance web applications. Rather than relying on runtime Virtual DOM diffing in the user's browser, Svelte compiles your declarative Single File Components (`.svelte`) into compact, surgical vanilla JavaScript instructions that directly update the real DOM with microscopic overhead.

This comprehensive curriculum is divided into three progressive levels designed to take you from web prerequisites and Svelte 5 Runes to full-stack SvelteKit, database integrations, and production architecture.

---

## 🟢 Level 1 — Beginner Fundamentals
Master the essential syntax, templating directives, Svelte 5 Runes reactivity, and component foundations:
1. **Prerequisites**: HTML5 semantic landmarks, CSS box model/grid/flexbox, ES6+ JavaScript, destructuring, modules, promises, and the Fetch API.
2. **Svelte Fundamentals**: The compiler paradigm, zero Virtual DOM overhead, comparison with React/Vue/Angular, Vite tooling, and `.svelte` Single File Components (`<script>`, `<style>`, `<script module>`).
3. **Templates & Control Flow**: Text interpolation, attribute shorthands, `class:` and `style:` directives, Svelte 5 event handlers, `{#if}`, keyed `{#each}`, `{#key}`, and `{#await}` promise blocks.
4. **Reactivity & Runes**: Svelte 5 Runes engine, `$state()` (deep and raw), `$derived()` and `$derived.by()`, `$effect()` side effects with cleanup returns, `$props()`, `$bindable()`, `$inspect()`, and universal `.svelte.ts` reactivity.
5. **Component Architecture & Snippets**: Component creation, typed `$props()`, modern callback props vs legacy dispatchers, Svelte 5 Snippets (`{#snippet}` and `{@render}`), default `children` snippet, `bind:this`, and dynamic components.
6. **Forms & Two-Way Input Bindings**: Input binding with `bind:value` and automatic numeric coercion, single/group checkboxes (`bind:checked`, `bind:group`), radio groups, select dropdowns, form validation, and custom form components with `$bindable()`.
7. **Basic Svelte Projects**: Complete architectures and implementations for 8 practice applications: Interactive Counter, Persistent Todo App, Calculator, Weather App with `{#await}`, Notes App, Expense Tracker, Product Catalog, and Shopping Cart.

---

## 🟡 Level 2 — Intermediate Architecture
Scale your applications with advanced composition, global state, full-stack SvelteKit routing, testing, and API integration:
8. **Advanced Components & Special Elements**: Parameterized Snippets, dependency injection via the Context API (`setContext()` / `getContext()`), and declarative meta-elements (`<svelte:window>`, `<svelte:document>`, `<svelte:body>`, `<svelte:head>`).
9. **State Management & Svelte Stores**: Svelte Store contract (`writable`, `readable`, `derived`, custom stores), auto-subscription `$store` syntax, Svelte 5 universal Rune state classes, and client vs server state separation.
10. **SvelteKit Full-Stack Framework**: File-based routing, `+page.svelte`, `+layout.svelte`, dynamic route parameters (`[slug]`), route groups `(app)`, error pages `+error.svelte`, programmatic navigation (`goto`), and instant link preloading.
11. **Data Fetching & Load Functions**: Universal `+page.ts` vs server-only `+page.server.ts` `load()` functions, layout data inheritance, SvelteKit's special `event.fetch`, `error()` / `redirect()` helpers, URL search parameter filtering, and navigation loading indicators.
12. **Form Actions & Progressive Enhancement**: Server-side Form Actions in `+page.server.ts`, structured validation errors with `fail()`, progressive enhancement via `use:enhance`, and production authentication forms.
13. **API & Backend Routes**: RESTful backend endpoints in `+server.ts`, `GET`/`POST`/`PUT`/`DELETE` handlers, SvelteKit's `json()` helper, secure cookie sessions (`httpOnly`, `SameSite`), and request headers.
14. **TypeScript with Svelte 5**: Strictly typed `$props()` interfaces, generic components (`generics="T"`), SvelteKit generated `./$types`, typed API contracts, and `svelte-check` CLI type verification.
15. **Styling, Transitions & Design Systems**: Scoped CSS, `:global()`, Tailwind CSS integration, built-in physics transitions (`svelte/transition` `fade`, `fly`, `slide`), FLIP list reordering (`svelte/animate` `flip`), a11y compiler warnings, and headless UI libraries (Bits UI).
16. **Testing Svelte 5 Applications**: Vitest configuration, component testing with `@testing-library/svelte`, unit testing universal Rune state classes in isolation, testing `load()` functions, and Playwright E2E automation.
17. **Intermediate Projects**: Complete blueprints for 8 intermediate applications: Full E-commerce, Blog CMS, Admin Panel with data tables, Auth System, Expense Ledger, Movie Explorer, Social Feed, and SaaS Analytics Dashboard.

---

## 🔴 Level 3 — Advanced & Production
Master compiler internals, database integrations, security, performance optimization, and enterprise DevOps:
18. **Svelte Compiler Internals & Runes Mechanics**: The three-stage compiler pipeline (parse, analyze, transform), compile-time reactivity vs Virtual DOM diffing, generated JavaScript dissection, and the Signal graph engine (`source`, `derived`, `effect`).
19. **Advanced Svelte 5 & Runes Architecture**: Detached reactive lifecycles with `$effect.root()`, custom reactive composables in `.svelte.ts`, dynamic rest prop forwarding, and a complete Svelte 4 to Svelte 5 migration guide.
20. **Advanced SvelteKit (Hooks, SSR & Hybrid Rendering)**: Hybrid rendering modes (SSR, SSG, CSR), server-only protection via `$lib/server`, Server Hooks (`hooks.server.ts`), `sequence()` middleware composition, `App.Locals`, and global error handlers (`handleError`).
21. **Authentication & Security**: Database session cookies vs JWTs, OAuth 2.0 PKCE, XSS defense, `@html` sanitization with DOMPurify, SvelteKit CSRF protection, Zod schema validation, and private secret isolation with `$env/static/private`.
22. **Database Integration & Full-Stack SvelteKit**: Relational database architecture (PostgreSQL, SQLite, Turso), Drizzle ORM schema design, migrations, relational queries in `load()`, atomic transactions in Form Actions, and serverless connection pooling.
23. **Svelte Performance & Optimization**: Core Web Vitals (LCP, INP, CLS), SSR hydration pipeline, dynamic `import()` component lazy loading, `rollup-plugin-visualizer` bundle treemap analysis, next-gen image optimization with `@sveltejs/enhanced-img`, and edge caching.
24. **Advanced Architecture & Component Systems**: Feature-driven vertical slices vs horizontal layering, Domain-Driven Design (DDD), Repository pattern, `pnpm` monorepo workspaces, and packaging component libraries with `@sveltejs/package`.
25. **Production, DevOps & Deployment**: SvelteKit adapter ecosystem (`@sveltejs/adapter-node`, `@sveltejs/adapter-vercel`, `@sveltejs/adapter-cloudflare`), GitHub Actions CI/CD pipelines, multi-stage Docker containerization, and Sentry live error monitoring.
26. **Advanced Capstone Projects**: Production blueprints for 10 enterprise capstone applications: Production E-commerce with Stripe, Full-stack SaaS, Real-Time Chat, Collaborative Editor with CRDT/Yjs, High-Frequency Financial Tickers, and Enterprise Design System.
