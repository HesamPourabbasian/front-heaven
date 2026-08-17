---
title: 'The Composition API & Custom Composables'
description: 'Master the Composition API: script setup architecture, extracting reusable logic into composables, toRef, toRefs, unref, isRef, shallowRef, and shallowReactive.'
order: 9
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 30
prerequisites:
  - /learn/vue/04-reactivity
  - /learn/vue/06-lifecycle
---

# The Composition API & Custom Composables

In Vue 2 and earlier versions of Vue 3, components were primarily written using the Options API, which organized code by option types (`data`, `methods`, `computed`, `watch`, `mounted`). While approachable for beginners, the Options API suffered from major limitations as applications scaled: related logical concerns became scattered across disparate options, and extracting and sharing stateful logic between components required brittle mixins with implicit dependencies and property collision risks.

The **Composition API** solves these challenges by allowing developers to organize component code by logical feature rather than framework option type. It enables seamless extraction and reuse of stateful business logic through **Composables** (the Vue equivalent of React Custom Hooks, but with superior performance and predictable execution semantics).

In this lesson, we will explore the Composition API in depth, build production-grade custom composables, and master reactivity utility helpers like `toRef`, `toRefs`, `unref`, `isRef`, `shallowRef`, and `shallowReactive`.

## Composition API Architecture: Why It Matters

The Composition API is not a replacement for Vue's reactivity system—it is the official architectural pattern for structuring reactive logic in Vue 3.

Key advantages of the Composition API include:
1. **Co-located Logical Concerns**: All reactive variables, computed getters, watchers, and lifecycle hooks belonging to a single feature (e.g. search pagination or user authentication) live together in one clean block.
2. **First-Class TypeScript Support**: Full static typing and IDE autocompletion without needing awkward `this` typing gymnastics.
3. **True Logic Reusability**: Stateful logic can be extracted into standalone `.ts` files called Composables and imported into any component.
4. **Smaller Production Bundles**: `<script setup>` code minifies more aggressively because template variables directly reference identifiers in local closure scope rather than object properties on a component instance.

## Anatomy of a Custom Composable

A **Composable** is a function that leverages Vue's Composition API to encapsulate and reuse stateful logic. By convention, composable function names always begin with `use`, such as `useMousePosition`, `useFetch`, `useLocalStorage`, or `useAuth`.

Unlike vanilla JavaScript utility functions that only perform stateless calculations, composables maintain their own reactive state (`ref`, `computed`), register their own lifecycle hooks (`onMounted`, `onUnmounted`), and return reactive references back to the calling component.

### Example: Building a Resilient `useWindowSize` Composable

```typescript
// src/composables/useWindowSize.ts
import { ref, onMounted, onUnmounted } from 'vue'

export function useWindowSize() {
  const width = ref(typeof window !== 'undefined' ? window.innerWidth : 0)
  const height = ref(typeof window !== 'undefined' ? window.innerHeight : 0)

  function update() {
    width.value = window.innerWidth
    height.value = window.innerHeight
  }

  onMounted(() => {
    window.addEventListener('resize', update, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('resize', update)
  })

  // Return reactive refs directly
  return { width, height }
}
```

Consuming the composable inside any component:
```vue
<script setup lang="ts">
import { useWindowSize } from '@/composables/useWindowSize'

const { width, height } = useWindowSize()
</script>

<template>
  <div class="viewport-badge">
    Screen: {{ width }} x {{ height }} px
    <span v-if="width < 768" class="badge">Mobile</span>
    <span v-else class="badge">Desktop</span>
  </div>
</template>
```

### Example: Building a Generic Asynchronous `useAsync` Composable

```typescript
// src/composables/useAsync.ts
import { ref, type Ref } from 'vue'

export interface AsyncState<T> {
  data: Ref<T | null>
  error: Ref<Error | null>
  isLoading: Ref<boolean>
  execute: (...args: any[]) => Promise<T | null>
}

export function useAsync<T>(asyncFn: (...args: any[]) => Promise<T>): AsyncState<T> {
  const data = ref<T | null>(null) as Ref<T | null>
  const error = ref<Error | null>(null)
  const isLoading = ref<boolean>(false)

  async function execute(...args: any[]): Promise<T | null> {
    isLoading.value = true
    error.value = null
    try {
      const result = await asyncFn(...args)
      data.value = result
      return result
    } catch (err: any) {
      error.value = err instanceof Error ? err : new Error(String(err))
      return null
    } finally {
      isLoading.value = false
    }
  }

  return { data, error, isLoading, execute }
}
```

## `toRef()` and `toRefs()`: Preserving Reactivity During Destructuring

When you receive a `reactive()` object (or a component's `props` object), standard JavaScript destructuring will sever the connection to Vue's reactivity system:

```typescript
const state = reactive({ count: 0, title: 'Hello' })
// BROKEN: count is now a plain primitive number, losing reactivity!
let { count } = state
```

To safely destructure properties from reactive objects or props while maintaining a two-way reactive link, use `toRefs()` or `toRef()`:

- **`toRefs(reactiveObject)`**: Converts every property of a reactive object into an individual `ref` pointing to the corresponding property on the original object.
- **`toRef(object, 'propertyName')`**: Creates a single `ref` linked to a specific property on a reactive object or prop.

```vue
<script setup lang="ts">
import { reactive, toRefs, toRef } from 'vue'

const user = reactive({
  name: 'Hesam',
  role: 'Engineer',
  score: 95
})

// Safely destructure all properties as refs
const { name, role, score } = toRefs(user)

// Mutating the ref mutates the underlying reactive object and vice versa
score.value += 5 // user.score is now 100

// Single property ref
const userRole = toRef(user, 'role')
</script>
```

## `unref()` and `isRef()`: Writing Flexible Composable Arguments

When writing reusable composable functions, users may pass either a plain primitive value (`string`) or a reactive ref (`Ref<string>`). To handle both inputs seamlessly without forcing callers to unwrap or wrap parameters manually, use `unref()` and `isRef()`:

- **`isRef(val)`**: Checks if a target value is a Vue `ref` object.
- **`unref(val)`**: Returns the inner `.value` if the argument is a ref, or returns the argument itself if it is a plain value. (Equivalent to `isRef(val) ? val.value : val`).
- **`toValue(val)`** (Vue 3.3+): Normalizes refs, getters/functions, and plain values into a raw value.

```typescript
import { unref, type MaybeRef } from 'vue'

export function useGreeting(name: MaybeRef<string>) {
  // unref safely extracts string whether name is 'Alex' or ref('Alex')
  const formatted = computed(() => `Hello, ${unref(name)}!`)
  return { formatted }
}
```

## `shallowRef()` and `shallowReactive()`: High-Performance Optimizations

By default, Vue's `ref()` and `reactive()` create **deep reactivity**: every nested object property within the data structure is recursively wrapped in a `Proxy`.

While deep reactivity is convenient, it introduces performance overhead when storing massive datasets that never mutate deeply (e.g. a list of 10,000 immutable table rows from a database, a complex Three.js 3D scene graph, or a large rich-text editor instance).

- **`shallowRef(value)`**: Only tracks mutations to the root `.value` property. Nested properties inside the object are NOT reactive. To trigger an update after modifying a nested property inside a shallow ref, use `triggerRef(myShallowRef)`.
- **`shallowReactive(object)`**: Only tracks root-level property access and mutation. Nested sub-objects remain raw and unproxied.

```typescript
import { shallowRef, triggerRef } from 'vue'

// Massive 3D scene or large immutable array
const largeDataset = shallowRef<BigRecord[]>([])

// Replacing the entire array is reactive and fast
largeDataset.value = await fetchBigData()

// Mutating a nested item does NOT trigger reactivity automatically...
largeDataset.value[0].status = 'processed'

// ...unless you explicitly notify Vue with triggerRef
triggerRef(largeDataset)
```

## Best Practices for Writing Composables

- **Always Return Plain Objects of Refs**: Return `{ data, isLoading, error }` instead of a reactive object, allowing consumers to destructure properties without losing reactivity.
- **Support Flexible Arguments with `MaybeRef`**: Accept `MaybeRef<T>` or `MaybeRefOrGetter<T>` so callers can pass either static values, refs, or getter functions.
- **Clean Up Side Effects Internally**: If your composable adds event listeners or creates timers, register `onUnmounted` (or `onScopeDispose`) inside the composable itself to guarantee zero memory leaks.
- **Keep Composables Single-Purpose**: Follow the Single Responsibility Principle; compose smaller composables together to build larger feature workflows.

## Summary

The Composition API transforms Vue development by enabling clean code organization, deep composability, and unmatched TypeScript support. By mastering custom composables, reactive helper utilities (`toRefs`, `unref`), and performance primitives (`shallowRef`), you can structure scalable, modular frontend applications.
