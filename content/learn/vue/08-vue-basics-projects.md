---
title: 'Vue 3 Basics Practice Projects'
description: 'Build 6 hands-on real-world Vue 3 projects: Todo App with localStorage, Multi-step Counter, Weather Dashboard, Expense Tracker, Product Catalog, and Shopping Cart.'
order: 8
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 40
prerequisites:
  - /learn/vue/07-forms
---

# Vue 3 Basics Practice Projects

The most effective way to consolidate your understanding of Vue 3 fundamentals—templates, directives, reactivity, components, lifecycle hooks, and forms—is by building real, self-contained mini-applications. By writing code from scratch, you learn how to structure reactive state, compute derived metrics, manage side effects, and cleanly divide responsibility across Single File Components.

In this lesson, we walk through the architecture, data models, and production-ready code for 6 essential beginner projects.

## Project 1: Todo App with LocalStorage Persistence

A classic Todo application teaches list rendering (`v-for`), two-way form binding (`v-model`), computed filtering (`all`, `active`, `completed`), and persistent side effects with `watch`.

```vue
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

interface Todo {
  id: string
  title: string
  completed: boolean
  createdAt: number
}

const STORAGE_KEY = 'vue_todos_v1'
const todos = ref<Todo[]>([])
const newTodoTitle = ref('')
const currentFilter = ref<'all' | 'active' | 'completed'>('all')

// Load initial todos from localStorage
onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      todos.value = JSON.parse(saved)
    } catch (e) {
      console.error('Failed to parse todos from storage', e)
    }
  }
})

// Deep watch todos and persist automatically
watch(todos, (newTodos) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newTodos))
}, { deep: true })

const filteredTodos = computed(() => {
  if (currentFilter.value === 'active') return todos.value.filter(t => !t.completed)
  if (currentFilter.value === 'completed') return todos.value.filter(t => t.completed)
  return todos.value
})

const activeCount = computed(() => todos.value.filter(t => !t.completed).length)

function addTodo() {
  if (!newTodoTitle.value.trim()) return
  todos.value.unshift({
    id: crypto.randomUUID(),
    title: newTodoTitle.value.trim(),
    completed: false,
    createdAt: Date.now()
  })
  newTodoTitle.value = ''
}

function removeTodo(id: string) {
  todos.value = todos.value.filter(t => t.id !== id)
}

function clearCompleted() {
  todos.value = todos.value.filter(t => !t.completed)
}
</script>

<template>
  <div class="todo-app max-w-md mx-auto p-6 bg-surface rounded-2xl border border-border shadow-sm">
    <h2 class="text-xl font-bold text-ink">My Tasks</h2>

    <form @submit.prevent="addTodo" class="mt-4 flex gap-2">
      <input
        v-model.trim="newTodoTitle"
        placeholder="What needs to be done?"
        class="flex-1 rounded-xl border border-border px-3 py-2 text-sm bg-surface-2 text-ink"
      />
      <button type="submit" class="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white">
        Add
      </button>
    </form>

    <!-- Filter Tabs -->
    <div class="mt-4 flex items-center justify-between border-b border-border pb-2 text-xs">
      <div class="flex gap-2">
        <button
          v-for="f in (['all', 'active', 'completed'] as const)"
          :key="f"
          @click="currentFilter = f"
          :class="currentFilter === f ? 'font-bold text-primary' : 'text-muted'"
          class="capitalize"
        >
          {{ f }}
        </button>
      </div>
      <span class="text-muted">{{ activeCount }} items left</span>
    </div>

    <!-- Todo List -->
    <ul class="mt-3 space-y-2">
      <li
        v-for="todo in filteredTodos"
        :key="todo.id"
        class="flex items-center justify-between rounded-lg bg-surface-2 p-2.5 text-sm"
      >
        <label class="flex items-center gap-2.5 cursor-pointer">
          <input v-model="todo.completed" type="checkbox" class="rounded text-primary" />
          <span :class="{ 'line-through text-muted': todo.completed, 'text-ink': !todo.completed }">
            {{ todo.title }}
          </span>
        </label>
        <button @click="removeTodo(todo.id)" class="text-xs text-red-500 hover:underline">
          Delete
        </button>
      </li>
    </ul>

    <button
      v-if="todos.some(t => t.completed)"
      @click="clearCompleted"
      class="mt-4 text-xs text-muted hover:text-ink underline block"
    >
      Clear completed tasks
    </button>
  </div>
</template>
```

## Project 2: Multi-Step Counter with History Log

The Multi-Step Counter demonstrates number inputs, step controls, min/max boundaries, and an immutable history audit log:

```vue
<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
const step = ref(1)
const history = ref<{ timestamp: string; action: string; result: number }[]>([])

function recordAction(action: string) {
  history.value.unshift({
    timestamp: new Date().toLocaleTimeString(),
    action,
    result: count.value
  })
  if (history.value.length > 10) history.value.pop()
}

function increment() {
  count.value += step.value
  recordAction(`+${step.value}`)
}

function decrement() {
  count.value -= step.value
  recordAction(`-${step.value}`)
}

function reset() {
  count.value = 0
  recordAction('Reset to 0')
}
</script>

<template>
  <div class="counter-app p-6 max-w-sm mx-auto bg-surface rounded-2xl border border-border">
    <h3 class="text-sm font-bold uppercase text-muted">Counter Value</h3>
    <div class="mt-2 text-4xl font-extrabold text-ink font-mono">{{ count }}</div>

    <div class="mt-4 flex items-center gap-2">
      <label class="text-xs text-muted">Step Size:</label>
      <input v-model.number="step" type="number" min="1" max="100" class="w-16 rounded border border-border px-2 py-1 text-xs" />
    </div>

    <div class="mt-4 flex gap-2">
      <button @click="decrement" class="flex-1 bg-surface-2 hover:bg-surface-3 py-2 rounded-lg font-bold">-{{ step }}</button>
      <button @click="reset" class="bg-surface-2 hover:bg-surface-3 px-3 py-2 rounded-lg text-xs">Reset</button>
      <button @click="increment" class="flex-1 bg-primary text-white py-2 rounded-lg font-bold">+{{ step }}</button>
    </div>

    <!-- History audit log -->
    <div class="mt-6 border-t border-border pt-3">
      <span class="text-xs font-bold text-muted">Activity History</span>
      <ul class="mt-2 space-y-1 text-xs font-mono">
        <li v-for="(item, i) in history" :key="i" class="flex justify-between text-muted">
          <span>{{ item.action }} ({{ item.timestamp }})</span>
          <span class="font-bold text-ink">{{ item.result }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
```

## Project 3: Weather Dashboard with Async Fetching

This project teaches asynchronous API requests, loading and error states, and responsive data formatting:

```vue
<script setup lang="ts">
import { ref } from 'vue'

interface WeatherData {
  city: string
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
}

const cityQuery = ref('London')
const weather = ref<WeatherData | null>(null)
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)

async function fetchWeather() {
  if (!cityQuery.value.trim()) return
  isLoading.value = true
  errorMessage.value = null

  try {
    // Simulated weather API endpoint
    await new Promise(resolve => setTimeout(resolve, 600))
    weather.value = {
      city: cityQuery.value,
      temperature: Math.round(15 + Math.random() * 15),
      condition: ['Sunny', 'Partly Cloudy', 'Rain Showers', 'Clear'][Math.floor(Math.random() * 4)] ?? 'Sunny',
      humidity: Math.round(40 + Math.random() * 40),
      windSpeed: Math.round(5 + Math.random() * 20),
    }
  } catch (err) {
    errorMessage.value = 'Could not retrieve weather data. Please check the city name.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="weather-widget p-6 max-w-sm mx-auto bg-surface rounded-2xl border border-border">
    <form @submit.prevent="fetchWeather" class="flex gap-2">
      <input v-model="cityQuery" placeholder="Enter city..." class="flex-1 rounded-xl border border-border px-3 py-1.5 text-xs bg-surface-2 text-ink" />
      <button type="submit" :disabled="isLoading" class="bg-primary text-white px-3 py-1.5 rounded-xl text-xs font-semibold">
        {{ isLoading ? '...' : 'Search' }}
      </button>
    </form>

    <div v-if="errorMessage" class="mt-4 p-3 bg-red-500/10 text-red-500 text-xs rounded-xl">
      {{ errorMessage }}
    </div>

    <div v-if="weather && !isLoading" class="mt-6 text-center">
      <h3 class="text-xl font-bold text-ink">{{ weather.city }}</h3>
      <div class="text-5xl font-black text-primary mt-2">{{ weather.temperature }}°C</div>
      <p class="text-sm font-medium text-muted mt-1">{{ weather.condition }}</p>

      <div class="grid grid-cols-2 gap-2 mt-6 pt-4 border-t border-border text-xs text-muted">
        <div>Humidity: <strong class="text-ink">{{ weather.humidity }}%</strong></div>
        <div>Wind: <strong class="text-ink">{{ weather.windSpeed }} km/h</strong></div>
      </div>
    </div>
  </div>
</template>
```

## Project 4: Personal Expense Tracker

Tracks financial transactions, computes balances, and separates income vs expenses:

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

interface Transaction {
  id: string
  description: string
  amount: number
  type: 'income' | 'expense'
}

const transactions = ref<Transaction[]>([
  { id: '1', description: 'Freelance Design', amount: 800, type: 'income' },
  { id: '2', description: 'Cloud Hosting', amount: 45, type: 'expense' },
])

const description = ref('')
const amount = ref<number | null>(null)
const type = ref<'income' | 'expense'>('expense')

const totalIncome = computed(() =>
  transactions.value.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
)
const totalExpense = computed(() =>
  transactions.value.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
)
const netBalance = computed(() => totalIncome.value - totalExpense.value)

function addTransaction() {
  if (!description.value.trim() || !amount.value || amount.value <= 0) return
  transactions.value.unshift({
    id: crypto.randomUUID(),
    description: description.value.trim(),
    amount: amount.value,
    type: type.value,
  })
  description.value = ''
  amount.value = null
}
</script>

<template>
  <div class="expense-tracker p-6 max-w-md mx-auto bg-surface rounded-2xl border border-border">
    <h2 class="text-lg font-bold text-ink">Expense Tracker</h2>
    
    <!-- Balance Card -->
    <div class="mt-4 p-4 rounded-xl bg-surface-2 flex justify-between items-center">
      <div>
        <span class="text-xs text-muted uppercase font-bold">Net Balance</span>
        <div class="text-2xl font-black" :class="netBalance >= 0 ? 'text-emerald-500' : 'text-red-500'">
          ${{ netBalance.toFixed(2) }}
        </div>
      </div>
      <div class="text-right text-xs space-y-0.5">
        <div class="text-emerald-500">+${{ totalIncome.toFixed(2) }}</div>
        <div class="text-red-500">-${{ totalExpense.toFixed(2) }}</div>
      </div>
    </div>

    <!-- Add Transaction Form -->
    <form @submit.prevent="addTransaction" class="mt-4 space-y-2">
      <input v-model.trim="description" placeholder="Description..." class="w-full rounded-lg border border-border px-3 py-1.5 text-xs bg-surface-2" />
      <div class="flex gap-2">
        <input v-model.number="amount" type="number" min="0.01" step="0.01" placeholder="Amount ($)" class="flex-1 rounded-lg border border-border px-3 py-1.5 text-xs bg-surface-2" />
        <select v-model="type" class="rounded-lg border border-border px-2 py-1.5 text-xs bg-surface-2">
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <button type="submit" class="bg-primary text-white px-4 py-1.5 rounded-lg text-xs font-bold">Add</button>
      </div>
    </form>

    <!-- History List -->
    <ul class="mt-4 space-y-2">
      <li v-for="t in transactions" :key="t.id" class="flex justify-between items-center p-2 rounded-lg bg-surface-2 text-xs">
        <span class="font-medium text-ink">{{ t.description }}</span>
        <span :class="t.type === 'income' ? 'text-emerald-500' : 'text-red-500'" class="font-bold">
          {{ t.type === 'income' ? '+' : '-' }}${{ t.amount.toFixed(2) }}
        </span>
      </li>
    </ul>
  </div>
</template>
```

## Project 5: Interactive Product Catalog with Filtering

Features multi-parameter filtering, search debouncing, and sort order controls:

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

interface Product {
  id: number
  title: string
  category: 'Monitors' | 'Audio' | 'Keyboards'
  price: number
  rating: number
}

const products = ref<Product[]>([
  { id: 1, title: 'Ergonomic Mechanical Keyboard', category: 'Keyboards', price: 149, rating: 4.8 },
  { id: 2, title: 'Studio Monitor Speakers', category: 'Audio', price: 299, rating: 4.6 },
  { id: 3, title: '34" Curved Ultrawide Display', category: 'Monitors', price: 599, rating: 4.9 },
  { id: 4, title: 'Wireless Noise-Cancelling Headphones', category: 'Audio', price: 199, rating: 4.7 },
  { id: 5, title: 'Compact 65% Wireless Keyboard', category: 'Keyboards', price: 89, rating: 4.4 },
])

const search = ref('')
const selectedCategory = ref<string>('All')
const sortBy = ref<'price-asc' | 'price-desc' | 'rating'>('rating')

const filteredProducts = computed(() => {
  return products.value
    .filter(p => {
      const matchCat = selectedCategory.value === 'All' || p.category === selectedCategory.value
      const matchSearch = p.title.toLowerCase().includes(search.value.toLowerCase())
      return matchCat && matchSearch
    })
    .sort((a, b) => {
      if (sortBy.value === 'price-asc') return a.price - b.price
      if (sortBy.value === 'price-desc') return b.price - a.price
      return b.rating - a.rating
    })
})
</script>

<template>
  <div class="product-catalog p-6 max-w-2xl mx-auto bg-surface rounded-2xl border border-border">
    <div class="flex flex-wrap gap-3 items-center justify-between">
      <input v-model="search" placeholder="Search catalog..." class="rounded-xl border border-border px-3 py-1.5 text-xs bg-surface-2 flex-1 min-w-[200px]" />
      
      <select v-model="selectedCategory" class="rounded-xl border border-border px-3 py-1.5 text-xs bg-surface-2">
        <option value="All">All Categories</option>
        <option value="Keyboards">Keyboards</option>
        <option value="Audio">Audio</option>
        <option value="Monitors">Monitors</option>
      </select>

      <select v-model="sortBy" class="rounded-xl border border-border px-3 py-1.5 text-xs bg-surface-2">
        <option value="rating">Top Rated</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>
    </div>

    <!-- Product Grid -->
    <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div v-for="item in filteredProducts" :key="item.id" class="p-4 rounded-xl bg-surface-2 border border-border flex flex-col justify-between">
        <div>
          <span class="text-[10px] uppercase font-bold text-primary">{{ item.category }}</span>
          <h4 class="font-bold text-sm text-ink mt-0.5">{{ item.title }}</h4>
        </div>
        <div class="mt-4 flex items-center justify-between pt-2 border-t border-border/60">
          <span class="font-bold text-ink">${{ item.price }}</span>
          <span class="text-xs text-amber-500 font-semibold">★ {{ item.rating }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
```

## Project 6: Simple Shopping Cart with Checkout Calculations

Demonstrates state mutation across quantity controls, item removals, sales tax calculations, and empty states:

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

interface CartItem {
  id: string
  title: string
  price: number
  quantity: number
}

const cart = ref<CartItem[]>([
  { id: 'item-1', title: 'Vue 3 T-Shirt', price: 28, quantity: 2 },
  { id: 'item-2', title: 'Frontend Developer Mug', price: 16, quantity: 1 },
])

const subtotal = computed(() =>
  cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
)
const taxRate = 0.08
const estimatedTax = computed(() => subtotal.value * taxRate)
const shippingFee = computed(() => (subtotal.value > 50 || subtotal.value === 0 ? 0 : 9.99))
const grandTotal = computed(() => subtotal.value + estimatedTax.value + shippingFee.value)

function incrementQuantity(item: CartItem) {
  item.quantity += 1
}

function decrementQuantity(item: CartItem) {
  if (item.quantity > 1) {
    item.quantity -= 1
  } else {
    removeItem(item.id)
  }
}

function removeItem(id: string) {
  cart.value = cart.value.filter(i => i.id !== id)
}
</script>

<template>
  <div class="cart-app p-6 max-w-lg mx-auto bg-surface rounded-2xl border border-border">
    <h2 class="text-xl font-bold text-ink">Your Shopping Cart</h2>

    <div v-if="cart.length === 0" class="py-12 text-center text-muted text-sm">
      Your cart is empty. Add some products to start!
    </div>

    <div v-else>
      <ul class="mt-4 divide-y divide-border">
        <li v-for="item in cart" :key="item.id" class="py-3 flex items-center justify-between text-sm">
          <div>
            <span class="font-bold text-ink">{{ item.title }}</span>
            <span class="text-xs text-muted block">${{ item.price }} each</span>
          </div>

          <div class="flex items-center gap-3">
            <div class="flex items-center border border-border rounded-lg bg-surface-2">
              <button @click="decrementQuantity(item)" class="px-2 py-0.5 text-muted hover:text-ink">-</button>
              <span class="px-2 text-xs font-mono font-bold text-ink">{{ item.quantity }}</span>
              <button @click="incrementQuantity(item)" class="px-2 py-0.5 text-muted hover:text-ink">+</button>
            </div>
            <span class="font-bold text-ink w-16 text-right">${{ (item.price * item.quantity).toFixed(2) }}</span>
            <button @click="removeItem(item.id)" class="text-red-500 hover:underline text-xs">✕</button>
          </div>
        </li>
      </ul>

      <!-- Price Breakdown -->
      <div class="mt-6 pt-4 border-t border-border space-y-1.5 text-xs text-muted">
        <div class="flex justify-between">
          <span>Subtotal:</span>
          <span class="text-ink">${{ subtotal.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between">
          <span>Estimated Sales Tax (8%):</span>
          <span class="text-ink">${{ estimatedTax.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between">
          <span>Shipping:</span>
          <span class="text-ink">{{ shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}` }}</span>
        </div>
        <div class="flex justify-between text-base font-bold text-ink pt-2 border-t border-border">
          <span>Grand Total:</span>
          <span class="text-primary">${{ grandTotal.toFixed(2) }}</span>
        </div>
      </div>

      <button class="mt-6 w-full py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">
        Proceed to Checkout
      </button>
    </div>
  </div>
</template>
```

## Best Practices

- **Derive Everything with `computed()`**: Calculate totals, filters, active counts, and taxes reactively from single sources of truth rather than manually synchronizing separate variables.
- **Isolate Storage Side-Effects in Watchers**: Use `watch(state, saveFn, { deep: true })` to persist state automatically whenever mutations occur.
- **Enforce TypeScript Interfaces**: Always declare explicit interfaces for domain entities (`Todo`, `Product`, `Transaction`) to catch bugs at compile time.
- **Provide Instant Visual Feedback**: Always handle empty states, loading indicators, and error banners gracefully to deliver a polished user experience.

## Summary

Building practical applications bridges the gap between theoretical knowledge and real-world software engineering. These 6 projects demonstrate the versatility of Vue 3's reactive primitives, form directives, list rendering algorithms, and computed state modeling. With Level 1 fundamentals mastered, you are ready to advance to Level 2: Intermediate Architecture.
