---
title: 'Routing with Vue Router'
description: 'Master client-side routing with Vue Router 4: dynamic routes, nested views, programmatic navigation, route guards, authentication flows, route metadata, and 404 handlers.'
order: 12
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 35
prerequisites:
  - /learn/vue/05-components
  - /learn/vue/09-composition-api
---

# Routing with Vue Router

In Single Page Applications (SPAs), client-side routing allows users to navigate between different views, manage browser history, bookmark specific application states with URLs, and execute route transitions without triggering full-page server reloads. **Vue Router 4** is the official routing library for Vue 3, deeply integrated with the Composition API and Vite build toolchain.

In this lesson, we will install and configure Vue Router, define dynamic and nested routes, navigate programmatically with `useRouter()`, build authentication route guards with `beforeEach`, handle catch-all 404 pages, and configure lazy-loaded route chunks.

## Installing and Configuring Vue Router

To add Vue Router to your Vue 3 project, install the `vue-router` package:

```bash
npm install vue-router@4
```

Create a router configuration file `src/router/index.ts` using `createRouter` and `createWebHistory`:

```typescript
// src/router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'about',
    // Lazy-loaded route chunk (downloaded only on demand)
    component: () => import('@/views/AboutView.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    } else {
      return { top: 0 }
    }
  },
})
```

In `src/main.ts`, register the router with your Vue app instance before mounting:

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')
```

## `<RouterView>` and `<RouterLink>`

Vue Router provides two essential built-in components:
- **`<RouterView>`**: Acts as the placeholder outlet where the component matching the current active route is rendered.
- **`<RouterLink>`**: Renders an accessible HTML `<a>` tag that intercepts click events to navigate without a full page reload, automatically applying active CSS classes (`router-link-active`, `router-link-exact-active`).

```vue
<!-- App.vue -->
<template>
  <div class="app-layout">
    <header class="navbar">
      <nav class="flex gap-4 p-4 border-b">
        <RouterLink to="/" class="nav-link">Home</RouterLink>
        <RouterLink to="/about" class="nav-link">About</RouterLink>
        <RouterLink :to="{ name: 'dashboard' }" class="nav-link">Dashboard</RouterLink>
      </nav>
    </header>

    <main class="content p-6">
      <!-- Route matching component renders here -->
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.router-link-active {
  font-weight: 700;
  color: #10b981;
}
</style>
```

## Dynamic Routes and Route Parameters

When building pages that display item details (such as `/users/101` or `/products/vue-course`), use **dynamic route parameters** prefixed with a colon `:paramName`:

```typescript
{
  path: '/users/:id',
  name: 'user-profile',
  component: () => import('@/views/UserProfileView.vue'),
  props: true // Automatically passes route.params as component props!
}
```

Inside your component, access parameters using `useRoute()` or via component props when `props: true` is enabled:

```vue
<!-- UserProfileView.vue -->
<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'

// Method 1: Via props (cleanest)
const props = defineProps<{
  id: string
}>()

// Method 2: Via useRoute() composable
const route = useRoute()
const userId = computed(() => route.params.id as string)
const searchQuery = computed(() => route.query.q as string | undefined)
</script>

<template>
  <div class="user-page">
    <h2>User Profile: #{{ props.id }}</h2>
    <p v-if="searchQuery">Referral Query: {{ searchQuery }}</p>
  </div>
</template>
```

## Nested Routes

Complex dashboards frequently have sub-navigation where a parent layout stays fixed while child sections switch:

```typescript
{
  path: '/settings',
  component: () => import('@/views/SettingsLayout.vue'),
  children: [
    {
      path: '', // Default child route: /settings
      name: 'settings-profile',
      component: () => import('@/views/settings/ProfileSettings.vue'),
    },
    {
      path: 'security', // Matches /settings/security
      name: 'settings-security',
      component: () => import('@/views/settings/SecuritySettings.vue'),
    },
    {
      path: 'billing', // Matches /settings/billing
      name: 'settings-billing',
      component: () => import('@/views/settings/BillingSettings.vue'),
    },
  ],
}
```

Inside `SettingsLayout.vue`, place a nested `<RouterView />` to render the child route.

## Programmatic Navigation with `useRouter`

To navigate in response to user actions (e.g. after successful form submission or button click), use the `useRouter()` composable:

```vue
<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

async function handleLogin() {
  // Perform authentication API call...
  
  // Navigate to dashboard by route name and pass query params
  router.push({
    name: 'dashboard',
    query: { welcome: 'true' }
  })

  // Alternatively, replace current history entry (cannot go back)
  // router.replace({ name: 'dashboard' })

  // Go back one step in history
  // router.go(-1)
}
</script>
```

## Navigation Guards & Authentication Protection

Navigation guards provide hooks to cancel, redirect, or inspect navigations before or after they occur.

### Global `beforeEach` Guard with Route Metadata
Attach custom metadata (such as authentication requirements or role permissions) using the `meta` property on route records:

```typescript
// src/router/index.ts
import { router } from './router'
import { useAuthStore } from '@/stores/auth'

router.beforeEach(async (to, from) => {
  const authStore = useAuthStore()

  // Check if target route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Redirect to login page and preserve intended destination in query
    return {
      name: 'login',
      query: { redirect: to.fullPath },
    }
  }

  // Check for admin role requirement
  if (to.meta.requiresAdmin && authStore.userRole !== 'admin') {
    return { name: 'forbidden' }
  }

  // Returning true or undefined allows navigation to proceed
  return true
})
```

```typescript
// Route record with meta
{
  path: '/admin',
  name: 'admin-dashboard',
  component: () => import('@/views/AdminView.vue'),
  meta: {
    requiresAuth: true,
    requiresAdmin: true,
  },
}
```

### In-Component Guards
Inside `<script setup>`, you can intercept navigation using:
- **`onBeforeRouteLeave((to, from) => { ... })`**: Called when leaving the current component route (e.g. warning users about unsaved form changes).
- **`onBeforeRouteUpdate((to, from) => { ... })`**: Called when the route changes but the component is reused (e.g. navigating from `/users/1` to `/users/2`).

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'

const hasUnsavedChanges = ref(true)

onBeforeRouteLeave((to, from) => {
  if (hasUnsavedChanges.value) {
    const answer = window.confirm('You have unsaved changes! Are you sure you want to leave?')
    if (!answer) return false // Cancels navigation
  }
})
</script>
```

## Catch-All 404 Not Found Routes

To gracefully handle invalid URLs typed by users, add a catch-all route with regular expression parameter matching at the very end of your routes array:

```typescript
{
  // Matches everything that did not match previous routes
  path: '/:pathMatch(.*)*',
  name: 'not-found',
  component: () => import('@/views/NotFoundView.vue'),
}
```

```vue
<!-- NotFoundView.vue -->
<template>
  <div class="not-found-page text-center py-20">
    <h1 class="text-6xl font-black text-primary">404</h1>
    <h2 class="text-2xl font-bold text-ink mt-2">Page Not Found</h2>
    <p class="text-sm text-muted mt-2">The page you are looking for does not exist.</p>
    <RouterLink to="/" class="btn-primary mt-6 inline-block">Return Home</RouterLink>
  </div>
</template>
```

## Best Practices

- **Always Use Named Routes**: Navigate using `{ name: 'user-profile', params: { id: 42 } }` rather than hardcoded path strings (`/users/42`) to make URL restructuring seamless.
- **Enable `props: true` on Dynamic Routes**: Decouple components from direct `useRoute()` imports by mapping route parameters directly into component props.
- **Lazy-Load Non-Initial Routes**: Always use dynamic `import()` for route components (`component: () => import(...)`) to optimize initial bundle size.
- **Configure `scrollBehavior`**: Automatically scroll to top or restore previous scroll positions on route changes for a polished user experience.

## Summary

Vue Router 4 provides a feature-complete routing engine for modern Vue 3 applications. By leveraging dynamic route parameters, nested view hierarchies, programmatic navigation with `useRouter()`, and robust `beforeEach` authentication guards with route metadata, you can architect scalable SPA navigation flows with confidence.
