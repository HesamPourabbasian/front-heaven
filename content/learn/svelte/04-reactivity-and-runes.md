---
title: 'Svelte 5 Reactivity & Runes'
description: 'Master the next-generation reactivity engine of Svelte 5: $state, $derived, $effect, $props, $bindable, $inspect, and universal reactivity across .svelte.ts files.'
order: 4
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 30
prerequisites:
  - /learn/svelte/02-svelte-fundamentals
  - /learn/svelte/03-templates
---

# Svelte 5 Reactivity & Runes

Reactivity is the engine that drives modern user interfaces: when underlying application data changes, the user interface updates automatically to reflect that change. In Svelte 5, reactivity underwent its most significant and powerful architectural evolution with the introduction of **Runes**.

Runes are compiler-level primitive symbols—prefixed with a dollar sign `$`—that provide explicit, fine-grained, signal-based reactivity. Unlike legacy Svelte 3/4 reactivity which was confined strictly to `.svelte` component files, Svelte 5 Runes are **universal**: they work identically inside `.svelte` components and standalone `.svelte.js` or `.svelte.ts` utility modules.

In this lesson, we will master the full suite of Svelte 5 runes: `$state`, `$derived`, `$effect`, `$props`, `$bindable`, and `$inspect`, while comparing them to legacy `$:` reactive declarations.

## The Evolution: From Legacy `$:` to Svelte 5 Runes

In legacy Svelte (versions 3 and 4), reactivity was tied to variable reassignment inside `<script>` blocks:
```svelte
<!-- Legacy Svelte 3/4 syntax -->
<script>
  let count = 0
  $: doubled = count * 2 // Reactive declaration using JS label syntax
  $: console.log('Count changed to:', count)

  function increment() {
    count += 1 // Reassignment triggered reactivity
  }
</script>
```

While concise, legacy reactivity had notable limitations:
1. **File Boundaries**: Reactivity only worked inside `.svelte` Single File Components. You could not declare reactive variables inside external `.js` or `.ts` files without using Svelte Stores.
2. **Ambiguous Mutability**: In legacy Svelte, it was impossible to distinguish between a regular local variable and a reactive state variable by inspecting its declaration.
3. **Refactoring Friction**: Moving code between components and helper functions required rewriting state logic into custom store wrappers.

**Svelte 5 Runes solve these challenges permanently.** Runes make reactivity explicit, universal, fine-grained, and deeply intuitive.

## Reactive State with `$state()`

To declare reactive state in Svelte 5, pass the initial value to the `$state()` rune:

```svelte
<script lang="ts">
  // Primitive reactive state
  let count = $state(0)

  // Object reactive state
  let user = $state({
    name: 'Hesam',
    role: 'Engineer',
    preferences: { darkTheme: true }
  })

  // Array reactive state
  let tags = $state(['svelte', 'typescript'])

  function update() {
    count += 1
    // Deep mutations work out of the box!
    user.preferences.darkTheme = !user.preferences.darkTheme
    tags.push('runes')
  }
</script>

<div class="card">
  <p>Count: {count}</p>
  <p>User: {user.name} (Dark Mode: {user.preferences.darkTheme})</p>
  <p>Tags: {tags.join(', ')}</p>
  <button onclick={update}>Update State</button>
</div>
```

### Deep Reactivity & `$state.raw()`
By default, `$state()` creates deep reactivity using modern JavaScript Proxies. Mutating nested properties like `user.preferences.darkTheme = false` or calling array methods like `tags.push('new')` updates the UI automatically.

If you are handling large, immutable datasets (like thousands of raw API records or Three.js scene graphs) where you only care about reassigning the root reference rather than nested mutations, use **`$state.raw()`** to avoid proxy overhead:

```typescript
let largeDataset = $state.raw<BigPayload[]>([])

function replaceData(fresh: BigPayload[]) {
  largeDataset = fresh // Triggers reactivity only on root reassignment
}
```

## Derived Values with `$derived()` and `$derived.by()`

When a piece of state depends on other reactive values, use the **`$derived()`** rune. Svelte tracks all reactive dependencies accessed within the expression and recomputes the derived value automatically with high-speed memoization:

```svelte
<script lang="ts">
  let price = $state(100)
  let quantity = $state(3)
  let discountPercent = $state(15)

  // Simple single-expression derived value
  let subtotal = $derived(price * quantity)
  let discountAmount = $derived((subtotal * discountPercent) / 100)
  let finalTotal = $derived(subtotal - discountAmount)
</script>

<div class="summary">
  <p>Subtotal: ${subtotal}</p>
  <p>Discount: -${discountAmount} ({discountPercent}%)</p>
  <p><strong>Total: ${finalTotal}</strong></p>
</div>
```

### Complex Computations with `$derived.by()`
If deriving a value requires complex multi-line logic, loops, or conditional branching, use **`$derived.by(fn)`**:

```typescript
interface CartItem {
  id: string
  price: number
  inStock: boolean
}

let items = $state<CartItem[]>([
  { id: '1', price: 20, inStock: true },
  { id: '2', price: 45, inStock: false },
  { id: '3', price: 80, inStock: true },
])

// Complex derived computation with $derived.by
let totalInStockValue = $derived.by(() => {
  return items
    .filter(item => item.inStock)
    .reduce((sum, item) => sum + item.price, 0)
})
```

## Managing Side Effects with `$effect()`

The **`$effect()`** rune executes side effects—such as manipulating the DOM manually, saving to `localStorage`, managing timers, or calling external telemetry SDKs—whenever its tracked reactive dependencies change.

Effects run **after the DOM has updated** in the browser:

```svelte
<script lang="ts">
  let searchQuery = $state('')
  let searchCount = $state(0)

  // $effect tracks searchQuery and runs automatically whenever searchQuery changes
  $effect(() => {
    console.log(`User searching for: "${searchQuery}"`)
    localStorage.setItem('last_query', searchQuery)
    searchCount++

    // Cleanup function: runs before effect re-executes or when component unmounts
    return () => {
      console.log('Cleaning up previous search effect.')
    }
  })
</script>

<input v-model={searchQuery} bind:value={searchQuery} placeholder="Search..." />
<p>Searches performed: {searchCount}</p>
```

### Pre-DOM Effects with `$effect.pre()`
If you need to read or measure the DOM *before* Svelte applies the pending DOM mutations (e.g. capturing scroll positions before prepending chat messages), use `$effect.pre()`.

## Component Props with `$props()`

In Svelte 5, component props are declared using the `$props()` rune, which supports clean destructuring, TypeScript interface typing, fallback defaults, and rest props:

```svelte
<!-- src/lib/UserProfileCard.svelte -->
<script lang="ts">
  interface Props {
    userId: string
    name: string
    role?: 'admin' | 'member' | 'guest'
    isOnline?: boolean
  }

  // Declare props with types and fallback defaults
  let {
    userId,
    name,
    role = 'member',
    isOnline = false,
    ...restProps
  }: Props = $props()
</script>

<div class="user-card" {...restProps}>
  <h3>{name} ({role})</h3>
  <span class="status">{isOnline ? '🟢 Online' : '⚪ Offline'}</span>
</div>
```

## Two-Way Binding Props with `$bindable()`

By default, props in Svelte 5 follow strict one-way data flow (parent to child). If a component wants to allow a parent component to use two-way binding (`bind:propName`) on a specific prop, the child declares it with **`$bindable()`**:

```svelte
<!-- src/lib/ToggleSwitch.svelte -->
<script lang="ts">
  let { checked = $bindable(false), label = 'Toggle' } = $props()
</script>

<label class="switch">
  <input
    type="checkbox"
    checked={checked}
    onchange={(e) => checked = e.currentTarget.checked}
  />
  <span>{label}</span>
</label>
```

Parent component consuming the bindable switch:
```svelte
<script lang="ts">
  import ToggleSwitch from './ToggleSwitch.svelte'
  let notificationsEnabled = $state(true)
</script>

<!-- Two-way synchronization using bind:checked -->
<ToggleSwitch bind:checked={notificationsEnabled} label="Enable Push Notifications" />
<p>Notifications are currently: {notificationsEnabled ? 'ON' : 'OFF'}</p>
```

## Reactive Debugging with `$inspect()`

Debugging reactive updates in complex components is effortless with the `$inspect()` rune. Svelte will log the variable's value to the browser console whenever it changes, and will be stripped from production builds automatically:

```svelte
<script lang="ts">
  let count = $state(0)
  let user = $state({ name: 'Hesam' })

  // Logs to console on every mutation: { count: 0, user: { name: 'Hesam' } }
  $inspect(count, user)

  // Attach custom inspector actions (e.g. console.trace)
  $inspect(count).with((type, val) => {
    console.log(`[Reactivity Event: ${type}] New value:`, val)
  })
</script>
```

## Universal Reactivity in Standalone `.svelte.ts` Files

The true power of Svelte 5 Runes is that they can be extracted into standalone TypeScript classes or factory functions without needing Svelte Stores:

```typescript
// src/lib/counter.svelte.ts
export class ReactiveCounter {
  count = $state(0)
  doubled = $derived(this.count * 2)

  increment() {
    this.count++
  }

  decrement() {
    this.count--
  }
}

export function createCounter(initial = 0) {
  let count = $state(initial)
  let doubled = $derived(count * 2)

  return {
    get count() { return count },
    get doubled() { return doubled },
    increment: () => count++,
    decrement: () => count--,
  }
}
```

Any component can instantiate `new ReactiveCounter()` and enjoy shared reactive state with full TypeScript type safety!

## Best Practices

- **Use `$state()` for All Mutable Data**: Replace legacy `let` reactive declarations with explicit `$state()` calls.
- **Prefer `$derived()` Over Manual Effects**: Never manually synchronize state inside `$effect()`; always use pure, declarative `$derived()` or `$derived.by()`.
- **Clean Up Side Effects in `$effect()`**: Always return a cleanup function from `$effect()` when creating interval timers, WebSocket listeners, or event handlers.
- **Leverage `$bindable()` Selectively**: Only mark props as `$bindable()` when explicit two-way binding is required (e.g. form controls, modal open states).

## Summary

Svelte 5 Runes represent the cutting edge of modern frontend reactivity. With `$state()` for reactive data, `$derived()` for computed views, `$effect()` for DOM side effects, `$props()` with `$bindable()` for clean component contracts, and universal reactivity across `.svelte.ts` files, you can build scalable, type-safe reactive architectures with exceptional clarity.
