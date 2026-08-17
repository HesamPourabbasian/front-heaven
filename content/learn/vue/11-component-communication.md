---
title: 'Component Communication & Architecture'
description: 'Master component communication patterns in Vue 3: Props and Emits, Provide / Inject dependency injection with TypeScript InjectionKey, shared composable state, and Smart vs Presentational architecture.'
order: 11
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 30
prerequisites:
  - /learn/vue/05-components
  - /learn/vue/09-composition-api
---

# Component Communication & Architecture

As applications scale from simple widgets into large-scale component hierarchies, how components share data, trigger actions, and coordinate state becomes the single most critical factor determining codebase maintainability. Poor communication patterns lead to "prop drilling," unmanageable side effects, tight coupling, and difficult-to-test components.

In this lesson, we will explore all levels of component communication in Vue 3—from direct Parent-Child interactions and deep Dependency Injection with `provide` / `inject`, to module-level shared reactive state, event patterns, and the architectural separation between Smart (Container) and Presentational (Dumb) components.

## Communication Hierarchy Overview

In Vue 3, choose your communication strategy based on component proximity and hierarchy:
1. **Direct Parent ↔ Child**: Use **Props** (data down) and **Emits** (events up).
2. **Deeply Nested Ancestor ↔ Descendant**: Use **`provide` / `inject`** to bypass intermediate components.
3. **Sibling or Cross-Tree Components**: Use **Shared Composables** or **Pinia Store**.
4. **Decoupled Global Notifications**: Use **Event Emitters** or **Global State Actions**.

## Solving Prop Drilling with `provide` and `inject`

When an ancestor component needs to pass data to a deeply nested descendant (5 levels deep), passing props through every intermediate component is known as **prop drilling**. The intermediate components are forced to declare and forward props they do not use, creating tight coupling and brittle refactoring paths.

Vue's `provide` and `inject` features allow an ancestor component to act as a dependency provider for all its descendants, regardless of how deep the component tree is.

### Type-Safe Dependency Injection with `InjectionKey`
In TypeScript, use `InjectionKey<T>` from `'vue'` to guarantee full compile-time type safety for injected values:

```typescript
// src/keys/authKeys.ts
import type { InjectionKey, Ref } from 'vue'

export interface UserContext {
  user: Ref<{ id: string; name: string; role: string } | null>
  logout: () => Promise<void>
}

// Unique symbol key typed with UserContext
export const UserContextKey: InjectionKey<UserContext> = Symbol('UserContext')
```

```vue
<!-- RootDashboard.vue (Ancestor Component) -->
<script setup lang="ts">
import { ref, provide, readonly } from 'vue'
import { UserContextKey } from '@/keys/authKeys'
import DeepChildTree from './DeepChildTree.vue'

const user = ref({ id: 'u_101', name: 'Hesam Pourabbasian', role: 'Architect' })

async function logout() {
  console.log('Logging user out...')
  user.value = null
}

// Provide reactive context with readonly guard on state to prevent rogue mutations
provide(UserContextKey, {
  user: readonly(user),
  logout
})
</script>

<template>
  <div class="dashboard-shell">
    <DeepChildTree />
  </div>
</template>
```

```vue
<!-- UserProfileBadge.vue (Deeply Nested Descendant) -->
<script setup lang="ts">
import { inject } from 'vue'
import { UserContextKey } from '@/keys/authKeys'

// Inject the context with strict TypeScript typing
const auth = inject(UserContextKey)

if (!auth) {
  throw new Error('UserProfileBadge must be used within a RootDashboard provider!')
}
</script>

<template>
  <div class="profile-badge">
    <span v-if="auth.user.value">
      Logged in as: <strong>{{ auth.user.value.name }}</strong> ({{ auth.user.value.role }})
    </span>
    <button @click="auth.logout" class="text-xs text-red-500 underline ml-2">
      Log Out
    </button>
  </div>
</template>
```

## Shared Composable State (Module-Level Reactivity)

Before reaching for an external state management library like Pinia, you can easily share global state across unrelated components by declaring reactive state **outside** of a composable function:

```typescript
// src/composables/useTheme.ts
import { ref, readonly } from 'vue'

// State defined in module scope: SHARED across all consumers!
const currentTheme = ref<'light' | 'dark'>('dark')

export function useTheme() {
  function toggleTheme() {
    currentTheme.value = currentTheme.value === 'dark' ? 'light' : 'dark'
    document.documentElement.classList.toggle('dark', currentTheme.value === 'dark')
  }

  return {
    theme: readonly(currentTheme),
    toggleTheme
  }
}
```

Because `currentTheme` lives in module scope, every component that imports and calls `useTheme()` shares the exact same reactive instance.

## Smart vs Presentational Component Architecture

A proven architectural pattern in frontend software engineering is the separation between **Smart (Container)** components and **Presentational (Dumb)** components:

### 1. Presentational (Dumb) Components
- **Focus**: Purely on visual presentation, layout, and styling.
- **Props**: Receives all data via `props`.
- **Emits**: Emits events (`@click`, `@update`) to request state changes; never mutates external state directly.
- **Dependencies**: No direct dependencies on API services, routers, or global state stores.
- **Reusability**: Extremely high; easily tested in isolation (e.g. Storybook) and reused across multiple views.

### 2. Smart (Container) Components
- **Focus**: Data fetching, routing, business logic orchestration, and state coordination.
- **Dependencies**: Injects stores, composables, API clients, and route parameters.
- **Markup**: Contains minimal visual markup; primarily responsible for orchestrating child presentational components.

```vue
<!-- Presentational Component: UserList.vue -->
<script setup lang="ts">
interface User {
  id: string
  name: string
  status: 'active' | 'inactive'
}

defineProps<{
  users: User[]
  isLoading: boolean
}>()

const emit = defineEmits<{
  (e: 'delete', id: string): void
  (e: 'select', user: User): void
}>()
</script>

<template>
  <div class="user-list">
    <div v-if="isLoading" class="spinner">Loading users...</div>
    <ul v-else class="divide-y divide-border">
      <li v-for="u in users" :key="u.id" class="p-3 flex justify-between items-center">
        <span @click="emit('select', u)" class="cursor-pointer font-medium">{{ u.name }}</span>
        <button @click="emit('delete', u.id)" class="text-xs text-red-500">Delete</button>
      </li>
    </ul>
  </div>
</template>
```

```vue
<!-- Smart Container Component: UserManagementView.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import UserList from './UserList.vue'
import { fetchUsersApi, deleteUserApi } from '@/services/userApi'

const users = ref([])
const loading = ref(true)

async function loadData() {
  loading.value = true
  try {
    users.value = await fetchUsersApi()
  } finally {
    loading.value = false
  }
}

async function handleDelete(id: string) {
  await deleteUserApi(id)
  users.value = users.value.filter((u: any) => u.id !== id)
}

onMounted(loadData)
</script>

<template>
  <div class="page">
    <h2>Team Directory</h2>
    <!-- Smart container passes state and listens to events -->
    <UserList :users="users" :is-loading="loading" @delete="handleDelete" />
  </div>
</template>
```

## Component Coupling and Cohesion Principles

When designing component hierarchies, adhere to standard software engineering cohesion and coupling principles:

- **High Cohesion**: Keep elements that change together in the same component. If a search input, debounce timer, and dropdown list are always used together as a unit, encapsulate them inside a single `SearchAutocomplete.vue` component.
- **Loose Coupling**: Components should know as little as possible about the internal implementation details of their parents or children. Avoid using `$parent` or `$root` directly.
- **Single Source of Truth**: Ensure each piece of data is owned by exactly one component or store. Other components should only read derived views or dispatch mutations back to the owner.

## Best Practices

- **Wrap Provided State with `readonly()`**: When using `provide()`, wrap reactive refs with `readonly(state)` and expose mutation functions alongside them, ensuring descendants cannot mutate parent state arbitrarily.
- **Always Provide Default Fallbacks in `inject()`**: Pass a default value `inject(Key, defaultValue)` or throw an explicit descriptive error to safeguard against missing providers.
- **Maintain Clear Boundaries Between Smart and Dumb Components**: Avoid importing Pinia stores or making `fetch()` calls inside generic UI buttons, cards, or tables.
- **Leverage TypeScript `InjectionKey<T>`**: Always use typed symbol keys for `provide`/`inject` in TypeScript codebases to prevent naming collisions and enable IDE autocomplete.

## Summary

Component communication is the backbone of Vue application architecture. By combining unidirectional props and emits for direct parent-child relationships, type-safe `provide`/`inject` for deep dependency trees, shared composables for cross-cutting state, and clear separation between Smart and Presentational components, you can engineer robust, loosely coupled frontend systems.
