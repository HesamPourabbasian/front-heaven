---
title: 'Production Observability, Monitoring & RUM'
description: 'Master production observability in Angular: custom Global ErrorHandler, Sentry and Datadog integration, Real User Monitoring (RUM), Core Web Vitals telemetry, and structured logging.'
order: 37
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 50
prerequisites: ['/learn/angular/22-testing']
---

# Production Observability, Monitoring & RUM

Writing bug-free software in development does not guarantee flawless execution in production. Real users operate on diverse hardware, unreliable mobile networks, outdated browser versions, and unpredictable network latency. **Observability** provides real-time visibility into application health, uncaught exceptions, and user journey bottlenecks.

A robust observability architecture incorporates:
1. **Global Exception Handling**: Intercepting and reporting unhandled errors via `ErrorHandler`.
2. **Real User Monitoring (RUM)**: Tracking real-world Core Web Vitals across user sessions.
3. **Structured Telemetry & Breadcrumbs**: Recording user actions leading up to a crash.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Angular Observability Architecture          │
│                                                             │
│  Uncaught Exception in Component / Service                  │
│             │                                               │
│             ▼                                               │
│  Custom Global ErrorHandler Provider                        │
│  ├── Extracts error stack trace & user context              │
│  ├── Collects breadcrumb telemetry (last 10 user clicks)    │
│  └── Dispatches payload to Monitoring Cloud (Sentry/Datadog)│
│             │                                               │
│             ▼                                               │
│  PerformanceObserver API (RUM)                              │
│  ├── Records LCP, INP, CLS measurements                     │
│  └── Ships telemetry to Analytics Datadog RUM Dashboard    │
└─────────────────────────────────────────────────────────────┘
```

## 1. Custom Global `ErrorHandler`

Angular routes all unhandled exceptions to the `ErrorHandler` service. Override this service to log errors to production monitoring platforms (e.g. Sentry):

```typescript
// src/app/core/errors/global-error-handler.ts
import { ErrorHandler, Injectable, NgZone, inject } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private zone = inject(NgZone);

  handleError(error: unknown): void {
    // Run telemetry transmission outside Angular's zone to prevent change detection loops
    this.zone.runOutsideAngular(() => {
      const errorObj = error instanceof Error ? error : new Error(String(error));

      console.error('[GlobalErrorHandler Caught]:', errorObj);

      // Transmit to monitoring service
      this.sendErrorToMonitoring({
        message: errorObj.message,
        stack: errorObj.stack,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
      });
    });
  }

  private sendErrorToMonitoring(payload: Record<string, unknown>): void {
    // Beacon API sends asynchronous data even if page is closing
    navigator.sendBeacon('/api/telemetry/errors', JSON.stringify(payload));
  }
}
```

Registering in `app.config.ts`:

```typescript
import { ApplicationConfig, ErrorHandler } from '@angular/core';
import { GlobalErrorHandler } from './core/errors/global-error-handler';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ]
};
```

## 2. Tracking Core Web Vitals with `PerformanceObserver`

```typescript
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WebVitalsTelemetryService {
  initTelemetry(): void {
    if (typeof PerformanceObserver === 'undefined') return;

    // Track Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.info(`[RUM Telemetry] LCP: ${lastEntry.startTime}ms`);
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
  }
}
```

## Summary & Key Takeaways

- Implement a custom `ErrorHandler` to catch, sanitize, and transmit production runtime errors.
- Run telemetry code inside `NgZone.runOutsideAngular` to prevent unwanted change detection triggers.
- Use `navigator.sendBeacon()` for guaranteed telemetry transmission during page teardown.
- Monitor Core Web Vitals continuously via `PerformanceObserver`.

## Best Practices & Senior Guidance

1. **Sanitize Telemetry Data (PII)**: Never transmit Personally Identifiable Information (passwords, credit card numbers, auth tokens) in error logs.
2. **Upload Source Maps to Sentry Securely**: Always upload `.map` files to your private error monitoring platform during CI and delete them from public web hosting.
