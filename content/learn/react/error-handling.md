---
title: "Error Handling & Error Boundaries"
technology: "react"
difficulty: "intermediate"
estimatedMinutes: 20
order: 26
description: "Handling runtime errors, building React Error Boundaries, displaying fallback UI, and integrating Sentry."
---

# Error Handling & Error Boundaries

In traditional web applications, an unhandled JavaScript error in a component often caused the entire React component tree to unmount, leaving the user with a completely blank white screen. React **Error Boundaries** solve this by catching runtime rendering errors anywhere in their child component tree, logging the error, and displaying a graceful fallback UI.

In this lesson, you will learn how to implement Error Boundaries, handle asynchronous errors, and integrate remote error tracking services like Sentry.

## What is an Error Boundary?

An Error Boundary is a React component that catches JavaScript errors anywhere in its child component tree during rendering, in lifecycle methods, and in constructors of class components.

Because functional components do not currently have a direct hook equivalent for `componentDidCatch`, Error Boundaries are implemented using class components or lightweight packages like `react-error-boundary`.

## Implementing an Error Boundary with `react-error-boundary`

The industry-standard approach is using the official `react-error-boundary` package:

```jsx
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert" className="p-6 rounded-2xl border border-red-200 bg-red-50 text-red-900">
      <h3 className="font-bold text-lg">Something went wrong</h3>
      <pre className="mt-2 text-xs font-mono bg-white p-3 rounded border border-red-200 overflow-auto">
        {error.message}
      </pre>
      <button
        onClick={resetErrorBoundary}
        className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700"
      >
        Try Again
      </button>
    </div>
  );
}

export function FeatureSection() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => console.log('Resetting error boundary state')}
    >
      <ComplexDataGrid />
    </ErrorBoundary>
  );
}
```

## What Error Boundaries Do NOT Catch

Error boundaries do not catch errors in:
1. **Event Handlers**: Use standard `try/catch` blocks inside `onClick` or `onSubmit` handlers.
2. **Asynchronous Code**: Network requests in `setTimeout` or `fetch` promises.
3. **Server-Side Rendering**: Errors during initial SSR compilation.

## Best Practices

- **Place Error Boundaries Strategically**: Place granular boundaries around independent widgets (like charts, comment sections, and feeds) so an isolated error does not crash the rest of the page.
- **Log Errors to Sentry/Datadog**: Always send caught exceptions to remote monitoring services for production debugging.
- **Provide Actionable Recovery**: Always give users a "Try Again" or "Return to Dashboard" button in fallback screens.

## Summary

Error Boundaries prevent isolated component failures from crashing entire applications. By isolating fragile features with error boundaries and handling asynchronous errors with try/catch, you deliver resilient, fault-tolerant web applications.
