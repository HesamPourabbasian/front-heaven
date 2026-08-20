---
title: 'Intermediate Projects & Real-Time Labs'
description: 'Consolidate Level 2 HTTP & API skills with 6 intermediate projects: OAuth2 PKCE Auth Flow, Real-Time Chat with WebSockets, GraphQL Dashboard, Paginated Feed, and Resilient API Client.'
order: 30
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 60
prerequisites: ['/learn/http-and-apis/26-websockets']
---

# Intermediate Projects & Real-Time Labs

Level 2 advances your network engineering capability: HTTP/2 multiplexing, OAuth 2.0 PKCE authentication, JWT validation, resilient retries with jitter, Cache-Control, WebSockets, Server-Sent Events, and GraphQL.

To prove your intermediate capability, you will build 6 production-grade network systems.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Level 2 Practical Labs Portfolio            │
├────┬─────────────────────────────┬──────────────────────────┤
│ #  │ Project Lab                 │ Core Architecture        │
├────┼─────────────────────────────┼──────────────────────────┤
│ 1  │ OAuth 2.0 PKCE Auth System  │ OIDC, Token Rotation     │
│ 2  │ Real-Time WebSocket Chat    │ Heartbeats, Reconnect    │
│ 3  │ AI Streaming Feed with SSE  │ EventSource, Stream Data │
│ 4  │ Paginated Infinite Feed     │ Cursor Keyset Pagination │
│ 5  │ GraphQL Analytics Dashboard │ SDL, Queries, Mutations  │
│ 6  │ Resilient API SDK Client    │ Exponential Backoff Jitt │
└────┴─────────────────────────────┴──────────────────────────┘
```

## Summary & Key Takeaways

- Real-world projects transition your networking knowledge into scalable production engineering.
- Combining resilient clients, token rotation, and WebSocket streaming delivers enterprise reliability.

## Best Practices & Senior Guidance

1. **Always Implement Offline Fallbacks**: Use caching and optimistic UI to ensure applications remain usable during brief network drops.
