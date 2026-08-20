---
title: 'HTTP Architecture & Interceptors'
description: 'Master Angular HTTP architecture: functional HTTP interceptors (HttpInterceptorFn), auth token injection, global error handling, retry with exponential backoff, caching, and HttpContext.'
order: 19
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 45
prerequisites: ['/learn/angular/11-http']
---

# HTTP Architecture & Interceptors

In enterprise applications, raw HTTP requests should never be made directly without a centralized network architecture. Applications require global authentication token injection, automated token refresh workflows, uniform error logging, notification toasts for network failures, intelligent request retries with exponential backoff, and selective caching.

Angular provides **Functional HTTP Interceptors** (`HttpInterceptorFn`) configured via `withInterceptors([authInterceptor, errorInterceptor])` inside `provideHttpClient()`. Interceptors form an immutable middleware pipeline through which every outgoing `HttpRequest` and incoming `HttpResponse` passes.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Angular HTTP Interceptor Pipeline           │
│                                                             │
│  Outgoing Request:                                          │
│  HttpClient.get('/api/orders')                              │
│       │                                                     │
│       ▼                                                     │
│  [Auth Interceptor] ──> Adds 'Authorization: Bearer <JWT>'  │
│       │                                                     │
│       ▼                                                     │
│  [Logging Interceptor] ──> Records timestamp & URL          │
│       │                                                     │
│       ▼                                                     │
│  [Browser Fetch / Backend Server]                           │
│       │                                                     │
│  Incoming Response:                                         │
│       ▼                                                     │
│  [Caching Interceptor] ──> Stores response in memory cache  │
│       │                                                     │
│       ▼                                                     │
│  [Error Interceptor] ──> Catches 401/500, displays toast   │
│       │                                                     │
│       ▼                                                     │
│  Subscriber receives clean typed data                       │
└─────────────────────────────────────────────────────────────┘
```

## 1. Authentication Interceptor (`HttpInterceptorFn`)

An authentication interceptor inspects outgoing requests and clones them with a Bearer JWT header:

```typescript
// src/app/core/http/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  // If token exists and request is targeting our API, attach Bearer header
  if (token && req.url.startsWith('/api')) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq);
  }

  return next(req);
};
```

## 2. Global Error Handling Interceptor

The error interceptor catches HTTP errors, displays notifications, and handles session expiry (401 Unauthorized):

```typescript
// src/app/core/http/error.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const notifier = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let userFriendlyMessage = 'An unexpected network error occurred.';

      if (error.status === 401) {
        userFriendlyMessage = 'Your session has expired. Please log in again.';
        router.navigate(['/login']);
      } else if (error.status === 403) {
        userFriendlyMessage = 'You do not have permission to perform this action.';
      } else if (error.status >= 500) {
        userFriendlyMessage = 'Internal server error. Our team has been notified.';
      }

      notifier.showError(userFriendlyMessage);
      return throwError(() => error);
    })
  );
};
```

## 3. Retry Strategy with Exponential Backoff

For transient network failures, use RxJS `retry` with an exponential backoff delay:

```typescript
// src/app/core/http/retry.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { retry, timer } from 'rxjs';

export const retryInterceptor: HttpInterceptorFn = (req, next) => {
  // Only retry GET requests (idempotent operations)
  if (req.method !== 'GET') {
    return next(req);
  }

  return next(req).pipe(
    retry({
      count: 3,
      delay: (error, retryCount) => {
        // Backoff: 1s, 2s, 4s
        const backoffMs = Math.pow(2, retryCount - 1) * 1000;
        console.warn(`[HTTP Retry] Attempt #${retryCount} after ${backoffMs}ms due to:`, error);
        return timer(backoffMs);
      }
    })
  );
};
```

## 4. Fine-Tuning Interceptors with `HttpContext`

When specific requests need to bypass an interceptor (e.g. skipping auth headers or skipping loading spinners), use `HttpContext`:

```typescript
// src/app/core/http/http-context.tokens.ts
import { HttpContextToken } from '@angular/common/http';

export const BYPASS_AUTH = new HttpContextToken<boolean>(() => false);
export const SILENT_REQUEST = new HttpContextToken<boolean>(() => false);
```

Usage in service:

```typescript
import { HttpClient, HttpContext } from '@angular/common/http';
import { BYPASS_AUTH } from './http-context.tokens';

this.http.get('/api/public/status', {
  context: new HttpContext().set(BYPASS_AUTH, true)
});
```

Checking in interceptor:

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.context.get(BYPASS_AUTH)) {
    return next(req); // Bypass auth header injection
  }
  // ... attach token
};
```

## 5. Registering Interceptors in `app.config.ts`

```typescript
// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/http/auth.interceptor';
import { retryInterceptor } from './core/http/retry.interceptor';
import { errorInterceptor } from './core/http/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withFetch(),
      withInterceptors([
        authInterceptor,
        retryInterceptor,
        errorInterceptor
      ])
    )
  ]
};
```

## Summary & Key Takeaways

- Functional HTTP Interceptors (`HttpInterceptorFn`) create a centralized request/response pipeline.
- Interceptors clone immutable `HttpRequest` objects to attach headers like Bearer tokens.
- Global error interceptors catch status codes (401, 403, 500) and trigger redirects and toasts.
- `retry()` with exponential backoff makes idempotent GET requests resilient to network hiccups.
- `HttpContext` allows individual HTTP calls to pass metadata flags to interceptors.

## Best Practices & Senior Guidance

1. **Only Retry Idempotent Requests**: Never automatically retry POST or PATCH requests, as this can result in duplicate payments or double form submissions.
2. **Order Interceptors Intentionally**: Interceptors execute in the array order registered in `withInterceptors([...])`. Place auth and logging first, error handlers last.
3. **Always Clone Requests**: `HttpRequest` objects are immutable. Never attempt to mutate properties directly; always call `req.clone({ ... })`.
