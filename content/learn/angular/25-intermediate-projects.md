---
title: 'Intermediate Projects & Enterprise Labs'
description: 'Consolidate Level 2 Angular mastery with 8 practical enterprise projects: E-Commerce Storefront, CRM Portal, Kanban Board, Real-Time Chat, Analytics Dashboard, and Checkout Wizard.'
order: 25
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 60
prerequisites: ['/learn/angular/20-state-management']
---

# Intermediate Projects & Enterprise Labs

Level 2 solidifies the advanced capabilities of Angular: Hierarchical Dependency Injection, Functional Interceptors, NgRx SignalStore, Typed Reactive Forms, Custom `ControlValueAccessor` controls, Unit Testing with `TestBed`, and CDK Accessibility.

To prove your intermediate mastery, you will architect and build 8 enterprise projects covering real-world industry requirements.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Level 2 Enterprise Portfolio                │
├────┬─────────────────────────────┬──────────────────────────┤
│ #  │ Project Title               │ Core Architecture        │
├────┼─────────────────────────────┼──────────────────────────┤
│ 1  │ E-Commerce Storefront       │ SignalStore, Interceptors│
│ 2  │ Enterprise CRM Portal       │ Typed Forms, CVA, Auth   │
│ 3  │ Project Kanban Board        │ CDK Drag & Drop, Signals │
│ 4  │ Real-Time Support Chat      │ RxJS WebSockets, Streams │
│ 5  │ Financial Analytics Suite   │ Deferrable Views, Charts │
│ 6  │ Multi-Step Checkout Wizard  │ Nested FormGroups, Guards│
│ 7  │ Role-Based Auth Platform    │ RBAC Guards, JWT Refresh │
│ 8  │ Headless Design System      │ CDK Primitives, A11y     │
└────┴─────────────────────────────┴──────────────────────────┘
```

## Project 1: Enterprise E-Commerce Storefront

### Architecture & Requirements:
- **State Management**: Implement an NgRx SignalStore managing products, pagination, active category filters, and persistent cart items.
- **HTTP Interceptors**: Attach Bearer JWT auth headers and implement exponential backoff retry for network errors.
- **Routing**: Lazy-loaded routes with functional resolvers pre-fetching product details.
- **Testing**: 80%+ unit test coverage for services and cart store using `TestBed`.

## Project 3: Kanban Project Management Board

### Architecture & Requirements:
- Multi-column task board (Backlog, In Progress, In Review, Done).
- Drag-and-drop cards between columns using `@angular/cdk/drag-drop`.
- Instant optimistic UI updates with automatic rollback on server sync failure.

## Summary & Key Takeaways

- Intermediate projects transition your knowledge from component syntax into scalable application architecture.
- Combining SignalStore, Interceptors, and Typed Forms provides enterprise resilience and maintainability.

## Best Practices & Senior Guidance

1. **Enforce Clean Architecture Boundaries**: Isolate business logic in services and stores; keep UI components focused on presentation.
2. **Write Automated Tests Alongside Features**: Write unit tests for your stores and integration tests for critical form workflows.
