---
title: 'Angular Signals & Reactivity'
description: 'Master fine-grained reactive Signals: signal(), computed(), and effect() in modern Angular.'
order: 4
difficulty: 'intermediate'
category: 'Reactivity'
estimatedMinutes: 25
prerequisites:
  - /learn/angular/services-and-di
---

## Using Signals

```typescript
import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: `<button (click)="inc()">Count: {{ count() }} (Double: {{ double() }})</button>`
})
export class CounterComponent {
  count = signal(0);
  double = computed(() => this.count() * 2);

  inc() {
    this.count.update(c => c + 1);
  }
}
```

---

## Summary & Key Takeaways

- Signals provide surgical DOM updates with zone-less potential.
