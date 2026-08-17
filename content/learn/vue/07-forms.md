---
title: 'Forms & Form Validation'
description: 'Comprehensive guide to form handling in Vue 3: text inputs, checkboxes, radio groups, select dropdowns, form submission, real-time validation, dynamic forms, and v-model modifiers.'
order: 7
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 25
prerequisites:
  - /learn/vue/04-reactivity
  - /learn/vue/05-components
---

# Forms & Form Validation

Forms are the primary medium for gathering user input, handling authentication, capturing configuration settings, and submitting data to backend servers. In Vue.js, two-way data binding via `v-model` simplifies state synchronization between form elements and reactive JavaScript data models.

In this lesson, we will master form bindings across all native HTML controls (text, checkboxes, radio buttons, select dropdowns, textareas), utilize `v-model` modifiers, implement real-time validation algorithms, and construct dynamic schema-driven form generators.

## Basic Input Binding and Modifiers

The `v-model` directive creates two-way data binding on `<input>` elements. By default, `v-model` syncs user input on every keystroke (`input` event).

Vue provides three essential modifiers to refine this behavior:
1. **`.lazy`**: Changes the synchronization trigger from the native `input` event (fires on every character) to the `change` event (fires when the input element loses focus or Enter is pressed).
2. **`.trim`**: Automatically trims leading and trailing whitespace from string inputs.
3. **`.number`**: Automatically casts the input string to a valid float or integer using `parseFloat()`. If the value cannot be parsed, the original string remains.

```vue
<script setup lang="ts">
import { ref } from 'vue'

const fullName = ref('')
const email = ref('')
const age = ref<number | null>(null)
</script>

<template>
  <div class="form-group">
    <!-- .trim removes accidental leading/trailing spaces -->
    <input v-model.trim="fullName" type="text" placeholder="Full Name" />

    <!-- .lazy waits until user finishes typing and blurs input -->
    <input v-model.lazy="email" type="email" placeholder="Email Address" />

    <!-- .number guarantees state holds a numeric type -->
    <input v-model.number="age" type="number" min="0" max="120" placeholder="Age" />
  </div>
</template>
```

## Checkbox: Boolean Flags vs Multi-Select Value Arrays

Checkboxes behave in two distinct modes depending on whether the bound reactive state is a single boolean or an array of values:

### 1. Single Checkbox (Boolean)
When bound to a boolean ref, `v-model` sets `true` when checked and `false` when unchecked.
```vue
<script setup lang="ts">
import { ref } from 'vue'

const agreeToTerms = ref(false)
</script>

<template>
  <label>
    <input v-model="agreeToTerms" type="checkbox" />
    I agree to the Terms of Service
  </label>
</template>
```

### 2. Multiple Checkboxes (Array of Values)
When multiple checkboxes share the same array ref with `v-model`, checking an input appends its `value` attribute to the array; unchecking removes it automatically.
```vue
<script setup lang="ts">
import { ref } from 'vue'

const selectedSkills = ref<string[]>(['vue'])
</script>

<template>
  <div class="skills-selector">
    <label><input v-model="selectedSkills" type="checkbox" value="vue" /> Vue.js</label>
    <label><input v-model="selectedSkills" type="checkbox" value="nuxt" /> Nuxt.js</label>
    <label><input v-model="selectedSkills" type="checkbox" value="typescript" /> TypeScript</label>
    <label><input v-model="selectedSkills" type="checkbox" value="tailwind" /> Tailwind CSS</label>

    <p>Selected: {{ selectedSkills.join(', ') }}</p>
  </div>
</template>
```

## Radio Buttons: Mutually Exclusive Selection

Radio buttons bound to the same `v-model` identifier automatically form a mutually exclusive group. The reactive state receives the `value` of whichever radio input is currently selected.

```vue
<script setup lang="ts">
import { ref } from 'vue'

const subscriptionPlan = ref<'free' | 'pro' | 'enterprise'>('pro')
</script>

<template>
  <div class="plan-picker">
    <label>
      <input v-model="subscriptionPlan" type="radio" value="free" />
      Starter Plan (Free)
    </label>
    <label>
      <input v-model="subscriptionPlan" type="radio" value="pro" />
      Professional ($29/mo)
    </label>
    <label>
      <input v-model="subscriptionPlan" type="radio" value="enterprise" />
      Enterprise ($99/mo)
    </label>
  </div>
</template>
```

## Select Dropdowns and Multi-Selects

Select elements bound via `v-model` cleanly bind to single values or arrays (for `<select multiple>`).

If the initial value of your `v-model` does not match any option, the `<select>` element will render in an "unselected" state. It is recommended to provide a disabled option with an empty value to serve as an explicit placeholder.

```vue
<script setup lang="ts">
import { ref } from 'vue'

const selectedCountry = ref('')
const selectedTags = ref<string[]>([])

const countries = [
  { code: 'US', name: 'United States' },
  { code: 'DE', name: 'Germany' },
  { code: 'CA', name: 'Canada' },
]
</script>

<template>
  <div class="select-group">
    <!-- Single Select Dropdown -->
    <select v-model="selectedCountry">
      <option value="" disabled>Select a country...</option>
      <option v-for="c in countries" :key="c.code" :value="c.code">
        {{ c.name }}
      </option>
    </select>

    <!-- Multi-Select Dropdown -->
    <select v-model="selectedTags" multiple class="h-28">
      <option value="frontend">Frontend</option>
      <option value="backend">Backend</option>
      <option value="devops">DevOps</option>
      <option value="ui-ux">UI/UX Design</option>
    </select>
  </div>
</template>
```

## Multi-Line Text: Textarea

Interpolation inside `<textarea>{{ text }}</textarea>` does not work in Vue. Always use `v-model` instead:

```vue
<script setup lang="ts">
import { ref } from 'vue'

const message = ref('')
</script>

<template>
  <textarea
    v-model.trim="message"
    placeholder="Write your feedback here..."
    rows="4"
  />
</template>
```

## Form Submission and Event Prevention

Standard HTML forms trigger a full browser page reload upon submission. In modern Vue applications, you intercept this default behavior using the `@submit.prevent` event modifier:

```vue
<script setup lang="ts">
import { ref } from 'vue'

const isSubmitting = ref(false)

async function handleSubmit() {
  isSubmitting.value = true
  try {
    // Perform async API POST request
    console.log('Submitting form payload...')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <!-- .prevent calls event.preventDefault() automatically -->
  <form @submit.prevent="handleSubmit">
    <button type="submit" :disabled="isSubmitting">
      {{ isSubmitting ? 'Saving...' : 'Submit Form' }}
    </button>
  </form>
</template>
```

## Reactive Form Validation Architecture

A robust form validation system requires validating fields on user interaction, computing field-level error messages, and tracking overall form validity.

Here is a clean, dependency-free validation pattern using `reactive()` and `computed()`:

```vue
<script setup lang="ts">
import { reactive, computed, ref } from 'vue'

const form = reactive({
  username: '',
  email: '',
  password: '',
})

const touched = reactive({
  username: false,
  email: false,
  password: false,
})

const errors = computed(() => {
  const e: Record<string, string> = {}

  if (!form.username.trim()) {
    e.username = 'Username is required'
  } else if (form.username.length < 3) {
    e.username = 'Username must be at least 3 characters'
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.email.trim()) {
    e.email = 'Email is required'
  } else if (!emailRegex.test(form.email)) {
    e.email = 'Please enter a valid email address'
  }

  if (!form.password) {
    e.password = 'Password is required'
  } else if (form.password.length < 8) {
    e.password = 'Password must be at least 8 characters'
  }

  return e
})

const isFormValid = computed(() => Object.keys(errors.value).length === 0)

function handleBlur(field: 'username' | 'email' | 'password') {
  touched[field] = true
}

function handleRegister() {
  // Mark all as touched on submit attempt
  touched.username = true
  touched.email = true
  touched.password = true

  if (!isFormValid.value) return
  console.log('Form is valid! Sending payload:', form)
}
</script>

<template>
  <form @submit.prevent="handleRegister" class="auth-form">
    <!-- Username Field -->
    <div class="field">
      <label>Username</label>
      <input
        v-model="form.username"
        type="text"
        @blur="handleBlur('username')"
        :class="{ 'input-error': touched.username && errors.username }"
      />
      <span v-if="touched.username && errors.username" class="error-msg">
        {{ errors.username }}
      </span>
    </div>

    <!-- Email Field -->
    <div class="field">
      <label>Email</label>
      <input
        v-model="form.email"
        type="email"
        @blur="handleBlur('email')"
        :class="{ 'input-error': touched.email && errors.email }"
      />
      <span v-if="touched.email && errors.email" class="error-msg">
        {{ errors.email }}
      </span>
    </div>

    <!-- Submit Button -->
    <button type="submit" :disabled="!isFormValid && Object.values(touched).some(Boolean)">
      Create Account
    </button>
  </form>
</template>
```

## Schema-Driven Dynamic Forms

Enterprise applications often render forms dynamically from JSON configuration schemas received from APIs:

```vue
<script setup lang="ts">
import { reactive } from 'vue'

interface FormFieldSchema {
  name: string
  label: string
  type: 'text' | 'email' | 'number' | 'select'
  options?: string[]
}

const schema: FormFieldSchema[] = [
  { name: 'fullName', label: 'Full Name', type: 'text' },
  { name: 'contactEmail', label: 'Contact Email', type: 'email' },
  { name: 'role', label: 'Target Role', type: 'select', options: ['Junior', 'Mid-Level', 'Senior Architect'] },
]

const formData = reactive<Record<string, any>>({
  fullName: '',
  contactEmail: '',
  role: 'Mid-Level',
})
</script>

<template>
  <form class="dynamic-form">
    <div v-for="field in schema" :key="field.name" class="field-item">
      <label>{{ field.label }}</label>
      
      <select v-if="field.type === 'select'" v-model="formData[field.name]">
        <option v-for="opt in field.options" :key="opt" :value="opt">{{ opt }}</option>
      </select>

      <input
        v-else
        v-model="formData[field.name]"
        :type="field.type"
      />
    </div>
  </form>
</template>
```

## Best Practices

- **Always Sanitize and Trim Text**: Use `v-model.trim` for textual inputs to avoid accidental trailing whitespace errors in usernames and email addresses.
- **Track "Touched" State for Validation Errors**: Do not scream red error messages at the user before they have even focused and typed into an input field; only show errors after the field is touched (`@blur`) or upon form submission.
- **Always Pair Labels with Inputs**: Use explicit `<label for="inputId">` or wrap `<label><input /></label>` to ensure optimal accessibility (a11y) for screen readers.
- **Disable Submit Buttons During Loading**: Prevent duplicate submissions by disabling buttons and showing spinner states when requests are in-flight.

## Summary

Handling forms in Vue 3 is clean, predictable, and fully reactive. By leveraging `v-model` across inputs, checkboxes, radio buttons, and select dropdowns, combined with modifiers, computed validation rules, and schema-driven dynamics, you can build enterprise-grade form experiences with minimal overhead.
