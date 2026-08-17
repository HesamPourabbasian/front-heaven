---
title: 'Advanced Svelte Components & Special Elements'
description: 'Master advanced Svelte component composition: parameterized Snippets, Context API (setContext/getContext), dynamic components, and special elements (<svelte:window>, <svelte:head>, <svelte:body>).'
order: 8
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 35
prerequisites:
  - /learn/svelte/04-reactivity-and-runes
  - /learn/svelte/05-components
---

# Advanced Svelte Components & Special Elements

As your frontend applications grow in complexity, organizing components into clean, loosely coupled architectures becomes crucial. Svelte provides an extraordinary suite of advanced component composition tools: first-class parameterized Snippets with `{@render}`, dependency injection via the Context API (`setContext` / `getContext`), dynamic component constructors, and declarative meta-elements (`<svelte:window>`, `<svelte:document>`, `<svelte:body>`, `<svelte:head>`).

In this lesson, we will explore advanced component patterns in Svelte 5, establish cross-component communication with the Context API, handle global browser window events declaratively, manipulate the document `<head>`, and build flexible compound component systems.

## Advanced Snippet Composition & Parameterization

In Svelte 5, Snippets (`{#snippet ...}`) are not merely passive template slots—they are first-class, callable template functions that can accept arguments, return markup, and be passed down through deeply nested component hierarchies.

Consider a generic, reusable data table component:

```svelte
<!-- src/lib/DataTable.svelte -->
<script lang="ts" generics="T extends { id: string | number }">
  import type { Snippet } from 'svelte'

  interface Props {
    items: T[]
    header?: Snippet
    row: Snippet<[item: T, index: number]>
    empty?: Snippet
  }

  let { items, header, row, empty }: Props = $props()
</script>

<div class="table-container">
  <table>
    {#if header}
      <thead>
        <tr>{@render header()}</tr>
      </thead>
    {/if}
    <tbody>
      {#each items as item, index (item.id)}
        <tr>
          <!-- Render snippet with arguments passed to the parent -->
          {@render row(item, index)}
        </tr>
      {:else}
        {#if empty}
          <tr><td colspan="100%">{@render empty()}</td></tr>
        {:else}
          <tr><td colspan="100%">No records found.</td></tr>
        {/if}
      {/each}
    </tbody>
  </table>
</div>
```

The consuming parent component supplies the custom row snippet with full type safety:

```svelte
<!-- src/App.svelte -->
<script lang="ts">
  import DataTable from '$lib/DataTable.svelte'

  interface User {
    id: string
    name: string
    email: string
    role: string
  }

  let users = $state<User[]>([
    { id: 'u1', name: 'Hesam', email: 'hesam@dev.com', role: 'Architect' },
    { id: 'u2', name: 'Sarah', email: 'sarah@dev.com', role: 'Lead UI' },
  ])
</script>

<DataTable items={users}>
  {#snippet header()}
    <th>#</th>
    <th>Name</th>
    <th>Email</th>
    <th>Role</th>
    <th>Actions</th>
  {/snippet}

  {#snippet row(user, idx)}
    <td>{idx + 1}</td>
    <td><strong>{user.name}</strong></td>
    <td>{user.email}</td>
    <td><span class="role-badge">{user.role}</span></td>
    <td><button onclick={() => console.log('Edit', user.id)}>Edit</button></td>
  {/snippet}
</DataTable>
```

## The Context API: `setContext()` and `getContext()`

When deeply nested child components need access to state or methods owned by an ancestor component, passing props through every intermediate component (**prop drilling**) becomes unmaintainable.

Svelte's **Context API** allows an ancestor component to provide data to its entire subtree using `setContext()`, which any descendant can access using `getContext()`:

```typescript
// Context keys should be unique Symbols for collision prevention
export const ACCORDION_KEY = Symbol('ACCORDION_KEY')

export interface AccordionContext {
  activeId: () => string | null
  setActiveId: (id: string) => void
}
```

```svelte
<!-- src/lib/Accordion.svelte (Parent) -->
<script lang="ts">
  import { setContext, type Snippet } from 'svelte'
  import { ACCORDION_KEY, type AccordionContext } from './accordionTypes'

  let { children }: { children?: Snippet } = $props()
  let activeId = $state<string | null>(null)

  // Provide reactive context to all descendants
  setContext<AccordionContext>(ACCORDION_KEY, {
    activeId: () => activeId,
    setActiveId: (id) => activeId = (activeId === id ? null : id)
  })
</script>

<div class="accordion-group">
  {@render children?.()}
</div>
```

```svelte
<!-- src/lib/AccordionItem.svelte (Deeply nested descendant) -->
<script lang="ts">
  import { getContext, type Snippet } from 'svelte'
  import { ACCORDION_KEY, type AccordionContext } from './accordionTypes'

  interface Props {
    id: string
    title: string
    children?: Snippet
  }

  let { id, title, children }: Props = $props()

  // Retrieve context from ancestor
  const accordion = getContext<AccordionContext>(ACCORDION_KEY)
  let isOpen = $derived(accordion.activeId() === id)
</script>

<div class="accordion-item" class:open={isOpen}>
  <button class="accordion-header" onclick={() => accordion.setActiveId(id)}>
    <span>{title}</span>
    <span>{isOpen ? '▲' : '▼'}</span>
  </button>

  {#if isOpen}
    <div class="accordion-body">
      {@render children?.()}
    </div>
  {/if}
</div>
```

Context is isolated strictly to the component subtree and does not leak globally across independent component instances.

## Declarative Window Events with `<svelte:window>`

Attaching global browser event listeners (like keyboard shortcuts, window resizing, or page scroll positions) in vanilla JavaScript requires manual `window.addEventListener` and teardown in `window.removeEventListener`.

Svelte provides the **`<svelte:window>`** special element, allowing you to bind window events and dimensions declaratively directly inside your template:

```svelte
<script lang="ts">
  let innerWidth = $state(0)
  let innerHeight = $state(0)
  let scrollY = $state(0)

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      console.log('Escape pressed globally!')
    }
  }
</script>

<!-- Declarative window event bindings with automatic cleanup on unmount -->
<svelte:window
  bind:innerWidth={innerWidth}
  bind:innerHeight={innerHeight}
  bind:scrollY={scrollY}
  onkeydown={handleKeyDown}
/>

<div class="telemetry-bar">
  <span>Viewport: {innerWidth}x{innerHeight}px</span>
  <span>Scroll Y: {Math.round(scrollY)}px</span>
</div>
```

## Document and Body Bindings: `<svelte:document>` and `<svelte:body>`

- **`<svelte:document>`**: Binds events to the global `document` object (e.g. `onvisibilitychange`, `onselectionchange`).
- **`<svelte:body>`**: Binds events directly to the HTML `<body>` element (e.g. `onmouseenter`, `onmouseleave` for detecting when a user's cursor leaves the webpage).

```svelte
<script lang="ts">
  let isPageVisible = $state(true)

  function handleVisibility() {
    isPageVisible = document.visibilityState === 'visible'
  }
</script>

<svelte:document onvisibilitychange={handleVisibility} />
```

## Managing Document Metadata with `<svelte:head>`

The **`<svelte:head>`** element lets components inject metadata, title tags, link stylesheets, and Open Graph tags directly into the document's `<head>` section:

```svelte
<script lang="ts">
  interface Props {
    title: string
    description: string
  }
  let { title, description }: Props = $props()
</script>

<svelte:head>
  <title>{title} — Front-Heaven</title>
  <meta name="description" content={description} />
  <meta property="og:title" content={title} />
  <link rel="canonical" href="https://front-heaven.dev" />
</svelte:head>
```

When the component mounts, Svelte adds these elements to `<head>`, and removes them cleanly when the component unmounts.

## Best Practices

- **Use Unique Symbols for Context Keys**: Prevent key collisions by defining context keys with `Symbol('KEY_NAME')`.
- **Pass Snippets for Flexible UI Slots**: Use Svelte 5 Snippets (`row: Snippet<[item: T]>`) for powerful, parameter-driven layout customization.
- **Leverage `<svelte:window>` for Global Listeners**: Let Svelte manage window event listeners and dimension bindings declaratively to eliminate memory leaks.
- **Encapsulate Compound Components**: Pair parent containers and child widgets (e.g. `Tabs` + `TabItem`) using the Context API for cohesive component systems.

## Summary

Advanced component architecture in Svelte empowers you to build sophisticated design systems and compound component ecosystems. By mastering parameterized Snippets, dependency injection with `setContext`/`getContext`, declarative `<svelte:window>` bindings, and `<svelte:head>` metadata injection, you can engineer flexible, production-ready frontend architectures.
