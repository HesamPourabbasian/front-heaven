---
title: 'Advanced Dependency Injection & Providers'
description: 'Master advanced Dependency Injection in Angular: hierarchical injectors (Element vs Environment), InjectionToken, provider types (useClass, useValue, useFactory, useExisting), multi-providers, and custom scopes.'
order: 18
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 45
prerequisites: ['/learn/angular/08-services-and-dependency-injection']
---

# Advanced Dependency Injection & Providers

Angular's Dependency Injection (DI) system is among the most sophisticated in modern web architecture. Beyond basic `@Injectable({ providedIn: 'root' })` singletons, Angular operates a two-tiered hierarchical injector tree consisting of **Environment Injectors** and **Element Injectors**. Understanding how resolution travels through this hierarchy allows you to configure component-scoped services, inject dynamic configuration tokens, build extensible plugin systems, and configure factory providers.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Angular Hierarchical Injector Tree          │
│                                                             │
│   Root Environment Injector (AppConfig / providedIn: 'root')│
│   ├── AuthService (Singleton)                               │
│   └── ApiConfigurationToken                                 │
│                │                                            │
│                ▼                                            │
│   Route Environment Injector (Lazy Route Chunk Providers)   │
│   └── FeatureAnalyticsService                               │
│                │                                            │
│                ▼                                            │
│   Element Injector (Parent Component: @Component.providers) │
│   └── FormStateService (Scoped to parent + its children)   │
│                │                                            │
│                ▼                                            │
│   Element Injector (Child Component)                        │
│   └── LocalAnimationService (Scoped strictly to child)     │
└─────────────────────────────────────────────────────────────┘
```

## 1. The Hierarchical Injector Hierarchy

When a component or service requests a dependency, Angular searches upward in the hierarchy:
1. **Element Injector**: Configured on `@Component({ providers: [...] })` or `@Directive({ providers: [...] })`. Instances are created per component instance and destroyed when the component is removed from the DOM.
2. **Environment Injector**: Configured in `app.config.ts` (`provideRouter`, `provideHttpClient`), route-level `providers: [...]`, or via `providedIn: 'root'`.

## 2. Defining Typed Injection Tokens (`InjectionToken`)

When injecting primitives, interfaces, or configuration objects (which do not exist as JavaScript classes at runtime), create an `InjectionToken<T>`:

```typescript
// src/app/core/config/app-config.token.ts
import { InjectionToken } from '@angular/core';

export interface AppConfig {
  apiBaseUrl: string;
  enableTelemetry: boolean;
  maxUploadSizeBytes: number;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG', {
  providedIn: 'root',
  factory: () => ({
    apiBaseUrl: 'https://api.front-heaven.com/v1',
    enableTelemetry: true,
    maxUploadSizeBytes: 10 * 1024 * 1024, // 10 MB
  })
});
```

Injecting the token:

```typescript
import { Component, inject } from '@angular/core';
import { APP_CONFIG } from './app-config.token';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `<p>API URL: {{ config.apiBaseUrl }}</p>`
})
export class HeaderComponent {
  readonly config = inject(APP_CONFIG);
}
```

## 3. The 4 Provider Recipes: `useClass`, `useValue`, `useFactory`, `useExisting`

Angular supports 4 distinct provider configurations:

```typescript
import { Provider } from '@angular/core';
import { LoggerService, ProductionLoggerService, MockLoggerService } from './logger.service';
import { APP_CONFIG } from './app-config.token';
import { HttpClient } from '@angular/common/http';

export const APP_PROVIDERS: Provider[] = [
  // 1. useValue: Provide static object/value
  {
    provide: APP_CONFIG,
    useValue: { apiBaseUrl: 'https://prod.api.com', enableTelemetry: false, maxUploadSizeBytes: 5000 }
  },

  // 2. useClass: Swap implementation based on environment
  {
    provide: LoggerService,
    useClass: environment.production ? ProductionLoggerService : MockLoggerService
  },

  // 3. useFactory: Dynamically instantiate service with dependencies
  {
    provide: AnalyticsService,
    useFactory: (http: HttpClient, config: AppConfig) => {
      return new AnalyticsService(http, config.enableTelemetry);
    },
    deps: [HttpClient, APP_CONFIG]
  },

  // 4. useExisting: Alias an existing provider to another token
  {
    provide: NewLoggerService,
    useExisting: LoggerService
  }
];
```

## 4. Multi-Providers (`multi: true`) & Plugin Architectures

By setting `multi: true`, multiple providers can be registered under the same `InjectionToken`. Injecting the token returns an array of all registered provider instances (`T[]`):

```typescript
import { InjectionToken, Provider } from '@angular/core';

export interface ValidatorPlugin {
  name: string;
  validate(data: unknown): boolean;
}

export const VALIDATOR_PLUGINS = new InjectionToken<ValidatorPlugin[]>('VALIDATOR_PLUGINS');

export function provideValidatorPlugin(plugin: ValidatorPlugin): Provider {
  return {
    provide: VALIDATOR_PLUGINS,
    useValue: plugin,
    multi: true // Append to the array of plugins
  };
}
```

## 5. Resolution Modifiers

When querying dependencies, resolution modifiers alter the search behavior:
- `inject(Service, { optional: true })`: Returns `null` if the dependency is not found instead of throwing an error.
- `inject(Service, { self: true })`: Checks only the current component's Element Injector.
- `inject(Service, { skipSelf: true })`: Skips the current component and starts searching from the parent injector.
- `inject(Service, { host: true })`: Restricts the search to the host component view boundary.

## Summary & Key Takeaways

- Angular DI features a hierarchical structure: Element Injectors (component-scoped) and Environment Injectors (application/route-scoped).
- Use `InjectionToken<T>` to inject non-class dependencies, configurations, and primitives safely.
- Provider recipes (`useValue`, `useClass`, `useFactory`, `useExisting`) offer total control over dependency resolution and mocking.
- `multi: true` allows multiple providers to register under a single token for extensible plugin systems.

## Best Practices & Senior Guidance

1. **Use `providedIn: 'root'` with Factories for Tokens**: Always provide a default factory in `new InjectionToken('...', { factory: () => ... })` to ensure tokens are tree-shakable.
2. **Avoid Component-Level Providers for Singletons**: Placing a service in `@Component({ providers: [...] })` creates a new instance for every component render, which breaks singleton patterns.
3. **Use `{ optional: true }` Defensively**: When writing reusable UI libraries, inject optional parent containers or theme services with `{ optional: true }` to prevent crashes when used in isolation.
