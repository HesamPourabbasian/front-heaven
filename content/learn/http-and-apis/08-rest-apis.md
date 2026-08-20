---
title: 'REST APIs & Resource-Oriented Architecture'
description: 'Master REST architecture: what an API is, Roy Fielding's REST constraints, resource-oriented endpoint design, CRUD operations, statelessness, and naming conventions.'
order: 8
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 40
prerequisites: ['/learn/http-and-apis/03-http-methods']
---

# REST APIs & Resource-Oriented Architecture

An **API** (Application Programming Interface) is a defined contract through which software systems exchange data and trigger operations. In modern web development, the dominant architectural style for building web APIs is **REST** (Representational State Transfer), introduced by Dr. Roy Fielding in his landmark 2000 doctoral dissertation.

A **RESTful API** organizes system capabilities around **Resources** (data entities such as users, products, orders) identified by stable URIs and manipulated using standard HTTP methods.

```text
┌─────────────────────────────────────────────────────────────┐
│                 RESTful Resource Endpoint Mapping           │
├─────────┬───────────────────────┬───────────────────────────┤
│ Method  │ Endpoint URI          │ Semantic CRUD Action      │
├─────────┼───────────────────────┼───────────────────────────┤
│ GET     │ /api/v1/articles      │ Read article collection   │
├─────────┼───────────────────────┼───────────────────────────┤
│ POST    │ /api/v1/articles      │ Create a new article      │
├─────────┼───────────────────────┼───────────────────────────┤
│ GET     │ /api/v1/articles/42   │ Read article with ID 42   │
├─────────┼───────────────────────┼───────────────────────────┤
│ PUT     │ /api/v1/articles/42   │ Replace entire article 42 │
├─────────┼───────────────────────┼───────────────────────────┤
│ PATCH   │ /api/v1/articles/42   │ Partial update article 42 │
├─────────┼───────────────────────┼───────────────────────────┤
│ DELETE  │ /api/v1/articles/42   │ Delete article 42         │
└─────────┴───────────────────────┴───────────────────────────┘
```

## 1. The Core Constraints of REST

To be truly RESTful, a system must satisfy six foundational constraints:
1. **Client-Server Separation**: The user interface (frontend client) is completely decoupled from data storage and business logic (backend server).
2. **Statelessness**: Every request contains all necessary credentials and context; the server stores no client session context.
3. **Cacheability**: Responses must explicitly define whether they are cacheable to prevent redundant network round-trips.
4. **Uniform Interface**: Resources are identified by URIs, manipulated via representations (JSON), and accompanied by self-descriptive metadata headers.
5. **Layered System**: Clients cannot distinguish whether they are connected directly to the end server or an intermediate proxy, load balancer, or CDN.
6. **Code on Demand (Optional)**: Servers can temporarily extend client functionality by transmitting executable code (e.g. JavaScript).

## 2. Resource Naming Conventions in REST

Professional REST APIs adhere to strict naming conventions:

- **Use Plural Nouns for Collections**:
  - ✅ `/api/v1/users`
  - ❌ `/api/v1/user` or `/api/v1/getUsers`
- **Never Put Verbs in URLs**: The HTTP method specifies the verb!
  - ✅ `DELETE /api/v1/products/42`
  - ❌ `POST /api/v1/deleteProduct?id=42`
- **Model Hierarchical Sub-Resources Cleanly**:
  - `GET /api/v1/users/42/orders`: Fetch orders belonging to user 42.
  - `POST /api/v1/articles/99/comments`: Add a comment to article 99.

## Summary & Key Takeaways

- REST is a resource-oriented architectural style leveraging HTTP methods for CRUD operations.
- Resources are named using plural nouns (`/products`, `/orders`), never action verbs.
- Statelessness ensures backend scalability and simplifies client communication.
- Sub-resources represent hierarchical ownership (`/users/123/orders`).

## Best Practices & Senior Guidance

1. **Keep URIs Predictable and Consistent**: Follow established plural conventions across all endpoints.
2. **Avoid Deep Nesting Beyond 2 Levels**: If sub-resources exceed two levels (e.g. `/users/1/orders/2/items/3/taxes`), flatten the endpoint to `/api/v1/order-items/3`.
