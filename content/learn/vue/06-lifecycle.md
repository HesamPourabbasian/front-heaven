---
title: 'Component Lifecycle Hooks'
description: 'Understand the complete lifecycle of Vue 3 components: creation, mounting, updating, and unmounting phases with onMounted, onUpdated, onUnmounted, and cleanup patterns.'
order: 6
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 20
prerequisites:
  - /learn/vue/05-components
---

# Component Lifecycle Hooks

Every Vue component instance goes through a series of initialization, mounting, updating, and destruction steps when it is created, rendered into the browser DOM, updated upon state changes, and finally removed from the page. Along the way, Vue provides **lifecycle hooks**—special functions imported from `'vue'`—that allow you to register custom callback logic at specific moments during a component's lifecycle.

In this lesson, we will examine the complete lifecycle timeline in Vue 3, explore all lifecycle hooks in `<script setup>`, learn how to access real DOM nodes with template refs, and establish rigorous resource cleanup patterns to prevent memory leaks.

## The Vue 3 Component Lifecycle Timeline

When a component is instantiated, it navigates through four distinct phases:
1. **Creation / Setup**: Code inside `<script setup>` executes synchronously. Props, reactive state (`ref`, `reactive`), and computed properties are initialized. (In Composition API, `<script setup>` itself serves as the creation phase, replacing legacy `beforeCreate` and `created` hooks).
2. **Mounting**: Vue compiles the template into a virtual DOM tree and inserts the actual rendered elements into the browser DOM (`onBeforeMount` → initial render → `onMounted`).
3. **Updating**: When reactive state changes, Vue reconciles the virtual DOM and re-renders the affected DOM nodes (`onBeforeUpdate` → DOM patch → `onUpdated`).
4. **Unmounting**: When the component is removed from the DOM (e.g. via `v-if="false"` or page navigation), event listeners and child components are dismantled (`onBeforeUnmount` → destruction → `onUnmounted`).

## `onMounted`: Accessing the DOM and Initiating Side Effects

The `onMounted` hook is called after the component has been mounted to the DOM. At this point:
- All synchronous child components have also been mounted.
- The component's real DOM nodes are now rendered and accessible in browser memory.
- Template refs (`ref="myElement"`) are guaranteed to be populated.

`onMounted` is the ideal place to perform initial client-side network requests, integrate non-Vue third-party libraries (such as charting engines, video players, or map SDKs), and set up global window or document event listeners.

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const searchInput = ref<HTMLInputElement | null>(null)
const analyticsSessionId = ref<string | null>(null)

onMounted(async () => {
  console.log('Component is now mounted in real DOM')
  
  // Safely access and focus the real DOM element
  searchInput.value?.focus()

  // Initialize analytics or third-party SDK
  analyticsSessionId.value = 'session_' + Math.random().toString(36).substring(2)
})
</script>

<template>
  <div class="search-widget">
    <!-- Template ref binding -->
    <input ref="searchInput" type="text" placeholder="Type to search..." />
  </div>
</template>
```

## `onUnmounted`: Teardown and Memory Leak Prevention

The `onUnmounted` hook is called after the component has been completely unmounted and removed from the DOM.

A very common source of frontend performance degradation and memory leaks is failing to clean up resources created during a component's lifetime. If you set up an interval timer (`setInterval`), a WebSocket connection, a custom event listener on `window` or `document`, or an intersection observer in `onMounted`, you **must** clean it up in `onUnmounted`.

```vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const windowWidth = ref(window.innerWidth)
let timerId: number | undefined

function handleResize() {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  // Add global window listener
  window.addEventListener('resize', handleResize)

  // Start polling interval
  timerId = window.setInterval(() => {
    console.log('Heartbeat ping...')
  }, 5000)
})

onUnmounted(() => {
  // CRITICAL CLEANUP: Remove global listeners & timers
  window.removeEventListener('resize', handleResize)
  if (timerId) {
    clearInterval(timerId)
  }
  console.log('Component unmounted and memory cleaned up.')
})
</script>

<template>
  <p>Window viewport width: {{ windowWidth }}px</p>
</template>
```

## `onBeforeMount` and `onBeforeUnmount`

- **`onBeforeMount`**: Called right before the component is mounted. Vue has finished compiling the template into render functions, but no real DOM nodes have been created yet. DOM access inside this hook will return `null`.
- **`onBeforeUnmount`**: Called immediately before a component instance is unmounted. At this stage, the component is still fully functional, its DOM elements are still intact, and its reactivity is fully active. This hook is ideal for recording analytics snapshots, persisting draft form state to local storage, or pausing media playback before DOM elements vanish.

```typescript
import { onBeforeMount, onBeforeUnmount } from 'vue'

onBeforeMount(() => {
  console.log('About to mount to DOM...')
})

onBeforeUnmount(() => {
  console.log('About to unmount, DOM is still accessible.')
})
```

## `onBeforeUpdate` and `onUpdated`

- **`onBeforeUpdate`**: Called right after reactive state has changed, but before the DOM is updated and re-rendered. You can access the existing DOM state (e.g. measuring scroll position before new chat messages are rendered).
- **`onUpdated`**: Called after a data change has caused the virtual DOM to re-render and patch the real DOM.

```vue
<script setup lang="ts">
import { ref, onUpdated, onBeforeUpdate } from 'vue'

const messages = ref(['Hello!', 'How are you?'])
const chatContainer = ref<HTMLElement | null>(null)
let previousScrollHeight = 0

onBeforeUpdate(() => {
  if (chatContainer.value) {
    previousScrollHeight = chatContainer.value.scrollHeight
  }
})

onUpdated(() => {
  if (chatContainer.value) {
    // Auto-scroll to bottom if new messages appeared
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
})

function addMessage() {
  messages.value.push(`New message at ${new Date().toLocaleTimeString()}`)
}
</script>

<template>
  <div ref="chatContainer" class="chat-box">
    <div v-for="(msg, i) in messages" :key="i" class="message-bubble">{{ msg }}</div>
    <button @click="addMessage">Send Message</button>
  </div>
</template>
```

**Caution**: Never mutate component state inside `onUpdated` without guard conditions, as this can trigger an infinite re-render loop.

## Template Refs with `<script setup>`

In Vue 3, accessing real DOM elements or child component instances is achieved using **Template Refs**.

Simply declare a `ref` with `null` as the initial value, naming the variable identically to the `ref="variableName"` attribute on the target HTML element in your template. TypeScript type annotations like `ref<HTMLInputElement | null>(null)` provide full type safety and autocompletion for native DOM APIs.

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const videoPlayer = ref<HTMLVideoElement | null>(null)

function playVideo() {
  videoPlayer.value?.play()
}

function pauseVideo() {
  videoPlayer.value?.pause()
}
</script>

<template>
  <div class="video-container">
    <video ref="videoPlayer" src="/sample.mp4" controls width="400" />
    <div class="controls">
      <button @click="playVideo">Play</button>
      <button @click="pauseVideo">Pause</button>
    </div>
  </div>
</template>
```

## Best Practices

- **Pair Setups with Teardowns**: Always ensure every `addEventListener`, `setInterval`, or third-party SDK subscription created in `onMounted` has a corresponding cleanup call in `onUnmounted`.
- **Avoid Mutating State in `onUpdated`**: Modifying reactive state inside `onUpdated` triggers another update cycle, easily causing browser freezing infinite loops.
- **Guard Template Ref Access**: Always use optional chaining (`myRef.value?.doSomething()`) when accessing template refs, because refs are `null` before mounting and after unmounting.
- **Prefer Composables for Reusable Lifecycle Logic**: Extract shared lifecycle behaviors (such as window resizing, mouse tracking, or websocket connections) into custom Composition API composables (`useWindowSize()`, `useWebSocket()`).

## Summary

Component lifecycle hooks provide structured, predictable intervention points throughout a component's existence. By utilizing `onMounted` for DOM access and initialization, `onUpdated` for post-render adjustments, and `onUnmounted` for resource teardown, you ensure optimal performance, robust integration, and leak-free memory management in your Vue 3 applications.
