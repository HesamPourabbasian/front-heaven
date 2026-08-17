---
title: 'Template Syntax & Directives'
description: 'Master Vue template syntax, data interpolation, conditional rendering with v-if/v-show, list rendering with v-for, event listeners, two-way v-model binding, and dynamic class/style bindings.'
order: 3
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 25
prerequisites:
  - /learn/vue/02-vue-fundamentals
---

# Template Syntax & Directives

Vue uses an HTML-based template syntax that allows you to declaratively bind the rendered DOM to the underlying component instance's reactive data. All Vue templates are syntactically valid HTML that can be parsed by spec-compliant browsers and HTML parsers. Under the hood, Vue compiles these templates into highly optimized Virtual DOM render functions.

In this lesson, we will explore Vue's template features in detail: from text interpolation and attribute binding to conditional structures, loop rendering, event listeners, and dynamic CSS styling.

## Text Interpolation with Mustaches: `{{ }}`

The most basic form of data binding in Vue templates is text interpolation using the double mustache syntax: `{{ expression }}`.

The mustache tag will be replaced with the value of the corresponding JavaScript property from the component's script. It will also be updated automatically whenever the property changes. Mustache syntax supports full JavaScript expressions inside the delimiters, such as ternary operators, string methods, or arithmetic calculations.

```vue
<script setup lang="ts">
import { ref } from 'vue'

const username = ref('Hesam')
const unreadCount = ref(5)
</script>

<template>
  <div class="user-greeting">
    <p>Welcome back, {{ username.toUpperCase() }}!</p>
    <p>{{ unreadCount > 0 ? `You have ${unreadCount} new notifications` : 'All caught up!' }}</p>
  </div>
</template>
```

Mustache tags can only contain single expressions (evaluable to a value), not statements (like `var a = 1` or `if (x) { ... }`).

## Attribute Binding with `v-bind` (`:`)

Mustache syntax cannot be used directly in HTML attributes. To bind an HTML attribute dynamically to reactive component state, use the `v-bind` directive, which is so commonly used that it has a universal shorthand prefix `:` (colon).

When the bound value is `null` or `undefined`, the attribute will be removed from the rendered DOM element entirely. For boolean attributes (such as `disabled`, `checked`, `required`, or `readonly`), the attribute will be included if the expression evaluates to truthy and omitted if falsy.

```vue
<script setup lang="ts">
import { ref } from 'vue'

const imageSrc = ref('/avatars/hesam.png')
const imageAlt = ref('Hesam Pourabbasian Profile')
const isSubmitDisabled = ref(true)
const dynamicId = ref('user-profile-header')
</script>

<template>
  <div :id="dynamicId">
    <!-- Full directive syntax: v-bind:src -->
    <!-- Shorthand syntax: :src -->
    <img :src="imageSrc" :alt="imageAlt" class="avatar" />
    <button :disabled="isSubmitDisabled">Submit Application</button>
  </div>
</template>
```

## Conditional Rendering: `v-if`, `v-else-if`, and `v-else`

The `v-if` directive is used to conditionally render an element or component block. The block will only be inserted into the DOM if the directive's expression returns a truthy value.

You can chain `v-else-if` and `v-else` immediately following a `v-if` element. If you need to toggle multiple sibling elements together without wrapping them in an extra real DOM `<div>`, you can apply `v-if` to an invisible `<template>` wrapper tag.

```vue
<script setup lang="ts">
import { ref } from 'vue'

const authState = ref<'loading' | 'authenticated' | 'anonymous'>('authenticated')
</script>

<template>
  <div class="auth-container">
    <div v-if="authState === 'loading'" class="spinner">
      Loading your profile...
    </div>
    
    <div v-else-if="authState === 'authenticated'" class="dashboard">
      <h2>Welcome to your dashboard</h2>
    </div>
    
    <div v-else class="login-prompt">
      <button>Sign In to Continue</button>
    </div>
  </div>
</template>
```

## `v-if` vs `v-show`: Performance and DOM Differences

Vue provides two directives for toggling element visibility: `v-if` and `v-show`. While they appear similar to end users, their underlying implementation and performance profiles are fundamentally different:

- **`v-if`** is "real" conditional rendering. It ensures that event listeners and child components inside the conditional block are properly destroyed and re-created during toggles. It is also **lazy**: if the condition is false on initial render, it will not do anything until the condition becomes true for the first time.
- **`v-show`** always renders the element into the DOM regardless of initial condition, and simply toggles the CSS `display: none;` style property.

```vue
<!-- Element is completely removed and recreated from DOM on toggle -->
<ModalDialog v-if="isModalOpen" />

<!-- Element stays in DOM, only toggles display: none -->
<div v-show="isTabActive" class="tab-pane">
  Tab Content
</div>
```

**Rule of Thumb**: Use `v-show` if you need to toggle something very frequently (such as tabs, dropdowns, tooltips). Use `v-if` if the condition is unlikely to change at runtime or if the component inside is heavy and shouldn't initialize unless needed.

## List Rendering: `v-for` and the Critical `:key` Attribute

To render a list of items based on an array, use the `v-for` directive. The syntax is `item in items` or `(item, index) in items`.

You can also use `v-for` to iterate over object properties `(value, key, index) in object` or over an integer range `n in 10`.

```vue
<script setup lang="ts">
import { ref } from 'vue'

interface Course {
  id: string
  title: string
  lessonsCount: number
}

const courses = ref<Course[]>([
  { id: 'vue-101', title: 'Vue 3 Fundamentals', lessonsCount: 12 },
  { id: 'nuxt-201', title: 'Fullstack Nuxt.js', lessonsCount: 18 },
  { id: 'pinia-301', title: 'State Architecture', lessonsCount: 8 },
])
</script>

<template>
  <ul class="course-list">
    <li v-for="(course, index) in courses" :key="course.id" class="course-item">
      <span class="index">#{{ index + 1 }}</span>
      <strong>{{ course.title }}</strong>
      <span class="count">({{ course.lessonsCount }} lessons)</span>
    </li>
  </ul>
</template>
```

### Why `:key` is strictly mandatory

When Vue updates a list of elements rendered with `v-for`, it uses an in-place patch strategy by default. If the order of the items changes, instead of moving the DOM elements to match the order of the items, Vue will patch each element in-place and ensure it reflects what should be rendered at that particular index.

Providing a unique, primitive key (`:key="item.id"`) gives Vue a stable identifier for each virtual node. This allows Vue's diffing algorithm to precisely identify which elements were added, removed, or reordered, preserving component internal state (such as input focus or CSS transitions) without expensive full-list re-renders. Never use array index as a `:key` if the list can be filtered, sorted, or mutated.

## Event Handling with `v-on` (`@`) and Modifiers

Use the `v-on` directive (shorthand `@`) to listen to DOM events and run JavaScript when triggered. The handler can be an inline JavaScript expression or a method name.

Vue provides handy event modifiers chained with dot notation to handle common DOM event tasks cleanly:
- `.stop`: Calls `event.stopPropagation()` to prevent event bubbling.
- `.prevent`: Calls `event.preventDefault()` (e.g. stopping full page reload on `<form @submit.prevent>`).
- `.self`: Only triggers handler if `event.target` is the element itself.
- `.once`: Triggers the event listener at most once.
- `.passive`: Improves mobile scrolling performance on touch/wheel events.
- Key modifiers: `@keyup.enter`, `@keydown.esc`, `@keydown.space`.

```vue
<script setup lang="ts">
import { ref } from 'vue'

const searchQuery = ref('')

function handleSearch() {
  console.log('Searching for:', searchQuery.value)
}

function handleCardClick() {
  console.log('Card container clicked')
}

function handleFavorite(e: MouseEvent) {
  console.log('Favorited!')
}
</script>

<template>
  <div class="card" @click="handleCardClick">
    <!-- .stop prevents triggering handleCardClick on parent -->
    <button @click.stop="handleFavorite">♥ Favorite</button>
    
    <!-- Submit without page reload -->
    <form @submit.prevent="handleSearch">
      <!-- Triggers only when Enter key is released -->
      <input v-model="searchQuery" @keyup.enter="handleSearch" placeholder="Search..." />
      <button type="submit">Search</button>
    </form>
  </div>
</template>
```

## Two-Way Form Binding with `v-model`

Manually connecting an input's `:value` attribute to reactive state and listening to `@input` to update the state is tedious. Vue provides the `v-model` directive to create seamless two-way data bindings on form inputs, textareas, checkboxes, radio buttons, and custom components.

`v-model` automatically selects the correct property and event based on the input element type:
- Text inputs and textareas use the `value` property and `input` event.
- Checkboxes and radio buttons use the `checked` property and `change` event.
- Select dropdowns use `value` as a prop and `change` as an event.

Modifiers for `v-model`:
- `.lazy`: Syncs after `change` event (when input loses focus) rather than every keystroke `input` event.
- `.number`: Automatically typecasts the user input string to a JavaScript number.
- `.trim`: Automatically strips leading and trailing whitespace from the string.

```vue
<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const age = ref<number>(25)
const isSubscribed = ref(true)
</script>

<template>
  <form class="settings-form">
    <input v-model.trim="email" type="email" placeholder="Email Address" />
    <input v-model.number="age" type="number" min="18" />
    <label>
      <input v-model="isSubscribed" type="checkbox" />
      Subscribe to newsletter
    </label>
  </form>
</template>
```

## Dynamic Class and Style Bindings

Managing dynamic CSS classes and inline styles is a daily requirement in frontend engineering. Vue enhances `v-bind:class` and `v-bind:style` to accept objects and arrays in addition to plain strings.

### Class Binding Syntax
- **Object Syntax**: `:class="{ 'active': isActive, 'text-danger': hasError }"` — the class is applied if the boolean condition is truthy.
- **Array Syntax**: `:class="[baseClass, isActive ? activeClass : '']"` — applies a list of multiple classes.
- **Combined Syntax**: `:class="['btn', { 'btn-primary': isPrimary, 'btn-disabled': isDisabled }]"`

```vue
<script setup lang="ts">
import { ref } from 'vue'

const isActive = ref(true)
const isPending = ref(false)
const themeColor = ref('#10b981')
</script>

<template>
  <!-- Object syntax for classes -->
  <div
    class="badge-base"
    :class="{
      'badge-active': isActive,
      'badge-pending': isPending
    }"
  >
    Status
  </div>

  <!-- Dynamic inline styles with camelCase or kebab-case -->
  <div
    :style="{
      backgroundColor: themeColor,
      fontSize: '14px',
      padding: '8px 16px',
      borderRadius: '8px'
    }"
  >
    Themed Box
  </div>
</template>
```

## Best Practices

- **Never Use `v-if` with `v-for` on the Same Element**: In Vue 3, `v-if` has higher priority than `v-for`, meaning the `v-if` condition cannot access variables defined in the `v-for` scope. Instead, filter your list in a `computed()` property or wrap the loop in a `<template v-for="...">` with `v-if` inside.
- **Always Provide Stable `:key` Attributes**: Use unique database IDs or UUIDs for list keys rather than array indices.
- **Keep Template Expressions Simple**: If a template expression requires more than one logical operation or string concatenation, extract it into a `computed()` property for better readability and performance.
- **Use Shorthands Consistently**: Standardize across your project on `@` for `v-on` and `:` for `v-bind`.

## Summary

Vue's template syntax combines the declarative power of HTML with the dynamic flexibility of JavaScript. By mastering text interpolation, `:bind` attributes, `v-if`/`v-show` conditions, `v-for` list rendering, `@` event listeners, and `v-model` form syncing, you possess the full vocabulary required to construct expressive, performant interfaces.
