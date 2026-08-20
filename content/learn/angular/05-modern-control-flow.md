---
title: 'Modern Control Flow (@if, @for, @switch)'
description: 'Master modern built-in control flow in Angular: @if, @else if, @else, @for with mandatory track expressions, @empty blocks, @switch, and performance advantages.'
order: 5
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 35
prerequisites: ['/learn/angular/04-templates']
---

# Modern Control Flow (@if, @for, @switch)

Starting with Angular 17, Angular introduced a revolutionary built-in **Control Flow Syntax** that replaces legacy structural directives (`*ngIf`, `*ngFor`, `*ngSwitch`). Built directly into the Angular template compiler, the new syntax uses clean `@` blocks (`@if`, `@for`, `@switch`) that look and feel like native JavaScript and TypeScript syntax.

Built-in control flow offers massive advantages over legacy structural directives:
1. **Zero Imports Required**: Built-in control flow works natively in all standalone templates without importing `CommonModule` or `NgIf`/`NgFor`.
2. **Superior Performance**: The compiler transforms `@` blocks into optimized low-level instructions, resulting in up to 90% faster runtime execution for list rendering.
3. **Better Type Narrowing**: TypeScript accurately narrows types within `@if` branches and template blocks without awkward `as` expressions.
4. **Mandatory Tracking**: `@for` mandates a `track` expression, completely eliminating common performance bugs caused by forgetting `trackBy`.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Legacy vs Modern Control Flow               │
├──────────────────────────────┬──────────────────────────────┤
│ Legacy Directive Syntax      │ Modern Built-in Syntax       │
├──────────────────────────────┼──────────────────────────────┤
│ <div *ngIf="user; else anon">│ @if (user()) {               │
│   <p>{{ user.name }}</p>     │   <p>{{ user().name }}</p>   │
│ </div>                       │ } @else {                    │
│ <ng-template #anon>...</>    │   <p>Anonymous</p>           │
│                              │ }                            │
├──────────────────────────────┼──────────────────────────────┤
│ <li *ngFor="let item of list;│ @for (item of list();        │
│      trackBy: trackById">    │       track item.id) {       │
│   {{ item.name }}            │   <li>{{ item.name }}</li>   │
│ </li>                        │ } @empty {                   │
│                              │   <p>No items found</p>      │
│                              │ }                            │
└──────────────────────────────┴──────────────────────────────┘
```

## 1. Conditional Rendering with `@if`, `@else if`, and `@else`

The `@if` block conditionally renders a section of the DOM based on a truthy condition. It supports intuitive `@else if` and `@else` branches:

```html
@if (authService.isAuthenticated()) {
  <app-user-dashboard [user]="authService.currentUser()!" />
} @else if (authService.isPending()) {
  <app-loading-spinner message="Authenticating session..." />
} @else {
  <app-login-form (onLogin)="authService.login($event)" />
}
```

### Type Narrowing with `@if`

Angular's template type checker narrows nullable types seamlessly inside `@if` blocks:

```typescript
export interface UserProfile {
  name: string;
  role: 'admin' | 'member';
}

@Component({
  standalone: true,
  template: `
    @if (profile(); as user) {
      <!-- user is typed as UserProfile (not null) -->
      <h2>Welcome back, {{ user.name }}</h2>
      @if (user.role === 'admin') {
        <button>Open Admin Panel</button>
      }
    }
  `
})
export class ProfileComponent {
  readonly profile = signal<UserProfile | null>(null);
}
```

## 2. List Rendering with `@for` and `track`

The `@for` block renders a repeated template for each item in an iterable. In modern Angular, a `track` expression is **mandatory**. The `track` expression tells Angular how to uniquely identify each item in the collection, allowing the DOM renderer to reorder or update existing DOM nodes rather than destroying and recreating the entire list.

```html
<ul class="task-list">
  @for (task of tasks(); track task.id; let idx = $index, let isFirst = $first) {
    <li [class.first-item]="isFirst">
      <span>#{{ idx + 1 }}: {{ task.title }}</span>
      <span class="badge">{{ task.status }}</span>
    </li>
  } @empty {
    <li class="empty-state">
      <p>No tasks scheduled for today. Great job!</p>
    </li>
  }
</ul>
```

### Contextual Variables in `@for`

Inside a `@for` loop, Angular provides several built-in contextual variables:
- `$index`: Index of the current item (0-based).
- `$count`: Total number of items in the iterable.
- `$first`: Boolean indicating if the item is the first in the list.
- `$last`: Boolean indicating if the item is the last in the list.
- `$even`: Boolean indicating if the item index is even.
- `$odd`: Boolean indicating if the item index is odd.

### The `@empty` Block

The `@empty` block renders automatically when the collection is empty (`null`, `undefined`, or array length 0). This removes the need for separate outer `@if (list.length === 0)` conditions.

## 3. Switch Statements with `@switch`, `@case`, and `@default`

The `@switch` block evaluates a value and renders the matching `@case` branch:

```html
<div class="status-indicator">
  @switch (orderStatus()) {
    @case ('pending') {
      <span class="status yellow">Order is awaiting confirmation</span>
    }
    @case ('processing') {
      <span class="status blue">Order is being packaged</span>
    }
    @case ('shipped') {
      <span class="status purple">Order is in transit</span>
    }
    @case ('delivered') {
      <span class="status green">Order has been delivered</span>
    }
    @default {
      <span class="status gray">Unknown order status</span>
    }
  }
</div>
```

## Summary & Key Takeaways

- Angular's modern built-in control flow (`@if`, `@for`, `@switch`) provides a clean, native-feeling syntax with zero module imports.
- Modern control flow executes significantly faster than legacy `*ngIf` and `*ngFor` directives.
- The `track` expression is mandatory in `@for` loops, guaranteeing optimal DOM reuse and rendering efficiency.
- The `@empty` block eliminates boilerplate empty-state checks when iterating over collections.
- Modern `@if` blocks provide robust TypeScript type narrowing directly inside templates.

## Best Practices & Senior Guidance

1. **Always Use Unique Primary Keys for `track`**: Track by a unique entity identifier (e.g. `track item.id` or `track item.uuid`). Avoid `track $index` unless the array is completely static and never reordered or filtered.
2. **Never Use Legacy Structural Directives in New Code**: Migrate all `*ngIf` and `*ngFor` to `@if` and `@for` using the automated CLI migration: `ng generate @angular/core:control-flow`.
3. **Take Advantage of `@empty`**: Always provide an `@empty` block in `@for` loops to ensure graceful empty states without extra DOM wrappers.
