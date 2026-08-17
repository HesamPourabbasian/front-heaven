---
title: 'SvelteKit Form Actions & Progressive Enhancement'
description: 'Master SvelteKit Form Actions: server-side actions, fail() error handling, progressive enhancement with use:enhance, custom submission callbacks, and authentication forms.'
order: 12
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 35
prerequisites:
  - /learn/svelte/06-forms
  - /learn/svelte/10-sveltekit
---

# SvelteKit Form Actions & Progressive Enhancement

Form handling is one of SvelteKit's most celebrated engineering features. Instead of requiring complex client-side event handlers, manual `fetch()` endpoints, and custom JSON payload parsing, SvelteKit embraces native HTML form mechanics through **Form Actions**.

Form Actions allow you to write standard HTML `<form method="POST">` elements that work natively **even if JavaScript is completely disabled in the user's browser**. With the addition of the `use:enhance` action, SvelteKit progressively enhances the form, transforming it into a high-speed Single Page Application submission with instant feedback and zero page reloads.

In this lesson, we will explore default and named form actions, returning structured errors with `fail()`, progressive enhancement via `use:enhance`, customizing submission lifecycles, and building a production-grade authentication form.

## What Are Form Actions?

A Form Action is an exported `actions` object inside a `+page.server.ts` file that receives incoming HTTP POST requests triggered by an HTML `<form>`.

Key benefits of SvelteKit Form Actions:
1. **True Progressive Enhancement**: Forms function seamlessly on slow 2G connections or before client JavaScript bundles have finished downloading.
2. **Server-Side Security**: Validation, password hashing, database mutations, and cookie modifications occur strictly on the server.
3. **Automatic Cache Revalidation**: After an action succeeds, SvelteKit automatically re-runs the page's `load()` function to refresh UI data without manual `invalidate()` calls.

## Default vs Named Actions

### 1. Default Form Action
If a page has only one primary form (e.g. a feedback submission page), declare a `default` action:

```typescript
// src/routes/feedback/+page.server.ts
import type { Actions } from './$types'
import { fail } from '@sveltejs/kit'

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData()
    const message = formData.get('message')?.toString()
    const email = formData.get('email')?.toString()

    if (!message || message.length < 10) {
      return fail(400, {
        error: 'Message must be at least 10 characters long.',
        email,
      })
    }

    // Save feedback to database...
    return { success: true }
  }
}
```

### 2. Named Form Actions
If a single page contains multiple distinct forms (e.g. Login vs Register, or Add Comment vs Delete Post), export named actions and specify the action target in the form's `action` attribute (`action="?/actionName"`):

```typescript
// src/routes/auth/+page.server.ts
import type { Actions } from './$types'
import { fail, redirect } from '@sveltejs/kit'

export const actions: Actions = {
  login: async ({ request, cookies }) => {
    const data = await request.formData()
    const email = data.get('email')?.toString()
    const password = data.get('password')?.toString()

    if (!email || !password) {
      return fail(400, { email, loginError: 'Email and password are required.' })
    }

    // Authenticate user against database...
    cookies.set('session_id', 'sess_xyz123', {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    })

    throw redirect(303, '/dashboard')
  },

  register: async ({ request }) => {
    const data = await request.formData()
    const email = data.get('email')?.toString()
    const password = data.get('password')?.toString()

    if (password && password.length < 8) {
      return fail(400, { email, registerError: 'Password must be at least 8 characters.' })
    }

    // Register user...
    return { registerSuccess: true }
  }
}
```

In your Svelte 5 component, point forms to the respective named action:

```svelte
<!-- src/routes/auth/+page.svelte -->
<script lang="ts">
  import type { PageProps } from './$types'
  import { enhance } from '$app/forms'

  let { form }: PageProps = $props()
</script>

<div class="auth-tabs">
  <!-- Target login action using action="?/login" -->
  <form method="POST" action="?/login" use:enhance class="auth-box">
    <h2>Log In</h2>
    {#if form?.loginError}
      <p class="error-banner">{form.loginError}</p>
    {/if}
    <input name="email" type="email" placeholder="Email" value={form?.email ?? ''} required />
    <input name="password" type="password" placeholder="Password" required />
    <button type="submit">Sign In</button>
  </form>

  <!-- Target register action using action="?/register" -->
  <form method="POST" action="?/register" use:enhance class="auth-box">
    <h2>Create Account</h2>
    {#if form?.registerError}
      <p class="error-banner">{form.registerError}</p>
    {/if}
    <input name="email" type="email" placeholder="Email" value={form?.email ?? ''} required />
    <input name="password" type="password" placeholder="Password (8+ chars)" required />
    <button type="submit">Register</button>
  </form>
</div>
```

## Returning Errors with `fail()` and Consuming `form` Prop

When validation fails on the server, never return a raw error object without `fail()`. The **`fail(statusCode, data)`** helper sets the proper HTTP status code (e.g. `400 Bad Request` or `422 Unprocessable Entity`) and passes the validation payload back to the page.

In Svelte 5, the returned action payload is passed to the component via the **`form`** prop (`let { form } = $props()`):

```svelte
{#if form?.error}
  <div class="error-alert">
    <span>⚠️ {form.error}</span>
  </div>
{/if}

{#if form?.success}
  <div class="success-alert">
    <span>✓ Your submission was successfully processed!</span>
  </div>
{/if}
```

## Progressive Enhancement with `use:enhance`

Adding the **`use:enhance`** action from `$app/forms` instructs SvelteKit to intercept the form submission via client-side JavaScript:
- It cancels the full browser page reload.
- Sends the `FormData` asynchronously via `fetch`.
- Automatically updates the `form` prop and revalidates page data.
- Handles redirects and resets the form on success.

### Customizing the `use:enhance` Lifecycle
You can pass a callback function to `use:enhance` to display optimistic UI, manage loading states, or handle custom confirmation dialogs:

```svelte
<script lang="ts">
  import { enhance } from '$app/forms'

  let isSubmitting = $state(false)
</script>

<form
  method="POST"
  use:enhance={({ formElement, formData, action, cancel }) => {
    // 1. Before submission: runs immediately when user clicks submit
    isSubmitting = true

    // Optionally cancel submission if client-side check fails:
    // if (!confirm('Submit form?')) cancel()

    return async ({ result, update }) => {
      // 2. After server responds:
      isSubmitting = false

      if (result.type === 'success') {
        console.log('Submission succeeded!')
      }

      // 3. Applies default SvelteKit behavior (revalidation & form prop updates)
      await update()
    }
  }}
>
  <textarea name="feedback" required placeholder="Your feedback..."></textarea>
  <button type="submit" disabled={isSubmitting}>
    {isSubmitting ? 'Saving...' : 'Submit Feedback'}
  </button>
</form>
```

## Best Practices

- **Always Validate Data on the Server**: Client validation improves user experience, but server validation in `+page.server.ts` guarantees security.
- **Use `fail()` for Validation Failures**: Return validation errors with `fail(400, { error, fields })` so HTTP status codes remain semantically accurate.
- **Preserve User Inputs in `fail()` Payloads**: Return previous input values in `fail(400, { values })` so users don't have to retype everything if an error occurs.
- **Always Add `use:enhance` for SPA Speed**: Add `use:enhance` to forms to provide snappy, zero-reload interactions while maintaining full progressive enhancement fallbacks.

## Summary

SvelteKit Form Actions represent the ideal blend of resilient web fundamentals and modern reactive ergonomics. By declaring server actions in `+page.server.ts`, reporting errors with `fail()`, enhancing forms with `use:enhance`, and consuming reactive results via the Svelte 5 `form` prop, you can build accessible, full-stack form workflows with complete confidence.
