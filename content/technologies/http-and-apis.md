---
title: 'HTTP & APIs'
description: 'How the web communicates. Master networking protocols, REST architecture, HTTP/2 & HTTP/3 QUIC, OAuth 2.0 PKCE, WebSockets, OpenAPI contracts, and enterprise API resilience.'
order: 7
difficulty: 'intermediate'
estimatedHours: 40
status: 'available'
track: 'core'
color: '#8b5cf6'
icon: 'network'
prerequisites:
  - javascript
---

## Why HTTP & APIs Matter

Hypertext Transfer Protocol (HTTP) and Application Programming Interfaces (APIs) form the universal communication substrate of the World Wide Web. Modern frontend engineering requires far more than issuing a simple `fetch()` request—it demands an end-to-end understanding of DNS resolution, TCP/TLS handshakes, HTTP/2 multiplexing, HTTP/3 QUIC transport, cryptographic authentication, resilient error recovery, rate limiting, and contract-first schema design.

## Curriculum Overview

This master curriculum spans 3 difficulty tiers across 48 comprehensive lessons:
1. **Level 1 — Beginner (Lessons 1–12)**: Web & Networking Fundamentals, HTTP Request/Response Architecture, HTTP Methods & Idempotency, Status Code Taxonomy (2xx, 3xx, 4xx, 5xx), HTTP Headers & Content Negotiation, URLs & Query Encoding, Web Data Formats (JSON, Multipart FormData), REST Architectural Principles, JavaScript Data Fetching (Fetch API, Axios, `AbortController`), CORS & Same-Origin Policy, API Developer Tooling (DevTools, Postman, cURL), and 6 Beginner Integration Labs.
2. **Level 2 — Intermediate (Lessons 13–30)**: RFC 9110 HTTP Semantics, HTTP Protocol Evolution (HTTP/1.1, HTTP/2, HTTP/3 QUIC), Authentication Architectures (Sessions vs Tokens, Token Rotation), Hardened HTTP Cookies (`HttpOnly`, `Secure`, `SameSite`), JSON Web Tokens (JWT / RFC 7519), OAuth 2.0 with PKCE, OpenID Connect (OIDC), REST API Design & RFC 7807 Error Standards, Advanced Pagination (Offset vs Cursor Keyset), Filtering, Sorting & Sparse Fieldsets, Correlation IDs, Reliability Engineering (Exponential Backoff, Jitter, Circuit Breakers), HTTP Caching & ETag Validation, Full-Duplex WebSockets, Server-Sent Events (SSE), GraphQL & SDL Schemas, OpenAPI 3.1 & Swagger Documentation, and 6 Intermediate Labs.
3. **Level 3 — Advanced (Lessons 31–48)**: Deep HTTP Binary Framing & Flow Control, Transport Layer Engineering (TCP BBR/CUBIC, TLS 1.3 0-RTT, ALPN), Browser Networking & Critical Resource Prioritization, Advanced API & Web Security (CSRF, CSP, HMAC Request Signing, Replay Defense), Passwordless WebAuthn & Passkeys, Rate Limiting Algorithms (Token Bucket, Sliding Window), High-Performance Edge Computing & Brotli Compression, Distributed Microservice APIs & BFF Patterns, API Gateway Architecture, Multi-Protocol Selection (gRPC vs GraphQL vs REST), Webhook Delivery & Idempotency Keys, Zero-Downtime API Versioning & Sunset Standards, Contract-First OpenAPI & Code Generation, Automated API Testing (MSW, Pact, Grafana k6), OpenTelemetry Distributed Tracing & SLOs, Enterprise API Governance (Spectral, Backstage), and 3 Senior Architect Capstones.
