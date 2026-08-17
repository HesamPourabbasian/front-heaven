---
title: 'Vue Fundamentals'
description: 'Understand the architecture of Vue.js, comparison with React and Angular, Vite tooling, project structure, and Single File Components (SFC).'
order: 2
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 25
prerequisites:
  - /learn/vue/01-javascript-prerequisites
---

# Vue Fundamentals

Vue.js is an open-source, progressive JavaScript framework created by Evan You for building modern user interfaces on the web. Since its inception in 2014, Vue has grown into one of the most widely adopted and loved frontend frameworks in the world. Vue is designed from the ground up to be incrementally adoptable—it can function as a lightweight script embedded in a legacy HTML page or scale up to power massive, mission-critical enterprise applications.

In this lesson, we explore what makes Vue unique, compare its design philosophy against React and Angular, examine the modern Vite build toolchain, and dissect the structure of Single File Components (`.vue`).

## What is Vue.js and the "Progressive" Philosophy?

The term "progressive framework" describes Vue's modular design architecture. Unlike monolithic frameworks that force you to adopt a complex toolchain, state manager, and routing solution on day one, Vue provides a core library focused purely on the view layer.

As your application grows in complexity, you incrementally adopt official, tightly maintained ecosystem companion packages: Vue Router for client-side routing, Pinia for centralized state management, Vite for lightning-fast bundling, and Nuxt for full-stack server-side rendering and static site generation. This progressive curve ensures that beginner developers face minimal cognitive overhead while advanced engineers enjoy enterprise-grade tooling.

## Vue vs React vs Angular: Architectural Comparison

Frontend engineers often choose between Vue, React, and Angular when planning new projects. While all three share modern component-based models, their philosophies differ significantly:

- **Vue.js**: Combines the best aspects of React (declarative Virtual DOM, component tree, reactive state) and Angular (HTML-centric template directives, scoped CSS styling, two-way form bindings). Vue provides an official, deeply integrated ecosystem and standard syntax without requiring third-party library fragmentation.
- **React**: A minimal view library that uses JSX (JavaScript XML) and functional component lifecycles. React delegates state management, routing, and styling decisions entirely to the open-source community, giving immense flexibility at the cost of higher decision fatigue.
- **Angular**: A fully batteries-included, opinionated enterprise framework built with TypeScript, RxJS, and Dependency Injection. Angular mandates strict patterns for everything, making it powerful for large corporate teams but heavier to learn and set up.

## Creating a Vue 3 Project with Vite

In the modern Vue ecosystem, **Vite** (pronounced "veet", French for "quick") is the official build tool created by Evan You. Vite replaces legacy Webpack setups by leveraging native browser ES Modules during development for instantaneous server start and sub-millisecond Hot Module Replacement (HMR).

To scaffold a brand new Vue 3 project using the official `create-vue` initializer powered by Vite, run the following command in your terminal:

```bash
npm create vue@latest
```

The interactive prompt allows you to configure TypeScript support, Vue Router, Pinia, ESLint, Prettier, and Vitest testing with a single click. Once configured, navigate into the directory and launch the dev server:

```bash
cd my-vue-project
npm install
npm run dev
```

## Anatomy of a Vue Project Structure

A standard Vue 3 Vite application generated with `create-vue` contains a clean, organized directory layout:

```text
my-vue-project/
├── index.html            # Entry HTML shell where Vue mounts
├── package.json          # Dependencies, scripts, and metadata
├── vite.config.ts        # Vite plugins and alias configuration
├── public/               # Static assets served as-is (favicon, robots.txt)
└── src/
    ├── main.ts           # Application entry point: creates & mounts Vue app
    ├── App.vue           # Root component of the application
    ├── assets/           # Global CSS, images, and fonts
    ├── components/       # Reusable UI components
    └── types/            # TypeScript interfaces and types
```

The `src/main.ts` file acts as the bootstrap script for your entire application. It imports the `createApp` function from `vue`, imports the root `App.vue` component, and mounts it into the `#app` container defined in `index.html`:

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'

const app = createApp(App)
app.mount('#app')
```

## Single File Components (.vue)

One of Vue's hallmark innovations is the **Single File Component (SFC)** format, encapsulated in `.vue` files. An SFC co-locates the component's HTML template, JavaScript logic, and CSS styling in a single, cohesive file.

Rather than artificially separating code by file technology (`.html`, `.js`, `.css`), SFCs organize code by logical unit of concern. Each component encapsulates its own visual presentation, behavior, and design rules, making large web applications remarkably easy to navigate, refactor, and maintain.

```vue
<script setup lang="ts">
import { ref } from 'vue'

const greeting = ref('Welcome to Vue 3!')
</script>

<template>
  <div class="card">
    <h2 class="title">{{ greeting }}</h2>
  </div>
</template>

<style scoped>
.card {
  padding: 1.5rem;
  border-radius: 1rem;
  background-color: #f8fafc;
}
.title {
  color: #0f172a;
  font-weight: 700;
}
</style>
```

## The `<template>` Block

The `<template>` block defines the markup and visual structure of your component. Vue templates are valid HTML that browser parsers can understand, augmented with Vue's expressive template syntax (such as `{{ message }}`, `v-if`, and `@click`).

During the Vite build process, Vue's compiler compiles the HTML template into highly optimized JavaScript render functions. Vue 3's compiler analyzes dynamic bindings at build time to produce "block trees" with patch flags, ensuring that runtime updates only check elements that can actually change.

## The `<script setup>` Syntax

The `<script setup>` block is the standard, modern syntactic sugar for using the Composition API inside Single File Components. Introduced in Vue 3.2, `<script setup>` eliminates boilerplate code:

- Top-level bindings (variables, functions, imports) are automatically exposed directly to the `<template>` without needing a manual `return` statement.
- Components imported at the top level can be used directly as tags in the template without manual registration.
- It delivers superior runtime performance because the template compiles into an inline render function with direct lexical access.
- It provides first-class TypeScript support with full type inference and compiler macros (`defineProps`, `defineEmits`).

```vue
<script setup lang="ts">
import { ref } from 'vue'
import UserAvatar from './UserAvatar.vue' // Automatically available in template

const username = ref('alex_dev')
function handleUpdate() {
  username.value = 'alex_lead'
}
</script>

<template>
  <div class="profile">
    <UserAvatar :name="username" />
    <button @click="handleUpdate">Update Handle</button>
  </div>
</template>
```

## The `<style>` and `scoped` Styling

The `<style>` block contains the CSS rules applied to your component. By adding the `scoped` attribute (`<style scoped>`), Vue automatically scopes the styles to the current component using a unique post-CSS data attribute (e.g. `data-v-7ba5bd90`).

Scoped CSS prevents styles from bleeding into child components or leaking into global parent elements, solving the classic CSS specificity and naming collision challenges in large codebases without requiring heavy CSS-in-JS runtimes.

```vue
<style scoped>
/* Only targets .badge inside this specific component */
.badge {
  background-color: #10b981;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
}
</style>
```

## Best Practices

- **Always Use `<script setup>`**: Build all new Vue 3 components with `<script setup>` for cleaner code, better TypeScript integration, and faster runtime execution.
- **Scope Component Styles**: Always use `<style scoped>` or utility classes (like Tailwind CSS) to maintain strict visual encapsulation.
- **Maintain Clear File Responsibilities**: Keep components focused on a single responsibility; split large components exceeding 200 lines of template/script into smaller child components.
- **Leverage Official Tooling**: Use Vite and `create-vue` rather than legacy Webpack setups for instantaneous developer feedback loops.

## Summary

Vue.js balances developer friendliness with enterprise-grade performance. Through Vite build tooling, Single File Components (`.vue`), and the streamlined `<script setup>` syntax, Vue enables you to build modular, maintainable, and highly reactive user interfaces with confidence.
