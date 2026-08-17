---
title: 'State Management & Svelte Stores'
description: 'Master global and shared state architecture in Svelte: Svelte stores (writable, readable, derived, custom stores), the $store auto-subscription syntax, and Svelte 5 universal rune classes.'
order: 9
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 35
prerequisites:
  - /learn/svelte/04-reactivity-and-runes
  - /learn/svelte/08-advanced-components
---

# State Management & Svelte Stores

In single-page and multi-page web applications, managing state across multiple distant components is a central architectural concern. While local component state (`$state` within a `.svelte` file) handles private UI toggles, shared domain data—such as authentication sessions, shopping carts, notification queues, and cached database records—requires structured global or module-level state management.

In this lesson, we will explore state management paradigms in Svelte: the classic **Svelte Store contract** (`writable`, `readable`, `derived`, and custom stores), the auto-subscription `$store` syntax, and the modern **Svelte 5 Universal Rune class architecture** in `.svelte.ts` modules.

## State Scope Hierarchy: Local vs Shared vs Global

When designing state architectures, categorize data into three distinct tiers:
1. **Local Component State**: Ephemeral UI state needed by only one component (e.g. `isDropdownOpen`, `activeInput`). Handled with local `$state()`.
2. **Context-Scoped State**: Shared within a specific component subtree (e.g. multi-step form wizard, accordion group). Handled via `setContext()` / `getContext()`.
3. **Global / Domain State**: Shared across entirely unrelated views, routes, and services (e.g. `currentUser`, `cartItems`, `themePreference`). Handled via Svelte 5 State Classes or Svelte Stores.

## Classic Svelte Stores: The Store Contract

A Svelte Store is any plain JavaScript object that implements a `.subscribe(callback)` method returning an unsubscribe function.

Svelte provides built-in store implementations under `svelte/store`:

### 1. `writable()` Stores
A `writable` store holds a value and exposes `.set(val)` and `.update(fn)` methods:

```typescript
// src/stores/counterStore.ts
import { writable } from 'svelte/store'

export const count = writable(0)

// Increment value via .update()
export function increment() {
  count.update(n => n + 1)
}

// Reset value via .set()
export function reset() {
  count.set(0)
}
```

### 2. The Auto-Subscription `$store` Syntax
In `.svelte` component files, prefixing a store variable with a dollar sign (`$count`) automatically subscribes to the store when the component mounts and **unsubscribes automatically when the component unmounts**, completely eliminating memory leaks:

```svelte
<!-- src/App.svelte -->
<script lang="ts">
  import { count, increment, reset } from '$lib/stores/counterStore'
</script>

<div class="store-card">
  <!-- $count auto-subscribes and updates reactively! -->
  <p>Current Store Count: {$count}</p>
  <button onclick={increment}>+1</button>
  <button onclick={reset}>Reset</button>
</div>
```

### 3. `readable()` Stores
A `readable` store holds values that cannot be mutated from the outside (e.g. current mouse coordinates, geolocation, or WebSocket ticker streams). It accepts a producer function with `set` and a cleanup return:

```typescript
// src/stores/timeStore.ts
import { readable } from 'svelte/store'

export const currentTime = readable(new Date(), (set) => {
  const interval = setInterval(() => {
    set(new Date())
  }, 1000)

  // Cleanup callback when all subscribers unsubscribe
  return () => clearInterval(interval)
})
```

### 4. `derived()` Stores
A `derived` store computes a value based on one or more other stores, executing lazily only when dependencies mutate:

```typescript
// src/stores/cartDerived.ts
import { derived } from 'svelte/store'
import { cartItems } from './cartStore'

export const totalCartPrice = derived(cartItems, ($items) => {
  return $items.reduce((sum, item) => sum + item.price * item.quantity, 0)
})
```

## Creating Encapsulated Custom Stores

To prevent arbitrary, uncontrolled state mutations across large engineering teams, wrap `writable` stores in custom store factory functions that expose only semantic domain actions:

```typescript
// src/stores/notificationStore.ts
import { writable } from 'svelte/store'

export interface AppNotification {
  id: string
  message: string
  type: 'success' | 'info' | 'error'
}

function createNotificationStore() {
  const { subscribe, update } = writable<AppNotification[]>([])

  return {
    subscribe,
    add(message: string, type: AppNotification['type'] = 'info', timeoutMs = 4000) {
      const id = crypto.randomUUID()
      update(items => [...items, { id, message, type }])

      setTimeout(() => {
        update(items => items.filter(n => n.id !== id))
      }, timeoutMs)
    },
    dismiss(id: string) {
      update(items => items.filter(n => n.id !== id))
    },
    clearAll() {
      update(() => [])
    }
  }
}

export const notifications = createNotificationStore()
```

Components consume the custom store:
```svelte
<script lang="ts">
  import { notifications } from '$lib/stores/notificationStore'
</script>

<div class="toast-container">
  {#each $notifications as toast (toast.id)}
    <div class="toast toast-{toast.type}">
      <span>{toast.message}</span>
      <button onclick={() => notifications.dismiss(toast.id)}>✕</button>
    </div>
  {/each}
</div>
```

## Svelte 5 State Architecture: Universal Rune Classes

In **Svelte 5**, you no longer need `svelte/store` for shared state. Because Runes are universal, you can define shared reactive state directly inside `.svelte.ts` files using modern TypeScript classes or factory objects:

```typescript
// src/lib/stores/auth.svelte.ts
export interface UserSession {
  id: string
  email: string
  role: 'admin' | 'user'
}

class AuthStore {
  // Svelte 5 $state inside universal .svelte.ts module
  user = $state<UserSession | null>(null)
  isLoading = $state(false)

  // $derived getters
  isAuthenticated = $derived(this.user !== null)
  isAdmin = $derived(this.user?.role === 'admin')

  login(userData: UserSession) {
    this.user = userData
    localStorage.setItem('session_user', JSON.stringify(userData))
  }

  logout() {
    this.user = null
    localStorage.removeItem('session_user')
  }
}

// Export a singleton instance
export const auth = new AuthStore()
```

Consuming the Svelte 5 state class in any component:
```svelte
<script lang="ts">
  import { auth } from '$lib/stores/auth.svelte'
</script>

{#if auth.isAuthenticated}
  <div class="user-greeting">
    <h3>Welcome, {auth.user?.email}!</h3>
    {#if auth.isAdmin}
      <span class="badge">Admin Panel Access</span>
    {/if}
    <button onclick={() => auth.logout()}>Log Out</button>
  </div>
{:else}
  <button onclick={() => auth.login({ id: '1', email: 'hesam@dev.com', role: 'admin' })}>
    Log In as Admin
  </button>
{/if}
```

Notice that with Svelte 5 Rune classes:
- **No `$store` dollar prefix is needed**—properties are read directly (`auth.user`, `auth.isAuthenticated`).
- Full TypeScript autocompletion and refactoring support in all IDEs.
- Zero boilerplate `.subscribe()` calls or store wrapper utilities.

## Server State vs Client State Separation

In modern frontend architecture, distinguish clearly between:
- **Client (UI) State**: Purely transient, client-owned data (e.g. sidebar collapsed, active modal, draft text). Kept in Svelte 5 state classes.
- **Server State**: Remotely persisted data belonging to backend databases (e.g. order records, product catalog). Handled via SvelteKit `load()` functions or data fetching services.

## Best Practices

- **Adopt Svelte 5 `.svelte.ts` State Classes for New Code**: Use universal `$state` and `$derived` classes instead of `svelte/store` for cleaner, store-less reactivity.
- **Encapsulate State Mutations**: Never expose raw write access directly; provide domain methods (`login()`, `logout()`, `addItem()`) to maintain predictable state transitions.
- **Scope Context Stores in SSR**: In SvelteKit SSR applications, avoid global module singletons for user-specific data; instantiate state classes inside `setContext()` per request.
- **Always Unsubscribe When Manually Calling `.subscribe()`**: Use `$store` auto-subscription in `.svelte` files to prevent memory leaks.

## Summary

State management in Svelte bridges the classic, lightweight Store contract (`writable`, `readable`, `derived`) and the cutting-edge power of Svelte 5 Universal Rune classes. By structuring your application into local, context-scoped, and global domain layers, you can build scalable, type-safe, and maintainable state architectures.
