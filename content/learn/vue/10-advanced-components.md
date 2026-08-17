---
title: 'Advanced Components & Built-in Features'
description: 'Master advanced Vue component architecture: dynamic components, KeepAlive caching, Teleport, Transition and TransitionGroup animations, async components, recursive trees, and renderless components.'
order: 10
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 35
prerequisites:
  - /learn/vue/05-components
  - /learn/vue/09-composition-api
---

# Advanced Components & Built-in Features

Beyond standard template rendering and prop passing, Vue provides a suite of specialized built-in components and advanced architectural patterns designed to handle complex UI requirements. These include dynamic runtime component switching, in-memory state caching with `<KeepAlive>`, DOM portal rendering with `<Teleport>`, smooth animations with `<Transition>` and `<TransitionGroup>`, code-split asynchronous components with `defineAsyncComponent`, and headless logic sharing with renderless components.

In this lesson, we will explore these powerful capabilities to build sophisticated, high-performance user interfaces.

## Dynamic Components with `<component :is="...">`

In many applications, you need to switch between different components dynamically based on user interaction (e.g. multi-tabbed dashboards, wizard step flows, or CMS block renderers). Instead of writing chained `v-if / v-else-if` statements, Vue provides the generic `<component :is="...">` element.

The `:is` attribute accepts:
1. An imported component object.
2. A registered component name string.
3. A native HTML tag string (such as `'button'` or `'div'`).

```vue
<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import OverviewTab from './tabs/OverviewTab.vue'
import BillingTab from './tabs/BillingTab.vue'
import SecurityTab from './tabs/SecurityTab.vue'

// Use shallowRef for component definitions to avoid unnecessary deep proxying
const currentTab = shallowRef(OverviewTab)

const tabs = [
  { label: 'Overview', comp: OverviewTab },
  { label: 'Billing', comp: BillingTab },
  { label: 'Security', comp: SecurityTab },
]
</script>

<template>
  <div class="tabs-container">
    <nav class="flex gap-2 border-b pb-2">
      <button
        v-for="t in tabs"
        :key="t.label"
        @click="currentTab = t.comp"
        :class="{ 'font-bold text-primary': currentTab === t.comp }"
      >
        {{ t.label }}
      </button>
    </nav>

    <!-- Dynamically switches component instance based on currentTab -->
    <main class="mt-4">
      <component :is="currentTab" />
    </main>
  </div>
</template>
```

## `<KeepAlive>`: In-Memory Component State Caching

When switching between dynamic components, Vue destroys the old component instance and creates a fresh one from scratch by default. This causes all local state (form inputs, scroll positions, loaded data) to be lost.

Wrapping dynamic components inside `<KeepAlive>` preserves the inactive component instance in memory instead of destroying it. When the user navigates back to a cached component, it is re-inserted instantaneously with its previous state intact.

### `<KeepAlive>` Props and Specialized Lifecycle Hooks
- `include`: Comma-delimited string or RegExp specifying which component names to cache.
- `exclude`: Specifies components that should never be cached.
- `max`: Limits the maximum number of component instances to cache (evicts the least recently used instance).
- `onActivated`: Lifecycle hook called when a kept-alive component is re-inserted into the DOM.
- `onDeactivated`: Lifecycle hook called when a kept-alive component is removed from the DOM into cache.

```vue
<script setup lang="ts">
import { ref, onActivated, onDeactivated } from 'vue'

onActivated(() => {
  console.log('Component restored from cache: refresh live data')
})

onDeactivated(() => {
  console.log('Component stored in cache: pause animations/timers')
})
</script>

<template>
  <KeepAlive :max="5" include="OverviewTab,BillingTab">
    <component :is="currentTab" />
  </KeepAlive>
</template>
```

## `<Teleport>`: Escaping the Local DOM Hierarchy

Modals, full-screen overlays, tooltips, and notification toasts are often declared deep within nested child components for logical co-location. However, placing their HTML elements deep in the DOM tree can cause severe visual bugs due to parent CSS rules (`z-index` stacking contexts, `overflow: hidden`, or CSS transforms).

The `<Teleport>` built-in component enables you to render a piece of a component's template into a completely different DOM node outside the component hierarchy (such as `to="body"` or `to="#modal-target"`), while retaining full Vue data reactivity, props, and event handling within the parent component scope.

```vue
<script setup lang="ts">
import { ref } from 'vue'

const isModalOpen = ref(false)
</script>

<template>
  <div class="card">
    <button @click="isModalOpen = true">Open Account Dialog</button>

    <!-- Teleported to document.body, escaping parent z-index and overflow -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div class="bg-surface p-6 rounded-2xl max-w-md shadow-2xl">
            <h3 class="text-lg font-bold">Teleported Dialog</h3>
            <p class="text-sm text-muted mt-2">Rendered cleanly at root body element.</p>
            <button @click="isModalOpen = false" class="mt-4 btn-primary">Close</button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
```

## Smooth Animations with `<Transition>`

Vue provides the `<Transition>` wrapper component to apply enter and leave transition animations whenever an element or component enters or leaves the DOM (via `v-if`, `v-show`, or dynamic `<component :is>`).

When an element inside `<Transition name="slide">` is toggled, Vue automatically applies 6 CSS transition classes at precise moments during the animation cycle:

```text
Enter Phase:
.slide-enter-from  --> Starting state before element appears
.slide-enter-active --> Active transition curve, duration, easing
.slide-enter-to    --> Final resting state after entering

Leave Phase:
.slide-leave-from  --> Starting state when element begins leaving
.slide-leave-active --> Active leave transition duration and easing
.slide-leave-to    --> Final state before element is removed from DOM
```

```vue
<template>
  <Transition name="slide-fade" mode="out-in">
    <div v-if="showMessage" class="alert-box">
      Operation completed successfully!
    </div>
  </Transition>
</template>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-8px);
  opacity: 0;
}
</style>
```

The `mode="out-in"` prop ensures that the outgoing element finishes animating out before the incoming element begins animating in, avoiding visual layout jumps.

## List Animations with `<TransitionGroup>`

To animate elements inside a `v-for` list (such as adding, removing, or reordering items), use `<TransitionGroup>`.

In addition to enter/leave transitions, `<TransitionGroup>` introduces the **`.name-move`** CSS class. Vue uses the FLIP (First, Last, Invert, Play) animation technique under the hood to calculate position transforms, smoothly gliding sibling elements into their new positions when an item is deleted or sorted.

```vue
<script setup lang="ts">
import { ref } from 'vue'

const items = ref(['Alpha', 'Beta', 'Gamma', 'Delta'])

function shuffle() {
  items.value = [...items.value].sort(() => Math.random() - 0.5)
}

function remove(index: number) {
  items.value.splice(index, 1)
}
</script>

<template>
  <div>
    <button @click="shuffle">Shuffle List</button>
    
    <TransitionGroup name="list" tag="ul" class="space-y-2 mt-4">
      <li v-for="(item, idx) in items" :key="item" class="p-3 bg-surface-2 rounded-lg flex justify-between">
        <span>{{ item }}</span>
        <button @click="remove(idx)" class="text-xs text-red-500">✕</button>
      </li>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
/* Crucial FLIP class for smooth layout shifts */
.list-move {
  transition: transform 0.4s ease;
}
</style>
```

## Asynchronous Components with `defineAsyncComponent`

In large applications, bundling all components into a single massive JavaScript file hurts initial page load performance. **Async components** allow you to code-split heavy components (such as rich text editors, 3D viewers, or admin charts) into separate chunks that are only downloaded over the network when rendered.

```vue
<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue'
import LoadingSpinner from './LoadingSpinner.vue'
import ErrorDisplay from './ErrorDisplay.vue'

// Loaded on-demand as a separate network chunk
const HeavyEditor = defineAsyncComponent({
  loader: () => import('./HeavyEditor.vue'),
  loadingComponent: LoadingSpinner,
  errorComponent: ErrorDisplay,
  delay: 200, // Show loading component after 200ms delay to avoid flashing
  timeout: 10000, // Timeout after 10 seconds if network fails
})

const showEditor = ref(false)
</script>

<template>
  <div>
    <button @click="showEditor = true">Launch Code Editor</button>
    <HeavyEditor v-if="showEditor" />
  </div>
</template>
```

## Recursive Components for Tree Structures

A component that recursively renders itself in its own template is called a **recursive component**. This pattern is essential for rendering hierarchical tree structures, such as nested file folder directories, comment threads, or organizational charts.

In `<script setup>`, a component can automatically reference itself by its file name (e.g. `FolderTree.vue` can use `<FolderTree />` inside its own template):

```vue
<!-- FolderTree.vue -->
<script setup lang="ts">
interface FileNode {
  name: string
  isDirectory: boolean
  children?: FileNode[]
}

defineProps<{
  node: FileNode
}>()
</script>

<template>
  <div class="pl-4 border-l border-border/80">
    <div class="flex items-center gap-1.5 py-1 text-sm font-medium">
      <span>{{ node.isDirectory ? '📁' : '📄' }}</span>
      <span>{{ node.name }}</span>
    </div>

    <!-- Recursive self-invocation -->
    <div v-if="node.isDirectory && node.children" class="space-y-1">
      <FolderTree
        v-for="child in node.children"
        :key="child.name"
        :node="child"
      />
    </div>
  </div>
</template>
```

## Renderless Components

A **renderless component** is a component that encapsulates complex behavioral logic without rendering any DOM elements of its own. It exposes its internal state, methods, and handlers to the parent component exclusively through **scoped slots**.

While custom composables have largely superseded renderless components for pure state sharing, renderless components remain popular in headless UI libraries where logic needs to bind tightly to template slot markup.

```vue
<!-- MouseTracker.vue (Renderless Component) -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const x = ref(0)
const y = ref(0)

function update(e: MouseEvent) {
  x.value = e.clientX
  y.value = e.clientY
}

onMounted(() => window.addEventListener('mousemove', update))
onUnmounted(() => window.removeEventListener('mousemove', update))
</script>

<template>
  <!-- No DOM wrapper: purely exposes scoped slot props -->
  <slot :x="x" :y="y" />
</template>
```

## Best Practices

- **Use `shallowRef` for Dynamic Component State**: Storing raw component objects in standard `ref()` incurs unnecessary deep proxying overhead; always use `shallowRef(MyComponent)`.
- **Set `max` on `<KeepAlive>`**: Unbounded `<KeepAlive>` caches will consume increasing browser memory as users navigate; always specify a sensible `:max="10"` limit.
- **Always Provide Explicit `:key` in `<TransitionGroup>`**: TransitionGroup relies strictly on stable, unique keys to perform FLIP layout recalculations.
- **Lazy-Load Heavy Below-the-Fold UI**: Use `defineAsyncComponent` for heavy features (charting libraries, modals, rich text editors) to optimize Initial Page Load (LCP).

## Summary

Vue's advanced component features empower developers to handle dynamic user interfaces with precision. By combining dynamic components, `<KeepAlive>` caching, `<Teleport>` portals, `<Transition>` and `<TransitionGroup>` animations, `defineAsyncComponent` code splitting, and recursive trees, you can build enterprise-grade frontend architectures that are responsive, animated, and performant.
