---
title: 'Distributed APIs, Microservices & The BFF Pattern'
description: 'Master distributed API architectures: Microservices vs Monoliths, Reverse Proxies, Load Balancers, Service Discovery, Backend-for-Frontend (BFF) pattern, and API Aggregation.'
order: 38
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 55
prerequisites: ['/learn/http-and-apis/20-api-design']
---

# Distributed APIs, Microservices & The BFF Pattern

In large enterprise systems, backend functionality is rarely implemented as a single monolithic process. Instead, systems are organized as **Distributed Microservices** communicating behind **Reverse Proxies**, **Load Balancers**, and dedicated **Backend-for-Frontend (BFF)** services.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Backend-for-Frontend (BFF) Architecture     │
│                                                             │
│  Desktop Web Client             Mobile iOS App              │
│        │                               │                    │
│        ▼                               ▼                    │
│  [Web BFF (Node.js/Nuxt)]      [Mobile BFF (FastAPI)]       │
│  (Tailored for large screens)  (Optimized for low-bandwidth)│
│        │                               │                    │
│        └──────────────┬────────────────┘                    │
│                       ▼                                     │
│  Internal Microservices Network (gRPC / REST)               │
│  ├── [User Service]                                         │
│  ├── [Billing Service]                                      │
│  └── [Inventory Service]                                    │
└─────────────────────────────────────────────────────────────┘
```

## 1. The Backend-for-Frontend (BFF) Pattern

Instead of forcing a single generic backend API to serve diverse clients (Desktop Web, Mobile Apps, Smart TVs):
- A dedicated **BFF Service** is maintained for each specific client platform.
- The BFF orchestrates and aggregates calls to multiple internal microservices, formatting data specifically for that client's UI requirements.

## 2. API Aggregation

Instead of the frontend client making 8 distinct HTTP calls to fetch user profiles, billing history, active orders, and notifications, the client makes **1 call to the API Gateway / BFF**, which queries the internal services in parallel over high-speed private networking!

## Summary & Key Takeaways

- BFF patterns tailor API aggregations to specific frontend client platforms.
- API Aggregation eliminates mobile network chatter by combining microservice calls.
- Load balancers distribute traffic evenly across healthy service replicas.

## Best Practices & Senior Guidance

1. **Keep BFFs Thin and Focused on Orchestration**: BFFs should aggregate and format data; business domain logic belongs in core microservices.
