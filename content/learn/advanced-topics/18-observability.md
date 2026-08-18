---
title: 'Front-End Observability, RUM & Production Diagnostics'
description: 'Master enterprise front-end observability: Real User Monitoring (RUM), Core Web Vitals telemetry, Sentry error tracking, production source map resolution, and structured logging.'
order: 18
difficulty: 'advanced'
category: 'Senior Front-End Engineering'
estimatedMinutes: 45
prerequisites:
  - /learn/advanced-topics/17-build-systems
---

# Front-End Observability, RUM & Production Diagnostics

Once an application is deployed to production, it runs across millions of permutations of browser versions, operating systems, network latencies, and device hardware. Without robust **Observability**, front-end teams are blind to runtime crashes, silent API failures, and performance degradation.

In this lesson, we explore **Real User Monitoring (RUM)** telemetry, production error tracking (**Sentry / Datadog**), source map security and resolution, the **Navigation & Resource Timing APIs**, and structured client-side logging.

```text
┌────────────────────────────────────────────────────────────┐
│               Front-End Observability Architecture         │
├──────────────────────────────┬─────────────────────────────┤
│ 1. Error Tracking (Sentry)   │ 2. Real User Monitoring(RUM)│
│ (Crashes, Unhandled Promise) │ (LCP, INP, CLS, TTFB)       │
├──────────────────────────────┴─────────────────────────────┤
│ 3. Browser Performance APIs:                               │
│ - `PerformanceObserver` (Long Tasks, Layout Shifts, LCP)   │
│ - `performance.mark()` & `performance.measure()`           │
├────────────────────────────────────────────────────────────┤
│ 4. Production Telemetry Pipeline ──► Beacon API / OTLP    │
└────────────────────────────────────────────────────────────┘
```

## 1. Automated Real User Monitoring (RUM) for Core Web Vitals

Collect live Core Web Vitals metrics from real users in production using the official `web-vitals` library and stream them to your telemetry endpoint:

```typescript
import { onCLS, onINP, onLCP, onTTFB, type Metric } from "web-vitals";

function sendTelemetryBeacon(metric: Metric) {
  const payload = JSON.stringify({
    name: metric.name,
    value: metric.value,
    rating: metric.rating, // 'good' | 'needs-improvement' | 'poor'
    id: metric.id,
    pageUrl: window.location.pathname,
    deviceMemory: (navigator as any).deviceMemory || "unknown",
    connectionType: (navigator as any).connection?.effectiveType || "unknown",
    timestamp: Date.now(),
  });

  // Use Navigator.sendBeacon: non-blocking HTTP POST that survives page unload!
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/telemetry/rum", payload);
  } else {
    fetch("/api/telemetry/rum", { method: "POST", body: payload, keepalive: true });
  }
}

export function initObservability() {
  onLCP(sendTelemetryBeacon);
  onINP(sendTelemetryBeacon);
  onCLS(sendTelemetryBeacon);
  onTTFB(sendTelemetryBeacon);
}
```

Using `navigator.sendBeacon` guarantees that performance beacons transmit successfully even when the user immediately closes the browser tab or navigates away.

## 2. Production Error Tracking & Context Enrichment

Capture unhandled errors and enrich them with structured user context, release version, and breadcrumbs:

```typescript
import * as Sentry from "@sentry/vue"; // or @sentry/react

export function initErrorMonitoring(app: any) {
  Sentry.init({
    app,
    dsn: "https://examplePublicKey@o0.ingest.sentry.io/0",
    release: "my-app@2.4.1", // Match exact release for source map mapping
    environment: "production",
    tracesSampleRate: 0.1, // Sample 10% of transactions for APM tracing
    replaysOnErrorSampleRate: 1.0, // Record 100% of sessions that experience errors!

    beforeSend(event, hint) {
      // Sanitize sensitive user secrets or passwords from telemetry payloads
      if (event.request?.headers) {
        delete event.request.headers["authorization"];
      }
      return event;
    },
  });

  // Associate error reports with anonymized user context
  Sentry.setUser({ id: "usr_9481", subscriptionTier: "enterprise" });
}
```

## 3. Production Source Map Resolution & Security

Production bundles are minified and obfuscated. Without source maps, error stack traces appear as unreadable gibberish (`at e.t [as render] (app.min.js:1:4821)`).

### Secure Source Map Workflow:
1. **Generate Source Maps during build**: Set `sourcemap: true` in your build config.
2. **Upload Maps to Sentry/Datadog in CI**: Use CLI tools (`@sentry/cli releases files upload-sourcemaps`) to upload maps to your private error monitoring platform.
3. **Delete Source Maps from public CDN**: Remove `.map` files from the public `dist/` directory before deploying to production CDN to prevent competitors from inspecting your unminified source code.

## 4. Custom Performance Marks & Measures

Use the browser's native **User Timing API** to measure custom business metrics:

```typescript
export function measureCheckoutExecutionTime() {
  performance.mark("checkout-start");

  // Execute checkout calculations...
  executeComplexOrderComputation();

  performance.mark("checkout-end");
  performance.measure("checkout-total-duration", "checkout-start", "checkout-end");

  const [measure] = performance.getEntriesByName("checkout-total-duration");
  console.log(`Checkout calculation took ${measure.duration.toFixed(2)}ms`);
}
```

## Summary

- Real User Monitoring (RUM) captures real-world Core Web Vitals telemetry across real user hardware and connections.
- `navigator.sendBeacon()` transmits telemetry data asynchronously without delaying page teardown or blocking user navigation.
- Sentry and Datadog capture unhandled runtime errors, enriched with breadcrumbs, release tags, and session replay recordings.
- Source maps should be uploaded directly to private error monitoring servers and stripped from public CDNs.
- The User Timing API (`performance.mark` and `performance.measure`) tracks granular business transaction latencies.

## Best Practices

1. **Always Tag Sentry Events with Release Versions**: Ensure immediate identification of the exact Git commit that introduced an error.
2. **Use `sendBeacon` with `keepalive: true`**: Prevent telemetry data loss during user page exits.
3. **Strip Public Source Maps from Production CDNs**: Upload maps to private monitoring servers to preserve security.
4. **Sanitize PII in Telemetry Payloads**: Never send passwords, credit card numbers, or authorization headers in error reports.
