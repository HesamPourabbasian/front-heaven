---
title: 'GraphQL: Declarative API Query Language'
description: 'Master GraphQL: REST vs GraphQL, Schema Definition Language (SDL), Types, Queries, Mutations, Variables, Fragments, Resolvers, and Apollo Client integration.'
order: 28
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 50
prerequisites: ['/learn/http-and-apis/08-rest-apis']
---

# GraphQL: Declarative API Query Language

Created by Meta in 2012 and open-sourced in 2015, **GraphQL** is a query language for APIs and a runtime for fulfilling queries with existing data. While REST exposes fixed data shapes across multiple endpoints, GraphQL exposes a single smart endpoint (`/graphql`) where the frontend client requests **exactly the data it needs and nothing more**.

GraphQL solves two classic REST bottlenecks:
1. **Over-Fetching**: Downloading 40 database columns when the UI only displays user name and avatar.
2. **Under-Fetching**: Requiring 5 separate sequential REST calls (`/users`, `/posts`, `/comments`) to assemble a single screen.

```text
┌─────────────────────────────────────────────────────────────┐
│                 REST Multi-Endpoint vs GraphQL Single       │
├──────────────────────────────┬──────────────────────────────┤
│ REST (Multiple Endpoints)    │ GraphQL (Single Query)       │
├──────────────────────────────┼──────────────────────────────┤
│ GET /api/users/42            │ POST /graphql                │
│ GET /api/users/42/posts      │ query {                      │
│ GET /api/posts/99/comments   │   user(id: 42) {             │
│                              │     name                     │
│ 3 Round-trips; fixed payloads│     posts { title comments } │
│                              │   }                          │
│                              │ } (1 Round-trip; exact shape)│
└──────────────────────────────┴──────────────────────────────┘
```

## 1. Schema Definition Language (SDL)

```graphql
type User {
  id: ID!
  name: String!
  email: String!
  orders: [Order!]!
}

type Order {
  id: ID!
  total: Float!
  createdAt: String!
}

type Query {
  user(id: ID!): User
  products(limit: Int): [Product!]!
}

type Mutation {
  createProduct(name: String!, price: Float!): Product!
}
```

## 2. Executing Queries with Fetch or Apollo

```typescript
const query = `
  query GetUserProfile($userId: ID!) {
    user(id: $userId) {
      id
      name
      orders {
        id
        total
      }
    }
  }
`;

const response = await fetch('/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query,
    variables: { userId: "42" }
  })
});
const { data, errors } = await response.json();
```

## Summary & Key Takeaways

- GraphQL allows clients to request declarative, custom data shapes in a single network round-trip.
- Solves over-fetching and under-fetching.
- Uses strongly typed schemas (SDL) with Queries (reads) and Mutations (writes).

## Best Practices & Senior Guidance

1. **Use Fragments for Reusable Component Props**: Co-locate GraphQL fragments with presentational components.
2. **Implement Query Depth Limiting on Backend**: Prevent malicious clients from crashing servers with deeply nested circular queries (`user -> posts -> author -> posts...`).
