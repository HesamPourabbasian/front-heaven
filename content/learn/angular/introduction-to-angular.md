---
title: 'Introduction to Angular'
description: 'Understand the enterprise TypeScript-first Angular framework, modules, standalone components, and the Angular CLI.'
order: 1
difficulty: 'intermediate'
category: 'Angular Fundamentals'
estimatedMinutes: 20
prerequisites:
  - /learn/typescript/interfaces
---

## What is Angular?

**Angular** is a platform and framework for building single-page client applications using HTML and TypeScript, developed by Google.

---

## Standalone Component Architecture

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `<h1>Hello {{ title }}!</h1>`,
  styles: [`h1 { color: #ef4444; }`]
})
export class AppComponent {
  title = 'Front-Heaven Angular';
}
```

---

## Summary & Key Takeaways

- Modern Angular uses Standalone Components without needing NgModules.
