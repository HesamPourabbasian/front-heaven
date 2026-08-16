---
title: 'Services & Dependency Injection'
description: 'Understand @Injectable services, root injectors, and sharing state across components.'
order: 3
difficulty: 'intermediate'
category: 'Angular Architecture'
estimatedMinutes: 25
prerequisites:
  - /learn/angular/components-and-templates
---

## Angular Dependency Injection

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);

  getUsers() {
    return this.http.get('/api/users');
  }
}
```

---

## Summary & Key Takeaways

- Angular's hierarchical dependency injection makes testing and enterprise architecture robust.
