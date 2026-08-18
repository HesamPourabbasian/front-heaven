---
title: 'Intermediate Projects'
description: 'Build 7 complete intermediate TypeScript architectures: E-commerce Engine, Typed REST API Client, Admin Dashboard, Authentication System, CRUD App, and SaaS Multi-Tenant Manager.'
order: 23
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 45
prerequisites:
  - /learn/typescript/22-testing
---

# Intermediate Projects

At the intermediate level, TypeScript is used to design multi-tier application architectures, manage secure user authentication, orchestrate complex state transformations, and build resilient HTTP API client libraries.

In this lesson, we build seven comprehensive, real-world intermediate systems combining generics, utility types, DTO patterns, abstract classes, and custom error boundaries.

```text
┌────────────────────────────────────────────────────────────┐
│                 Intermediate Projects Suite                │
├──────────────────────────────┬─────────────────────────────┤
│ 1. Typed E-Commerce Engine   │ 5. Full-Stack CRUD Manager  │
│ (Discounts, Tax, Checkout)   │ (Repository, Pagination)    │
├──────────────────────────────┼─────────────────────────────┤
│ 2. Resilient API Client      │ 6. Multi-Currency Tracker   │
│ (Retry, Interceptors, Axios) │ (Exchange, Category Stats)  │
├──────────────────────────────┼─────────────────────────────┤
│ 3. RBAC Admin Dashboard      │ 7. SaaS Multi-Tenant Engine │
│ (Permissions, Data Tables)   │ (Subscriptions, Usage Quota)│
├──────────────────────────────┴─────────────────────────────┤
│ 4. JWT Auth & Session System (Refresh Tokens, Guards)      │
└────────────────────────────────────────────────────────────┘
```

## Project 1: Typed E-Commerce Checkout Engine

A comprehensive e-commerce cart, discount, and taxation processing system:

```typescript
export interface Product {
  readonly id: string;
  name: string;
  priceCents: number;
  taxCategory: "standard" | "reduced" | "exempt";
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type DiscountRule =
  | { type: "percentage"; percent: number }
  | { type: "fixed"; amountCents: number }
  | { type: "buyXGetYFree"; buyQuantity: number; freeQuantity: number };

export interface OrderBreakdown {
  subtotalCents: number;
  discountCents: number;
  taxCents: number;
  totalCents: number;
  itemCount: number;
}

export class CheckoutEngine {
  private items: Map<string, CartItem> = new Map();

  public addItem(product: Product, quantity: number = 1): void {
    const existing = this.items.get(product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.set(product.id, { product, quantity });
    }
  }

  public calculateBreakdown(discount?: DiscountRule, taxRate: number = 0.08): OrderBreakdown {
    const itemsList = Array.from(this.items.values());
    const subtotal = itemsList.reduce((sum, item) => sum + item.product.priceCents * item.quantity, 0);

    let discountAmount = 0;
    if (discount) {
      switch (discount.type) {
        case "percentage":
          discountAmount = Math.round((subtotal * discount.percent) / 100);
          break;
        case "fixed":
          discountAmount = Math.min(discount.amountCents, subtotal);
          break;
        case "buyXGetYFree":
          // Complex discount calculation logic...
          break;
      }
    }

    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const tax = Math.round(taxableAmount * taxRate);

    return {
      subtotalCents: subtotal,
      discountCents: discountAmount,
      taxCents: tax,
      totalCents: taxableAmount + tax,
      itemCount: itemsList.reduce((sum, item) => sum + item.quantity, 0),
    };
  }
}
```

## Project 2: Resilient Generic API Client with Retry

A robust HTTP client with automatic retry logic, interceptors, and strict response typing:

```typescript
export interface RequestConfig extends RequestInit {
  retries?: number;
  retryDelayMs?: number;
  timeoutMs?: number;
}

export class ApiClient {
  constructor(private readonly baseUrl: string, private readonly defaultHeaders: Record<string, string> = {}) {}

  public async request<TData>(endpoint: string, config: RequestConfig = {}): Promise<TData> {
    const { retries = 2, retryDelayMs = 1000, timeoutMs = 8000, ...fetchOptions } = config;
    const url = `${this.baseUrl}${endpoint}`;

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        const response = await fetch(url, {
          ...fetchOptions,
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            ...this.defaultHeaders,
            ...fetchOptions.headers,
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
        }

        return (await response.json()) as TData;
      } catch (err: unknown) {
        lastError = err instanceof Error ? err : new Error(String(err));
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, retryDelayMs * Math.pow(2, attempt)));
        }
      }
    }

    throw lastError ?? new Error(`Request to ${url} failed after ${retries} retries.`);
  }
}
```

## Project 3: Role-Based Access Control (RBAC) Admin Dashboard

A permission matrix system validating role access across administrative resources:

```typescript
export type UserRole = "superadmin" | "manager" | "analyst" | "support";

export type PermissionAction = "create" | "read" | "update" | "delete" | "export";
export type ResourceDomain = "users" | "billing" | "reports" | "systemLogs";

export type PermissionKey = `${ResourceDomain}:${PermissionAction}`;

const ROLE_PERMISSIONS: Record<UserRole, readonly PermissionKey[]> = {
  superadmin: [
    "users:create", "users:read", "users:update", "users:delete", "users:export",
    "billing:create", "billing:read", "billing:update", "billing:delete",
    "reports:read", "reports:export", "systemLogs:read"
  ],
  manager: ["users:read", "users:update", "billing:read", "reports:read", "reports:export"],
  analyst: ["reports:read", "reports:export", "users:read"],
  support: ["users:read", "users:update"],
};

export class AccessControlGuard {
  public static hasPermission(role: UserRole, permission: PermissionKey): boolean {
    const permissions = ROLE_PERMISSIONS[role];
    return permissions ? permissions.includes(permission) : false;
  }

  public static requirePermission(role: UserRole, permission: PermissionKey): void {
    if (!this.hasPermission(role, permission)) {
      throw new Error(`Access Denied: Role '${role}' lacks permission '${permission}'`);
    }
  }
}
```

## Project 4: JWT Authentication & Session Token Refresher

Handling access token expiration, token refresh queues, and secure session management:

```typescript
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresInSeconds: number;
}

export interface UserSession {
  userId: string;
  email: string;
  role: UserRole;
  tokens: AuthTokens;
  issuedAt: Date;
}

export class SessionManager {
  private session: UserSession | null = null;
  private refreshPromise: Promise<AuthTokens> | null = null;

  public setSession(session: UserSession): void {
    this.session = session;
  }

  public isTokenExpired(): boolean {
    if (!this.session) return true;
    const expirationTime = this.session.issuedAt.getTime() + this.session.tokens.expiresInSeconds * 1000;
    // Buffer of 60 seconds
    return Date.now() >= expirationTime - 60000;
  }

  public async getValidAccessToken(refreshFn: (refreshToken: string) => Promise<AuthTokens>): Promise<string> {
    if (!this.session) throw new Error("No active session found.");

    if (!this.isTokenExpired()) {
      return this.session.tokens.accessToken;
    }

    // Deduplicate simultaneous refresh calls using a shared Promise
    if (!this.refreshPromise) {
      this.refreshPromise = refreshFn(this.session.tokens.refreshToken)
        .then(newTokens => {
          if (this.session) {
            this.session.tokens = newTokens;
            this.session.issuedAt = new Date();
          }
          this.refreshPromise = null;
          return newTokens;
        })
        .catch(err => {
          this.session = null;
          this.refreshPromise = null;
          throw err;
        });
    }

    const refreshed = await this.refreshPromise;
    return refreshed.accessToken;
  }
}
```

## Project 5: Full-Stack Generic CRUD Repository

A generic repository abstracting paginated entity queries, sorting, and filters:

```typescript
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export class InMemoryCrudRepository<T extends BaseEntity> {
  private store: Map<string, T> = new Map();

  public async create(item: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<T> {
    const entity = {
      ...item,
      id: `ent_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as T;

    this.store.set(entity.id, entity);
    return entity;
  }

  public async findPage(params: PaginationParams): Promise<PaginatedResult<T>> {
    const all = Array.from(this.store.values());
    const startIndex = (params.page - 1) * params.limit;
    const paginatedItems = all.slice(startIndex, startIndex + params.limit);

    return {
      data: paginatedItems,
      total: all.length,
      page: params.page,
      totalPages: Math.ceil(all.length / params.limit),
    };
  }
}
```

## Project 6: SaaS Multi-Tenant Quota & Billing Manager

A subscription tier engine that limits tenant usage based on plan limits:

```typescript
export type SubscriptionPlan = "free" | "starter" | "enterprise";

export interface PlanQuota {
  maxMembers: number;
  maxProjects: number;
  monthlyStorageGb: number;
  hasCustomDomain: boolean;
}

export const PLAN_LIMITS: Record<SubscriptionPlan, PlanQuota> = {
  free: { maxMembers: 3, maxProjects: 5, monthlyStorageGb: 1, hasCustomDomain: false },
  starter: { maxMembers: 15, maxProjects: 50, monthlyStorageGb: 25, hasCustomDomain: true },
  enterprise: { maxMembers: Infinity, maxProjects: Infinity, monthlyStorageGb: 1000, hasCustomDomain: true },
};

export class TenantQuotaGuard {
  constructor(public readonly plan: SubscriptionPlan) {}

  public canCreateProject(currentProjectCount: number): boolean {
    const quota = PLAN_LIMITS[this.plan];
    return currentProjectCount < quota.maxProjects;
  }

  public assertStorageAvailable(currentStorageGb: number, incomingFileSizeGb: number): void {
    const quota = PLAN_LIMITS[this.plan];
    if (currentStorageGb + incomingFileSizeGb > quota.monthlyStorageGb) {
      throw new Error(`Storage limit reached for plan '${this.plan}'. Please upgrade.`);
    }
  }
}
```

## Summary

- The Checkout Engine demonstrates clean separation of taxation, discounts, and order breakdowns.
- The API Client implements exponential backoff retries with TypeScript generics.
- The RBAC system combines template literal types (`${Domain}:${Action}`) with permission guards.
- The Session Manager prevents token refresh race conditions using shared Promise memoization.
- The In-Memory CRUD repository demonstrates generic constraints and standardized pagination models.
- The SaaS Multi-Tenant Manager protects business resource limits using plan configuration matrices.

## Best Practices

1. **Memoize Asynchronous Authentication Refreshes**: Prevent duplicate concurrent token refresh requests by storing the active refresh Promise.
2. **Use Template Literal Types for Granular Permissions**: Model permission strings as `${Domain}:${Action}` for exhaustive autocomplete across all RBAC operations.
3. **Encapsulate Domain Rules in Concrete Methods**: Do not allow client code to mutate order subtotals directly; enforce all business logic through tested domain classes.
4. **Standardize Pagination Responses**: Use a generic `PaginatedResult<T>` structure across all search and listing endpoints in your APIs.
