---
title: 'Intermediate Vue 3 Architecture Projects'
description: 'Build 8 production-ready intermediate Vue 3 applications: Full E-commerce, Auth Dashboard, Admin Panel, Blog CMS, Expense System, Movie Explorer, Real-time Chat UI, and SaaS Dashboard.'
order: 18
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 45
prerequisites:
  - /learn/vue/12-vue-router
  - /learn/vue/13-state-management-pinia
  - /learn/vue/14-api-and-backend-integration
---

# Intermediate Vue 3 Architecture Projects

Building full-featured multi-page applications transforms your knowledge of Vue 3, Vue Router, Pinia, TypeScript, and API services into professional frontend engineering mastery. Intermediate projects require careful planning around modular folder structures, store composition, reusable layout shells, asynchronous route guards, and error boundaries.

In this lesson, we examine the system architecture, state models, routing definitions, and implementation patterns for 8 comprehensive intermediate applications.

## Project 1: Full E-Commerce Frontend Application

### Architecture & Capabilities:
- **Routes**: Home (`/`), Catalog (`/products`), Product Detail (`/products/:id`), Checkout (`/checkout`).
- **State**: Pinia `useCartStore` with quantity management, coupon discounts, and tax computation; `useProductStore` with cached catalog pagination.
- **Features**: Multi-attribute filtering (category, price range, brand), image thumbnail gallery with zoom, sliding cart drawer, simulated Stripe checkout form.

```typescript
// src/stores/cartStore.ts
export interface CartItem {
  productId: string
  title: string
  price: number
  selectedSize: string
  quantity: number
  imageUrl: string
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const discountCode = ref<string | null>(null)
  const discountPercent = ref(0)

  const subtotal = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )

  const discountAmount = computed(() => (subtotal.value * discountPercent.value) / 100)
  const tax = computed(() => (subtotal.value - discountAmount.value) * 0.08)
  const grandTotal = computed(() => subtotal.value - discountAmount.value + tax.value)

  function applyCoupon(code: string) {
    if (code.toUpperCase() === 'HEAVEN20') {
      discountCode.value = 'HEAVEN20'
      discountPercent.value = 20
      return true
    }
    return false
  }

  return { items, subtotal, discountCode, discountAmount, tax, grandTotal, applyCoupon }
})
```

## Project 2: Authentication & Role-Based Dashboard

### Architecture & Capabilities:
- **Routes**: Login (`/login`), Register (`/register`), Forgot Password (`/forgot-password`), Protected Dashboard (`/dashboard`), Admin Settings (`/dashboard/admin`).
- **Guards**: `router.beforeEach` verifying active session, automatic refresh tokens, role-level authorization (`to.meta.role === 'admin'`).
- **Features**: JWT token storage, automatic logout on 401 response interceptor, avatar upload, password strength validator.

```typescript
// src/router/authGuard.ts
import { router } from '@/router'
import { useAuthStore } from '@/stores/authStore'

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.requiredRole && auth.user?.role !== to.meta.requiredRole) {
    return { name: 'unauthorized' }
  }

  return true
})
```

## Project 3: Enterprise Admin Panel with Data Tables

### Architecture & Capabilities:
- **Features**: Multi-column sorting, debounced search filters, server-side pagination, bulk row selection with batch actions (delete, export, status change), slide-over edit drawer.
- **Components**: Generic `<DataTable :columns="cols" :data="rows" />` using scoped slots for custom action cells, `<ConfirmDialog />` using `<Teleport>`.

```vue
<!-- components/AdminDataTable.vue -->
<script setup lang="ts" generic="T extends { id: string | number }">
defineProps<{
  columns: { key: keyof T; label: string; sortable?: boolean }[]
  rows: T[]
  isLoading: boolean
}>()

const emit = defineEmits<{
  sort: [key: keyof T]
  rowClick: [row: T]
}>()
</script>

<template>
  <div class="overflow-x-auto border border-border rounded-2xl bg-surface">
    <table class="w-full text-left text-sm">
      <thead class="bg-surface-2 border-b border-border text-xs uppercase text-muted">
        <tr>
          <th v-for="col in columns" :key="String(col.key)" class="px-4 py-3">
            <button
              v-if="col.sortable"
              @click="emit('sort', col.key)"
              class="flex items-center gap-1 font-bold text-ink"
            >
              {{ col.label }}
              <span>↕</span>
            </button>
            <span v-else>{{ col.label }}</span>
          </th>
          <th class="px-4 py-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-border">
        <tr v-for="row in rows" :key="row.id" class="hover:bg-surface-2/50 transition-colors">
          <td v-for="col in columns" :key="String(col.key)" class="px-4 py-3">
            <!-- Scoped slot for custom column cell overrides -->
            <slot :name="`cell-${String(col.key)}`" :value="row[col.key]" :row="row">
              {{ row[col.key] }}
            </slot>
          </td>
          <td class="px-4 py-3 text-right">
            <slot name="actions" :row="row" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
```

## Project 4: Markdown Blog CMS with Reading Time

### Architecture & Capabilities:
- **Features**: Live split-pane Markdown editor with real-time HTML preview, reading time estimator composable (`useReadingTime`), category and tag filtering, syntax highlighting.
- **Composables**: `useMarkdownParser` converting raw markdown into sanitized HTML with table-of-contents extraction.

```typescript
// src/composables/useReadingTime.ts
import { computed, type MaybeRef, unref } from 'vue'

export function useReadingTime(content: MaybeRef<string>) {
  const wordsPerMinute = 200

  const stats = computed(() => {
    const text = unref(content) || ''
    const words = text.trim().split(/\s+/).filter(Boolean).length
    const minutes = Math.ceil(words / wordsPerMinute)
    return {
      wordCount: words,
      minutes: Math.max(1, minutes),
      text: `${Math.max(1, minutes)} min read`,
    }
  })

  return stats
}
```

## Project 5: Expense Management & Budget Analytics

### Architecture & Capabilities:
- **Features**: Monthly budget tracking, expense categories with custom color tags, visual progress bars indicating budget thresholds, CSV export, monthly trend summary.
- **State**: `useExpenseStore` with category summaries and remaining balance calculations.

```typescript
// src/stores/expenseStore.ts
export interface ExpenseRecord {
  id: string
  title: string
  amount: number
  category: 'Housing' | 'Food' | 'Tech' | 'Transport' | 'Entertainment'
  date: string
}

export const useExpenseStore = defineStore('expenses', () => {
  const records = ref<ExpenseRecord[]>([])
  const monthlyBudget = ref(3500)

  const categoryBreakdown = computed(() => {
    const map: Record<string, number> = {}
    for (const r of records.value) {
      map[r.category] = (map[r.category] || 0) + r.amount
    }
    return map
  })

  const totalSpent = computed(() =>
    records.value.reduce((sum, r) => sum + r.amount, 0)
  )

  const remainingBudget = computed(() => monthlyBudget.value - totalSpent.value)
  const budgetUtilizationPercent = computed(() =>
    Math.min(100, Math.round((totalSpent.value / monthlyBudget.value) * 100))
  )

  return { records, monthlyBudget, categoryBreakdown, totalSpent, remainingBudget, budgetUtilizationPercent }
})
```

## Project 6: Movie & TV Explorer Application

### Architecture & Capabilities:
- **Features**: Debounced search query fetching external API results, genre filter chips, dynamic video trailer modal inside `<Teleport>`, user watchlist saved in Pinia with `localStorage` persistence.
- **Composables**: `useDebounceFn` for keystroke network optimization.

```vue
<!-- components/MovieCard.vue -->
<script setup lang="ts">
import { useWatchlistStore } from '@/stores/watchlist'

const props = defineProps<{
  movie: {
    id: number
    title: string
    posterPath: string
    voteAverage: number
    releaseYear: string
  }
}>()

const watchlist = useWatchlistStore()
</script>

<template>
  <div class="group relative rounded-2xl overflow-hidden border border-border bg-surface shadow-sm">
    <img :src="props.movie.posterPath" :alt="props.movie.title" class="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-300" />
    <button
      @click="watchlist.toggle(props.movie)"
      class="absolute top-2 right-2 size-9 rounded-full bg-black/60 backdrop-blur text-white flex items-center justify-center"
    >
      {{ watchlist.has(props.movie.id) ? '★' : '☆' }}
    </button>
    <div class="p-3">
      <h4 class="font-bold text-sm text-ink truncate">{{ props.movie.title }}</h4>
      <div class="flex justify-between text-xs text-muted mt-1">
        <span>{{ props.movie.releaseYear }}</span>
        <span class="text-amber-500 font-bold">★ {{ props.movie.voteAverage.toFixed(1) }}</span>
      </div>
    </div>
  </div>
</template>
```

## Project 7: Real-Time Chat Interface

### Architecture & Capabilities:
- **Features**: Message thread scrolling with `onUpdated` auto-scroll, typing status indicators, message bubbles with delivery timestamps, optimistic message dispatching.
- **State**: Message queues, active channel switcher, online participants list.

```vue
<!-- components/ChatWindow.vue -->
<script setup lang="ts">
import { ref, onMounted, onUpdated, nextTick } from 'vue'

interface Message {
  id: string
  sender: string
  text: string
  isMe: boolean
  timestamp: string
}

const messages = ref<Message[]>([])
const newMessage = ref('')
const messageContainer = ref<HTMLElement | null>(null)

function scrollToBottom() {
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight
  }
}

function sendMessage() {
  if (!newMessage.value.trim()) return
  messages.value.push({
    id: crypto.randomUUID(),
    sender: 'Me',
    text: newMessage.value.trim(),
    isMe: true,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  })
  newMessage.value = ''
  nextTick(scrollToBottom)
}

onMounted(scrollToBottom)
onUpdated(scrollToBottom)
</script>

<template>
  <div class="chat-wrapper flex flex-col h-[500px] border border-border rounded-2xl bg-surface overflow-hidden">
    <div ref="messageContainer" class="flex-1 p-4 overflow-y-auto space-y-3">
      <div
        v-for="msg in messages"
        :key="msg.id"
        :class="msg.isMe ? 'items-end' : 'items-start'"
        class="flex flex-col"
      >
        <div
          :class="msg.isMe ? 'bg-primary text-white rounded-br-none' : 'bg-surface-2 text-ink rounded-bl-none'"
          class="px-4 py-2 rounded-2xl max-w-sm text-sm"
        >
          {{ msg.text }}
        </div>
        <span class="text-[10px] text-muted mt-0.5 px-1">{{ msg.timestamp }}</span>
      </div>
    </div>

    <form @submit.prevent="sendMessage" class="p-3 border-t border-border flex gap-2 bg-surface-2">
      <input v-model="newMessage" placeholder="Type a message..." class="flex-1 rounded-xl border border-border px-4 py-2 text-sm bg-surface text-ink" />
      <button type="submit" class="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold">Send</button>
    </form>
  </div>
</template>
```

## Project 8: Multi-Tenant SaaS Analytics Dashboard

### Architecture & Capabilities:
- **Features**: Top metric KPI summary cards with percentage comparisons, interactive date range selector, notification bell dropdown with real-time badge count, dark mode theming.
- **Layout**: Collapsible sidebar navigation, persistent header shell, and breadcrumbs navigation.

```vue
<!-- views/SaaSDashboard.vue -->
<template>
  <div class="saas-dashboard p-6 space-y-6 max-w-7xl mx-auto">
    <!-- Header with greeting & Date Range Picker -->
    <div class="flex flex-wrap justify-between items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-ink">Analytics Overview</h1>
        <p class="text-xs text-muted">Monitor your recurring revenue and subscription performance.</p>
      </div>
      <div class="flex gap-2">
        <button class="px-3 py-1.5 border rounded-xl text-xs font-semibold bg-surface">Last 30 Days ▾</button>
        <button class="btn-primary text-xs px-4 py-1.5 rounded-xl font-bold">Export Report</button>
      </div>
    </div>

    <!-- 4 Core Metric KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="p-4 rounded-2xl border border-border bg-surface shadow-xs">
        <span class="text-xs text-muted font-bold uppercase">Monthly Recurring Revenue</span>
        <div class="text-2xl font-extrabold text-ink mt-1">$48,250</div>
        <span class="text-xs text-emerald-500 font-semibold mt-1 block">↑ +12.4% vs last month</span>
      </div>
      <div class="p-4 rounded-2xl border border-border bg-surface shadow-xs">
        <span class="text-xs text-muted font-bold uppercase">Active Subscribers</span>
        <div class="text-2xl font-extrabold text-ink mt-1">1,420</div>
        <span class="text-xs text-emerald-500 font-semibold mt-1 block">↑ +8.2% new users</span>
      </div>
      <div class="p-4 rounded-2xl border border-border bg-surface shadow-xs">
        <span class="text-xs text-muted font-bold uppercase">Average Churn Rate</span>
        <div class="text-2xl font-extrabold text-ink mt-1">1.8%</div>
        <span class="text-xs text-emerald-500 font-semibold mt-1 block">↓ -0.4% improvement</span>
      </div>
      <div class="p-4 rounded-2xl border border-border bg-surface shadow-xs">
        <span class="text-xs text-muted font-bold uppercase">Customer Lifetime Value</span>
        <div class="text-2xl font-extrabold text-ink mt-1">$890</div>
        <span class="text-xs text-emerald-500 font-semibold mt-1 block">↑ +5.1% growth</span>
      </div>
    </div>
  </div>
</template>
```

## Best Practices

- **Centralize Entity Types in Shared Folders**: Maintain domain entity types in `src/types/` to share contracts across stores, views, and components.
- **Decompose Large Views into Focused Sub-Components**: Break 500-line dashboard views into modular sub-components (`MetricCard.vue`, `RevenueChart.vue`, `RecentActivityTable.vue`).
- **Implement Optimistic UI Updates**: Immediately update client state for responsive interactions, rolling back only if the server returns an error.
- **Enforce Consistent Layout Shells**: Use nested Vue Router layouts (`<RouterView />`) to keep navigation sidebars and headers persistent across child page switches.

## Summary

These 8 intermediate projects represent the core product features required in modern web engineering: e-commerce flows, secure authentication systems, data administration tables, content management, real-time messaging, and analytics dashboards. With Level 2 architecture mastered, you are prepared to advance to Level 3: Advanced Internals & Production.
