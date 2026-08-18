---
title: 'TypeScript with Frontend Frameworks'
description: 'Master TypeScript across modern UI frameworks: React (props, hooks, events), Vue 3 (script setup, defineProps, ref), Svelte 5, form typing, and DOM event handling.'
order: 20
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 40
prerequisites:
  - /learn/typescript/19-javascript-and-typescript
---

# TypeScript with Frontend Frameworks

TypeScript is the industry standard for modern frontend UI engineering. Leading frontend frameworks—including **React**, **Vue 3**, and **Svelte 5**—are built with first-class TypeScript support. Adding TypeScript to UI components transforms fragile templates into type-safe component trees where missing props, incorrect event payloads, and unhandled asynchronous states are caught instantly in your editor.

In this lesson, we explore practical TypeScript patterns across React, Vue, and Svelte, learn how to type DOM events, handle form state, and structure end-to-end API response workflows in client applications.

```text
┌────────────────────────────────────────────────────────────┐
│               Frontend Framework Type System               │
├──────────────────────────────┬─────────────────────────────┤
│ React (TSX / Functional)     │ Vue 3 (<script setup lang="ts">)
│ - interface ButtonProps      │ - defineProps<{ variant: string }>()
│ - React.MouseEvent<HTMLButton>│ - defineEmits<{ (e: 'submit'): void }>()
│ - useState<UserProfile | null>│ - ref<UserProfile | null>(null)
├──────────────────────────────┴─────────────────────────────┤
│ Type-Safe Client State & Forms                             │
│ - HTMLInputElement & FormEvent<HTMLFormElement>            │
│ - Generic useFetch<T> & TanStack Query / Pinia Store       │
└────────────────────────────────────────────────────────────┘
```

## 1. React with TypeScript

In modern React, components are typed as standard TypeScript functions receiving a typed props object:

### Component Props and Children
```tsx
import React, { type ReactNode } from "react";

interface CardProps {
  title: string;
  variant?: "elevated" | "outlined" | "flat";
  children: ReactNode;
  onClick?: (cardTitle: string) => void;
}

export const Card: React.FC<CardProps> = ({
  title,
  variant = "flat",
  children,
  onClick,
}) => {
  return (
    <div className={`card card--${variant}`} onClick={() => onClick?.(title)}>
      <h3 className="card__title">{title}</h3>
      <div className="card__body">{children}</div>
    </div>
  );
};
```

### Hooks Typing (`useState`, `useRef`, `useReducer`)
```tsx
import { useState, useRef } from "react";

interface UserProfile {
  id: string;
  username: string;
}

export function UserDashboard() {
  // State typed with Union for initial null state:
  const [user, setUser] = useState<UserProfile | null>(null);

  // Ref typed to specific DOM element:
  const searchInputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    // searchInputRef.current is HTMLInputElement | null
    searchInputRef.current?.focus();
  };

  return <input ref={searchInputRef} placeholder="Search user..." />;
}
```

### React DOM Event Handling
```tsx
export function LoginForm() {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Input value:", event.target.value);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Form submitted safely without page reload");
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <input type="text" onChange={handleInputChange} />
      <button type="submit">Log In</button>
    </form>
  );
}
```

## 2. Vue 3 with TypeScript (`<script setup lang="ts">`)

Vue 3 was built from the ground up in TypeScript, offering ergonomic macro-based type definitions:

### `defineProps` and `defineEmits`
```vue
<script setup lang="ts">
import type { UserProfile } from "~/types/user";

// Type-only Props declaration:
const props = withDefaults(
  defineProps<{
    user: UserProfile;
    isAdmin?: boolean;
    theme?: "dark" | "light";
  }>(),
  {
    isAdmin: false,
    theme: "light",
  }
);

// Type-only Emits declaration:
const emit = defineEmits<{
  (e: "deleteUser", userId: string): void;
  (e: "updateRole", newRole: string): void;
}>();

function handleDelete() {
  emit("deleteUser", props.user.id);
}
</script>

<template>
  <div :class="['user-card', theme]">
    <h4>{{ user.username }}</h4>
    <button @click="handleDelete">Delete</button>
  </div>
</template>
```

### Vue Reactivity (`ref`, `reactive`, `computed`)
```typescript
import { ref, computed } from "vue";

const activeUserId = ref<string | null>(null);
const searchQuery = ref("");

// Computed value type is automatically inferred as boolean
const hasSearch = computed(() => searchQuery.value.trim().length > 0);
```

## 3. Svelte 5 with TypeScript (Runes)

Svelte 5 introduces universal Runes (`$state`, `$derived`, `$props`) with deep TypeScript integration:

```svelte
<script lang="ts">
interface CounterProps {
  initialCount?: number;
  step?: number;
  onCountChange?: (count: number) => void;
}

let { initialCount = 0, step = 1, onCountChange }: CounterProps = $props();

let count = $state(initialCount);
let doubleCount = $derived(count * 2);

function increment() {
  count += step;
  onCountChange?.(count);
}
</script>

<button onclick={increment}>
  Count: {count} (Double: {doubleCount})
</button>
```

## 4. Universal Form & DOM Event Types

When working directly with browser DOM APIs, TypeScript provides global types for every standard HTML element and event:

| HTML Element | Event Type | Target Element Type |
| :--- | :--- | :--- |
| `<input type="text">` | `InputEvent` / `ChangeEvent` | `HTMLInputElement` |
| `<button>` | `MouseEvent` | `HTMLButtonElement` |
| `<form>` | `SubmitEvent` | `HTMLFormElement` |
| `<select>` | `ChangeEvent` | `HTMLSelectElement` |
| `window` | `KeyboardEvent` | `Window` |

```typescript
function handleKeyboardShortcut(event: KeyboardEvent) {
  if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
    event.preventDefault();
    console.log("Global search modal opened!");
  }
}

window.addEventListener("keydown", handleKeyboardShortcut);
```

## Summary

- React components use `React.FC<Props>` or standard typed parameter signatures with `ReactNode` children.
- React hooks (`useState<T>`, `useRef<HTMLElement>`) enforce strict nullability and element access safety.
- Vue 3 `<script setup lang="ts">` uses `defineProps<T>()` and `defineEmits<T>()` for zero-overhead compile-time prop checks.
- Svelte 5 uses typed `$props()` destructuring and typed `$state<T>()` runes.
- DOM events (`MouseEvent`, `ChangeEvent<HTMLInputElement>`, `KeyboardEvent`) guarantee exact access to event properties and elements.

## Best Practices

1. **Explicitly Type React `useState` When Starting as Null**: Always write `useState<User | null>(null)` so TypeScript permits assigning `User` instances later.
2. **Type HTML Element Refs Accurately**: Always specify the exact element type in `useRef<HTMLInputElement>(null)` or `ref<HTMLDivElement | null>(null)`.
3. **Use Macro Types in Vue 3**: In `<script setup>`, prefer generic `defineProps<{ ... }>()` over runtime option objects.
4. **Use Shared DTOs Across Frontend and Backend**: Import shared interfaces (`User`, `ApiResponse<T>`) across both UI components and API client services.
