---
title: 'Network Engineering, HTTP Protocols & Caching'
description: 'Master modern network engineering: HTTP/2 multiplexing, HTTP/3 QUIC, TLS 1.3, Cache-Control, ETags, CDN caching, request batching, deduplication, and streaming responses.'
order: 6
difficulty: 'advanced'
category: 'Senior Front-End Engineering'
estimatedMinutes: 45
prerequisites:
  - /learn/advanced-topics/05-chrome-devtools-mastery
---

# Network Engineering, HTTP Protocols & Caching

The network is the slowest and most volatile component in web application architecture. Senior front-end engineers must understand the differences between **HTTP/1.1**, **HTTP/2**, and **HTTP/3 (QUIC)**, configure immutable cache headers, implement in-flight request deduplication, and design resilient network retry strategies.

In this lesson, we explore network transport layers, HTTP caching mechanics, CDN edge strategies, and client-side network performance optimization patterns.

```text
┌────────────────────────────────────────────────────────────┐
│                    HTTP Protocol Evolution                 │
├──────────────┬───────────────────────────────┬─────────────┤
│ Protocol     │ Transport Layer               │ Key Feature │
├──────────────┼───────────────────────────────┼─────────────┤
│ HTTP/1.1     │ TCP (Head-of-Line Blocking)   │ 6 conns/host│
│ HTTP/2       │ TCP (Single Stream Multiplex) │ Streams/HPAK│
│ HTTP/3       │ QUIC over UDP (0-RTT TLS 1.3) │ No HoL Block│
└──────────────┴───────────────────────────────┴─────────────┘
```

## 1. HTTP Protocol Mechanics: HTTP/1.1 vs HTTP/2 vs HTTP/3

- **HTTP/1.1**: Transmits plaintext messages over individual TCP connections. Browsers enforce a strict limit of **6 concurrent TCP connections per origin**, causing Head-of-Line (HoL) blocking on heavy resource pages.
- **HTTP/2**: Introduces binary framing over a single TCP connection. Multiple requests and responses are interleaved simultaneously as independent bidirectional **streams** with HPACK header compression.
- **HTTP/3 (QUIC over UDP)**: Solves TCP packet-loss Head-of-Line blocking by running over UDP. If a single packet drops on a mobile cellular connection, only that specific stream pauses while other parallel streams continue downloading without interruption.

## 2. Advanced HTTP Caching & Invalidation Architecture

HTTP caching is governed by specific response headers that instruct browsers and CDN edge servers how to store and validate assets:

```http
# 1. Immutable Fingerprinted Static Assets (JS/CSS/Images with content hash in filename)
Cache-Control: public, max-age=31536000, immutable

# 2. Dynamic HTML Documents (Must revalidate with origin server every time)
Cache-Control: no-cache
ETag: W/"68bba34f-1200"

# 3. Sensitive User Data / Authenticated Dashboards (Never store in any cache)
Cache-Control: no-store, private
```

### Understanding Cache Directives:
- **`no-cache`**: Does *not* mean "do not cache". It means the browser *can* cache the response, but **must revalidate** with the server via `If-None-Match` (ETag) or `If-Modified-Since` before serving it. If unchanged, the server returns a lightweight `304 Not Modified`.
- **`no-store`**: Completely prohibits the browser and intermediary proxies from saving any copy to disk or memory.
- **`immutable`**: Tells the browser that the file content will *never* change during its `max-age` lifetime, preventing conditional `304` revalidation checks on page reload.

## 3. Client-Side Request Deduplication & In-Flight Batching

When multiple independent UI components request the same endpoint simultaneously (e.g., user profile or app configuration), deduplicate concurrent requests using a Promise cache:

```typescript
export class RequestDeduplicator {
  private inFlight = new Map<string, Promise<any>>();

  public async fetch<T>(url: string, fetcher: () => Promise<T>): Promise<T> {
    if (this.inFlight.has(url)) {
      // Return existing pending promise to all concurrent callers!
      return this.inFlight.get(url)!;
    }

    const requestPromise = fetcher()
      .finally(() => {
        // Clean up from map as soon as request settles
        this.inFlight.delete(url);
      });

    this.inFlight.set(url, requestPromise);
    return requestPromise;
  }
}

export const deduplicator = new RequestDeduplicator();
```

## 4. Exponential Backoff & Retry Strategies

Transient network blips (503 Service Unavailable, 504 Gateway Timeout, connection drops) should be retried with exponential backoff and randomized jitter to prevent thundering herd spikes on backend servers:

```typescript
export async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelayMs = 300
): Promise<T> {
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (err) {
      attempt++;
      if (attempt >= maxRetries) throw err;

      // Exponential backoff with random jitter (prevents thundering herd)
      const jitter = Math.random() * 100;
      const delay = Math.pow(2, attempt) * baseDelayMs + jitter;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw new Error("Maximum retry attempts reached");
}
```

## 5. Streaming Network Responses with Fetch & ReadableStream

Using the Fetch API with `ReadableStream`, client applications can process large JSON arrays or AI text streams token-by-token as chunks arrive over the wire, without waiting for the full payload to download:

```typescript
export async function streamTextResponse(url: string, onChunk: (text: string) => void) {
  const response = await fetch(url);
  if (!response.body) throw new Error("No readable body");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    onChunk(decoder.decode(value, { stream: true }));
  }
}
```

## Summary

- HTTP/2 provides stream multiplexing over TCP; HTTP/3 runs over QUIC/UDP to eliminate packet-loss Head-of-Line blocking.
- Static assets with content-hashed filenames should use `Cache-Control: public, max-age=31536000, immutable`.
- HTML documents should use `Cache-Control: no-cache` combined with `ETag` to support fast `304 Not Modified` revalidations.
- Request deduplication merges concurrent calls to the same endpoint into a single in-flight network request.
- Exponential backoff with jitter prevents thundering-herd overload during backend recovery.

## Best Practices

1. **Fingerprint All Static Bundles**: Use content hashes in asset URLs (`main.8f4a1c.js`) to enable permanent immutable caching.
2. **Never Cache HTML Documents Immutably**: Always use `no-cache` on `index.html` so new deployments take effect instantly.
3. **Use Request Deduplication in State Stores**: Prevent duplicate HTTP requests across multiple component mounts.
4. **Implement Jittered Backoff for Network Retries**: Avoid bombarding recovered servers with synchronized retry waves.
