---
title: 'API Versioning & Zero-Downtime Migration Strategies'
description: 'Master enterprise API evolution: URI versioning (/v1/), Header versioning, Media-Type negotiation, breaking vs non-breaking changes, Sunset headers, and zero-downtime migration.'
order: 43
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 50
prerequisites: ['/learn/http-and-apis/20-api-design']
---

# API Versioning & Zero-Downtime Migration Strategies

APIs are living systems that evolve over time. However, once an API is public or consumed by native mobile apps (where users may not update their app for months), changing response schemas or renaming fields will crash millions of active client applications.

Senior architects implement structured **API Versioning Strategies**, establish strict **Breaking Change Definitions**, and execute **Zero-Downtime Migration Pipelines**.

```text
┌─────────────────────────────────────────────────────────────┐
│                 API Evolution & Zero-Downtime Migration     │
│                                                             │
│  Phase 1: Additive Non-Breaking Expansion                   │
│  └── Introduce new optional fields alongside old fields.    │
│                                                             │
│  Phase 2: Deprecation Notice                                │
│  └── Add `Deprecation` & `Sunset` headers on old endpoints. │
│                                                             │
│  Phase 3: Dual-Writing & Adapter Layer                      │
│  └── API Gateway routes /v1 and /v2 to unified backend.     │
│                                                             │
│  Phase 4: Sunsetting & Safe Decommissioning                 │
│  └── Decommission /v1 after traffic metrics reach 0.00%.    │
└─────────────────────────────────────────────────────────────┘
```

## 1. What Constitutes a Breaking Change?

| Modification | Breaking or Non-Breaking? |
| :--- | :--- |
| **Adding a new optional field** to response JSON | ✅ Non-Breaking |
| **Adding a new endpoint** | ✅ Non-Breaking |
| **Renaming an existing field** (`user_name` -> `username`) | ❌ **BREAKING** |
| **Removing an existing field** | ❌ **BREAKING** |
| **Changing data types** (`price: 100` -> `price: "$100"`) | ❌ **BREAKING** |
| **Adding a new REQUIRED parameter** to a request | ❌ **BREAKING** |

## Summary & Key Takeaways

- Never introduce breaking changes into an active API version.
- Use additive design to expand schemas without version bumps.
- Announce retirements using standard `Sunset` and `Deprecation` HTTP headers.

## Best Practices & Senior Guidance

1. **Enforce Automated Schema Diff Checking in CI**: Run tools like `oasdiff` in GitHub Actions to automatically fail PRs that introduce breaking changes to the OpenAPI specification.
