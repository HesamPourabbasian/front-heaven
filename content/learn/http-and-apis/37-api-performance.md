---
title: 'API Performance: Compression, Edge & Payload Optimization'
description: 'Master API performance engineering: Brotli vs Gzip compression, request batching, Edge caching, CDN stale-while-revalidate, and database payload serialization optimization.'
order: 37
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 50
prerequisites: ['/learn/http-and-apis/25-http-caching']
---

# API Performance: Compression, Edge & Payload Optimization

High-performance APIs deliver sub-100ms global latency. Achieving this speed requires optimizing every stage of the request pipeline: compressing payloads with **Brotli (`br`)**, executing compute at the **Edge (Cloudflare Workers / Vercel Edge)**, batching client requests, and optimizing JSON serialization.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Edge Compute vs Origin Architecture         │
│                                                             │
│  User in Tokyo (5ms to Edge)                                │
│        │                                                    │
│        ▼                                                    │
│  [Edge CDN Cache / Cloudflare Worker]                       │
│  ├── 90% of reads served in 8ms directly from edge memory!   │
│  └── 10% cache-misses forwarded to origin in US-East        │
│        │                                                    │
│        ▼                                                    │
│  [Origin Backend Datacenter (US-East)]                      │
└─────────────────────────────────────────────────────────────┘
```

## 1. Modern Compression: Brotli (`br`) vs Gzip

- **Brotli (`Content-Encoding: br`)**: Provides 15–25% higher compression ratios on JSON payloads and text than Gzip, reducing network transit times significantly.

## 2. Edge Caching & `stale-while-revalidate`

```http
Cache-Control: public, max-age=60, s-maxage=3600, stale-while-revalidate=86400
```

- `max-age=60`: Browser caches for 60 seconds.
- `s-maxage=3600`: Shared CDN Edge caches for 1 hour.
- `stale-while-revalidate=86400`: Edge CDN serves stale data instantly while refreshing in the background for up to 24 hours!

## Summary & Key Takeaways

- Brotli compression reduces JSON transfer size by up to 25% compared to Gzip.
- Edge caching serves reads with single-digit millisecond latency worldwide.
- `stale-while-revalidate` delivers zero-latency perceived performance.

## Best Practices & Senior Guidance

1. **Enable Brotli Compression Globally**: Configure Nginx, Cloudflare, or Fastly to compress JSON responses with Brotli.
