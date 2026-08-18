---
title: 'Reliability Engineering, Circuit Breakers & Resilience'
description: 'Master enterprise front-end reliability: Graceful Degradation, Circuit Breaker design pattern, Chaos Engineering, Timeout Management, Kill Switches, and Partial Failure recovery.'
order: 19
difficulty: 'advanced'
category: 'Senior Front-End Engineering'
estimatedMinutes: 45
prerequisites:
  - /learn/advanced-topics/18-observability
---

# Reliability Engineering, Circuit Breakers & Resilience

Production web applications must be resilient to partial outages. If a third-party analytics script hangs, an external payment gateway returns 500 errors, or the user's mobile network drops into a tunnel, the application must **degrade gracefully** rather than crashing with a white screen of death.

In this lesson, we explore **Site Reliability Engineering (SRE)** principles for the front-end: the **Circuit Breaker Pattern**, Timeout Management, Global Error Boundaries, Kill Switches, and Offline Fallbacks.

```text
┌────────────────────────────────────────────────────────────┐
│               Front-End Circuit Breaker States             │
├────────────────────────────────────────────────────────────┤
│ [ CLOSED (Normal Operation) ]                              │
│       │                                                    │
│       ▼ (Consecutive Failures Exceed Threshold, e.g. 5)    │
│ [ OPEN (Fails Fast Immediately without Calling Backend) ]  │
│       │                                                    │
│       ▼ (Cool-off Timer Expires, e.g. 30 seconds)          │
│ [ HALF-OPEN (Trial Request Sent to Probe Backend Health) ] │
│       ├── (Success) ──► Transitions back to CLOSED         │
│       └── (Failure) ──► Re-opens and resets cool-off timer │
└────────────────────────────────────────────────────────────┘
```

## 1. The Circuit Breaker Pattern on the Front-End

When a backend microservice fails, continuing to hammer it with hundreds of retry requests wastes client CPU/battery and prevents the server from recovering.

A **Circuit Breaker** wraps API calls with stateful fault detection:

```typescript
export type CircuitState = "CLOSED" | "OPEN" | "HALF_OPEN";

export class CircuitBreaker {
  private state: CircuitState = "CLOSED";
  private failureCount = 0;
  private nextAttempt = Date.now();

  constructor(
    private readonly failureThreshold = 5,
    private readonly coolOffPeriodMs = 30000
  ) {}

  public async execute<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
    if (this.state === "OPEN") {
      if (Date.now() > this.nextAttempt) {
        this.state = "HALF_OPEN"; // Try a trial request
      } else {
        // Fail fast immediately and return safe fallback!
        return fallback;
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (err) {
      this.onFailure();
      return fallback;
    }
  }

  private onSuccess() {
    this.failureCount = 0;
    this.state = "CLOSED";
  }

  private onFailure() {
    this.failureCount++;
    if (this.failureCount >= this.failureThreshold) {
      this.state = "OPEN";
      this.nextAttempt = Date.now() + this.coolOffPeriodMs;
    }
  }
}
```

## 2. Graceful Degradation & Partial Failure UI

In modular web applications (like e-commerce portals), independent sections of the page should fail in isolation without bringing down the entire experience:

```text
┌────────────────────────────────────────────────────────────┐
│                      E-Commerce Layout                     │
├────────────────────────────────────────────────────────────┤
│ [ Product Image & Add-to-Cart Form (Working) ]             │
├────────────────────────────────────────────────────────────┤
│ [ Recommended Products Section (API Down!) ]               │
│ └── Gracefully Degrades: Shows static "Top Sellers" cache  │
├────────────────────────────────────────────────────────────┤
│ [ Live Customer Reviews Section (Timeout!) ]               │
│ └── Gracefully Degrades: Shows "Reviews temporarily offline│
└────────────────────────────────────────────────────────────┘
```

Wrap independent widgets in **Error Boundaries** so unexpected runtime exceptions in secondary widgets do not crash primary purchasing flows.

## 3. Remote Kill Switches

A **Kill Switch** is an emergency feature flag that allows engineering teams to disable a broken feature globally across millions of active client sessions within seconds, without deploying new code:

```typescript
export function renderPaymentMethods(killSwitches: Record<string, boolean>) {
  if (killSwitches.DISABLE_APPLE_PAY_V2) {
    // Fall back to standard credit card form immediately
    return renderCreditCardForm();
  }
  return renderApplePayButton();
}
```

## 4. Strict Timeout Management with `Promise.race`

Never allow an HTTP request to hang indefinitely. Always enforce a hard timeout:

```typescript
export async function withTimeout<T>(promise: Promise<T>, timeoutMs = 8000): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]);
}
```

## Summary

- Reliability engineering ensures applications degrade gracefully during partial network or service failures.
- The Circuit Breaker pattern prevents client request storms against struggling backend services by failing fast.
- Error Boundaries isolate UI crashes to individual components, preventing full-page whiteouts.
- Remote Kill Switches disable broken features in real time without requiring emergency production deployments.
- Hard timeouts (`Promise.race`) ensure hanging requests fail gracefully and trigger fallback flows.

## Best Practices

1. **Wrap All Secondary Widgets in Error Boundaries**: Never let recommendations or analytics crash checkout.
2. **Enforce Hard Timeouts on All Network Calls**: Reject requests taking longer than 8-10 seconds.
3. **Use Circuit Breakers for Non-Critical APIs**: Protect third-party integrations from degrading application performance.
4. **Implement Offline Cache Fallbacks**: Cache recent query responses locally so users can browse in offline mode.
