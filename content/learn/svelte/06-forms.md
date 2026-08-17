---
title: 'Svelte Forms & Two-Way Input Bindings'
description: 'Master form handling in Svelte: bind:value, bind:checked, bind:group, numeric coercion, client-side validation, touched states, and custom form components with $bindable.'
order: 6
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 30
prerequisites:
  - /learn/svelte/04-reactivity-and-runes
  - /learn/svelte/05-components
---

# Svelte Forms & Two-Way Input Bindings

Form handling is a cornerstone of web development. Whether you are capturing user registrations, processing multi-step checkouts, filtering product catalogs, or collecting telemetry settings, web applications require seamless synchronization between interactive HTML form elements and reactive application state.

Svelte provides an elegant suite of two-way binding directives—such as `bind:value`, `bind:checked`, and `bind:group`—that eliminate manual event handling boilerplate while providing automatic numeric type coercion, group selection arrays, and effortless custom component bindings.

In this lesson, we will explore text and number bindings, checkboxes, radio groups, multi-select dropdowns, form validation algorithms, touched state tracking, and building reusable form inputs using Svelte 5 `$bindable()`.

## Two-Way Text and Number Input Bindings: `bind:value`

In traditional vanilla JavaScript, synchronizing an input with state requires setting the `value` property and listening for the `input` event:
```html
<input value={username} oninput={(e) => username = e.target.value} />
```

In Svelte, the **`bind:value`** directive establishes instantaneous two-way data synchronization between the HTML input element and your reactive state variable:

```svelte
<script lang="ts">
  let email = $state('developer@front-heaven.dev')
  let age = $state(28)
</script>

<div class="form-group">
  <label for="email">Email Address</label>
  <input id="email" type="email" bind:value={email} />

  <label for="age">Age</label>
  <!-- Svelte automatically coerces type="number" inputs into JavaScript numbers! -->
  <input id="age" type="number" min="18" max="100" bind:value={age} />
</div>

<p class="preview">Bound Email: {email} | Type of Age: {typeof age} ({age})</p>
```

### Automatic Numeric Coercion
In standard HTML inputs, the DOM `value` is always a string—even on `<input type="number">` and `<input type="range">`. Svelte automatically parses numeric input values into native JavaScript numbers, preventing subtle string concatenation bugs like `"25" + 5 = "255"`.

## Checkboxes: `bind:checked` and `bind:group`

### 1. Single Boolean Checkboxes (`bind:checked`)
For standalone toggle checkboxes (like terms agreements or dark mode toggles), bind to the `checked` attribute:

```svelte
<script lang="ts">
  let acceptTerms = $state(false)
</script>

<label class="checkbox-row">
  <input type="checkbox" bind:checked={acceptTerms} />
  <span>I agree to the Terms of Service and Privacy Policy</span>
</label>

<button disabled={!acceptTerms}>Continue Registration</button>
```

### 2. Multi-Value Checkbox Arrays (`bind:group`)
When you have a group of checkboxes sharing the same category and want to capture selected values into an array, use the **`bind:group`** directive:

```svelte
<script lang="ts">
  let selectedSkills = $state<string[]>(['svelte'])
  const availableSkills = ['svelte', 'vue', 'react', 'typescript', 'tailwind']
</script>

<fieldset class="skills-group">
  <legend>Select Frameworks & Technologies</legend>
  {#each availableSkills as skill}
    <label class="skill-item">
      <input
        type="checkbox"
        value={skill}
        bind:group={selectedSkills}
      />
      <span>{skill.toUpperCase()}</span>
    </label>
  {/each}
</fieldset>

<p>Selected ({selectedSkills.length}): {selectedSkills.join(', ')}</p>
```

Svelte automatically adds or removes values from the `selectedSkills` array as users toggle individual checkboxes.

## Radio Buttons with `bind:group`

For mutually exclusive option selections, attach `bind:group` to multiple radio inputs. Svelte synchronizes the selected radio's `value` directly into your state variable:

```svelte
<script lang="ts">
  type PlanType = 'starter' | 'pro' | 'enterprise'
  let selectedPlan = $state<PlanType>('pro')
</script>

<div class="pricing-selector">
  <label class="plan-card" class:active={selectedPlan === 'starter'}>
    <input type="radio" value="starter" bind:group={selectedPlan} />
    <strong>Starter ($0/mo)</strong>
  </label>

  <label class="plan-card" class:active={selectedPlan === 'pro'}>
    <input type="radio" value="pro" bind:group={selectedPlan} />
    <strong>Pro Tier ($29/mo)</strong>
  </label>

  <label class="plan-card" class:active={selectedPlan === 'enterprise'}>
    <input type="radio" value="enterprise" bind:group={selectedPlan} />
    <strong>Enterprise (Custom)</strong>
  </label>
</div>
```

## Select Dropdowns and Multi-Selects

Select elements bind their active selection with `bind:value`:

```svelte
<script lang="ts">
  interface Country {
    code: string
    name: string
  }

  const countries: Country[] = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'DE', name: 'Germany' },
    { code: 'GB', name: 'United Kingdom' },
  ]

  let selectedCountryCode = $state('DE')
  let selectedTags = $state<string[]>(['frontend'])
</script>

<!-- Single Select -->
<select bind:value={selectedCountryCode}>
  {#each countries as country}
    <option value={country.code}>{country.name}</option>
  {/each}
</select>

<!-- Multiple Select -->
<select multiple bind:value={selectedTags}>
  <option value="frontend">Frontend</option>
  <option value="backend">Backend</option>
  <option value="devops">DevOps</option>
</select>
```

You can even bind rich objects directly to `<option value={countryObject}>`—Svelte handles object reference matching automatically!

## Textareas

Textareas in Svelte use `bind:value` rather than placing content between opening and closing `<textarea>` tags:

```svelte
<script lang="ts">
  let bio = $state('Full-stack engineer passionate about Svelte 5 and web performance.')
  let characterLimit = 200
  let charactersRemaining = $derived(characterLimit - bio.length)
</script>

<textarea bind:value={bio} maxlength={characterLimit} rows="4"></textarea>
<span class="counter" class:text-red-500={charactersRemaining < 20}>
  {charactersRemaining} characters remaining
</span>
```

## Form Submission and Client-Side Validation

A robust form validation architecture tracks three key states:
1. **Form Values**: The reactive data payload.
2. **Touched Fields**: Tracks which inputs the user has focused and blurred to avoid displaying error messages prematurely before the user finishes typing.
3. **Derived Validation Errors**: Pure computations evaluating validity rules.

```svelte
<script lang="ts">
  let email = $state('')
  let password = $state('')
  let isSubmitted = $state(false)
  let touched = $state({ email: false, password: false })

  // Derived error calculations
  let emailError = $derived.by(() => {
    if (!touched.email && !isSubmitted) return ''
    if (!email) return 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address'
    return ''
  })

  let passwordError = $derived.by(() => {
    if (!touched.password && !isSubmitted) return ''
    if (!password) return 'Password is required'
    if (password.length < 8) return 'Password must be at least 8 characters long'
    return ''
  })

  let isFormValid = $derived(!emailError && !passwordError && email && password)

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault()
    isSubmitted = true

    if (!isFormValid) return

    console.log('Submitting login payload:', { email, password })
    alert('Login successful!')
  }
</script>

<form onsubmit={handleSubmit} class="auth-form" novalidate>
  <h2>Account Sign In</h2>

  <div class="field">
    <label for="user-email">Email</label>
    <input
      id="user-email"
      type="email"
      bind:value={email}
      onblur={() => touched.email = true}
      class:error={Boolean(emailError)}
    />
    {#if emailError}
      <span class="error-msg">{emailError}</span>
    {/if}
  </div>

  <div class="field">
    <label for="user-pass">Password</label>
    <input
      id="user-pass"
      type="password"
      bind:value={password}
      onblur={() => touched.password = true}
      class:error={Boolean(passwordError)}
    />
    {#if passwordError}
      <span class="error-msg">{passwordError}</span>
    {/if}
  </div>

  <button type="submit" disabled={!isFormValid && isSubmitted}>Sign In</button>
</form>
```

## Creating Custom Reusable Form Components with `$bindable()`

To create custom form controls (e.g. `<CustomTextInput>`, `<ToggleSlider>`, `<RatingStars>`) that support `bind:value` from parent components, declare the prop using `$bindable()` in Svelte 5:

```svelte
<!-- src/lib/FormInput.svelte -->
<script lang="ts">
  interface Props {
    value?: string
    label: string
    type?: string
    placeholder?: string
    error?: string
  }

  let {
    value = $bindable(''),
    label,
    type = 'text',
    placeholder = '',
    error = ''
  }: Props = $props()
</script>

<div class="custom-field">
  <label>{label}</label>
  <input
    {type}
    {placeholder}
    bind:value={value}
    class:has-error={Boolean(error)}
  />
  {#if error}
    <span class="error-text">{error}</span>
  {/if}
</div>
```

```svelte
<!-- Parent component consuming FormInput -->
<script lang="ts">
  import FormInput from '$lib/FormInput.svelte'
  let username = $state('')
</script>

<!-- Two-way binding works seamlessly! -->
<FormInput label="Username" placeholder="e.g. hesam_dev" bind:value={username} />
<p>Current username: {username}</p>
```

## Best Practices

- **Use `bind:group` for Checkboxes & Radios**: Keep multi-choice options synchronized cleanly with array state variables.
- **Track Touched State Before Displaying Errors**: Prevent frustrating user experience by displaying validation error messages only after an input is blurred (`onblur`) or submitted.
- **Use `novalidate` on Forms with Custom Validation**: Prevent browser default tooltip popups from conflicting with your custom UI error states.
- **Declare Two-Way Props with `$bindable()`**: Use Svelte 5 `$bindable()` in design system input primitives for seamless two-way parent integration.

## Summary

Form handling in Svelte combines the speed of native HTML attributes with the power of two-way reactive directives. By utilizing `bind:value` with automatic numeric parsing, `bind:group` for collections, derived validation computations, and custom `$bindable()` inputs, you can build accessible, resilient form systems with minimal code.
