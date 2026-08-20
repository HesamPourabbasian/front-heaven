---
title: 'Component Communication & Data Flow'
description: 'Master communication between Angular components: signal inputs (input, input.required), output events (output()), model inputs for two-way binding, and shared state patterns.'
order: 7
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 35
prerequisites: ['/learn/angular/06-signals']
---

# Component Communication & Data Flow

Modern web applications are constructed as hierarchical trees of components. For an application to function coherently, components must exchange data and trigger actions across parent-child and sibling relationships. Angular provides a clean, predictable, and strictly typed communication architecture based on unidirectional data flow: **Data flows down via inputs, and events flow up via outputs.**

In modern Angular (v17.2+), component communication has been modernized with Signal-based communication primitives: `input()`, `input.required()`, `output()`, and `model()`. These modern functions replace the legacy `@Input()` and `@Output()` decorators with cleaner, type-safe, signal-integrated syntax.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Component Data Flow Architecture            │
│                                                             │
│                  ┌───────────────────────┐                  │
│                  │   Parent Component    │                  │
│                  └───────────────────────┘                  │
│                     │                 ▲                     │
│    Data Down        │                 │  Events Up          │
│    [user]="user()"  │                 │  (delete)="onDel()" │
│    [role]="'admin'" │                 │  (save)="onSave()"  │
│                     ▼                 │                     │
│                  ┌───────────────────────┐                  │
│                  │    Child Component    │                  │
│                  │ - input.required<T>() │                  │
│                  │ - output<T>()         │                  │
│                  │ - model<T>() [2-way]  │                  │
│                  └───────────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

## 1. Signal Inputs (`input()` and `input.required()`)

A Signal Input declares a reactive property that receives its value from the parent component. Because signal inputs return a `Signal<T>`, child components can use them inside `computed()` properties and `effect()` functions seamlessly.

```typescript
import { Component, input, computed } from '@angular/core';

export interface User {
  id: string;
  name: string;
  role: string;
}

@Component({
  selector: 'app-user-badge',
  standalone: true,
  template: `
    <div class="user-badge" [class.admin]="isAdmin()">
      <span class="name">{{ user().name }}</span>
      <span class="role">({{ user().role }})</span>
      @if (compact()) {
        <small class="pill">Mini</small>
      }
    </div>
  `
})
export class UserBadgeComponent {
  // Required input: TypeScript compiler forces parent to provide it
  readonly user = input.required<User>();

  // Optional input with a default value
  readonly compact = input<boolean>(false);

  // Computed value derived from the input signal
  readonly isAdmin = computed(() => this.user().role === 'admin');
}
```

### Input Transforms & Aliases
Signal inputs support input transformation functions (e.g. converting a string to a boolean or number) and aliases:

```typescript
import { Component, input, booleanAttribute, numberAttribute } from '@angular/core';

@Component({
  selector: 'app-custom-card',
  standalone: true,
  template: `<div>Card: {{ elevation() }} | Disabled: {{ disabled() }}</div>`
})
export class CustomCardComponent {
  // Automatically transforms string "true" to boolean true
  readonly disabled = input(false, { transform: booleanAttribute });

  // Transforms string "10" to number 10
  readonly elevation = input(1, { transform: numberAttribute });
}
```

## 2. Component Outputs (`output()`)

Outputs allow child components to emit custom events up to their parent component. Modern Angular uses the `output<T>()` function:

```typescript
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  template: `
    <li class="todo-row">
      <input type="checkbox" (change)="toggleComplete.emit(id())" />
      <span>{{ title() }}</span>
      <button (click)="deleteItem.emit(id())">Delete</button>
    </li>
  `
})
export class TodoItemComponent {
  readonly id = input.required<string>();
  readonly title = input.required<string>();

  // Declaring outputs
  readonly toggleComplete = output<string>();
  readonly deleteItem = output<string>();
}
```

Parent component listening to outputs:

```html
<app-todo-item
  [id]="todo.id"
  [title]="todo.title"
  (toggleComplete)="handleToggle($event)"
  (deleteItem)="handleDelete($event)"
/>
```

## 3. Two-Way Model Inputs (`model()`)

When a child component needs to both receive a value and emit updates to synchronize state bidirectionally with the parent, Angular provides `model()`:

```typescript
import { Component, model } from '@angular/core';

@Component({
  selector: 'app-toggle-switch',
  standalone: true,
  template: `
    <button (click)="toggle()" [class.active]="checked()">
      {{ checked() ? 'ON' : 'OFF' }}
    </button>
  `
})
export class ToggleSwitchComponent {
  // Two-way model signal
  readonly checked = model<boolean>(false);

  toggle(): void {
    this.checked.update(val => !val);
  }
}
```

Parent usage with two-way binding syntax `[()]`:

```html
<app-toggle-switch [(checked)]="isNotificationsEnabled" />
```

## 4. Shared State Between Sibling Components

When sibling components need to communicate, data should not be passed through complex parent relay chains. Instead, move shared state into an `@Injectable({ providedIn: 'root' })` service with private signals and public read-only signals.

## Summary & Key Takeaways

- Angular enforces unidirectional data flow: inputs down, outputs up.
- Modern `input()` and `input.required()` create read-only signals that integrate with `computed()` derived state.
- `output<T>()` provides clean, type-safe event emission without needing legacy `@Output()` decorators.
- `model<T>()` creates bidirectional two-way binding signals for custom input controls.
- Use Injectable services for cross-branch and sibling component communication.

## Best Practices & Senior Guidance

1. **Use `input.required()` for Mandatory Props**: If a component cannot function without a piece of data, make it `input.required()`.
2. **Keep Outputs Semantic**: Name outputs after actions or events that occurred (`itemDeleted`, `selectionChanged`), not imperative commands.
3. **Do Not Mutate Inputs**: Inputs are read-only signals. Never attempt to modify an input directly in the child component.
