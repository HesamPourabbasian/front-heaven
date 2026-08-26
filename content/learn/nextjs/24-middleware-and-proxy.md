---
title: 'Middleware, Edge Routing & Request Interception'
description: 'Master Next.js Middleware (middleware.ts): Edge runtime execution, request interception, route protection, redirects vs rewrites, custom response headers, and matcher optimization.'
order: 24
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 35
prerequisites:
  - /learn/nextjs/21-authentication
---

# Middleware, Edge Routing & Request Interception

**Middleware (`middleware.ts`)** is a powerful request interceptor that executes at the network edge *before* a request reaches any route handler, layout, or page. Middleware allows you to inspect incoming cookies, verify authentication tokens, rewrite internal URLs for multi-tenancy, redirect legacy paths, and inject custom security headers.

In this lesson, you will master the `middleware.ts` file convention, edge execution limitations, redirects vs rewrites, and matcher configuration.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Next.js Middleware Execution Flow                        │
├─────────────────────────────────────────────────────────────────────────────┤
│  Incoming HTTP Request                                                      │
│         │                                                                   │
│         ▼                                                                   │
│  middleware.ts (Edge Runtime Execution)                                     │
│         ├── Matcher Filter (e.g. /dashboard/:path*)                         │
│         ├── Inspects Cookies / Session Token                                │
│         │     ├── Invalid ──> NextResponse.redirect('/login')               │
│         │     └── Valid   ──> Injects x-user-id header                      │
│         │                                                                   │
│         ▼                                                                   │
│  NextResponse.next() ──> Proceeds to Server Component / Route Handler       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Creating `middleware.ts`

Place `middleware.ts` in the root of your project (or inside `src/`):

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('session_token')?.value;
  const { pathname } = request.nextUrl;

  // Protect /dashboard routes
  if (pathname.startsWith('/dashboard') && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Inject custom security tracking headers
  const response = NextResponse.next();
  response.headers.set('x-custom-edge-region', 'us-east-1');
  return response;
}

// Optimization: Specify which routes invoke middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, svg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

---

## 2. Redirects vs Rewrites

- **`NextResponse.redirect()`**: Changes the browser URL and issues an HTTP 307/308 redirect.
- **`NextResponse.rewrite()`**: Proxies the request internally to a different path without changing the URL shown in the user's browser (essential for multi-tenant subdomains like `tenant.myplatform.com` -> `app/tenants/[id]`).

```typescript
// Multi-tenant subdomain rewriting example
export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const subdomain = hostname.split('.')[0];

  if (subdomain && subdomain !== 'www' && subdomain !== 'app') {
    // Rewrites internal path to /tenants/[subdomain] while keeping user URL intact!
    return NextResponse.rewrite(new URL(`/tenants/${subdomain}${request.nextUrl.pathname}`, request.url));
  }

  return NextResponse.next();
}
```

---

## Summary & Key Takeaways

- Middleware executes at the Edge before route rendering.
- Use `matcher` to exclude static assets, images, and public fonts from invoking middleware.
- `NextResponse.redirect()` updates the browser URL; `NextResponse.rewrite()` proxies internally.
- Middleware operates on a lightweight Edge runtime (Node.js native packages like `fs` or full ORMs cannot be used directly in middleware).

## Best Practices & Senior Guidance

1. **Keep Middleware Ultra-Light**: Avoid connecting to heavy SQL databases inside middleware; verify signed cryptographic JWT cookies instead.
2. **Always Use Negative Matcher Regex**: Filtering out `_next/static` and static images prevents wasting serverless invocation compute on asset requests.
