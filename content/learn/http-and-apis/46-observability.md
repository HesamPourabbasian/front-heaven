---
title: 'API Observability: OpenTelemetry, Metrics & SLOs'
description: 'Master enterprise API observability: OpenTelemetry distributed tracing, Trace IDs & Span IDs, P95/P99 latency metrics, Error Budgets, and Service Level Objectives (SLIs / SLOs).'
order: 46
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 55
prerequisites: ['/learn/http-and-apis/23-error-handling']
---

# API Observability: OpenTelemetry, Metrics & SLOs

In modern distributed microservice architectures, knowing *that* a system is failing is not enough—you must know *where*, *why*, and *which dependency* caused the regression.

**Observability** provides actionable visibility across the Three Pillars: **Structured JSON Logs**, **Distributed Traces (OpenTelemetry)**, and **Aggregated Metrics (P95/P99 Latency, Throughput, Error Rates)**.

```text
┌─────────────────────────────────────────────────────────────┐
│                 OpenTelemetry Distributed Tracing           │
│                                                             │
│  Trace ID: 4bf92f3577b34da6a3ce929d0e0e4736                 │
│                                                             │
│  [API Gateway: GET /checkout] ──────────────────── (145ms)  │
│    ├── [Auth Service: Verify JWT] ────── (12ms)             │
│    ├── [Billing Service: Stripe Charge] ────────── (98ms)   │
│    └── [Inventory Service: Reserve Item] ── (22ms)          │
│                                                             │
│  Identifies the exact bottleneck service in milliseconds!   │
└─────────────────────────────────────────────────────────────┘
```

## 1. Core Service Level Metrics (SLIs & SLOs)

- **Service Level Indicator (SLI)**: A quantifiable metric measured in production (e.g. Percentage of successful requests completed in $< 200\text{ms}$).
- **Service Level Objective (SLO)**: The target reliability commitment agreed with product teams (e.g. $99.9\%$ of API requests must return $2xx$ status codes over a rolling 30-day window).
- **Latency Percentiles**:
  - **P50 (Median)**: Half of all users experience this latency.
  - **P95 / P99**: Captures the slowest $5\%$ and $1\%$ of user requests (identifies cold starts, cache misses, and database locking).

## Summary & Key Takeaways

- OpenTelemetry standardizes traces, metrics, and logs across cloud providers.
- Distributed traces follow a single Trace ID across all downstream services.
- P95 and P99 latency percentiles expose real-world user degradation.

## Best Practices & Senior Guidance

1. **Monitor P99 Latency, Not Averages**: An average latency of 150ms can conceal the fact that 5% of users are suffering from 4-second timeouts.
