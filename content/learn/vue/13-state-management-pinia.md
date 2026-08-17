---
title: 'Global State Management with Pinia'
description: 'Master enterprise state management with Pinia: setup stores, state, getters, actions, store composition, storeToRefs, authentication workflows, and state persistence.'
order: 13
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 35
prerequisites:
  - /learn/vue/04-reactivity
  - /learn/vue/09-composition-api
---

# Global State Management with Pinia

As frontend applications expand, multiple components across distant branches of the component tree often need access to the same shared data—such as the currently authenticated user session, shopping cart items, notification queues, or cached server entities. Managing this state via prop drilling or ad-hoc event passing quickly becomes chaotic.

**Pinia** is the official, lightweight, and modern state management library for Vue.js. Created by Eduardo San Martin Morote (Vue core team member), Pinia officially replaces Vuex, delivering a dramatically simpler API, zero mutations boilerplate, full TypeScript type inference, and exceptional Vue Devtools integration.

In this lesson, we will explore why and when to use global state, set up Pinia in a Vue 3 application, build both Setup Stores and Option Stores, compose multiple stores together, and implement persistent authentication state.

## Why State Management? Local vs Global State

Before introducing a global store, it is vital to distinguish between two categories of state:
1. **Local (Component) State**: Data that is only relevant to a single component or its immediate children (e.g. form input values, modal open/closed toggle, dropdown hover state). This should always remain local using `ref()` or `reactive()`.
2. **Global (Application) State**: Data that needs to be accessed, modified, or synchronized across unrelated components in different views (e.g. user authentication tokens, global notification alerts, shopping cart items, system preferences). This belongs in a Pinia store.

## Installing and Initializing Pinia

Install the `pinia` package using your package manager:

```bash
npm install pinia
```

In `src/main.ts`, instantiate and install Pinia into your Vue application:

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.mount('#app')
```

## Defining Stores: Setup Stores vs Option Stores

Pinia supports two formats for defining stores: **Option Stores** (similar to Vue 2 / Vuex syntax) and **Setup Stores** (leveraging Composition API syntax).

The Vue core team strongly recommends **Setup Stores** because they allow you to write store logic identically to regular Composition API composables (`ref` = state, `computed` = getters, `function` = actions), while providing full TypeScript type inference and enabling custom composables and watchers inside the store.

### The Setup Store Syntax (Recommended)

```typescript
// src/stores/cart.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface CartProduct {
  id: string
  title: string
  price: number
  quantity: number
}

export const useCartStore = defineStore('cart', () => {
  // 1. State (refs)
  const items = ref<CartProduct[]>([])
  const isDrawerOpen = ref(false)

  // 2. Getters (computed)
  const totalItemCount = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const subtotal = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )

  const isCartEmpty = computed(() => items.value.length === 0)

  // 3. Actions (functions)
  function addItem(product: Omit<CartProduct, 'quantity'>) {
    const existing = items.value.find(i => i.id === product.id)
    if (existing) {
      existing.quantity += 1
    } else {
      items.value.push({ ...product, quantity: 1 })
    }
  }

  function removeItem(productId: string) {
    items.value = items.value.filter(i => i.id !== productId)
  }

  function clearCart() {
    items.value = []
  }

  function toggleDrawer() {
    isDrawerOpen.value = !isDrawerOpen.value
  }

  // Must explicitly return all public state, getters, and actions
  return {
    items,
    isDrawerOpen,
    totalItemCount,
    subtotal,
    isCartEmpty,
    addItem,
    removeItem,
    clearCart,
    toggleDrawer,
  }
})
```

## Consuming Stores and `storeToRefs()`

To use a store inside a component, import the store hook and invoke it inside `<script setup>`:

```vue
<script setup lang="ts">
import { useCartStore } from '@/stores/cart'
import { storeToRefs } from 'pinia'

const cartStore = useCartStore()

// DANGER: Standard destructuring will BREAK reactivity for state & getters!
// const { items, totalItemCount } = cartStore (WRONG)

// SOLUTION: storeToRefs extracts state and getters as reactive refs
const { items, totalItemCount, subtotal } = storeToRefs(cartStore)

// Actions can be destructured directly because they are plain functions
const { addItem, removeItem } = cartStore
</script>

<template>
  <div class="cart-widget">
    <span>Cart Items: {{ totalItemCount }}</span>
    <span>Subtotal: ${{ subtotal.toFixed(2) }}</span>
  </div>
</template>
```

**Rule**: Always use `storeToRefs(store)` when destructuring state or getters from a Pinia store. Actions can be destructured directly without `storeToRefs`.

## Asynchronous Actions in Pinia

Unlike Vuex, which required separate synchronous `mutations` and asynchronous `actions`, Pinia actions can be fully `async` functions that modify state directly:

```typescript
// src/stores/products.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProductStore = defineStore('products', () => {
  const products = ref([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchProducts() {
    isLoading.value = true
    error.value = null
    try {
      const response = await fetch('https://api.front-heaven.dev/v1/products')
      if (!response.ok) throw new Error('Failed to fetch products')
      products.value = await response.json()
    } catch (err: any) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  return { products, isLoading, error, fetchProducts }
})
```

## Store Composition: Using Stores Inside Other Stores

In enterprise applications, stores often depend on one another. Pinia allows you to import and consume one store directly inside another store's actions or getters without circular dependency errors:

```typescript
// src/stores/order.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth'
import { useCartStore } from './cart'

export const useOrderStore = defineStore('order', () => {
  const isSubmitting = ref(false)

  async function submitOrder() {
    const authStore = useAuthStore()
    const cartStore = useCartStore()

    if (!authStore.isAuthenticated) {
      throw new Error('User must be logged in to place an order')
    }

    isSubmitting.value = true
    try {
      const payload = {
        userId: authStore.user?.id,
        items: cartStore.items,
        total: cartStore.subtotal,
      }
      
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { Authorization: `Bearer ${authStore.token}` },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        cartStore.clearCart() // Coordinate actions across stores!
      }
    } finally {
      isSubmitting.value = false
    }
  }

  return { isSubmitting, submitOrder }
})
```

## Complete Authentication Store Pattern

Managing tokens, user profiles, login/logout, and persistent session recovery is a quintessential global state requirement:

```typescript
// src/stores/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const user = ref<User | null>(null)
  const isInitializing = ref(true)

  const isAuthenticated = computed(() => Boolean(token.value))
  const isAdmin = computed(() => user.value?.role === 'admin')

  function setSession(newToken: string, newUser: User) {
    token.value = newToken
    user.value = newUser
    localStorage.setItem('auth_token', newToken)
  }

  function clearSession() {
    token.value = null
    user.value = null
    localStorage.removeItem('auth_token')
  }

  async function fetchCurrentUser() {
    if (!token.value) {
      isInitializing.value = false
      return
    }

    try {
      const res = await fetch('/api/me', {
        headers: { Authorization: `Bearer ${token.value}` }
      })
      if (res.ok) {
        user.value = await res.json()
      } else {
        clearSession()
      }
    } catch {
      clearSession()
    } finally {
      isInitializing.value = false
    }
  }

  return {
    token,
    user,
    isInitializing,
    isAuthenticated,
    isAdmin,
    setSession,
    clearSession,
    fetchCurrentUser
  }
})
```

## Best Practices

- **Adopt Setup Stores Consistently**: Standardize on `defineStore('name', () => { ... })` across your entire engineering team.
- **Always Destructure with `storeToRefs()`**: Prevent lost reactivity bugs by wrapping store destructuring statements with `storeToRefs(myStore)`.
- **Keep Transient UI State Local**: Do not pollute Pinia stores with local dropdown open states or single-component form inputs; reserve Pinia for truly shared application domain state.
- **Encapsulate Mutations in Actions**: Avoid modifying `store.someProperty = x` arbitrarily across multiple components; create descriptive action functions (`store.updateProfile(...)`) for easier debugging and devtools time-travel auditing.

## Summary

Pinia delivers a streamlined, type-safe, and modular state management architecture for modern Vue 3 applications. By eliminating legacy mutations, embracing the Composition API, providing full TypeScript inference, and supporting multi-store composition, Pinia allows you to organize complex global state with clarity and confidence.
