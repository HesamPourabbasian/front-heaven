---
title: 'TypeScript with Vue 3'
description: 'Complete guide to TypeScript in Vue 3: typing props and emits with compiler macros, typing refs and reactive state, generic components, typed Pinia stores, and vue-tsc type checking.'
order: 15
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 35
prerequisites:
  - /learn/vue/05-components
  - /learn/vue/09-composition-api
  - /learn/vue/13-state-management-pinia
---

# TypeScript with Vue 3

Vue 3 was completely rewritten in TypeScript from its core codebase. Because Vue 3 is built TypeScript-first, using TypeScript in your application requires zero extra wrapper libraries and delivers unmatched static type safety, intelligent autocompletion in VS Code / IDEs, refactoring confidence, and compile-time error detection.

In this lesson, we will master typing Vue 3 Single File Components using `<script setup lang="ts">`, type props with `defineProps` and `withDefaults`, type custom events with `defineEmits`, create generic components with the `generic` attribute, type composables, and integrate type-safe Pinia stores and API contracts.

## Configuring TypeScript in Vue 3

When scaffolding a project with `npm create vue@latest`, selecting TypeScript generates a customized `tsconfig.json` extending `@vue/tsconfig`. The setup includes:
- **`vue-tsc`**: A CLI command-wrapper around the TypeScript compiler (`tsc`) that performs full type-checking on both `.ts` files and the `<template>` and `<script>` blocks of `.vue` Single File Components.
- **Vue - Official (formerly Volar)**: The official IDE extension for Visual Studio Code, providing live type-checking, prop validation, and refactoring within Vue templates.

Add typecheck scripts in `package.json`:
```json
{
  "scripts": {
    "typecheck": "vue-tsc --noEmit"
  }
}
```

## Typing Component Props with `defineProps`

In `<script setup lang="ts">`, declare props using pure TypeScript interface syntax passed directly as a generic type parameter to `defineProps<Props>()`:

```vue
<!-- UserBadge.vue -->
<script setup lang="ts">
export interface UserBadgeProps {
  id: string
  name: string
  role: 'admin' | 'editor' | 'viewer'
  avatarUrl?: string
  tags?: string[]
  isVerified?: boolean
}

// withDefaults sets fallback values for optional props
const props = withDefaults(defineProps<UserBadgeProps>(), {
  role: 'viewer',
  avatarUrl: '/images/default.png',
  tags: () => ['community'],
  isVerified: false,
})
</script>

<template>
  <div class="badge" :class="`badge-${props.role}`">
    <img :src="props.avatarUrl" :alt="props.name" />
    <h4>{{ props.name }}</h4>
    <span v-if="props.isVerified" class="verified">✓</span>
  </div>
</template>
```

When parent components consume `<UserBadge />`, the IDE enforces required properties (`id`, `name`) and autocompletes union options (`'admin' | 'editor' | 'viewer'`).

## Typing Custom Events with `defineEmits`

To strictly type the events emitted by a component and the exact parameter types passed with them, pass a TypeScript call signature type to `defineEmits`:

```vue
<!-- FilterToolbar.vue -->
<script setup lang="ts">
export interface FilterPayload {
  category: string
  minPrice: number
  inStockOnly: boolean
}

// Define strict emit types
const emit = defineEmits<{
  (e: 'applyFilter', payload: FilterPayload): void
  (e: 'reset'): void
  (e: 'changePage', page: number): void
}>()

function triggerApply() {
  emit('applyFilter', {
    category: 'electronics',
    minPrice: 50,
    inStockOnly: true,
  })
}
</script>
```

In Vue 3.3+, you can use the more concise tuple syntax for `defineEmits`:
```typescript
const emit = defineEmits<{
  applyFilter: [payload: FilterPayload]
  reset: []
  changePage: [page: number]
}>()
```

## Typing Reactivity: `ref`, `reactive`, and `computed`

### 1. Typing `ref()`
TypeScript can automatically infer primitive types (`ref(0)` is `Ref<number>`), but you must explicitly supply generics when the initial value is `null` or a complex union:

```typescript
import { ref } from 'vue'

interface Member {
  id: string
  email: string
}

// Explicit union type: Ref<Member | null>
const activeMember = ref<Member | null>(null)

// Array ref: Ref<string[]>
const permissions = ref<string[]>([])
```

### 2. Typing `reactive()`
Specify the interface directly when invoking `reactive<T>()`:

```typescript
import { reactive } from 'vue'

interface AppConfig {
  theme: 'light' | 'dark'
  maxUploadSizeMb: number
  allowedExtensions: string[]
}

const config = reactive<AppConfig>({
  theme: 'dark',
  maxUploadSizeMb: 25,
  allowedExtensions: ['.png', '.jpg', '.pdf'],
})
```

### 3. Typing `computed()`
Computed properties infer their return type from the return value of the getter function. You can also explicitly specify the generic return type:

```typescript
import { ref, computed } from 'vue'

const price = ref(100)
const discount = ref(0.2)

// Explicit return type Ref<number>
const discountedPrice = computed<number>(() => {
  return price.value * (1 - discount.value)
})
```

## Typing Template Refs and DOM Elements

When grabbing references to raw browser HTML elements in `<script setup>`, annotate the ref with the corresponding native DOM interface:

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const emailInput = ref<HTMLInputElement | null>(null)
const canvasElement = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  // Full autocompletion on native DOM methods
  emailInput.value?.select()
  const ctx = canvasElement.value?.getContext('2d')
})
</script>

<template>
  <input ref="emailInput" type="email" />
  <canvas ref="canvasElement" width="400" height="200" />
</template>
```

## Generic Components in Vue 3.3+

Vue 3.3 introduced the `generic` attribute for `<script setup>`, enabling components to accept generic type parameters. This is ideal for reusable list views, dropdowns, and data tables:

```vue
<!-- DropdownSelect.vue -->
<script setup lang="ts" generic="T extends { id: string | number; label: string }">
defineProps<{
  items: T[]
  selectedItem: T | null
}>()

const emit = defineEmits<{
  select: [item: T]
}>()
</script>

<template>
  <div class="dropdown">
    <button
      v-for="item in items"
      :key="item.id"
      @click="emit('select', item)"
      :class="{ 'font-bold': selectedItem?.id === item.id }"
    >
      {{ item.label }}
    </button>
  </div>
</template>
```

When a parent component passes an array of `User` objects to `<DropdownSelect :items="users" />`, Vue automatically infers `T` as `User`!

## Typing Custom Composables

When creating composables, use the `MaybeRef<T>` or `MaybeRefOrGetter<T>` types from `'vue'` to allow callers to pass either raw values, refs, or getters:

```typescript
// src/composables/useLocalStorage.ts
import { ref, watch, type Ref } from 'vue'

export function useLocalStorage<T>(key: string, defaultValue: T): Ref<T> {
  const data = ref<T>(defaultValue) as Ref<T>

  const stored = localStorage.getItem(key)
  if (stored) {
    try {
      data.value = JSON.parse(stored)
    } catch {
      data.value = defaultValue
    }
  }

  watch(data, (newVal) => {
    localStorage.setItem(key, JSON.stringify(newVal))
  }, { deep: true })

  return data
}
```

## Typing Pinia Stores and API Contracts

Pinia provides complete type safety out of the box when using Setup Stores:

```typescript
// src/stores/user.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface UserState {
  id: string
  username: string
  roles: string[]
}

export const useUserStore = defineStore('user', () => {
  const profile = ref<UserState | null>(null)
  
  const hasAdminRights = computed<boolean>(() => {
    return Boolean(profile.value?.roles.includes('admin'))
  })

  function setProfile(newProfile: UserState): void {
    profile.value = newProfile
  }

  return { profile, hasAdminRights, setProfile }
})
```

## Best Practices

- **Run `vue-tsc` in CI/CD Pipelines**: Always add `npm run typecheck` (`vue-tsc --noEmit`) to your pull request checks to prevent type regressions.
- **Export and Share Entity Interfaces**: Place core domain interfaces (`User`, `Product`, `Order`) in a shared `src/types/` directory to reuse between services, stores, and components.
- **Avoid Using `any`**: Use `unknown` with type guards or generics instead of `any` to keep your codebase strictly typed.
- **Leverage Generic Components for UI Toolkits**: Use `<script setup lang="ts" generic="T">` when building design system primitives like Select, Combobox, and DataGrid.

## Summary

TypeScript transforms Vue 3 development by turning runtime guessing into compile-time verification. With `<script setup lang="ts">`, type-only `defineProps` and `defineEmits`, generic components, typed composables, and `vue-tsc` template checking, you can engineer large-scale enterprise Vue applications with maximum reliability and maintainability.
