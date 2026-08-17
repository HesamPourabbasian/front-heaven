---
title: 'Reactivity Fundamentals'
description: 'Deep dive into Vue 3 reactivity engine: JavaScript Proxies, ref(), reactive(), computed getters, watch(), watchEffect(), and template unwrapping rules.'
order: 4
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 30
prerequisites:
  - /learn/vue/03-template-syntax
---

# Reactivity Fundamentals

Reactivity is the core engine that powers Vue.js. It is the mechanism by which changes to your JavaScript application state are automatically detected and reflected in the browser's Document Object Model (DOM) without requiring manual DOM manipulation. In Vue 3, the reactivity system was completely rewritten using modern ES6 `Proxy` objects, delivering seamless property tracking, full support for dynamic key additions/deletions, array mutations, and exceptional runtime performance.

In this lesson, we will dissect how reactivity works, explore the differences between `ref()` and `reactive()`, master cached `computed()` properties, and understand reactive side-effect watchers (`watch` and `watchEffect`).

## What is Reactivity? Dependency Tracking and Triggers

In standard JavaScript, values do not automatically re-evaluate when their dependencies change:

```javascript
let price = 10
let quantity = 2
let total = price * quantity // 20

price = 20
console.log(total) // Still 20! (total is not reactive)
```

In a reactive system like Vue, whenever a piece of state is read during component rendering or computed evaluation, Vue records a dependency relationship (**tracking**). When that piece of state is later mutated, Vue looks up all recorded dependencies and re-executes them (**triggering** effects to re-render the DOM or compute new values).

Vue 3 achieves this transparently by wrapping reactive data in JavaScript `Proxy` handlers that intercept property reads (`get` trap) and writes (`set` trap).

## `ref()` and the `.value` Wrapper

The `ref()` function is the primary and recommended way to declare reactive state in Vue 3. It takes an inner value (primitive like `number`, `string`, `boolean`, or complex types like objects and arrays) and returns a reactive, mutable **ref object**.

The ref object contains a single property: `.value`. Inside `<script setup>`, you must explicitly access and mutate state via `.value`. However, when a ref is bound inside the `<template>`, Vue automatically "unwraps" it, allowing you to omit `.value` for clean, ergonomic markup.

```vue
<script setup lang="ts">
import { ref } from 'vue'

// Declaring primitive refs
const count = ref<number>(0)
const title = ref<string>('Frontend Mastery')

function increment() {
  // In JavaScript/TypeScript, .value is required
  count.value += 1
}
</script>

<template>
  <div class="counter">
    <h2>{{ title }}</h2>
    <!-- In template, .value is automatically unwrapped -->
    <p>Current Count: {{ count }}</p>
    <button @click="increment">+1</button>
  </div>
</template>
```

## `reactive()` for Complex State Objects

In addition to `ref()`, Vue provides the `reactive()` function. Unlike `ref()`, which wraps the value in an object with a `.value` property, `reactive()` returns a reactive `Proxy` of the target object itself.

With `reactive()`, you access properties directly without `.value`, both in script and in template. However, `reactive()` comes with significant limitations:
1. It **only works for object types** (objects, arrays, Maps, Sets)—it cannot hold primitive types (`string`, `number`, `boolean`).
2. You **cannot replace the entire reactive object** (reassigning `state = reactive({ ... })` breaks the reactive proxy connection).
3. If you destructure properties from a `reactive()` object (`const { count } = state`), the destructured variables lose reactivity unless converted using `toRefs()`.

```vue
<script setup lang="ts">
import { reactive } from 'vue'

const userProfile = reactive({
  id: 101,
  name: 'Hesam',
  preferences: {
    theme: 'dark',
    notifications: true
  }
})

function toggleTheme() {
  // Direct property mutation without .value
  userProfile.preferences.theme = 
    userProfile.preferences.theme === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <div>
    <p>User: {{ userProfile.name }} (Theme: {{ userProfile.preferences.theme }})</p>
    <button @click="toggleTheme">Toggle Theme</button>
  </div>
</template>
```

**Recommendation**: The Vue core team recommends using `ref()` as the primary standard for all reactive state declarations.

## `computed()`: Cached Derived State

A `computed()` property is a reactive getter whose returned value is automatically derived from other reactive sources.

Computed properties are **lazily evaluated and cached**. A computed property will only re-evaluate when one of its reactive dependencies has actually changed. If you access a computed property 100 times, but its reactive dependencies remain identical, Vue returns the cached result instantaneously without re-running the calculation function. This is vastly superior to calling a regular function inside the template, which executes on every single component re-render.

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

const cartItems = ref([
  { id: 1, name: 'Vue 3 Mastery Book', price: 49, quantity: 2 },
  { id: 2, name: 'Vite Sticker Pack', price: 12, quantity: 3 },
  { id: 3, name: 'Nuxt Cap', price: 25, quantity: 1 },
])

// Computed property derived from cartItems ref
const totalPrice = computed(() => {
  console.log('Calculating cart total...')
  return cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

const isEligibleForFreeShipping = computed(() => totalPrice.value >= 100)
</script>

<template>
  <div class="cart-summary">
    <p>Total Items: {{ cartItems.length }}</p>
    <p>Grand Total: ${{ totalPrice.toFixed(2) }}</p>
    <p v-if="isEligibleForFreeShipping" class="free-shipping">
      ✓ You qualify for free worldwide shipping!
    </p>
  </div>
</template>
```

### Writable Computed Properties
By default, computed properties are read-only. However, you can provide an object with both a `get` and a `set` function to create a two-way writable computed property:

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

const firstName = ref('Hesam')
const lastName = ref('Pourabbasian')

const fullName = computed({
  get() {
    return `${firstName.value} ${lastName.value}`
  },
  set(newValue: string) {
    const parts = newValue.split(' ')
    firstName.value = parts[0] ?? ''
    lastName.value = parts.slice(1).join(' ')
  }
})
</script>
```

## `watch()`: Explicit Side Effects on Reactive Changes

While `computed()` is designed to derive synchronous values without side effects, `watch()` is designed to perform asynchronous operations or side effects (such as making API calls, persisting data to `localStorage`, or logging analytics) when specific reactive state changes.

`watch()` is **lazy by default**—the callback does not run until the watched source actually changes. It receives both the `newValue` and the `oldValue` as arguments.

```vue
<script setup lang="ts">
import { ref, watch } from 'vue'

const searchKeyword = ref('')
const searchResults = ref<string[]>([])
const isLoading = ref(false)

// Watching a single ref
watch(searchKeyword, async (newQuery, oldQuery) => {
  if (!newQuery.trim()) {
    searchResults.value = []
    return
  }

  isLoading.value = true
  try {
    const res = await fetch(`https://api.example.com/search?q=${encodeURIComponent(newQuery)}`)
    const data = await res.json()
    searchResults.value = data.items
  } finally {
    isLoading.value = false
  }
}, {
  debounce: 300, // custom logic or third-party composable
  immediate: false, // default is false; set true to run immediately on mount
  deep: false // set true to deep-watch nested object properties
})
</script>
```

To watch multiple sources simultaneously, pass an array:
```typescript
watch([userId, organizationId], ([newUserId, newOrgId], [oldUserId, oldOrgId]) => {
  console.log('User or Organization changed:', newUserId, newOrgId)
})
```

## `watchEffect()`: Eager, Automatic Dependency Tracking

`watchEffect()` is an alternative to `watch()` that runs its callback function **immediately on creation** (eager) while automatically tracking any reactive properties accessed synchronously inside its execution function.

You do not need to explicitly declare which properties to watch—Vue discovers them dynamically. If any accessed reactive property changes in the future, the effect re-executes.

```vue
<script setup lang="ts">
import { ref, watchEffect } from 'vue'

const userId = ref(1)
const userData = ref(null)

// Automatically tracks userId.value because it is read during execution
watchEffect(async (onCleanup) => {
  const controller = new AbortController()
  
  // Register cleanup function (called if userId changes before fetch finishes)
  onCleanup(() => controller.abort())

  try {
    const res = await fetch(`https://api.example.com/users/${userId.value}`, {
      signal: controller.signal
    })
    userData.value = await res.json()
  } catch (err: any) {
    if (err.name !== 'AbortError') console.error(err)
  }
})
</script>
```

## Reactive Objects and Array Mutations

In Vue 2, Object property additions and direct array index assignments (`arr[0] = val`) failed to trigger reactivity due to `Object.defineProperty` limitations.

In Vue 3, because reactivity is powered by native `Proxy` objects, all mutations are detected automatically:
- Adding or deleting object properties: `delete user.age` or `user.newField = 123` are 100% reactive.
- Array index assignments: `items[0] = 'new'` triggers updates.
- Array length mutations: `items.length = 0` triggers updates.
- Native mutating array methods: `push()`, `pop()`, `shift()`, `unshift()`, `splice()`, `sort()`, `reverse()` all trigger reactivity.

## Template Ref Unwrapping Rules

When refs are accessed as top-level properties in the template, Vue unwraps them automatically. However, if a ref is nested inside a plain JavaScript object (not a `reactive()` object), unwrapping does not occur automatically inside templates:

```vue
<script setup lang="ts">
import { ref } from 'vue'

const count = ref(10) // Top level: unwrapped automatically
const nested = { number: ref(20) } // Nested in plain object: NOT unwrapped
</script>

<template>
  <p>{{ count + 1 }}</p> <!-- Works: 11 -->
  <p>{{ nested.number.value + 1 }}</p> <!-- Must explicitly use .value -->
</template>
```

## Best Practices

- **Standardize on `ref()`**: Use `ref()` for all state definitions to keep your code predictable, avoid destructuring pitfalls, and maintain uniform `.value` semantics across scripts.
- **Keep `computed()` Pure**: Never perform asynchronous network requests, DOM mutations, or state modifications inside a computed getter; keep them deterministic and purely mathematical.
- **Choose Between `watch` and `watchEffect` Intentionally**: Use `watch()` when you need access to the previous value or want lazy evaluation. Use `watchEffect()` when you need immediate execution and want automatic dependency collection.
- **Clean Up Async Effects**: Always register cleanup callbacks inside `watchEffect` using `onCleanup` to abort pending network requests when input parameters change rapidly.

## Summary

Vue 3's Proxy-based reactivity system delivers declarative state synchronization with high performance and zero boilerplate. By utilizing `ref()` for reactive state, `computed()` for cached derived data, and `watch()`/`watchEffect()` for side effects, you have complete control over state lifecycle and UI rendering.
