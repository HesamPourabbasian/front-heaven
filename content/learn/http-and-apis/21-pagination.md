---
title: 'API Pagination: Offset, Cursor & Keyset Strategies'
description: 'Master API pagination architectures: Offset-based pagination (limit/offset), Cursor-based pagination (keyset), infinite scroll synchronization, and handling massive datasets.'
order: 21
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 45
prerequisites: ['/learn/http-and-apis/08-rest-apis']
---

# API Pagination: Offset, Cursor & Keyset Strategies

When querying collections containing millions of database records, returning the entire dataset in a single HTTP response is impossible—it crashes server memory, consumes enormous bandwidth, and freezes the client browser.

APIs utilize **Pagination** to break large datasets into manageable chunks. The two primary strategies are **Offset-Based Pagination** and **Cursor-Based (Keyset) Pagination**.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Offset vs Cursor Pagination                 │
├──────────────────────────────┬──────────────────────────────┤
│ Offset Pagination            │ Cursor Pagination            │
├──────────────────────────────┼──────────────────────────────┤
│ GET /users?page=3&limit=20   │ GET /users?cursor=eyJpZCI6ND │
│ SQL: OFFSET 40 LIMIT 20      │ SQL: WHERE id > 42 LIMIT 20  │
│                              │                              │
│ Pros: Direct page jumping    │ Pros: O(1) database index    │
│ Cons: Slow on large offsets; │       lookup; immune to duplicate│
│       duplicate/skipped items│       items during live feeds.│
└──────────────────────────────┴──────────────────────────────┘
```

## 1. Offset-Based Pagination

- Parameters: `?page=2&limit=20` (or `?offset=20&limit=20`).
- **The "Drifting Items" Problem**: If a new item is inserted at the top of the list while a user is on Page 1, moving to Page 2 causes the last item from Page 1 to appear again!

## 2. Cursor-Based Pagination (Real-Time Feeds)

In cursor pagination, the client requests items after a specific opaque cursor token (e.g. base64-encoded timestamp and ID):

```http
GET /api/v1/feed?limit=10&after=cursor_xyz789 HTTP/1.1
```

Response:

```json
{
  "data": [...],
  "pagination": {
    "hasMore": true,
    "nextCursor": "cursor_abc123"
  }
}
```

## Summary & Key Takeaways

- Offset pagination allows direct page jumping but degrades on large datasets.
- Cursor pagination provides high-performance $O(1)$ indexing and stable infinite scrolling feeds.
- Always include pagination metadata (`hasMore`, `nextCursor`, `totalCount`).

## Best Practices & Senior Guidance

1. **Use Cursor Pagination for Infinite Scroll Feeds**: Prevents duplicate items from rendering when users scroll social feeds or transaction lists.
