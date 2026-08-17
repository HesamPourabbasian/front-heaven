---
title: 'Svelte Template Syntax & Control Flow'
description: 'Master Svelte template syntax: dynamic expressions, attribute/class/style directives, event handlers, and control flow blocks ({#if}, {#each}, {#key}, and {#await}).'
order: 3
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 25
prerequisites:
  - /learn/svelte/02-svelte-fundamentals
---

# Svelte Template Syntax & Control Flow

Svelte's template language is an extension of standard HTML. You can write regular HTML markup, and whenever you need dynamic JavaScript values, conditions, loops, or asynchronous handling, you use Svelte's intuitive curly brace `{...}` expressions and block tags (`{#if}`, `{#each}`, `{#key}`, `{#await}`).

In this lesson, we will explore Svelte's template syntax in depth: from dynamic text interpolation and shorthand attribute bindings to class directives, modern Svelte 5 event handlers, loop keying, and asynchronous promise rendering.

## Text Interpolation and JavaScript Expressions

Any valid JavaScript expression can be embedded inside single curly braces `{...}` in a Svelte template. The expression will be evaluated and converted to a text node in the DOM.

Svelte automatically updates the text in the real DOM whenever any reactive variables used in the expression change.

```svelte
<script lang="ts">
  let user = $state({ firstName: 'Hesam', lastName: 'Pourabbasian' })
  let score = $state(92)
</script>

<div class="user-banner">
  <h1>Welcome, {user.firstName} {user.lastName.toUpperCase()}!</h1>
  <p>Status: {score >= 90 ? 'Grade A (Distinction)' : 'Passing'}</p>
</div>
```

Unlike some template languages that require complex filter pipes, Svelte supports any standard JavaScript methods (`.toUpperCase()`, `.toFixed()`, ternary operators, and arithmetic operations) directly inside `{...}`.

## Attribute Bindings and Shorthand Syntax

Dynamic HTML attributes use curly braces instead of quotes:

```svelte
<script lang="ts">
  let avatarUrl = $state('/images/avatar.png')
  let altText = $state('User Profile Photo')
  let isSubmitDisabled = $state(true)
</script>

<!-- Full syntax -->
<img src={avatarUrl} alt={altText} />
<button disabled={isSubmitDisabled}>Submit</button>
```

### Attribute Shorthand
When the attribute name matches the variable name, Svelte allows you to write `{src}` instead of `src={src}`:

```svelte
<script lang="ts">
  let src = $state('/images/hero.webp')
  let alt = $state('Frontend Hero Artwork')
  let id = $state('main-content-banner')
</script>

<!-- Clean shorthand syntax -->
<img {src} {alt} {id} />
```

## Class and Style Directives

Managing dynamic CSS classes and inline styles is streamlined in Svelte using specialized directives:

### 1. The `class:` Directive
The `class:className={condition}` directive toggles a CSS class on an element based on a boolean expression:

```svelte
<script lang="ts">
  let isActive = $state(true)
  let hasError = $state(false)
</script>

<!-- Adds 'active' when isActive is true, 'is-invalid' when hasError is true -->
<button
  class="btn"
  class:active={isActive}
  class:is-invalid={hasError}
>
  Action
</button>
```

If the class name matches the variable name, you can write `class:active` as a shorthand for `class:active={active}`.

### 2. The `style:` Directive
The `style:property={value}` directive sets dynamic inline style properties directly:

```svelte
<script lang="ts">
  let themeColor = $state('#f97316')
  let fontSizePx = $state(18)
</script>

<p
  style:color={themeColor}
  style:font-size="{fontSizePx}px"
  style:--dynamic-shadow-color={themeColor}
>
  Styled dynamic typography with CSS variables.
</p>
```

## Event Handlers in Svelte 5

In Svelte 5, event handlers use standard HTML attribute naming conventions (`onclick`, `onkeydown`, `oninput`, `onmouseenter`) rather than the legacy `on:click` syntax.

Handlers accept inline arrow functions or function references:

```svelte
<script lang="ts">
  let count = $state(0)

  function handleIncrement(e: MouseEvent) {
    count++
  }
</script>

<div class="controls">
  <!-- Named function reference -->
  <button onclick={handleIncrement}>Increment</button>

  <!-- Inline arrow function -->
  <button onclick={() => count = 0}>Reset</button>

  <!-- Accessing event object -->
  <input onkeydown={(e) => {
    if (e.key === 'Enter') console.log('Enter pressed!')
  }} />
</div>
```

## Conditional Rendering: `{#if}`, `{:else if}`, and `{:else}`

Svelte manages conditional markup using `{#if}` blocks. The block starts with `#if`, intermediate conditions use `{:else if}`, the fallback uses `{:else}`, and the block closes with `{/if}`.

```svelte
<script lang="ts">
  type AuthStatus = 'loading' | 'authenticated' | 'anonymous'
  let status = $state<AuthStatus>('authenticated')
</script>

<div class="auth-box">
  {#if status === 'loading'}
    <div class="spinner">Verifying credentials...</div>
  {:else if status === 'authenticated'}
    <div class="welcome">
      <h3>Welcome to your dashboard!</h3>
      <button onclick={() => status = 'anonymous'}>Log Out</button>
    </div>
  {:else}
    <div class="login-prompt">
      <p>Please sign in to view your learning progress.</p>
      <button onclick={() => status = 'authenticated'}>Sign In</button>
    </div>
  {/if}
</div>
```

## List Rendering: `{#each}` and Mandatory Keys

To iterate over an array or iterable, use an `{#each}` block: `{#each items as item, index (key)}`.

### Keyed `{#each}` Blocks (Essential for Performance)
Always provide a unique, stable key expression in parentheses: `(item.id)`. Keying allows Svelte's compiler to precisely track items when the list is sorted, filtered, or mutated, updating only the affected DOM nodes rather than recreating the list.

```svelte
<script lang="ts">
  interface LessonItem {
    id: string
    title: string
    durationMins: number
  }

  let lessons = $state<LessonItem[]>([
    { id: 'l1', title: 'Svelte 5 Runes', durationMins: 20 },
    { id: 'l2', title: 'Template Blocks', durationMins: 15 },
    { id: 'l3', title: 'Component Snippets', durationMins: 25 },
  ])
</script>

<ul class="lesson-list">
  <!-- Keyed each block using (lesson.id) -->
  {#each lessons as lesson, index (lesson.id)}
    <li class="lesson-row">
      <span class="index">#{index + 1}</span>
      <strong>{lesson.title}</strong>
      <span class="duration">({lesson.durationMins}m)</span>
    </li>
  {:else}
    <!-- Empty list fallback -->
    <li class="empty-state">No lessons found in this track.</li>
  {/each}
</ul>
```

The `{:else}` branch inside an `{#each}` block renders automatically when the array is empty (`lessons.length === 0`).

## The `{#key}` Block: Forcing Component Re-initialization

Sometimes you want a component or DOM element to be completely destroyed and recreated from scratch whenever a specific variable changes (e.g. re-triggering a CSS enter animation, resetting local child state, or reloading a charting instance).

The `{#key expression}` block watches the expression and completely reconstructs its contents when the expression value changes:

```svelte
<script lang="ts">
  let pageId = $state(1)
</script>

<button onclick={() => pageId++}>Next Chapter</button>

<!-- Whenever pageId changes, ArticleContent is unmounted and remounted with fresh animations -->
{#key pageId}
  <article class="animate-fade-in">
    <h2>Chapter {pageId}</h2>
    <p>Loaded fresh chapter content.</p>
  </article>
{/key}
```

## Asynchronous Promise Handling with `{#await}`

Svelte allows you to handle JavaScript Promises directly in the template markup using `{#await}` blocks, eliminating the need to manually manage `isLoading`, `data`, and `error` boolean variables:

```svelte
<script lang="ts">
  interface UserProfile {
    id: number
    name: string
    role: string
  }

  async function fetchUser(): Promise<UserProfile> {
    const res = await fetch('https://api.example.com/user/current')
    if (!res.ok) throw new Error('Could not load user profile')
    return res.json()
  }

  let userPromise = $state(fetchUser())

  function reload() {
    userPromise = fetchUser()
  }
</script>

<div class="user-container">
  <button onclick={reload}>Reload User Data</button>

  {#await userPromise}
    <!-- 1. Pending / Loading State -->
    <div class="loading-box">
      <span class="spinner"></span> Loading profile...
    </div>
  {:then user}
    <!-- 2. Resolved / Success State -->
    <div class="profile-card">
      <h3>{user.name}</h3>
      <span class="role-badge">{user.role}</span>
    </div>
  {:catch error}
    <!-- 3. Rejected / Error State -->
    <div class="error-box">
      <p class="text-red-500">Error: {error.message}</p>
      <button onclick={reload}>Retry</button>
    </div>
  {/await}
</div>
```

## Best Practices

- **Always Key `{#each}` Blocks**: Provide a unique ID `{#each list as item (item.id)}` to maintain element identity and prevent subtle DOM state bugs.
- **Use Class Directives Over String Interpolation**: Use `class:active={isActive}` rather than error-prone template string concatenation `class="btn ${isActive ? 'active' : ''}"`.
- **Leverage `{#await}` for Simple Async Operations**: Avoid creating boilerplate `loading = true` and `error = null` flags when an `{#await}` block handles promise states declaratively.
- **Use `{#key}` for Animation Re-triggers**: Wrap animating components in `{#key triggerValue}` to smoothly restart CSS transitions upon state updates.

## Summary

Svelte's template syntax combines the familiarity of HTML with powerful declarative control flow structures. By mastering attribute shorthands, class directives, Svelte 5 event handlers, `{#if}` branches, keyed `{#each}` iterations, `{#key}` resets, and `{#await}` promise rendering, you possess the full toolkit needed to construct dynamic, expressive web interfaces.
