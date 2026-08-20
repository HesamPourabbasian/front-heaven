---
title: 'HTTP Methods: GET, POST, PUT, PATCH & DELETE'
description: 'Master HTTP request methods: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS, Safe vs Unsafe methods, and Idempotency guarantees.'
order: 3
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 35
prerequisites: ['/learn/http-and-apis/02-http-fundamentals']
---

# HTTP Methods: GET, POST, PUT, PATCH & DELETE

HTTP defines a standardized set of request methods (frequently called **HTTP Verbs**) that specify the desired action to be performed on a given resource. Designing robust REST APIs and building reliable frontend data-fetching layers requires understanding the exact semantic purpose, safety, and idempotency guarantees of each method.

```text
┌─────────────────────────────────────────────────────────────┐
│                 HTTP Methods Characteristics                │
├─────────┬───────────────────┬──────────────┬────────────────┤
│ Method  │ Semantic Action   │ Safe Method? │ Idempotent?    │
├─────────┼───────────────────┼──────────────┼────────────────┤
│ GET     │ Retrieve resource │ YES          │ YES            │
│ HEAD    │ Retrieve headers  │ YES          │ YES            │
│ OPTIONS │ Query capabilities│ YES          │ YES            │
│ POST    │ Create resource   │ NO           │ NO             │
│ PUT     │ Replace resource  │ NO           │ YES            │
│ PATCH   │ Partial update    │ NO           │ NO (Usually)   │
│ DELETE  │ Remove resource   │ NO           │ YES            │
└─────────┴───────────────────┴──────────────┴────────────────┘
```

## 1. Safety vs Idempotency Explained

Two fundamental mathematical and architectural properties classify HTTP methods:

- **Safe Methods**: A method is *safe* if invoking it produces **zero side effects or state mutations on the server**. Reading a resource via `GET` should never alter database records or trigger financial charges.
- **Idempotent Methods**: A method is *idempotent* if **executing it multiple times sequentially produces the identical server state as executing it once**.
  - Example: `DELETE /users/42` executed 5 times results in user 42 being deleted. The first call deletes the record; subsequent calls return 404, but server state remains identical.
  - Non-idempotent: `POST /orders` executed 5 times creates 5 separate charge transactions.

## 2. Core HTTP Verbs in Detail

### `GET`: Retrieve Resources
Requests a representation of the specified resource. `GET` requests must never include a body payload or mutate server state.

```http
GET /api/v1/products?category=hardware HTTP/1.1
Host: api.front-heaven.com
Accept: application/json
```

### `POST`: Create Resources & Processing
Submits data to be processed by the server, typically resulting in the creation of a new subordinate database record.

```http
POST /api/v1/products HTTP/1.1
Host: api.front-heaven.com
Content-Type: application/json

{ "name": "Mechanical Keyboard", "price": 129.99 }
```

### `PUT`: Complete Resource Replacement
Completely replaces the target resource with the uploaded payload. If optional properties are omitted from a `PUT` payload, they are overwritten with `null` or default values.

```http
PUT /api/v1/products/101 HTTP/1.1
Host: api.front-heaven.com
Content-Type: application/json

{ "name": "Mechanical Keyboard Pro", "price": 149.99, "inStock": true }
```

### `PATCH`: Partial Modification
Applies partial modifications to a resource. Only the specified fields are updated; unmentioned properties retain their previous values.

```http
PATCH /api/v1/products/101 HTTP/1.1
Host: api.front-heaven.com
Content-Type: application/json

{ "price": 139.99 }
```

### `DELETE`: Resource Removal
Deletes the specified resource identified by the URI.

```http
DELETE /api/v1/products/101 HTTP/1.1
Host: api.front-heaven.com
```

### `HEAD` and `OPTIONS`
- **`HEAD`**: Identical to `GET`, but the server returns only headers with no response body. Used to check file size (`Content-Length`) or cache validity before downloading.
- **`OPTIONS`**: Used in CORS preflight checks to query which HTTP methods, headers, and origins the server supports.

## Summary & Key Takeaways

- `GET` is safe and idempotent; used exclusively for reading data.
- `POST` creates resources and is neither safe nor idempotent.
- `PUT` replaces entire resources and is idempotent.
- `PATCH` modifies specific fields partially.
- `DELETE` removes resources and is idempotent.

## Best Practices & Senior Guidance

1. **Never Use `GET` to Mutate State**: Never implement actions like `GET /delete-account?id=42`. Search engine crawlers and pre-fetching proxies will trigger account deletions automatically!
2. **Choose Correctly Between `PUT` and `PATCH`**: Use `PATCH` for partial form updates; use `PUT` only when transmitting the complete object graph.
