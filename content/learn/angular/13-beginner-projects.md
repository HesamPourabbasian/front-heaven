---
title: 'Beginner Projects & Practical Labs'
description: 'Consolidate Level 1 Angular skills with 7 hands-on beginner projects: Todo app with Signals, Weather forecast app, Markdown notes, Blog, Product catalog, and Auth UI.'
order: 13
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 60
prerequisites: ['/learn/angular/12-styling']
---

# Beginner Projects & Practical Labs

To solidify the foundational concepts mastered in Level 1—including Standalone Components, Signals, Modern Control Flow (`@if`, `@for`), Dependency Injection, Reactive Forms, and `HttpClient`—you will build 7 hands-on practice projects. Building real applications is the single most effective way to transition from conceptual understanding to practical engineering confidence.

```text
┌─────────────────────────────────────────────────────────────┐
│                   Level 1 Project Portfolio                 │
├────┬─────────────────────────────┬──────────────────────────┤
│ #  │ Project Title               │ Core Technologies Tested │
├────┼─────────────────────────────┼──────────────────────────┤
│ 1  │ Todo List & Habit Tracker   │ Signals, @for, Storage   │
│ 2  │ Live Weather Forecast App   │ HttpClient, toSignal     │
│ 3  │ Markdown Notes Application  │ Reactive Forms, computed │
│ 4  │ Tech Blog with Routing      │ Router, withComponentInp │
│ 5  │ Filterable Product Catalog  │ Inputs, Outputs, models  │
│ 6  │ Multi-Role Auth Form UI     │ Typed Forms, Validators  │
│ 7  │ Simple Admin Dashboard      │ Layouts, SCSS, Signals   │
└────┴─────────────────────────────┴──────────────────────────┘
```

## Project 1: Signal-Based Todo Application

### Specifications & Objectives:
- Add, toggle completion, edit, and delete tasks.
- Filter tasks by status: `All`, `Active`, `Completed`.
- Display a computed summary: Total tasks, Completed count, Remaining percentage.
- Persist state to browser `localStorage` using an `effect()`.

```typescript
// src/app/projects/todo/todo.service.ts
import { Injectable, signal, computed, effect } from '@angular/core';

export interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
}

@Injectable({ providedIn: 'root' })
export class TodoService {
  private readonly STORAGE_KEY = 'fh_angular_todos';

  private readonly _todos = signal<TodoItem[]>(this.loadInitialTodos());
  public readonly filter = signal<'all' | 'active' | 'completed'>('all');

  public readonly todos = this._todos.asReadonly();

  public readonly filteredTodos = computed(() => {
    const list = this._todos();
    const currentFilter = this.filter();
    if (currentFilter === 'active') return list.filter(t => !t.completed);
    if (currentFilter === 'completed') return list.filter(t => t.completed);
    return list;
  });

  public readonly stats = computed(() => {
    const list = this._todos();
    const total = list.length;
    const completed = list.filter(t => t.completed).length;
    return {
      total,
      completed,
      active: total - completed,
      percent: total === 0 ? 0 : Math.round((completed / total) * 100)
    };
  });

  constructor() {
    // Synchronize to localStorage whenever _todos changes
    effect(() => {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._todos()));
    });
  }

  addTodo(title: string): void {
    if (!title.trim()) return;
    const newItem: TodoItem = {
      id: crypto.randomUUID(),
      title: title.trim(),
      completed: false,
      createdAt: Date.now()
    };
    this._todos.update(items => [newItem, ...items]);
  }

  toggleTodo(id: string): void {
    this._todos.update(items =>
      items.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    );
  }

  deleteTodo(id: string): void {
    this._todos.update(items => items.filter(t => t.id !== id));
  }

  private loadInitialTodos(): TodoItem[] {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  }
}
```

## Project 2: Weather Forecast Application

### Specifications & Objectives:
- Search for a city name and fetch current weather from OpenWeatherMap REST API.
- Use `provideHttpClient(withFetch())` and convert API Observables to Signals using `toSignal()`.
- Display loading indicators and error banners with `@if` / `@else`.

## Project 3: Filterable Product Catalog

### Specifications & Objectives:
- Present a list of product cards with categories, ratings, and prices.
- Provide a debounced search bar and category filter dropdown.
- Use Presentational (`ProductCardComponent`) and Container (`CatalogComponent`) architecture.

## Summary & Key Takeaways

- Building practical applications solidifies Angular fundamentals and establishes muscle memory.
- The Smart/Dumb component pattern creates scalable, testable application code.
- Angular Signals and `computed()` provide clean, instantaneous reactive UI updates without manual subscription boilerplate.

## Best Practices & Senior Guidance

1. **Commit Code Incrementally**: Use Git feature branches for each project deliverable.
2. **Keep Business Logic in Services**: Never place API calls or storage synchronization logic inside components.
3. **Always Add Empty States**: Use `@empty` blocks in every `@for` loop to guarantee polished user experiences.
