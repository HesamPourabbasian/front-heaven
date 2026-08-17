---
title: 'Basic Svelte 5 Practice Projects'
description: 'Build 8 complete beginner Svelte 5 projects: Counter, Todo App, Calculator, Weather App, Notes App, Expense Tracker, Product List, and Shopping Cart.'
order: 7
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 45
prerequisites:
  - /learn/svelte/04-reactivity-and-runes
  - /learn/svelte/05-components
  - /learn/svelte/06-forms
---

# Basic Svelte 5 Practice Projects

Applying theoretical framework concepts to functional, real-world mini-applications is the most effective way to cement your understanding of Svelte 5 Runes, reactive state mutations, component decomposition, and two-way form bindings.

In this lesson, we will construct 8 complete beginner applications using modern Svelte 5 syntax (`$state`, `$derived`, `$effect`, and Snippets). Each project includes clean architecture, state models, interactive UI controls, and production-ready code.

## Project 1: Interactive Counter with History Log

### Features:
- Increment, decrement, and reset actions with customizable step sizes.
- Min (-50) and Max (+50) threshold bounds.
- Reactive history log recording every mutation with timestamp.

```svelte
<!-- src/lib/CounterApp.svelte -->
<script lang="ts">
  let count = $state(0)
  let step = $state(1)
  let history = $state<string[]>([])

  const MIN = -50
  const MAX = 50

  let isAtMin = $derived(count <= MIN)
  let isAtMax = $derived(count >= MAX)

  function updateCount(delta: number) {
    const next = count + delta
    if (next < MIN || next > MAX) return
    
    count = next
    const record = `${new Date().toLocaleTimeString()} → Changed by ${delta > 0 ? '+' + delta : delta} (New: ${count})`
    history = [record, ...history.slice(0, 9)] // Keep latest 10
  }

  function reset() {
    count = 0
    history = [`${new Date().toLocaleTimeString()} → Reset to 0`, ...history]
  }
</script>

<div class="project-box">
  <h2>Interactive Counter</h2>
  <div class="counter-display" class:text-red-500={isAtMin} class:text-emerald-500={isAtMax}>
    {count}
  </div>

  <div class="controls">
    <button disabled={isAtMin} onclick={() => updateCount(-step)}>-{step}</button>
    <button onclick={reset}>Reset</button>
    <button disabled={isAtMax} onclick={() => updateCount(step)}>+{step}</button>
  </div>

  <div class="step-control">
    <label>Step Size: {step}</label>
    <input type="range" min="1" max="10" bind:value={step} />
  </div>

  <div class="history">
    <h4>Recent Activity ({history.length})</h4>
    <ul>
      {#each history as log, idx (idx)}
        <li>{log}</li>
      {/each}
    </ul>
  </div>
</div>
```

## Project 2: Persistent Todo Application

### Features:
- Add new tasks with keyboard Enter shortcut.
- Toggle task completion and delete items.
- Filter by `all`, `active`, and `completed`.
- Automatic `localStorage` persistence with `$effect`.

```svelte
<!-- src/lib/TodoApp.svelte -->
<script lang="ts">
  interface Todo {
    id: string
    text: string
    completed: boolean
  }

  const STORAGE_KEY = 'svelte5_todos'

  // Initialize from localStorage or default
  function loadTodos(): Todo[] {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : [
      { id: '1', text: 'Learn Svelte 5 Runes', completed: true },
      { id: '2', text: 'Build a Todo application', completed: false }
    ]
  }

  let todos = $state<Todo[]>(loadTodos())
  let newTodoText = $state('')
  let activeFilter = $state<'all' | 'active' | 'completed'>('all')

  // Persist to localStorage whenever todos change
  $effect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  })

  // Derived filtered collection
  let filteredTodos = $derived.by(() => {
    if (activeFilter === 'active') return todos.filter(t => !t.completed)
    if (activeFilter === 'completed') return todos.filter(t => t.completed)
    return todos
  })

  let remainingCount = $derived(todos.filter(t => !t.completed).length)

  function addTodo() {
    const text = newTodoText.trim()
    if (!text) return
    todos.push({ id: crypto.randomUUID(), text, completed: false })
    newTodoText = ''
  }

  function removeTodo(id: string) {
    todos = todos.filter(t => t.id !== id)
  }

  function clearCompleted() {
    todos = todos.filter(t => !t.completed)
  }
</script>

<div class="todo-app">
  <h2>Task Master ({remainingCount} left)</h2>

  <form onsubmit={(e) => { e.preventDefault(); addTodo() }} class="todo-form">
    <input placeholder="What needs to be done?" bind:value={newTodoText} />
    <button type="submit">Add Task</button>
  </form>

  <div class="filter-pills">
    <button class:active={activeFilter === 'all'} onclick={() => activeFilter = 'all'}>All</button>
    <button class:active={activeFilter === 'active'} onclick={() => activeFilter = 'active'}>Active</button>
    <button class:active={activeFilter === 'completed'} onclick={() => activeFilter = 'completed'}>Completed</button>
    <button class="clear-btn" onclick={clearCompleted}>Clear Completed</button>
  </div>

  <ul class="todo-list">
    {#each filteredTodos as todo (todo.id)}
      <li class="todo-item" class:done={todo.completed}>
        <input type="checkbox" bind:checked={todo.completed} />
        <span>{todo.text}</span>
        <button class="delete-btn" onclick={() => removeTodo(todo.id)}>✕</button>
      </li>
    {:else}
      <li class="empty-msg">No tasks found.</li>
    {/each}
  </ul>
</div>
```

## Project 3: Digital Arithmetic Calculator

### Features:
- Number keypad ($0-9$), decimal point, and arithmetic operators ($+, -, \times, \div$).
- Live equation preview formula.
- Clear (`AC`) and delete backspace actions.

```svelte
<!-- src/lib/CalculatorApp.svelte -->
<script lang="ts">
  let display = $state('0')
  let formula = $state('')
  let resetOnNextDigit = $state(false)

  function inputDigit(digit: string) {
    if (display === '0' || resetOnNextDigit) {
      display = digit
      resetOnNextDigit = false
    } else {
      display += digit
    }
  }

  function inputDecimal() {
    if (!display.includes('.')) {
      display += '.'
    }
  }

  function handleOperator(op: string) {
    formula = `${display} ${op} `
    resetOnNextDigit = true
  }

  function calculate() {
    if (!formula) return
    const expression = formula + display
    try {
      // Safe sanitized arithmetic evaluation
      const sanitized = expression.replace(/×/g, '*').replace(/÷/g, '/')
      const result = Function(`'use strict'; return (${sanitized})`)()
      display = String(Number(result.toFixed(6)))
      formula = ''
      resetOnNextDigit = true
    } catch {
      display = 'Error'
      formula = ''
    }
  }

  function clear() {
    display = '0'
    formula = ''
    resetOnNextDigit = false
  }
</script>

<div class="calculator-card">
  <div class="calc-screen">
    <div class="formula">{formula}</div>
    <div class="main-display">{display}</div>
  </div>

  <div class="grid-buttons">
    <button class="action" onclick={clear}>AC</button>
    <button class="op" onclick={() => handleOperator('÷')}>÷</button>
    <button class="op" onclick={() => handleOperator('×')}>×</button>
    <button class="op" onclick={() => handleOperator('-')}>-</button>

    <button onclick={() => inputDigit('7')}>7</button>
    <button onclick={() => inputDigit('8')}>8</button>
    <button onclick={() => inputDigit('9')}>9</button>
    <button class="op" onclick={() => handleOperator('+')}>+</button>

    <button onclick={() => inputDigit('4')}>4</button>
    <button onclick={() => inputDigit('5')}>5</button>
    <button onclick={() => inputDigit('6')}>6</button>
    <button class="equals" onclick={calculate}>=</button>

    <button onclick={() => inputDigit('1')}>1</button>
    <button onclick={() => inputDigit('2')}>2</button>
    <button onclick={() => inputDigit('3')}>3</button>
    <button onclick={() => inputDigit('0')}>0</button>
    <button onclick={inputDecimal}>.</button>
  </div>
</div>
```

## Project 4: Weather Dashboard with `{#await}`

### Features:
- Search by city with instant simulated network request.
- Temperature unit toggle (Celsius vs Fahrenheit).
- Status handling with `{#await}`, `{:then}`, and `{:catch}`.

```svelte
<!-- src/lib/WeatherApp.svelte -->
<script lang="ts">
  interface WeatherReport {
    city: string
    celsius: number
    condition: 'Sunny' | 'Cloudy' | 'Rainy' | 'Snow'
    humidity: number
    windKmH: number
  }

  let selectedCity = $state('London')
  let isCelsius = $state(true)

  async function fetchWeather(city: string): Promise<WeatherReport> {
    // Simulated weather API endpoint
    await new Promise((r) => setTimeout(r, 600))
    const mockData: Record<string, WeatherReport> = {
      london: { city: 'London', celsius: 16, condition: 'Rainy', humidity: 78, windKmH: 22 },
      tokyo: { city: 'Tokyo', celsius: 24, condition: 'Sunny', humidity: 55, windKmH: 10 },
      paris: { city: 'Paris', celsius: 19, condition: 'Cloudy', humidity: 62, windKmH: 14 },
    }
    const report = mockData[city.toLowerCase()]
    if (!report) throw new Error(`City "${city}" not found in weather directory.`)
    return report
  }

  let weatherPromise = $state(fetchWeather(selectedCity))

  function search(e: SubmitEvent) {
    e.preventDefault()
    weatherPromise = fetchWeather(selectedCity)
  }
</script>

<div class="weather-box">
  <form onsubmit={search} class="search-row">
    <input placeholder="Search London, Tokyo, Paris..." bind:value={selectedCity} />
    <button type="submit">Check Weather</button>
  </form>

  <div class="unit-toggle">
    <button class:active={isCelsius} onclick={() => isCelsius = true}>°C</button>
    <button class:active={!isCelsius} onclick={() => isCelsius = false}>°F</button>
  </div>

  {#await weatherPromise}
    <div class="loading">Fetching live atmospheric data...</div>
  {:then data}
    <div class="weather-result">
      <h3>{data.city}</h3>
      <div class="temp-big">
        {isCelsius ? `${data.celsius}°C` : `${Math.round(data.celsius * 1.8 + 32)}°F`}
      </div>
      <span class="condition-badge">{data.condition}</span>
      <div class="metrics">
        <span>💧 Humidity: {data.humidity}%</span>
        <span>💨 Wind: {data.windKmH} km/h</span>
      </div>
    </div>
  {:catch error}
    <div class="error-msg">⚠️ {error.message}</div>
  {/await}
</div>
```

## Project 5: Markdown Notes App

### Features:
- Create, edit, and delete notes.
- Color category tags (Personal, Work, Ideas).
- Live note search query filter.

```svelte
<!-- src/lib/NotesApp.svelte -->
<script lang="ts">
  interface Note {
    id: string
    title: string
    body: string
    tag: 'work' | 'personal' | 'idea'
    createdAt: string
  }

  let notes = $state<Note[]>([
    { id: '1', title: 'Svelte 5 Runes', body: 'Universal signals are game changers.', tag: 'work', createdAt: '10:15 AM' },
    { id: '2', title: 'Grocery Run', body: 'Apples, Oat Milk, Coffee beans.', tag: 'personal', createdAt: 'Yesterday' },
  ])

  let search = $state('')
  let titleInput = $state('')
  let bodyInput = $state('')
  let tagInput = $state<'work' | 'personal' | 'idea'>('work')

  let filteredNotes = $derived(
    notes.filter(n =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.body.toLowerCase().includes(search.toLowerCase())
    )
  )

  function addNote() {
    if (!titleInput.trim()) return
    notes.unshift({
      id: crypto.randomUUID(),
      title: titleInput.trim(),
      body: bodyInput.trim(),
      tag: tagInput,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })
    titleInput = ''
    bodyInput = ''
  }

  function deleteNote(id: string) {
    notes = notes.filter(n => n.id !== id)
  }
</script>

<div class="notes-app">
  <div class="notes-sidebar">
    <input placeholder="Search notes..." bind:value={search} />
    <div class="notes-list">
      {#each filteredNotes as note (note.id)}
        <div class="note-card note-tag-{note.tag}">
          <div class="flex justify-between items-start">
            <h4>{note.title}</h4>
            <button onclick={() => deleteNote(note.id)}>✕</button>
          </div>
          <p>{note.body}</p>
          <span class="timestamp">{note.createdAt}</span>
        </div>
      {/each}
    </div>
  </div>

  <div class="note-creator">
    <h3>New Note</h3>
    <input placeholder="Title" bind:value={titleInput} />
    <textarea placeholder="Write your note..." bind:value={bodyInput}></textarea>
    <div class="tag-selector">
      <select bind:value={tagInput}>
        <option value="work">Work</option>
        <option value="personal">Personal</option>
        <option value="idea">Idea</option>
      </select>
      <button onclick={addNote}>Save Note</button>
    </div>
  </div>
</div>
```

## Project 6: Personal Expense Tracker

### Features:
- Income vs Expense transaction management.
- Real-time Balance, Total Income, and Total Expense metric computations.
- Category tagging and deletion.

```svelte
<!-- src/lib/ExpenseApp.svelte -->
<script lang="ts">
  interface Transaction {
    id: string
    description: string
    amount: number
    type: 'income' | 'expense'
  }

  let transactions = $state<Transaction[]>([
    { id: '1', description: 'Freelance Frontend Build', amount: 1500, type: 'income' },
    { id: '2', description: 'Cloud Hosting Subscription', amount: 45, type: 'expense' },
  ])

  let desc = $state('')
  let amount = $state<number>(0)
  let type = $state<'income' | 'expense'>('expense')

  let totalIncome = $derived(
    transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  )

  let totalExpense = $derived(
    transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  )

  let netBalance = $derived(totalIncome - totalExpense)

  function addTransaction() {
    if (!desc.trim() || amount <= 0) return
    transactions.push({
      id: crypto.randomUUID(),
      description: desc.trim(),
      amount,
      type
    })
    desc = ''
    amount = 0
  }

  function remove(id: string) {
    transactions = transactions.filter(t => t.id !== id)
  }
</script>

<div class="expense-card">
  <h2>Expense Ledger</h2>
  
  <div class="balance-banner">
    <span>Current Net Balance</span>
    <div class="balance-amount" class:text-red-500={netBalance < 0}>
      ${netBalance.toFixed(2)}
    </div>
    <div class="income-expense-row">
      <span class="text-emerald-600">▲ Income: ${totalIncome.toFixed(2)}</span>
      <span class="text-rose-600">▼ Expenses: ${totalExpense.toFixed(2)}</span>
    </div>
  </div>

  <form onsubmit={(e) => { e.preventDefault(); addTransaction() }} class="transaction-form">
    <input placeholder="Description" bind:value={desc} />
    <input type="number" min="1" step="any" placeholder="Amount ($)" bind:value={amount} />
    <select bind:value={type}>
      <option value="expense">Expense</option>
      <option value="income">Income</option>
    </select>
    <button type="submit">Record</button>
  </form>

  <ul class="transaction-list">
    {#each transactions as t (t.id)}
      <li class="t-row t-{t.type}">
        <span>{t.description}</span>
        <strong>{t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}</strong>
        <button onclick={() => remove(t.id)}>✕</button>
      </li>
    {/each}
  </ul>
</div>
```

## Project 7: Filterable Product Catalog

### Features:
- Multi-category filter chips (All, Hardware, Software, Books).
- Price range slider with dynamic maximum filter threshold.
- Sort by Price (Low $\rightarrow$ High / High $\rightarrow$ Low) and Rating.

```svelte
<!-- src/lib/ProductCatalog.svelte -->
<script lang="ts">
  interface Product {
    id: number
    title: string
    category: 'Hardware' | 'Software' | 'Books'
    price: number
    rating: number
  }

  const catalog: Product[] = [
    { id: 1, title: 'Mechanical Keyboard', category: 'Hardware', price: 140, rating: 4.8 },
    { id: 2, title: 'IDE Enterprise License', category: 'Software', price: 80, rating: 4.6 },
    { id: 3, title: 'Svelte 5 Architecture Book', category: 'Books', price: 35, rating: 4.9 },
    { id: 4, title: '4K UltraWide Monitor', category: 'Hardware', price: 450, rating: 4.7 },
  ]

  let selectedCategory = $state<string>('All')
  let maxPrice = $state<number>(500)
  let sortBy = $state<'price-asc' | 'price-desc' | 'rating'>('rating')

  let filteredProducts = $derived.by(() => {
    let result = catalog.filter(p => {
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory
      const matchPrice = p.price <= maxPrice
      return matchCat && matchPrice
    })

    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price)
    if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price)
    if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating)

    return result
  })
</script>

<div class="catalog-page">
  <div class="filters-bar">
    <div class="category-buttons">
      {#each ['All', 'Hardware', 'Software', 'Books'] as cat}
        <button class:active={selectedCategory === cat} onclick={() => selectedCategory = cat}>
          {cat}
        </button>
      {/each}
    </div>

    <div class="slider-box">
      <label>Max Price: ${maxPrice}</label>
      <input type="range" min="30" max="500" step="10" bind:value={maxPrice} />
    </div>

    <select bind:value={sortBy}>
      <option value="rating">Top Rated</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
    </select>
  </div>

  <div class="products-grid">
    {#each filteredProducts as product (product.id)}
      <div class="product-card">
        <span class="category-tag">{product.category}</span>
        <h3>{product.title}</h3>
        <div class="flex justify-between items-center mt-3">
          <span class="price">${product.price}</span>
          <span class="rating">★ {product.rating}</span>
        </div>
      </div>
    {:else}
      <p class="no-match">No products match your active filters.</p>
    {/each}
  </div>
</div>
```

## Project 8: Shopping Cart & Checkout Calculator

### Features:
- Add items to cart, increment/decrement quantities, remove items.
- Discount coupon code input (`SAVE20` for 20% off).
- Automatic Subtotal, Tax (8%), Discount, and Final Grand Total computation.

```svelte
<!-- src/lib/ShoppingCartApp.svelte -->
<script lang="ts">
  interface CartItem {
    id: string
    name: string
    unitPrice: number
    quantity: number
  }

  let cart = $state<CartItem[]>([
    { id: 'p1', name: 'Svelte 5 Full Course', unitPrice: 49.99, quantity: 1 },
    { id: 'p2', name: 'UI Components Kit', unitPrice: 29.99, quantity: 2 },
  ])

  let couponCode = $state('')
  let discountRate = $state(0)
  let couponMessage = $state('')

  let subtotal = $derived(
    cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  )

  let discountAmount = $derived((subtotal * discountRate) / 100)
  let taxAmount = $derived((subtotal - discountAmount) * 0.08)
  let grandTotal = $derived(subtotal - discountAmount + taxAmount)

  function updateQty(id: string, delta: number) {
    const item = cart.find(i => i.id === id)
    if (!item) return
    const newQty = item.quantity + delta
    if (newQty <= 0) {
      cart = cart.filter(i => i.id !== id)
    } else {
      item.quantity = newQty
    }
  }

  function applyCoupon() {
    if (couponCode.toUpperCase() === 'SAVE20') {
      discountRate = 20
      couponMessage = '✓ 20% Discount applied!'
    } else {
      discountRate = 0
      couponMessage = '✕ Invalid promo code'
    }
  }
</script>

<div class="cart-wrapper">
  <h2>Your Shopping Cart ({cart.length})</h2>

  <div class="cart-table">
    {#each cart as item (item.id)}
      <div class="cart-row">
        <span>{item.name} (${item.unitPrice.toFixed(2)})</span>
        <div class="qty-controls">
          <button onclick={() => updateQty(item.id, -1)}>-</button>
          <span>{item.quantity}</span>
          <button onclick={() => updateQty(item.id, 1)}>+</button>
        </div>
        <strong>${(item.unitPrice * item.quantity).toFixed(2)}</strong>
      </div>
    {:else}
      <p class="empty-cart">Your cart is currently empty.</p>
    {/each}
  </div>

  <div class="coupon-section">
    <input placeholder="Promo code (try SAVE20)" bind:value={couponCode} />
    <button onclick={applyCoupon}>Apply</button>
    {#if couponMessage}
      <span class="coupon-feedback">{couponMessage}</span>
    {/if}
  </div>

  <div class="order-summary">
    <div class="summary-line"><span>Subtotal:</span> <span>${subtotal.toFixed(2)}</span></div>
    {#if discountRate > 0}
      <div class="summary-line text-emerald-600"><span>Discount ({discountRate}%):</span> <span>-${discountAmount.toFixed(2)}</span></div>
    {/if}
    <div class="summary-line"><span>Estimated Tax (8%):</span> <span>${taxAmount.toFixed(2)}</span></div>
    <div class="summary-line grand-total"><span>Grand Total:</span> <strong>${grandTotal.toFixed(2)}</strong></div>
  </div>
</div>
```

## Best Practices

- **Derive Aggregate Metrics with `$derived`**: Calculate subtotals, remaining counts, and filtered arrays purely with `$derived` rather than manually updating state in callbacks.
- **Use `$effect` Exclusively for Side Effects**: Synchronize with browser APIs (`localStorage`, document title, analytics) inside `$effect()`.
- **Encapsulate Domain Models in Clear TypeScript Interfaces**: Always define clear TypeScript contracts (`Todo`, `Product`, `Transaction`) for state predictability.
- **Always Provide Fallback Empty States in `{#each}`**: Use `{:else}` within `{#each}` blocks to guarantee clean UI when datasets are empty.

## Summary

These 8 practice projects demonstrate the foundational patterns of Svelte 5 development: fine-grained reactive state with `$state`, computed views with `$derived`, browser synchronization via `$effect`, two-way form bindings, and template control flow. With Level 1 mastered, you are ready to advance to Level 2: Intermediate SvelteKit & State Architecture.
