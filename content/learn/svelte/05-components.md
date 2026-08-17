---
title: 'Svelte Component Architecture & Snippets'
description: 'Master component architecture in Svelte 5: props with $props(), modern callback events, Svelte 5 Snippets ({#snippet} / {@render}), children content, and dynamic components.'
order: 5
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 30
prerequisites:
  - /learn/svelte/03-templates
  - /learn/svelte/04-reactivity-and-runes
---

# Svelte Component Architecture & Snippets

Component-driven development is the primary methodology for structuring modern user interfaces. In Svelte, components are self-contained building blocks combining markup, scoped CSS, and TypeScript logic. Svelte 5 introduces **Snippets**—a modern, powerful replacement for legacy slots—that brings unprecedented flexibility to component composition and template parameterization.

In this lesson, we will explore creating and nesting components, passing typed props with `$props()`, handling modern callback events, mastering Svelte 5 Snippets (`{#snippet}` and `{@render}`), accessing component instances with `bind:this`, and rendering dynamic components.

## Creating and Importing Components

To create a component in Svelte, create a new file with the `.svelte` extension. Component filenames should follow **PascalCase** convention (e.g. `UserCard.svelte`, `NavigationMenu.svelte`).

To consume a child component in a parent component, import it at the top of the `<script>` block and use it like a custom HTML tag:

```svelte
<!-- src/lib/StatusBadge.svelte -->
<script lang="ts">
  interface Props {
    status: 'online' | 'busy' | 'offline'
  }
  let { status }: Props = $props()
</script>

<span class="badge badge-{status}">
  {status.toUpperCase()}
</span>

<style>
  .badge { padding: 0.25rem 0.5rem; border-radius: 0.5rem; font-size: 0.75rem; font-weight: bold; }
  .badge-online { background: #dcfce7; color: #15803d; }
  .badge-busy { background: #fee2e2; color: #b91c1c; }
  .badge-offline { background: #f1f5f9; color: #64748b; }
</style>
```

```svelte
<!-- src/App.svelte -->
<script lang="ts">
  import StatusBadge from '$lib/StatusBadge.svelte'
</script>

<main class="container">
  <h1>Team Activity</h1>
  <div class="user-row">
    <span>Hesam Pourabbasian</span>
    <StatusBadge status="online" />
  </div>
</main>
```

## Component Events: Modern Callback Props vs Legacy Dispatchers

In legacy Svelte (v3/v4), components dispatched custom events using `createEventDispatcher()`, and parents listened using `on:eventName`.

In **Svelte 5**, custom event dispatchers have been deprecated in favor of **standard callback props**. Functions are passed directly as props, exactly like standard JavaScript event handlers (`onclick`, `onselect`, `ondelete`):

```svelte
<!-- src/lib/ItemRow.svelte -->
<script lang="ts">
  interface Props {
    title: string
    id: string
    onDelete: (id: string) => void
    onSelect?: (id: string) => void
  }

  let { title, id, onDelete, onSelect }: Props = $props()
</script>

<div class="item-row">
  <span onclick={() => onSelect?.(id)}>{title}</span>
  <button onclick={() => onDelete(id)}>Delete</button>
</div>
```

```svelte
<!-- src/App.svelte -->
<script lang="ts">
  import ItemRow from '$lib/ItemRow.svelte'

  let activeId = $state<string | null>(null)

  function handleDelete(id: string) {
    console.log('Deleting item:', id)
  }
</script>

<ItemRow
  id="prod_1"
  title="Vue 3 & Svelte 5 Masterclass"
  onDelete={handleDelete}
  onSelect={(id) => activeId = id}
/>
```

Callback props are fully type-safe, support IDE parameter autocompletion, and eliminate event dispatch boilerplate.

## Svelte 5 Snippets: The Modern Replacement for Slots

In Svelte 4 and earlier, passing custom template markup into a child component was achieved through `<slot>` and `<slot name="...">`.

In **Svelte 5**, slots are superseded by **Snippets**. A snippet is a first-class, parameterized chunk of template markup declared with `{#snippet name(args)}...{/snippet}` and rendered using `{@render name(args)}`.

Snippets can be defined anywhere in a component, passed as props to child components, and invoked with arguments:

```svelte
<script lang="ts">
  let users = $state(['Alice', 'Bob', 'Charlie'])
</script>

<!-- 1. Declare a reusable local snippet -->
{#snippet userBadge(name: string, role: string)}
  <div class="inline-badge">
    <strong>{name}</strong>
    <span class="role">({role})</span>
  </div>
{/snippet}

<!-- 2. Render the snippet anywhere using {@render} -->
<div class="team-list">
  {@render userBadge('Hesam', 'Architect')}
  {@render userBadge('Sarah', 'Designer')}
</div>
```

## Passing Content with the Default `children` Snippet

When a parent component passes markup between a child component's opening and closing tags (`<Card>Markup here</Card>`), Svelte 5 passes that markup to the child as a prop named **`children`** of type `Snippet`:

```svelte
<!-- src/lib/Card.svelte -->
<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    title: string
    children?: Snippet
  }

  let { title, children }: Props = $props()
</script>

<section class="card">
  <header>
    <h2>{title}</h2>
  </header>
  <div class="content">
    {#if children}
      <!-- Render the passed child markup -->
      {@render children()}
    {:else}
      <p class="text-muted">No content provided.</p>
    {/if}
  </div>
</section>
```

```svelte
<!-- src/App.svelte -->
<script lang="ts">
  import Card from '$lib/Card.svelte'
</script>

<Card title="Front-End Architecture">
  <p>Building high-performance Svelte 5 web applications.</p>
  <button class="btn-primary">Learn More</button>
</Card>
```

## Named Snippet Props for Complex Layouts

For complex components that require multiple customizable regions (such as header, body, footer, and actions), pass named snippets as props:

```svelte
<!-- src/lib/ModalDialog.svelte -->
<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    isOpen: boolean
    onClose: () => void
    header?: Snippet
    children?: Snippet
    footer?: Snippet
  }

  let { isOpen, onClose, header, children, footer }: Props = $props()
</script>

{#if isOpen}
  <div class="modal-backdrop" onclick={onClose}>
    <div class="modal-window" onclick={(e) => e.stopPropagation()}>
      {#if header}
        <header class="modal-header">{@render header()}</header>
      {/if}

      <div class="modal-body">
        {@render children?.()}
      </div>

      {#if footer}
        <footer class="modal-footer">{@render footer()}</footer>
      {/if}
    </div>
  </div>
{/if}
```

```svelte
<!-- Consuming named snippets in parent -->
<script lang="ts">
  import ModalDialog from '$lib/ModalDialog.svelte'
  let isModalOpen = $state(false)
</script>

<ModalDialog isOpen={isModalOpen} onClose={() => isModalOpen = false}>
  {#snippet header()}
    <h3>Confirm Order Deletion</h3>
  {/snippet}

  <p>Are you sure you want to delete this order? This action cannot be undone.</p>

  {#snippet footer()}
    <button onclick={() => isModalOpen = false}>Cancel</button>
    <button class="btn-danger" onclick={() => isModalOpen = false}>Confirm Delete</button>
  {/snippet}
</ModalDialog>
```

## Component Instances and `bind:this`

If you need to programmatically access methods or properties exported from a child component instance, use the `bind:this` directive:

```svelte
<!-- src/lib/AudioPlayer.svelte -->
<script lang="ts">
  let isPlaying = $state(false)

  // Export methods to parent components
  export function play() { isPlaying = true; console.log('Playing...') }
  export function pause() { isPlaying = false; console.log('Paused.') }
</script>

<div>Status: {isPlaying ? 'Playing' : 'Paused'}</div>
```

```svelte
<!-- src/App.svelte -->
<script lang="ts">
  import AudioPlayer from '$lib/AudioPlayer.svelte'
  let playerRef = $state<AudioPlayer | null>(null)
</script>

<AudioPlayer bind:this={playerRef} />
<button onclick={() => playerRef?.play()}>Play via Ref</button>
<button onclick={() => playerRef?.pause()}>Pause via Ref</button>
```

## Dynamic Components in Svelte 5

In Svelte 5, dynamic components can be rendered directly by assigning the component constructor to a variable starting with a capital letter:

```svelte
<script lang="ts">
  import OverviewTab from './OverviewTab.svelte'
  import SettingsTab from './SettingsTab.svelte'
  import BillingTab from './BillingTab.svelte'

  const tabComponents = {
    overview: OverviewTab,
    settings: SettingsTab,
    billing: BillingTab
  }

  let activeTabKey = $state<'overview' | 'settings' | 'billing'>('overview')

  // Derived dynamic component reference
  let ActiveTab = $derived(tabComponents[activeTabKey])
</script>

<div class="tabs">
  <button onclick={() => activeTabKey = 'overview'}>Overview</button>
  <button onclick={() => activeTabKey = 'settings'}>Settings</button>
  <button onclick={() => activeTabKey = 'billing'}>Billing</button>
</div>

<!-- Direct dynamic component rendering in Svelte 5 -->
<ActiveTab />
```

## Best Practices

- **Use Snippets Instead of Slots**: Adopt Svelte 5 `{#snippet}` and `{@render}` for all template composition needs.
- **Pass Callback Props for Events**: Replace `createEventDispatcher` with direct callback props (`onSelect`, `onDelete`) for full TypeScript type-checking.
- **Provide Safe Fallbacks for Optional Snippets**: Always use optional chaining `{@render children?.()}` or `{#if children}` before rendering snippet props.
- **Name Dynamic Component Variables with PascalCase**: In Svelte 5, assign dynamic components to capitalized variables (e.g. `let DynamicView = ...`) to render them directly.

## Summary

Component architecture in Svelte 5 brings together the simplicity of Single File Components with the expressive power of Snippets and typed callback props. By mastering `$props()`, Snippet composition (`{#snippet}` / `{@render}`), component references with `bind:this`, and dynamic component rendering, you can architect robust, modular Svelte application suites.
