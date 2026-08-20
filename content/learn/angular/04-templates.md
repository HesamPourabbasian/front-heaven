---
title: 'Templates & Data Binding'
description: 'Master Angular template syntax: interpolation, property binding, event binding, two-way binding, template expressions, and template reference variables.'
order: 4
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 35
prerequisites: ['/learn/angular/03-components']
---

# Templates & Data Binding

In Angular, a **Template** is an HTML document enhanced with Angular-specific syntax that dictates how a component renders to the browser DOM. Templates are declarative: rather than writing imperative JavaScript to query and update DOM nodes, you bind HTML elements directly to the component's TypeScript properties, signals, and methods.

Angular templates are strictly typed. The Angular compiler analyzes every expression, method invocation, and property binding against the component's TypeScript class during compilation. If you attempt to access a non-existent property or pass the wrong type to an input, the build fails immediately with an informative compiler error.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                      Angular Data Binding Matrix                       │
├───────────────────────┬──────────────────────┬─────────────────────────┤
│ Binding Type          │ Syntax               │ Direction               │
├───────────────────────┼──────────────────────┼─────────────────────────┤
│ Interpolation         │ {{ expression }}     │ Component -> DOM        │
│ Property Binding      │ [property]="value"   │ Component -> DOM        │
│ Event Binding         │ (event)="handler()"  │ DOM -> Component        │
│ Two-Way Binding       │ [(ngModel)]="val"    │ Component <-> DOM       │
│ Template Reference    │ #myRef               │ Template-scoped pointer │
└───────────────────────┴──────────────────────┴─────────────────────────┘
```

## 1. Interpolation (`{{ }}`)

Interpolation evaluates a TypeScript expression, converts the result to a string, and inserts it into the HTML document:

```html
<h1>Welcome, {{ username() }}!</h1>
<p>Total items in cart: {{ cartItems().length }}</p>
<p>Calculated total: \${{ formatCurrency(totalAmount()) }}</p>
```

Interpolation expressions must be side-effect free. You should never call functions that mutate state inside an interpolation block.

## 2. Property Binding (`[property]`)

Property binding sets the value of a target DOM property or child component input from a component expression. Property binding uses square brackets `[]`:

```html
<!-- Binding to standard HTML DOM properties -->
<button [disabled]="isSubmitting()">Submit</button>
<img [src]="userAvatarUrl()" [alt]="userName() + ' profile picture'" />
<div [class.active]="isSelected()" [style.width.px]="progressWidth()"></div>

<!-- Binding to child component input -->
<app-user-card [user]="currentUser()" [theme]="activeTheme()"></app-user-card>
```

Notice the crucial difference: `src="{{ url }}"` evaluates as a string, whereas `[src]="url"` binds the property value directly.

## 3. Event Binding (`(event)`)

Event binding listens for DOM events (such as clicks, keystrokes, form submissions, or custom child component output events) and invokes a component handler method. Event binding uses parentheses `()`:

```html
<!-- DOM click event -->
<button (click)="onSave()">Save Changes</button>

<!-- Passing the native event object ($event) -->
<input (input)="onSearchInput($event)" placeholder="Search products..." />

<!-- Keyboard event filter modifier -->
<input (keydown.enter)="submitQuery()" (keydown.escape)="clearQuery()" />

<!-- Listening to child component output event -->
<app-item-list (itemDeleted)="handleItemDeletion($event)"></app-item-list>
```

Inside the component:

```typescript
export class SearchComponent {
  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    console.log('Search query:', input.value);
  }
}
```

## 4. Two-Way Binding (`[(...)]`)

Two-way data binding combines property binding (data flow from component to DOM) and event binding (user changes propagate back from DOM to component). In modern Angular, two-way binding is frequently implemented via the "banana-in-a-box" syntax `[()]`:

```html
<!-- Requires FormsModule imported in standalone component -->
<input [(ngModel)]="username" placeholder="Enter username" />
<p>Live preview: {{ username }}</p>
```

In modern Angular with Signals, two-way binding is achieved with the `model()` signal primitive on child components without needing `FormsModule`.

## 5. Template Reference Variables (`#var`)

A Template Reference Variable creates a named reference to a DOM element, component instance, or directive within the template. It is declared with the `#` symbol:

```html
<!-- Reference to native input DOM element -->
<input #phoneInput type="tel" placeholder="(555) 000-0000" />
<button (click)="callNumber(phoneInput.value)">Call</button>

<!-- Reference to child component instance -->
<app-video-player #player></app-video-player>
<button (click)="player.play()">Play Video</button>
<button (click)="player.pause()">Pause</button>
```

## Template Expressions & Pure Functions

Angular runs template expressions frequently during change detection. To prevent severe frame rate drops:
- Keep template expressions fast and lightweight.
- Never execute HTTP calls, heavy mathematical algorithms, or deep array transformations inside templates.
- Use `computed()` signals to memoize derived state rather than invoking methods in template bindings.

## Summary & Key Takeaways

- Angular templates provide a declarative, type-safe DSL for building interactive user interfaces.
- Interpolation `{{ }}` and Property binding `[property]` flow data unidirectionally from the component class to the DOM.
- Event binding `(event)` captures user interactions and passes data upwards from the DOM to component handlers.
- Two-way binding `[(ngModel)]` synchronizes form controls and component state bidirectionally.
- Template Reference Variables (`#ref`) provide direct access to DOM nodes and child component instances in templates.

## Best Practices & Senior Guidance

1. **Never Call Methods in Template Interpolation**: Avoid `{{ calculateTotal() }}`. Every change detection cycle will re-execute the method. Use a `computed()` signal instead: `readonly total = computed(() => ...);` and bind `{{ total() }}`.
2. **Use Type-Safe `$event` Handling**: Cast `$event.target` safely in TypeScript methods rather than writing inline JavaScript logic in HTML attributes.
3. **Prefer Explicit Property Binding**: Use `[disabled]="isValid()"` instead of string interpolation `disabled="{{ isValid() }}"`.
