---
title: 'API Contracts: OpenAPI, JSON Schema & Code Gen'
description: 'Master Contract-First API development: OpenAPI 3.1, JSON Schema, Protocol Buffers, runtime validation with Zod / TypeBox, and automated end-to-end type-safe client generation.'
order: 44
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 50
prerequisites: ['/learn/http-and-apis/29-api-documentation']
---

# API Contracts: OpenAPI, JSON Schema & Code Gen

In modern software engineering, manual TypeScript interface declarations are a liability. When backend developers modify a database schema, frontend interfaces quickly drift out of synchronization, leading to runtime `TypeError: Cannot read property of undefined` bugs in production.

**Contract-First Development** treats the API schema (OpenAPI 3.1 / JSON Schema / Protobuf) as the single source of truth, generating both backend server route validators and frontend type-safe HTTP client SDKs automatically.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Contract-First Automated Pipeline           │
│                                                             │
│                   openapi.yaml (Single Truth)               │
│                               │                             │
│         ┌─────────────────────┴─────────────────────┐       │
│         ▼                                           ▼       │
│  Backend Route Validation                 Frontend Type-Safe│
│  (Zod / TypeBox / Fastify)                Client SDK        │
│                                           (openapi-fetch)   │
└─────────────────────────────────────────────────────────────┘
```

## 1. Type-Safe Data Fetching with `openapi-fetch`

Using `openapi-fetch`, your frontend code receives full autocompletion for endpoint URLs, query parameters, request bodies, and typed response data:

```typescript
import createClient from 'openapi-fetch';
import type { paths } from './types/api-schema';

const client = createClient<paths>({ baseUrl: 'https://api.front-heaven.com/v1' });

// 100% Type-safe! TypeScript validates params and return shape:
const { data, error } = await client.GET('/users/{id}', {
  params: {
    path: { id: 'u123' },
    query: { fields: ['id', 'name'] }
  }
});
```

## Summary & Key Takeaways

- Contract-first design establishes schemas as the single source of truth before code is written.
- Eliminates manual TypeScript interface maintenance across frontend and backend.
- Runtime validators (Zod) guarantee that incoming data matches expected contracts.

## Best Practices & Senior Guidance

1. **Automate SDK Generation in CI**: Re-generate and publish frontend SDK packages whenever the backend OpenAPI specification is merged.
