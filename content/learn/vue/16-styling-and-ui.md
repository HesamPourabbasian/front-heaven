---
title: 'Styling & UI Architecture in Vue 3'
description: 'Master modern styling in Vue 3: scoped CSS, deep selectors (:deep), v-bind in CSS, Tailwind CSS integration, component libraries, dark mode architecture, and accessibility (a11y).'
order: 16
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 30
prerequisites:
  - /learn/vue/02-vue-fundamentals
  - /learn/vue/05-components
---

# Styling & UI Architecture in Vue 3

Styling and user interface (UI) architecture define how users experience and interact with your application. Vue 3 offers unprecedented flexibility for styling components, ranging from built-in scoped CSS and dynamic `v-bind()` in CSS, to CSS Modules, modern utility-first CSS frameworks like Tailwind CSS, headless UI component systems, and dark mode theming.

In this lesson, we will explore Vue's styling ecosystem, dissect scoped styling pseudo-selectors, integrate Tailwind CSS, implement dynamic CSS variable bindings, build a persistent dark mode switch, and enforce accessibility (a11y) standards.

## Scoped CSS and PostCSS Selectors

When you add the `scoped` attribute to a `<style>` block (`<style scoped>`), Vue uses PostCSS to rewrite your component's CSS selectors, appending a unique data attribute (e.g. `[data-v-f3f3eg9]`) to both the compiled CSS rules and the rendered HTML elements.

This guarantees that styles written in one component never accidentally bleed out and affect other components across your application.

```vue
<template>
  <div class="banner">
    <h1>Welcome to Front-Heaven</h1>
  </div>
</template>

<style scoped>
/* Compiled to: .banner[data-v-f3f3eg9] */
.banner {
  background-color: #f1f5f9;
  padding: 1.5rem;
}
/* Compiled to: h1[data-v-f3f3eg9] */
h1 {
  color: #0f172a;
}
</style>
```

### The Deep Selector: `:deep()`
By default, scoped styles in a parent component do not target elements inside child components. However, when styling third-party UI library components or HTML rendered via `v-html`, you need to pierce the scoped boundary. Use the `:deep()` pseudo-class:

```vue
<style scoped>
/* Targets .editor-content inside a nested child component or v-html */
.parent-container :deep(.editor-content p) {
  line-height: 1.8;
  color: #334155;
}
</style>
```

### Slotted and Global Selectors: `:slotted()` and `:global()`
- **`:slotted(selector)`**: Targets elements passed into the component via a `<slot>`.
- **`:global(selector)`**: Applies styles globally without needing a separate unscoped `<style>` block.

## Dynamic State Binding in CSS: `v-bind()` in `<style>`

Vue 3 allows you to bind CSS values directly to reactive JavaScript variables using the `v-bind()` function inside the `<style>` block. Under the hood, Vue compiles this into a reactive CSS Custom Property (CSS variable) attached to the component's root element.

```vue
<script setup lang="ts">
import { ref } from 'vue'

const themeColor = ref('#10b981')
const borderRadius = ref('12px')
const paddingSize = ref('16px')
</script>

<template>
  <div class="dynamic-card">
    <h3>Dynamic Theming</h3>
    <button @click="themeColor = '#06b6d4'">Switch to Cyan</button>
  </div>
</template>

<style scoped>
.dynamic-card {
  /* Reactive CSS properties synchronized with component state */
  background-color: color-mix(in srgb, v-bind(themeColor) 15%, transparent);
  border: 2px solid v-bind(themeColor);
  border-radius: v-bind(borderRadius);
  padding: v-bind(paddingSize);
}
</style>
```

## CSS Modules with `<style module>`

If you prefer CSS Modules over scoped CSS, add the `module` attribute: `<style module>`. Vue exposes an automatically generated `$style` object to your `<template>` and `<script setup>` containing the hashed class names:

```vue
<script setup lang="ts">
import { useCssModule } from 'vue'

const styles = useCssModule()
console.log('Hashed class name:', styles.primaryButton)
</script>

<template>
  <button :class="$style.primaryButton">Click Me</button>
</template>

<style module>
.primaryButton {
  background-color: #10b981;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
}
</style>
```

## Integrating Tailwind CSS with Vue 3

**Tailwind CSS** is the most popular utility-first CSS framework in modern web development. When combined with Vue's component model, Tailwind allows you to build completely custom design systems without writing repetitive CSS classes.

### Setting up Tailwind CSS in a Vite Vue 3 Project:
```bash
npm install -D tailwindcss @tailwindcss/vite
```

In your `src/assets/main.css`, import Tailwind:
```css
@import "tailwindcss";
```

### Creating Reusable Tailwind UI Components:
```vue
<!-- BaseButton.vue -->
<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
})
</script>

<template>
  <button
    :disabled="props.disabled"
    class="inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    :class="[
      // Size variants
      props.size === 'sm' && 'px-3 py-1.5 text-xs',
      props.size === 'md' && 'px-4 py-2 text-sm',
      props.size === 'lg' && 'px-6 py-3 text-base',
      // Color variants
      props.variant === 'primary' && 'bg-emerald-500 text-white hover:bg-emerald-600 focus:ring-emerald-500',
      props.variant === 'secondary' && 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200',
      props.variant === 'danger' && 'bg-rose-500 text-white hover:bg-rose-600 focus:ring-rose-500',
    ]"
  >
    <slot />
  </button>
</template>
```

## Vue Component Libraries & Headless UI

When building production enterprise software, developers often leverage established component ecosystems:
- **Headless UI / Radix Vue / Reka UI / Shadcn Vue**: Provide completely unstyled, fully accessible interactive primitives (Dropdowns, Dialogs, Comboboxes, Accordions) that you style with your own Tailwind CSS classes.
- **PrimeVue**: A feature-rich, enterprise-grade component suite with over 90 UI components and comprehensive theming engines.
- **Vuetify / Element Plus**: Full-featured Material Design and enterprise UI systems.

## Dark Mode Architecture

A robust dark mode implementation should respect the user's operating system preferences (`prefers-color-scheme`), allow manual toggling, and persist the preference in `localStorage`:

```typescript
// src/composables/useDarkMode.ts
import { ref, watch, onMounted } from 'vue'

const isDark = ref(false)

export function useDarkMode() {
  function toggleDark() {
    isDark.value = !isDark.value
  }

  onMounted(() => {
    const saved = localStorage.getItem('theme_preference')
    if (saved) {
      isDark.value = saved === 'dark'
    } else {
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
  })

  watch(isDark, (val) => {
    document.documentElement.classList.toggle('dark', val)
    localStorage.setItem('theme_preference', val ? 'dark' : 'light')
  }, { immediate: true })

  return { isDark, toggleDark }
}
```

```vue
<!-- ThemeToggle.vue -->
<script setup lang="ts">
import { useDarkMode } from '@/composables/useDarkMode'

const { isDark, toggleDark } = useDarkMode()
</script>

<template>
  <button @click="toggleDark" class="p-2 rounded-xl border border-border bg-surface text-ink">
    <span>{{ isDark ? '🌙 Dark Mode' : '☀️ Light Mode' }}</span>
  </button>
</template>
```

## Accessibility (a11y) Best Practices in Vue

Accessibility is an essential quality standard in modern frontend engineering:
- **Semantic HTML**: Use native semantic tags (`<button>`, `<nav>`, `<header>`, `<main>`, `<article>`) rather than `<div>` tags with click handlers.
- **Keyboard Navigation**: Ensure all interactive elements can be navigated via Tab and triggered via Enter / Space.
- **ARIA Attributes**: Use `aria-expanded="isMenuOpen"`, `aria-haspopup="true"`, and `role="dialog"` to convey component state to screen readers.
- **Focus Management**: Trap keyboard focus inside open modals using composables or libraries like `focus-trap` so keyboard users cannot accidentally tab outside the dialog.

## Best Practices

- **Use Scoped CSS or Tailwind Exclusively**: Never write global unstructured CSS classes that risk naming collisions across large teams.
- **Use `:deep()` Sparingly**: Only use `:deep()` when modifying third-party UI library internals; excessive `:deep()` usage indicates poor component boundaries.
- **Leverage CSS Variables for Themes**: Define semantic CSS tokens (`--color-surface`, `--color-primary`, `--color-ink`) and switch themes by swapping variable sets.
- **Always Test Keyboard Navigation**: Ensure every custom modal, dropdown, and tab widget can be operated seamlessly using only a keyboard.

## Summary

Styling in Vue 3 bridges modular CSS scoping, dynamic reactive JavaScript bindings, utility-first styling with Tailwind CSS, and headless accessibility primitives. By adhering to scoped styling rules, building resilient dark mode architectures, and prioritizing accessibility, you can craft visually stunning, accessible user interfaces.
