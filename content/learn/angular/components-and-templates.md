---
title: 'Angular Templates & Control Flow'
description: 'Master modern @if, @for, @switch block syntax, property binding [property], and event binding (event).'
order: 2
difficulty: 'intermediate'
category: 'Angular Fundamentals'
estimatedMinutes: 20
prerequisites:
  - /learn/angular/introduction-to-angular
---

## Built-in Control Flow Blocks

```html
@if (isLoggedIn) {
  <p>Welcome back, {{ username }}!</p>
} @else {
  <button (click)="login()">Sign In</button>
}

<ul>
  @for (item of items; track item.id) {
    <li>{{ item.name }}</li>
  } @empty {
    <li>No items found</li>
  }
</ul>
```

---

## Summary & Key Takeaways

- Angular 17+ block syntax replaces legacy `*ngIf` and `*ngFor` directives.
