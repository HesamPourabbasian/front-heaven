---
title: 'API Documentation: OpenAPI 3.1 & Swagger'
description: 'Master API documentation: OpenAPI Specification 3.1, Swagger UI, JSON Schema definitions, request/response examples, authentication schemes, and automated client generation.'
order: 29
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 45
prerequisites: ['/learn/http-and-apis/20-api-design']
---

# API Documentation: OpenAPI 3.1 & Swagger

An API is only as good as its documentation. Without clear, machine-readable specifications, frontend and backend teams suffer from constant communication friction, out-of-sync data contracts, and integration bugs.

The **OpenAPI Specification (OAS 3.1)** is the vendor-neutral, industry-standard format for describing REST APIs. Powered by tools like **Swagger UI** and **Stoplight**, OpenAPI definitions generate interactive documentation, mock servers, and type-safe TypeScript client SDKs automatically.

```text
┌─────────────────────────────────────────────────────────────┐
│                 OpenAPI Contract Ecosystem                  │
│                                                             │
│                 openapi.yaml (OAS 3.1 Spec)                 │
│                              │                              │
│         ┌────────────────────┼────────────────────┐         │
│         ▼                    ▼                    ▼         │
│   Swagger UI           Mock Server       TypeScript SDK Gen │
│ (Interactive Docs)   (Local Testing)   (openapi-typescript) │
└─────────────────────────────────────────────────────────────┘
```

## 1. Sample OpenAPI 3.1 Document

```yaml
openapi: 3.1.0
info:
  title: Front-Heaven API
  version: 1.0.0
  description: Enterprise Frontend Learning Platform API

paths:
  /users/{id}:
    get:
      summary: Fetch user by ID
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: User found successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '404':
          description: User not found

components:
  schemas:
    User:
      type: object
      required: [id, name, email]
      properties:
        id:
          type: string
        name:
          type: string
        email:
          type: string
          format: email
```

## 2. Generating Type-Safe TypeScript SDKs

Using tools like `openapi-typescript`, you can generate 100% type-safe TypeScript definitions directly from your backend's `openapi.yaml`:

```bash
npx openapi-typescript https://api.front-heaven.com/openapi.json -o src/types/api-schema.d.ts
```

## Summary & Key Takeaways

- OpenAPI 3.1 is the universal standard for describing REST APIs.
- Swagger UI renders interactive documentation where developers can execute live requests.
- Type generators create TypeScript interfaces directly from OpenAPI schemas, eliminating manual type syncing.

## Best Practices & Senior Guidance

1. **Practice Contract-First Design**: Agree on the OpenAPI specification with frontend and backend stakeholders before writing backend implementation code.
