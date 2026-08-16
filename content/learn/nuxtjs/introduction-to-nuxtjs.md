---
title: 'Introduction to Nuxt & Universal Vue'
description: 'Discover Nuxt, the intuitive Vue meta-framework: file-based routing, auto-imports, universal SSR, and Nitro server engine.'
order: 1
difficulty: 'advanced'
category: 'Nuxt Fundamentals (Vue)'
estimatedMinutes: 25
prerequisites:
  - /learn/vue/introduction-to-vue
---

## What is Nuxt?

**Nuxt** is the progressive meta-framework built on top of **Vue 3**. It provides an intuitive developer experience with file-based routing, auto-imports, universal Server-Side Rendering (SSR), and the lightweight Nitro server engine.

---

## Nuxt Directory Structure

- `pages/`: File-based routing (e.g. `pages/about.vue` -> `/about`).
- `components/`: Auto-imported Vue components.
- `composables/`: Auto-imported reactive state composables.
- `server/api/`: Full-stack backend API endpoints powered by Nitro.

```vue
<!-- pages/index.vue -->
<script setup lang="ts">
// useFetch is auto-imported! Zero manual import statements!
const { data: users } = await useFetch('/api/users')
</script>

<template>
  <div class="container">
    <h1>Nuxt SSR Page</h1>
    <UserCard v-for="user in users" :key="user.id" :user="user" />
  </div>
</template>
```

---

## Summary & Key Takeaways

- Nuxt sits on top of Vue, adding SSR, automated routing, and backend server endpoints.
- Auto-imports streamline DX by eliminating repetitive import statements.
