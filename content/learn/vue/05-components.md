---
title: 'Component Architecture & Props'
description: 'Master Vue component design: component registration, defineProps with validation, defineEmits for custom events, parent-child communication patterns, default slots, named slots, and scoped slots.'
order: 5
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 30
prerequisites:
  - /learn/vue/04-reactivity
---

# Component Architecture & Props

Components are the fundamental building blocks of modern user interfaces in Vue.js. They allow you to divide complex user interfaces into independent, reusable, and self-contained pieces of UI with their own markup, logic, and styling. A Vue application is structured as a hierarchical tree of nested components, with a root `App.vue` component at the top of the hierarchy.

In this lesson, we will explore component creation and registration, prop validation and one-way data flow, event emission with `defineEmits`, and slot distribution including default, named, and scoped slots.

## Creating and Registering Components

In Vue 3 with `<script setup>`, registering a component locally is as simple as importing it. Any imported `.vue` component file is automatically available as a custom HTML tag in the template without requiring manual registration objects.

```vue
<!-- ParentComponent.vue -->
<script setup lang="ts">
import BaseButton from './BaseButton.vue'
import UserCard from './UserCard.vue'
</script>

<template>
  <div class="page-container">
    <UserCard username="hesam" role="Frontend Architect" />
    <BaseButton variant="primary">Save Changes</BaseButton>
  </div>
</template>
```

Alternatively, components can be registered globally in your entry file `main.ts` using `app.component('BaseButton', BaseButton)`. However, global registration is discouraged for standard components because it prevents build tools from tree-shaking unused components, inflating bundle size. Use local imports inside `<script setup>` by default.

## Passing Data Down: Component Props and `defineProps`

Props are custom attributes you can register on a component to pass data from a parent component down to a child component. In `<script setup>`, props are declared using the `defineProps()` compiler macro, which requires no import from `'vue'`.

Vue supports both runtime object syntax and pure TypeScript type-based declaration:

### TypeScript Type-Based Props Declaration (Recommended)
```vue
<!-- UserCard.vue -->
<script setup lang="ts">
interface Props {
  username: string
  role?: string
  avatarUrl?: string
  badges?: string[]
  isOnline?: boolean
}

// withDefaults provides default values for optional props
const props = withDefaults(defineProps<Props>(), {
  role: 'Member',
  avatarUrl: '/images/default-avatar.png',
  badges: () => ['Newbie'],
  isOnline: false,
})
</script>

<template>
  <div class="user-card" :class="{ 'is-online': props.isOnline }">
    <img :src="props.avatarUrl" :alt="props.username" />
    <h3>{{ props.username }}</h3>
    <span class="role-badge">{{ props.role }}</span>
  </div>
</template>
```

### Runtime Object Props Syntax
If you are using JavaScript rather than TypeScript:
```vue
<script setup>
const props = defineProps({
  username: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'Member'
  },
  age: {
    type: Number,
    validator(value) {
      return value >= 0 && value <= 120
    }
  }
})
</script>
```

## One-Way Data Flow (Props are Read-Only)

All props form a **one-way-down binding** between the child property and the parent one: when the parent property updates, it will flow down to the child, but not the other way around. This prevents child components from accidentally mutating the parent's state, which can make your app's data flow hard to understand.

**Never mutate a prop directly inside a child component**:
```typescript
// ANTI-PATTERN: Never do this!
props.username = 'new_name' // Error: props are read-only
```

If you need to use a prop as an initial value for local state, declare a local `ref` initialized with the prop:
```typescript
const localUsername = ref(props.username)
```

## Communicating Up: Custom Events and `defineEmits`

To send data or signal actions from a child component back up to its parent, the child emits custom events using the `defineEmits()` compiler macro.

The parent component listens to these events using standard `@event-name` syntax, exactly like native DOM events.

```vue
<!-- RatingStars.vue (Child Component) -->
<script setup lang="ts">
// Declare emitted events with TypeScript parameter types
const emit = defineEmits<{
  (e: 'ratingChange', newScore: number): void
  (e: 'submitFeedback', comment: string): void
}>()

function setRating(score: number) {
  // Emit event to parent with payload data
  emit('ratingChange', score)
}
</script>

<template>
  <div class="star-rating">
    <button v-for="star in 5" :key="star" @click="setRating(star)">
      ★ {{ star }}
    </button>
  </div>
</template>
```

```vue
<!-- ParentProductPage.vue (Parent Component) -->
<script setup lang="ts">
import { ref } from 'vue'
import RatingStars from './RatingStars.vue'

const currentRating = ref(0)

function handleRatingUpdate(newScore: number) {
  currentRating.value = newScore
  console.log('Parent received new rating:', newScore)
}
</script>

<template>
  <div class="product-page">
    <h2>Product Reviews</h2>
    <p>User Rating: {{ currentRating }} / 5</p>
    <RatingStars @rating-change="handleRatingUpdate" />
  </div>
</template>
```

## Two-Way Component Binding with `v-model` Props

In Vue 3.4+, you can declare two-way component props effortlessly using the `defineModel()` macro. This replaces the verbose prop + emit boilerplate:

```vue
<!-- CustomTextInput.vue -->
<script setup lang="ts">
const model = defineModel<string>({ default: '' })
</script>

<template>
  <input v-model="model" class="custom-input" />
</template>
```

In the parent component, you simply bind it with `v-model`:
```vue
<CustomTextInput v-model="searchQuery" />
```

## Content Distribution with Default Slots

Props allow you to pass data (strings, numbers, arrays, objects) into components. However, what if you need to pass rich HTML markup, custom icons, or other components into a child template? This is where **slots** (`<slot>`) come in.

The `<slot>` outlet indicates where the parent-provided slot content should be rendered:

```vue
<!-- BaseModal.vue (Child) -->
<template>
  <div class="modal-backdrop">
    <div class="modal-content">
      <!-- Slot fallback content rendered if parent provides nothing -->
      <slot>
        <p>Default modal body content</p>
      </slot>
    </div>
  </div>
</template>
```

```vue
<!-- Parent.vue -->
<BaseModal>
  <h3>Custom Dialog Title</h3>
  <p>Are you sure you want to delete this repository?</p>
</BaseModal>
```

## Named Slots for Structured Layouts

When a component requires multiple slot insertion points (e.g. a card with a distinct header, body, and action footer), use **named slots** with the `name` attribute: `<slot name="header">`.

In the parent component, use `<template #slotName>` (where `#` is shorthand for `v-slot:`):

```vue
<!-- BaseCard.vue (Child) -->
<template>
  <div class="card-container">
    <header v-if="$slots.header" class="card-header">
      <slot name="header" />
    </header>
    
    <main class="card-body">
      <slot /> <!-- Default slot -->
    </main>
    
    <footer v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </footer>
  </div>
</template>
```

```vue
<!-- Parent.vue -->
<BaseCard>
  <template #header>
    <h2>Frontend Architecture Guide</h2>
  </template>

  <p>Comprehensive breakdown of modern web engineering principles.</p>

  <template #footer>
    <button class="btn-primary">Read Article</button>
  </template>
</BaseCard>
```

## Scoped Slots: Passing Data from Child Slot to Parent

Sometimes, the child component controls internal data or iteration logic, but wants the parent component to customize *how* each item is visually rendered. This is achieved using **scoped slots**.

The child component passes attributes to the `<slot>` element: `<slot :item="item" :index="index" />`. The parent receives these slot props using `<template #default="slotProps">` or destructuring `<template #default="{ item, index }">`:

```vue
<!-- DataTable.vue (Child) -->
<script setup lang="ts" generic="T extends { id: string | number }">
defineProps<{
  items: T[]
}>()
</script>

<template>
  <ul class="data-table">
    <li v-for="(item, index) in items" :key="item.id">
      <!-- Exposing item and index to parent -->
      <slot :item="item" :index="index">
        {{ item }}
      </slot>
    </li>
  </ul>
</template>
```

```vue
<!-- Parent.vue -->
<DataTable :items="users">
  <template #default="{ item, index }">
    <div class="user-row">
      <span>#{{ index + 1 }}</span>
      <strong>{{ item.name }}</strong>
      <span class="badge">{{ item.role }}</span>
    </div>
  </template>
</DataTable>
```

## Best Practices

- **Strict One-Way Data Flow**: Never mutate props inside children; emit events to ask the parent to perform mutations.
- **Provide Default Fallbacks in Slots**: Always include helpful fallback content in `<slot>` tags for robust reusable components.
- **Use TypeScript Generic Macros**: Declare props with `defineProps<Props>()` and emits with `defineEmits<Emits>()` for full IDE autocompletion and compile-time type safety.
- **Prefer Named Slots Over Massive Prop Flags**: Rather than passing 10 boolean flags to customize headers and buttons, expose named slots (`#header`, `#actions`) to give consumers full markup freedom.

## Summary

Vue 3's component model provides a modular, type-safe architecture. With `defineProps` for downward data flow, `defineEmits` for upward event messaging, `defineModel` for two-way synchronization, and default/named/scoped slots for flexible template composition, you can build scalable design systems and maintainable application architectures.
