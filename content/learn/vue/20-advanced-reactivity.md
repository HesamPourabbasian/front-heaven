---
title: 'Advanced Reactivity & Effect Scopes'
description: 'Master advanced Vue 3 reactivity: effectScope(), customRef for debouncing, onScopeDispose, flush timing (pre/post/sync), markRaw, toRaw, and reactive debugging with onTrack/onTrigger.'
order: 20
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 35
prerequisites:
  - /learn/vue/04-reactivity
  - /learn/vue/09-composition-api
  - /learn/vue/19-vue-internals
---

# Advanced Reactivity & Effect Scopes

While `ref()`, `reactive()`, and `computed()` cover daily application needs, advanced frontend engineering often requires low-level control over reactive effect lifecycles, custom debounce/throttle state mechanisms, raw non-proxied object markers, and fine-grained watcher flush timings. Vue 3 exposes a comprehensive suite of low-level reactivity APIs under `@vue/reactivity`.

In this lesson, we will master `effectScope()` for managing detached reactive effects, construct custom debounced refs with `customRef()`, dissect watcher flush timing (`pre`, `post`, `sync`), understand `markRaw()` and `toRaw()`, and debug reactivity graphs using `onTrack` and `onTrigger`.

## Managing Reactive Lifecycles with `effectScope()`

In a standard Vue component, all computed properties, watchers, and nested composables created during `<script setup>` are automatically tied to the component's internal lifecycle. When the component unmounts, Vue disposes of all associated effects automatically.

However, when creating reusable libraries, micro-frontend plugins, or global state stores outside of a component context, reactive watchers and computed properties will leak in memory forever unless manually stopped one by one.

**`effectScope()`** creates an isolated effect scope container that captures all reactive effects created within its synchronous execution. You can dispose of the entire group of effects with a single `.stop()` call:

```typescript
// src/services/LiveTelemetryService.ts
import { ref, computed, watch, effectScope, type EffectScope } from 'vue'

export class LiveTelemetryService {
  private scope: EffectScope | null = null
  public rawFps = ref(60)
  public smoothedFps = ref(60)

  public start() {
    // 1. Create a new isolated effect scope
    this.scope = effectScope()

    // 2. Execute reactive logic inside the scope
    this.scope.run(() => {
      // All watchers and computed properties created here are captured by this.scope!
      const fpsHistory = ref<number[]>([])

      watch(this.rawFps, (newVal) => {
        fpsHistory.value.push(newVal)
        if (fpsHistory.value.length > 10) fpsHistory.value.shift()
        
        const sum = fpsHistory.value.reduce((a, b) => a + b, 0)
        this.smoothedFps.value = Math.round(sum / fpsHistory.value.length)
      })
    })
  }

  public stop() {
    // 3. Clean up all watchers and effects in one call!
    if (this.scope) {
      this.scope.stop()
      this.scope = null
      console.log('All telemetry reactive watchers disposed.')
    }
  }
}
```

### `onScopeDispose()`
Inside custom composables, use `onScopeDispose()` to register cleanup callbacks. It functions like `onUnmounted`, but works seamlessly inside both component lifecycles AND standalone `effectScope()` containers:

```typescript
import { onScopeDispose } from 'vue'

export function useWebSocket(url: string) {
  const socket = new WebSocket(url)

  // Cleans up automatically whether invoked in a component or an effectScope
  onScopeDispose(() => {
    socket.close()
    console.log('WebSocket connection closed.')
  })

  return { socket }
}
```

## Creating Custom Reactive Primitives with `customRef()`

The `customRef()` API allows you to define a reactive reference with explicit control over when dependency tracking (`track()`) and change triggering (`trigger()`) occur.

A quintessential use case is creating a **debounced ref** that delays updating downstream computed properties, watchers, and UI templates until typing ceases:

```typescript
// src/composables/useDebouncedRef.ts
import { customRef } from 'vue'

export function useDebouncedRef<T>(initialValue: T, delayMs: number = 300) {
  let timeoutId: number | undefined
  let internalValue = initialValue

  return customRef<T>((track, trigger) => ({
    get() {
      // 1. Explicitly track dependency reads
      track()
      return internalValue
    },
    set(newValue: T) {
      clearTimeout(timeoutId)
      // 2. Delay triggering downstream reactive subscribers
      timeoutId = window.setTimeout(() => {
        internalValue = newValue
        trigger() // Notify Vue to update UI and computed getters!
      }, delayMs)
    }
  }))
}
```

Consuming the debounced ref in a search component:
```vue
<script setup lang="ts">
import { useDebouncedRef } from '@/composables/useDebouncedRef'

// Only updates downstream bindings 400ms after user stops typing!
const searchQuery = useDebouncedRef('', 400)
</script>

<template>
  <input v-model="searchQuery" placeholder="Debounced search..." />
  <p>Active Query: {{ searchQuery }}</p>
</template>
```

## Watcher Flush Timing: `pre`, `post`, and `sync`

When a watcher's dependencies change, Vue buffers watcher callbacks by default to run immediately before the DOM updates. The `flush` option in `watch()` and `watchEffect()` allows you to control this timing:

- **`flush: 'pre'` (Default)**: Callback runs **before** component DOM updates. Ideal for state adjustments before rendering.
- **`flush: 'post'` (or `watchPostEffect`)**: Callback runs **after** the component's DOM has been patched. Essential when your watcher needs to inspect the updated DOM elements (e.g. measuring scroll heights or canvas drawing).
- **`flush: 'sync'` (or `watchSyncEffect`)**: Callback runs **synchronously and immediately** upon mutation, bypassing the microtask batching queue. Use with extreme caution, as it degrades performance if multiple properties mutate simultaneously.

```vue
<script setup lang="ts">
import { ref, watchPostEffect } from 'vue'

const items = ref(['Task 1', 'Task 2'])
const listRef = ref<HTMLUListElement | null>(null)

// watchPostEffect guarantees DOM is already rendered and updated!
watchPostEffect(() => {
  if (listRef.value) {
    console.log('Updated DOM element count:', listRef.value.children.length)
  }
})
</script>
```

## `toRaw()` and `markRaw()`: Opting Out of Reactivity

Wrapping large non-reactive objects (such as Three.js 3D meshes, Leaflet map instances, Monocle code editors, or complex third-party class instances) in Vue's reactive `Proxy` introduces severe performance overhead and can break internal `this` method bindings of external libraries.

### 1. `markRaw(object)`
Explicitly marks an object so that it will **never** be converted to a reactive proxy, even if nested inside a `reactive()` state tree:

```typescript
import { reactive, markRaw } from 'vue'
import * as THREE from 'three'

interface AppState {
  user: { name: string }
  scene: THREE.Scene | null
}

const state = reactive<AppState>({
  user: { name: 'Hesam' },
  // markRaw prevents Vue from recursively proxying the massive Three.js scene graph!
  scene: markRaw(new THREE.Scene())
})
```

### 2. `toRaw(observedProxy)`
Returns the raw, original JavaScript object from a Vue reactive or readonly proxy:

```typescript
import { reactive, toRaw } from 'vue'

const state = reactive({ count: 1, tags: ['a', 'b'] })
const rawObj = toRaw(state)

console.log(rawObj === state) // false
console.log(rawObj) // { count: 1, tags: ['a', 'b'] } (plain JS object)
```

Use `toRaw()` when sending data payloads across Web Workers or third-party SDKs that reject Proxy objects.

## Reactive Debugging Hooks: `onTrack` and `onTrigger`

When diagnosing performance bottlenecks or tracking down why a component is re-rendering unexpectedly, use the `onTrack` and `onTrigger` debugging hooks in `computed()` or `watchEffect()`:

```typescript
import { ref, computed } from 'vue'

const score = ref(100)

const grade = computed(() => {
  return score.value >= 90 ? 'A' : 'B'
}, {
  onTrack(e) {
    // Fired when score.value is read as a dependency
    console.log('Dependency tracked:', e.key, e.target)
  },
  onTrigger(e) {
    // Fired when score.value mutation triggers a recalculation
    console.log('Dependency triggered:', e.key, e.oldValue, '->', e.newValue)
  }
})
```

## Best Practices

- **Use `markRaw()` for Complex Third-Party Instances**: Always mark chart instances (Chart.js, ECharts), 3D engines (Three.js), and map controllers (Leaflet, Mapbox) with `markRaw()` to prevent performance degradation.
- **Dispose Standalone Scopes**: Always call `.stop()` on `effectScope()` instances when managing plugin or background service lifecycles.
- **Avoid `flush: 'sync'` in Standard Application Code**: Use `flush: 'post'` or `flush: 'pre'`; synchronous watchers defeat Vue's batching optimizations.
- **Use `customRef` for Custom Storage Sync**: Create composables like `useStorageRef` with `customRef` to encapsulate sync logic cleanly.

## Summary

Advanced reactivity primitives provide the foundation for building high-performance Vue 3 libraries and complex frontend architectures. By leveraging `effectScope()` for lifecycle management, `customRef()` for customized reactive triggers, `markRaw()` for performance isolation, and debugging hooks for introspection, you master the full power of the Vue 3 reactivity engine.
