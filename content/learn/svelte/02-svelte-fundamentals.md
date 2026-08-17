---
title: 'Svelte Fundamentals & Architecture'
description: 'Understand the architecture of Svelte: the compiler paradigm, zero Virtual DOM overhead, comparison with React/Vue/Angular, Vite tooling, and .svelte Single File Components.'
order: 2
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 25
prerequisites:
  - /learn/svelte/01-prerequisites
---

# Svelte Fundamentals & Architecture

Svelte is a revolutionary, open-source frontend framework created by Rich Harris. Unlike traditional frameworks like React and Vue that execute substantial runtime virtual DOM diffing inside the user's browser, Svelte operates as a **compile-time framework**. It shifts the heavy lifting of reactivity from the browser runtime into the build step, compiling your components into compact, surgical vanilla JavaScript that directly updates the browser DOM with microscopic overhead.

In this lesson, we will explore what makes Svelte unique, compare its architecture against React, Vue, and Angular, scaffold a project with Vite, examine project file structure, and master the anatomy of `.svelte` Single File Components.

## What is Svelte? The Compiler Paradigm

Traditional frontend frameworks run a runtime engine in the browser. When a user interacts with a React application, React creates a new Virtual DOM tree in memory, diffs it against the old Virtual DOM tree, calculates the differences, and applies mutations to the real DOM.

**Svelte eliminates the Virtual DOM entirely.** During your build step (powered by Vite), Svelte analyzes your component templates and scripts, tracking exactly which variables affect which DOM elements. It outputs direct, imperative JavaScript instructions—such as `element.textContent = count`—that run only when that specific variable mutates.

Key benefits of Svelte's compiler model:
1. **Zero Virtual DOM Overhead**: No in-memory VNode trees, no tree-diffing algorithms, and zero reconciliation lag.
2. **Tiny Production Bundles**: Svelte components compile into lean JavaScript, resulting in ultra-fast page loads and minimal bandwidth consumption on mobile networks.
3. **True Reactive Ergonomics**: State updates feel like writing standard JavaScript variables without calling verbose hooks like `useState()` or setting up boilerplate.

## Svelte vs React vs Vue vs Angular

Understanding how Svelte compares to other major web frameworks highlights its distinct engineering advantages:

- **Svelte**: Compiles components into raw DOM-manipulation code at build time. Employs Svelte 5 Runes (`$state`, `$derived`, `$effect`) for universal reactivity. Uses Single File Components (`.svelte`) with scoped CSS by default.
- **React**: Relies on JSX and a runtime Virtual DOM. Re-executes the entire component function on every state change, requiring manual memoization (`useMemo`, `useCallback`) to avoid performance regressions.
- **Vue**: Uses Single File Components (`.vue`) with an HTML-based template syntax and Proxy-based runtime reactivity. Vue compiles templates into optimized virtual DOM render functions with static hoisting and patch flags.
- **Angular**: A fully featured, highly opinionated enterprise framework built on TypeScript, RxJS, and Zone.js/Signals. Comprehensive but carries a steep learning curve and larger baseline bundle size.

## Creating a Svelte Project with Vite

In the modern Svelte ecosystem, **Vite** is the official, high-speed development server and bundler.

To scaffold a standalone Svelte 5 application using Vite and TypeScript, run:

```bash
npm create vite@latest my-svelte-app -- --template svelte-ts
```

Navigate into the directory, install dependencies, and launch the dev server:

```bash
cd my-svelte-app
npm install
npm run dev
```

The Vite dev server starts in milliseconds and features instantaneous Hot Module Replacement (HMR), updating your components in the browser instantly as you save files without losing component state.

## Anatomy of a Svelte Project Structure

A standard Svelte Vite application has an intuitive, clean directory structure:

```text
my-svelte-app/
├── index.html            # Entry HTML shell mounting the Svelte app
├── package.json          # Project dependencies, scripts, and configuration
├── svelte.config.js      # Svelte compiler options and preprocessors
├── vite.config.ts        # Vite plugins and alias configuration
├── public/               # Static assets (favicon, images)
└── src/
    ├── main.ts           # Application bootstrap entry point
    ├── App.svelte        # Root Svelte component
    ├── assets/           # Global styles and static media
    └── lib/              # Reusable Svelte components and utilities
```

In `src/main.ts`, the Svelte application is mounted into the DOM using the modern Svelte 5 `mount()` API:

```typescript
// src/main.ts
import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'

const app = mount(App, {
  target: document.getElementById('app')!,
})

export default app
```

## Single File Components (`.svelte`)

Svelte components are encapsulated inside `.svelte` files. Like Vue SFCs, Svelte co-locates the component's JavaScript logic, HTML markup, and CSS styling in a single, cohesive file.

```svelte
<!-- src/lib/GreetingCard.svelte -->
<script lang="ts">
  let name = $state('Hesam')
  let isHighlighted = $state(false)

  function toggleHighlight() {
    isHighlighted = !isHighlighted
  }
</script>

<div class="card" class:highlighted={isHighlighted}>
  <h2>Hello, {name}!</h2>
  <button onclick={toggleHighlight}>
    {isHighlighted ? 'Remove Highlight' : 'Highlight Card'}
  </button>
</div>

<style>
  .card {
    padding: 1.5rem;
    border-radius: 1rem;
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    transition: all 0.2s ease;
  }
  .highlighted {
    border-color: #f97316;
    background-color: #fff7ed;
  }
</style>
```

## The `<script>` Block

The `<script>` block contains the component's JavaScript or TypeScript logic. Code inside `<script>` runs when the component instance is created.

In Svelte 5, you declare reactive state using **Runes** (`$state`, `$derived`, `$props`), define event handler functions, and import child components or external libraries. Variables and functions declared in `<script>` are automatically available inside the component's template.

## The `<style>` Block and Scoped CSS

Svelte scopes CSS styles written inside `<style>` blocks by default. During compilation, Svelte analyzes which HTML elements match your CSS selectors, generates a unique hash class (e.g. `svelte-1xyz4a`), and appends it to both the CSS rules and the rendered elements.

Key advantages of Svelte's scoped CSS:
- **Zero Style Leaks**: Styles in child components cannot override parent styles, and parent styles cannot accidentally leak into children.
- **Dead Code Elimination**: If you write a CSS class in `<style>` that is not used in the template, the Svelte compiler generates a compile-time warning and removes the unused rule from the production bundle!

```svelte
<style>
  /* Only styles <p> elements inside this specific component */
  p {
    color: #f97316;
    font-weight: 600;
  }
</style>
```

## The `<script module>` Block

Standard `<script>` code executes once per component instance. If you need code to execute **once when the module is first loaded** (shared across all instances of the component), use a `<script module>` block:

```svelte
<script module lang="ts">
  // Shared module-level state across ALL instances of this component
  let totalInstancesCreated = 0

  // Export named helper functions or constants from the .svelte file
  export function getTotalInstances() {
    return totalInstancesCreated
  }
</script>

<script lang="ts">
  // Instance-specific code (runs on every mount)
  totalInstancesCreated++
  let instanceId = totalInstancesCreated
</script>

<div class="instance-badge">
  Component Instance #{instanceId} of {totalInstancesCreated}
</div>
```

Other components can import named exports directly from the `.svelte` file: `import { getTotalInstances } from './InstanceBadge.svelte'`.

## Best Practices

- **Embrace Svelte 5 Runes**: Use `$state()` and `$derived()` for all new codebases rather than legacy `let` and `$:` syntax.
- **Rely on Built-in Scoped Styles**: Avoid overusing global CSS classes; leverage Svelte's compiler-enforced CSS scoping for modular styling.
- **Use `<script module>` for Shared Constants & Exports**: Place shared constants, type definitions, and factory exports in `<script module>`.
- **Organize Components in `src/lib/`**: Place reusable UI widgets and business components inside `src/lib/` for clear modular organization.

## Summary

Svelte revolutionizes frontend development by transforming components into ultra-lean, surgical vanilla JavaScript at compile time. By eliminating the virtual DOM, integrating lightning-fast Vite tooling, and encapsulating logic, template markup, and scoped CSS within `.svelte` Single File Components, Svelte delivers an unmatched developer experience with exceptional runtime performance.
