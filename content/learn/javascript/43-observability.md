---
title: 'Observability'
description: 'Master frontend observability and production telemetry: Error tracking (Sentry), Source Map de-minification, Real User Monitoring (RUM), performance telemetry (Web Vitals), structured logging, custom business metrics, OpenTelemetry distributed tracing, and production debugging.'
order: 43
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 40
prerequisites:
  - /learn/javascript/42-production-engineering
---

# Observability

In modern distributed web systems, delivering resilient user experiences requires complete visibility into client runtime behavior. **Observability** is the measure of how well you can infer the internal states of a system based on its external outputs. Unlike local development where you have full access to DevTools, production code runs on thousands of disparate devices, browsers, and network conditions across the globe.

A mature frontend observability architecture encompasses the three pillars of telemetry: **Error Monitoring**, **Real User Monitoring (RUM)** for Core Web Vitals, and **Distributed Tracing (OpenTelemetry)** for tracking requests end-to-end across frontend and microservice backends.

In this lesson, we will implement production error monitoring pipelines, configure automated source map uploading for stack trace de-minification, track Real User Monitoring metrics, structure logging formats, capture custom business telemetry, and connect OpenTelemetry traces.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        Frontend Observability Pipeline                 │
├────────────────────────────────────────────────────────────────────────┤
│ [ User Browser Event / Error / API Call ]                              │
│            │                                                           │
│     (Client Telemetry Collector: Web Vitals + Error SDK)               │
│            │                                                           │
│     (Batching & Beaconing) ──> navigator.sendBeacon() / Fetch          │
│            │                                                           │
│     [ Observability Gateway / Ingestion API ]                          │
│      ├── Error Tracker (Sentry / Datadog) <── (Private Source Maps)    │
│      ├── Real User Monitoring (RUM) (LCP, INP, CLS Analytics)          │
│      └── Distributed Tracing (OpenTelemetry / Jaeger Spans)            │
└────────────────────────────────────────────────────────────────────────┘
```

## Error Monitoring and Stack Trace De-minification

When an uncaught exception occurs in production, the browser logs a minified stack trace (e.g. `at e.t (bundle.min.js:1:2401)`), which is useless for debugging.

An error tracking pipeline (such as Sentry or Datadog) captures runtime errors, collects surrounding context (user ID, browser version, release tag, breadcrumbs of recent user clicks), and matches the minified line numbers against uploaded **Source Maps** to reconstruct the exact original TypeScript/JavaScript source code line:

```javascript
class TelemetryClient {
  constructor(endpoint, releaseVersion) {
    this.endpoint = endpoint;
    this.release = releaseVersion;
    this.breadcrumbs = [];
    this.initGlobalListeners();
  }

  recordBreadcrumb(category, message) {
    this.breadcrumbs.push({ category, message, timestamp: Date.now() });
    if (this.breadcrumbs.length > 30) this.breadcrumbs.shift(); // Keep last 30
  }

  initGlobalListeners() {
    window.addEventListener("error", (event) => {
      this.captureError(event.error || new Error(event.message));
    });

    window.addEventListener("unhandledrejection", (event) => {
      this.captureError(event.reason);
    });
  }

  captureError(error) {
    const payload = {
      name: error?.name || "Error",
      message: error?.message || String(error),
      stack: error?.stack,
      release: this.release,
      url: window.location.href,
      breadcrumbs: [...this.breadcrumbs],
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };

    // Reliable delivery using sendBeacon
    navigator.sendBeacon(this.endpoint, JSON.stringify(payload));
  }
}
```

## Real User Monitoring (RUM) with the `web-vitals` Library

Synthetic Lighthouse tests running on fast developer machines cannot capture the real-world performance experienced by users on low-end mobile hardware or patchy 3G networks. **Real User Monitoring (RUM)** captures actual Core Web Vitals metrics directly from real users:

```javascript
import { onLCP, onINP, onCLS, onFCP, onTTFB } from "web-vitals";

function sendMetricToAnalytics({ name, value, id, rating }) {
  const body = JSON.stringify({ name, value, id, rating, page: location.pathname });

  // Use sendBeacon to ensure telemetry delivers even if user closes the tab
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/telemetry/vitals", body);
  } else {
    fetch("/api/telemetry/vitals", { body, method: "POST", keepalive: true });
  }
}

// Subscribe to all Core Web Vitals
onLCP(sendMetricToAnalytics);
onINP(sendMetricToAnalytics);
onCLS(sendMetricToAnalytics);
onFCP(sendMetricToAnalytics);
onTTFB(sendMetricToAnalytics);
```

## Structured Logging

Production logging must avoid unstructured, arbitrary `console.log()` strings. Structured logs output machine-readable JSON formats containing timestamps, log severity levels (`info`, `warn`, `error`), trace IDs, and contextual metadata:

```javascript
class StructuredLogger {
  constructor(serviceName) {
    this.serviceName = serviceName;
  }

  #log(level, message, context = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      service: this.serviceName,
      message,
      context,
      traceId: window.activeTraceId || "none"
    };

    if (process.env.NODE_ENV === "development") {
      console[level === "error" ? "error" : "log"](
        `[${logEntry.timestamp}] [${level.toUpperCase()}] ${message}`,
        context
      );
    } else {
      // In production: stream to central logging ingestion
      navigator.sendBeacon("/api/logs", JSON.stringify(logEntry));
    }
  }

  info(msg, ctx) { this.#log("info", msg, ctx); }
  warn(msg, ctx) { this.#log("warn", msg, ctx); }
  error(msg, ctx) { this.#log("error", msg, ctx); }
}
```

## Distributed Tracing & OpenTelemetry (W3C Trace Context)

In modern microservice architectures, a user action on the frontend triggers a cascade of backend service calls. **Distributed Tracing** injects standard W3C `traceparent` headers into outgoing `fetch` requests, allowing backend services (API Gateway, Auth Service, Database) to correlate all logs under a single unified **Trace ID**:

```javascript
// Attaching W3C Trace Context to outgoing requests
function fetchWithTraceContext(url, options = {}) {
  const traceId = crypto.randomUUID().replaceAll("-", "");
  const spanId = crypto.randomUUID().substring(0, 16).replaceAll("-", "");
  
  // W3C Traceparent Header Format: version-traceId-spanId-flags
  const traceparent = `00-${traceId}-${spanId}-01`;

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      "traceparent": traceparent
    }
  });
}
```

## Custom Business Metrics and Performance Marks

Beyond standard system metrics, modern applications record custom performance milestones using the **User Timing API** (`performance.mark()` and `performance.measure()`).

Measuring how long it takes for custom interactive widgets to become usable—such as checkout calculation time or map rendering—provides actionable business telemetry directly in DevTools and APM dashboards:

```javascript
// Measuring custom user transaction latency
performance.mark("checkout-start");
await executeCheckoutWorkflow();
performance.mark("checkout-end");

performance.measure("checkout-duration", "checkout-start", "checkout-end");
const measures = performance.getEntriesByName("checkout-duration");
console.log("Checkout duration (ms):", measures[0].duration);
```

## Release Tracking and Production Debugging Strategies

When shipping frequent updates to production, associating errors and telemetry with exact **Release Tags** (e.g. Git commit SHAs) is vital.

Release tracking allows teams to instantly identify whether an error is a regression introduced by the latest deployment, monitor adoption of new client versions, and trigger automated canary rollbacks if error thresholds spike.

## Summary

Frontend observability transforms unpredictable client environments into measurable, actionable insights. Error monitoring captures stack traces mapped against private source maps with user breadcrumbs. Real User Monitoring (RUM) tracks Core Web Vitals via `navigator.sendBeacon()`. Structured JSON logging enables rapid querying, and distributed tracing with W3C `traceparent` headers correlates frontend actions with backend microservice workflows.

## Best Practices

1. **Use `navigator.sendBeacon()` for Telemetry**: Prevents dropped analytics payloads when users close browser tabs or navigate away.
2. **Sanitize PII in Telemetry**: Always scrub Personally Identifiable Information (passwords, credit cards, emails) from logs and error breadcrumbs.
3. **Automate Source Map Uploading in CI/CD**: Upload source maps during release builds to Sentry/Datadog and purge them from public hosting.
4. **Sample High-Volume Telemetry**: In high-traffic apps (>10M requests), sample telemetry (e.g. 10% of normal sessions, 100% of errors) to reduce ingestion costs.
5. **Set Up Actionable Error Alerts**: Configure alerting rules on error frequency spikes and regressions rather than alerting on every individual error.
