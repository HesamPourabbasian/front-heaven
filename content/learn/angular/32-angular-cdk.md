---
title: 'Angular CDK: Headless UI Primitives'
description: 'Master the Angular Component Development Kit (CDK): Overlay, Dialog, Portals, Drag and Drop (CdkDrag, CdkDropList), Virtual Scrolling, and building custom design systems.'
order: 32
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 50
prerequisites: ['/learn/angular/24-accessibility']
---

# Angular CDK: Headless UI Primitives

The **Angular Component Development Kit (CDK)** (`@angular/cdk`) is a library of un-styled, accessible, and battle-tested headless UI primitives created by the Angular team at Google. Rather than dictating specific visual themes or CSS styles (like Angular Material), the CDK provides the underlying behavioral and structural machinery needed to build custom enterprise design systems, floating popovers, drag-and-drop kanban boards, virtualized tables, and accessible dialogs.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Angular CDK Headless Architecture           │
├──────────────────────┬──────────────────────────────────────┤
│ CDK Module           │ Primitive Capabilities               │
├──────────────────────┼──────────────────────────────────────┤
│ @angular/cdk/overlay │ Floating menus, tooltips, popovers,  │
│                      │ connected position strategies.       │
├──────────────────────┼──────────────────────────────────────┤
│ @angular/cdk/portal  │ Dynamic DOM rendering across view    │
│                      │ boundaries without routing.          │
├──────────────────────┼──────────────────────────────────────┤
│ @angular/cdk/drag-drop│ Touch-friendly drag-and-drop lists,  │
│                      │ sorting, connected drop zones.       │
├──────────────────────┼──────────────────────────────────────┤
│ @angular/cdk/dialog  │ Headless modal dialog engine with    │
│                      │ backdrop, focus trap, and ARIA roles.│
└──────────────────────┴──────────────────────────────────────┘
```

## 1. Floating Overlays with `@angular/cdk/overlay`

The `Overlay` service creates floating panels (dropdowns, tooltips, context menus) attached to specific anchor elements or positioned globally on screen:

```typescript
import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { CustomMenuComponent } from './custom-menu.component';

@Component({
  selector: 'app-menu-trigger',
  standalone: true,
  template: `
    <button #triggerBtn (click)="openMenu()">Open Dropdown</button>
  `
})
export class MenuTriggerComponent {
  private overlay = inject(Overlay);
  readonly triggerBtn = viewChild.required<ElementRef<HTMLButtonElement>>('triggerBtn');

  private overlayRef: OverlayRef | null = null;

  openMenu(): void {
    // 1. Create flexible position strategy connected to button
    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(this.triggerBtn().nativeElement)
      .withPositions([
        { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
        { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' }
      ]);

    // 2. Instantiate overlay
    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop'
    });

    // 3. Attach component portal
    const portal = new ComponentPortal(CustomMenuComponent);
    this.overlayRef.attach(portal);

    // 4. Close when backdrop clicked
    this.overlayRef.backdropClick().subscribe(() => this.overlayRef?.dispose());
  }
}
```

## 2. Drag and Drop with `@angular/cdk/drag-drop`

The Drag-Drop module enables fluid, accessible reordering and cross-column item transfers:

```typescript
import { Component } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [DragDropModule],
  template: `
    <div class="board">
      <!-- Todo Column -->
      <div
        cdkDropList
        #todoList="cdkDropList"
        [cdkDropListData]="todoTasks"
        [cdkDropListConnectedTo]="[doneList]"
        class="task-column"
        (cdkDropListDropped)="onDrop($event)">
        <h3>To Do</h3>
        @for (task of todoTasks; track task) {
          <div cdkDrag class="task-card">{{ task }}</div>
        }
      </div>

      <!-- Done Column -->
      <div
        cdkDropList
        #doneList="cdkDropList"
        [cdkDropListData]="doneTasks"
        [cdkDropListConnectedTo]="[todoList]"
        class="task-column"
        (cdkDropListDropped)="onDrop($event)">
        <h3>Done</h3>
        @for (task of doneTasks; track task) {
          <div cdkDrag class="task-card">{{ task }}</div>
        }
      </div>
    </div>
  `,
  styles: [`
    .board { display: flex; gap: 1.5rem; }
    .task-column { width: 300px; min-height: 400px; background: #f8fafc; padding: 1rem; border-radius: 8px; }
    .task-card { background: white; padding: 0.75rem; margin-bottom: 0.5rem; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); cursor: grab; }
  `]
})
export class KanbanBoardComponent {
  todoTasks = ['Design System Tokens', 'Implement OAuth PKCE', 'Write Unit Tests'];
  doneTasks = ['Setup Angular 18 CLI', 'Configure ESLint'];

  onDrop(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
```

## Summary & Key Takeaways

- The Angular CDK provides un-styled, accessible building blocks for custom component libraries.
- The `Overlay` and `Portal` modules build accessible modals, dropdowns, and floating menus.
- `@angular/cdk/drag-drop` creates sorting lists and multi-container kanban boards with minimal code.
- CDK primitives eliminate reinventing complex browser event handling, scroll listeners, and positioning math.

## Best Practices & Senior Guidance

1. **Build Custom Design Systems on the CDK**: Instead of writing complex position calculations and focus managers from scratch, leverage CDK primitives.
2. **Always Dispose Overlays**: Call `overlayRef.dispose()` upon modal or menu closure to prevent orphaned DOM nodes in `cdk-overlay-container`.
