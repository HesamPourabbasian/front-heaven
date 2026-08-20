---
title: 'Change Detection, OnPush & Zoneless Angular'
description: 'Master Angular Change Detection: Zone.js monkey-patching mechanics, ChangeDetectionStrategy.OnPush, Signal-driven micro-updates, ChangeDetectorRef, and Zoneless Angular architectures.'
order: 27
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 55
prerequisites: ['/learn/angular/26-angular-internals']
---

# Change Detection, OnPush & Zoneless Angular

**Change Detection** is the computational mechanism by which Angular synchronizes application state with the browser DOM. Historically, Angular relied on **Zone.js** to intercept all asynchronous browser events and trigger top-down dirty checking across the entire component tree.

In modern Angular, change detection has evolved dramatically. By combining **`ChangeDetectionStrategy.OnPush`**, **Signals**, and the revolutionary **Zoneless Angular** mode (`provideExperimentalZonelessChangeDetection`), Angular eliminates top-down tree sweeps entirely in favor of surgical, fine-grained DOM updates.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Change Detection Strategies Compared        │
├──────────────────────────┬──────────────────────────────────┤
│ Default Change Detection │ OnPush + Signals (Modern)        │
├──────────────────────────┼──────────────────────────────────┤
│ - Top-down tree sweep    │ - Dirty-marking boundary         │
│ - Checks EVERY component │ - Checks ONLY changed branches   │
│ - Triggered by ANY async │ - Triggered by Signal updates,   │
│   event via Zone.js      │   Input changes, or DOM events   │
│ - High CPU overhead      │ - High-performance & optimal     │
└──────────────────────────┴──────────────────────────────────┘
```

## 1. How Zone.js Works

Zone.js creates an execution context across asynchronous operations. It monkey-patches over 40 browser APIs:
- DOM Events: `addEventListener('click')`, `input`, `scroll`
- Timers: `setTimeout()`, `setInterval()`, `requestAnimationFrame()`
- Network: `XMLHttpRequest`, `fetch()`
- Microtasks: `Promise.then()`

Whenever any patched asynchronous task completes, Zone.js notifies Angular via `onMicrotaskEmpty`, and Angular calls `ApplicationRef.tick()`, initiating a full top-down change detection sweep across all rendered components.

## 2. `ChangeDetectionStrategy.OnPush`

When a component is marked with `changeDetection: ChangeDetectionStrategy.OnPush`, Angular will **skip checking that component and its entire child subtree** unless one of the following conditions is met:
1. An `@Input()` reference changes (compared via `Object.is()`).
2. A DOM event listener registered inside the component's template fires (e.g. `(click)="onSave()"`).
3. A Signal read inside the component template changes value.
4. An `Observable` bound via the `AsyncPipe` (`| async`) emits a new value.
5. The component explicitly calls `ChangeDetectorRef.markForCheck()`.

```typescript
import { Component, ChangeDetectionStrategy, input, signal } from '@angular/core';

@Component({
  selector: 'app-user-row',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush, // High-performance mode
  template: `
    <div class="row">
      <span>{{ name() }}</span>
      <span>{{ role() }}</span>
    </div>
  `
})
export class UserRowComponent {
  readonly name = input.required<string>();
  readonly role = input.required<string>();
}
```

## 3. Zoneless Angular (`provideExperimentalZonelessChangeDetection`)

Starting with Angular 18+, developers can completely remove Zone.js from their applications, unlocking:
- **Smaller Bundle Size**: Eliminates ~30KB of Zone.js polyfill code from initial download.
- **Faster Startup & Execution**: No monkey-patching overhead on browser APIs.
- **Direct Stack Traces**: Clean, readable browser error stack traces without Zone.js wrapper frames.

To configure Zoneless Angular in `src/app/app.config.ts`:

```typescript
import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Enable Zoneless Change Detection
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes),
  ]
};
```

In Zoneless Angular, UI updates are driven entirely by Signal notifications, `AsyncPipe` emissions, and template event handlers.

## 4. Manual Control with `ChangeDetectorRef`

When integrating legacy third-party WebSocket libraries or Web Workers outside Angular's zone:

```typescript
import { Component, ChangeDetectorRef, inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-socket-listener',
  standalone: true,
  template: `<p>Status: {{ status }}</p>`
})
export class SocketListenerComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  status = 'Connecting...';

  ngOnInit() {
    // External non-Angular callback
    customWebSocket.onMessage((data: string) => {
      this.status = data;
      // Mark component path for change detection
      this.cdr.markForCheck();
    });
  }
}
```

## Summary & Key Takeaways

- Default change detection performs a top-down tree sweep on every asynchronous event via Zone.js.
- `ChangeDetectionStrategy.OnPush` skips unchanged component branches, drastically boosting application framerates.
- Zoneless Angular removes Zone.js completely, relying on Signals and direct scheduler notifications for ultra-fast rendering.
- `ChangeDetectorRef.markForCheck()` flags a component and its ancestors as dirty for the next rendering pass.

## Best Practices & Senior Guidance

1. **Set `OnPush` Everywhere by Default**: Configure CLI schematics to generate all new components with `changeDetection: ChangeDetectionStrategy.OnPush`.
2. **Migrate Towards Zoneless**: Build components using Signals and `toSignal()` to make your codebase ready for full Zoneless deployment.
3. **Never Call `detectChanges()` in Loops**: Avoid `cdr.detectChanges()` in tight loops; use `markForCheck()` to allow Angular to coalesce updates into a single browser animation frame.
