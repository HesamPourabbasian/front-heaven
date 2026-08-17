---
title: 'Advanced Svelte 5 & Runes Architecture'
description: 'Master advanced Svelte 5 Runes design patterns: $effect.root, $state.raw, custom reactive signal composables, and a complete migration guide from legacy Svelte 4 to Svelte 5.'
order: 19
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 40
prerequisites:
  - /learn/svelte/04-reactivity-and-runes
  - /learn/svelte/18-svelte-internals
---

# Advanced Svelte 5 & Runes Architecture

Svelte 5 introduced the most comprehensive upgrade in the framework's history. By unifying reactivity under signal-based **Runes**, Svelte 5 provides frontend engineers with unmatched flexibility to architect complex state trees, build decoupled reactive abstractions outside component boundaries, and cleanly organize enterprise codebases.

In this lesson, we will explore advanced Rune patterns, master standalone effect lifecycles with `$effect.root()`, build reusable reactive composables in `.svelte.ts` modules, and provide a comprehensive migration blueprint from legacy Svelte 4 syntax to modern Svelte 5 Runes.

## Advanced Rune Primitives: `$effect.root()` and `$effect.pre()`

While standard `$effect()` calls are bound to the lifecycle of the active component instance, advanced libraries, micro-frontend plugins, or global telemetry services often need to run reactive effects **outside of any active component lifecycle**.

### Managing Detached Effects with `$effect.root()`
The `$effect.root(fn)` rune creates an isolated effect container that does not automatically clean up when components unmount. It returns a manual cleanup function:

```typescript
// src/lib/services/GlobalTelemetry.svelte.ts
export function createGlobalTelemetry(userState: { isLoggedIn: boolean }) {
  // Create an effect root that persists across component page navigation
  const cleanup = $effect.root(() => {
    $effect(() => {
      if (userState.isLoggedIn) {
        console.log('[Telemetry] Active authenticated user detected.')
      }
    })
  })

  // Expose manual disposal method
  return {
    destroy: () => {
      cleanup()
      console.log('[Telemetry] Effect root destroyed.')
    }
  }
}
```

## Reusable Reactive Abstractions in `.svelte.ts`

Because Runes are universal, you can extract reactive browser utilities into standalone `.svelte.ts` modules:

### 1. Synchronized Local Storage: `useLocalStorage`
```typescript
// src/lib/composables/useLocalStorage.svelte.ts
export function useLocalStorage<T>(key: string, initialValue: T) {
  let stored: T = initialValue

  if (typeof window !== 'undefined') {
    const item = localStorage.getItem(key)
    if (item) {
      try {
        stored = JSON.parse(item)
      } catch {
        stored = initialValue
      }
    }
  }

  let value = $state<T>(stored)

  $effect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value))
    }
  })

  return {
    get current() { return value },
    set current(next: T) { value = next },
  }
}
```

Consuming in components:
```svelte
<script lang="ts">
  import { useLocalStorage } from '$lib/composables/useLocalStorage.svelte'

  const theme = useLocalStorage('theme_pref', 'dark')
</script>

<button onclick={() => theme.current = theme.current === 'dark' ? 'light' : 'dark'}>
  Active Theme: {theme.current}
</button>
```

### 2. Reactive Media Query: `useMediaQuery`
```typescript
// src/lib/composables/useMediaQuery.svelte.ts
export function useMediaQuery(query: string) {
  let matches = $state(false)

  $effect(() => {
    if (typeof window === 'undefined') return

    const media = window.matchMedia(query)
    matches = media.matches

    const listener = (e: MediaQueryListEvent) => { matches = e.matches }
    media.addEventListener('change', listener)

    return () => media.removeEventListener('change', listener)
  })

  return {
    get matches() { return matches }
  }
}
```

## Advanced `$props()` and Dynamic Rest Prop Forwarding

In Svelte 5, prop destructuring supports rest property forwarding, allowing you to build transparent UI wrapper components:

```svelte
<!-- src/lib/TextInput.svelte -->
<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements'

  interface Props extends HTMLInputAttributes {
    label: string
    value?: string
    error?: string
  }

  let {
    label,
    value = $bindable(''),
    error,
    class: className = '',
    ...restProps
  }: Props = $props()
</script>

<div class="field-group">
  <label>{label}</label>
  <input
    bind:value={value}
    class="custom-input {className}"
    class:has-error={Boolean(error)}
    {...restProps}
  />
  {#if error}
    <span class="error-msg">{error}</span>
  {/if}
</div>
```

Any standard HTML attribute passed to `<TextInput>` (like `type="password"`, `disabled`, `autocomplete="off"`, `maxlength={50}`) is forwarded directly to the underlying `<input>` element via `{...restProps}`!

## Comprehensive Migration Guide: Svelte 4 $\rightarrow$ Svelte 5

Upgrading legacy Svelte 4 codebases to Svelte 5 Runes is straightforward using this comparative translation matrix:

### 1. Component State
```svelte
<!-- Svelte 4 (Legacy) -->
<script>
  let count = 0
  let user = { name: 'Hesam' }
</script>

<!-- Svelte 5 (Modern) -->
<script lang="ts">
  let count = $state(0)
  let user = $state({ name: 'Hesam' })
</script>
```

### 2. Derived Computations
```svelte
<!-- Svelte 4 (Legacy) -->
<script>
  $: doubled = count * 2
  $: total = items.reduce((a, b) => a + b.price, 0)
</script>

<!-- Svelte 5 (Modern) -->
<script lang="ts">
  let doubled = $derived(count * 2)
  let total = $derived.by(() => items.reduce((a, b) => a + b.price, 0))
</script>
```

### 3. Component Props & Two-Way Binding
```svelte
<!-- Svelte 4 (Legacy) -->
<script>
  export let title = 'Default Title'
  export let value = ''
</script>

<!-- Svelte 5 (Modern) -->
<script lang="ts">
  let { title = 'Default Title', value = $bindable('') } = $props()
</script>
```

### 4. Custom Events
```svelte
<!-- Svelte 4 (Legacy) -->
<script>
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()
  function save() { dispatch('save', { id: 1 }) }
</script>

<!-- Svelte 5 (Modern: Callback Props) -->
<script lang="ts">
  let { onSave }: { onSave?: (payload: { id: number }) => void } = $props()
  function save() { onSave?.({ id: 1 }) }
</script>
```

### 5. Template Slots $\rightarrow$ Snippets
```svelte
<!-- Svelte 4 (Legacy) -->
<div class="card">
  <slot name="header" />
  <slot />
</div>

<!-- Svelte 5 (Modern) -->
<script lang="ts">
  import type { Snippet } from 'svelte'
  let { header, children }: { header?: Snippet; children?: Snippet } = $props()
</script>

<div class="card">
  {#if header}{@render header()}{/if}
  {@render children?.()}
</div>
```

## Best Practices

- **Use Getter/Setter Objects for Composable State**: Return `{ get value() { return stateVal } }` from composable functions to maintain reactive signal bindings across function boundaries.
- **Isolate Detached Effects in `$effect.root()`**: Always wrap standalone effects in `$effect.root()` when managing global listeners outside component lifecycles.
- **Pass Callback Props Instead of Event Dispatchers**: Migrate away from `createEventDispatcher` to standard callback props (`onsave`, `onselect`) for better TypeScript autocompletion.
- **Embrace Svelte 5 Snippets for Multi-Region Layouts**: Replace legacy named slots with typed Snippet props.

## Summary

Advanced Svelte 5 Rune architecture unlocks universal, high-speed reactivity across components and external TypeScript modules. By leveraging `$effect.root()`, building custom signal composables, and following standard Svelte 4 to 5 migration patterns, you can engineer modern, scalable frontend applications with maximum type safety and minimal runtime overhead.
