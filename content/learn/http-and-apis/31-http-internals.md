---
title: 'HTTP Internals: Binary Framing, Streams & Flow Control'
description: 'Master deep HTTP internals: message framing, persistent connections, HTTP/2 binary framing layer (HEADERS, DATA, SETTINGS frames), stream states, flow control windows, HPACK vs QPACK.'
order: 31
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 55
prerequisites: ['/learn/http-and-apis/14-http-versions']
---

# HTTP Internals: Binary Framing, Streams & Flow Control

To design high-throughput network architectures, optimize streaming protocols, and troubleshoot transport bottlenecks, senior engineers must inspect the internal mechanics of the HTTP framing layers.

While HTTP/1.1 parsed text line-by-line using ASCII delimiters, **HTTP/2 and HTTP/3** operate as binary protocol engines dividing communication into distinct **Streams**, **Messages**, and **Frames** with credit-based **Flow Control** and stateful compression.

```text
┌─────────────────────────────────────────────────────────────┐
│                 HTTP/2 Binary Framing Layer Architecture    │
│                                                             │
│  Single TCP Connection                                      │
│  ├── Stream 1 (GET /index.html)                             │
│  │   └── [HEADERS Frame (Stream 1)] ──> [DATA Frame (St 1)] │
│  ├── Stream 3 (GET /styles.css)                             │
│  │   └── [HEADERS Frame (Stream 3)] ──> [DATA Frame (St 3)] │
│  └── Stream 5 (POST /api/telemetry)                         │
│      └── [HEADERS Frame (Stream 5)] ──> [DATA Frame (St 5)] │
│                                                             │
│  Binary frames interleave over the socket simultaneously!   │
└─────────────────────────────────────────────────────────────┘
```

## 1. Frame Types in HTTP/2

Every HTTP/2 communication is wrapped in a 9-byte binary header followed by a variable-length payload:
- **`HEADERS` (Type 0x1)**: Opens a new stream and carries compressed HTTP header blocks.
- **`DATA` (Type 0x0)**: Carries the request or response payload body chunks.
- **`SETTINGS` (Type 0x4)**: Configures connection parameters (maximum concurrent streams, initial window size).
- **`WINDOW_UPDATE` (Type 0x8)**: Implements credit-based flow control.
- **`RST_STREAM` (Type 0x3)**: Immediately cancels a stream without tearing down the underlying TCP connection.
- **`PING` / `GOAWAY`**: Health check and graceful server shutdown signals.

## 2. Stream Multiplexing & Flow Control

- **Stream Identifier**: A 31-bit unsigned integer tagging every frame (odd numbers initiated by client, even numbers by server).
- **Credit-Based Flow Control**: Prevents a fast sender from overwhelming a slow receiver (e.g. slow mobile CPU). Receivers grant byte credits via `WINDOW_UPDATE` frames; when credits reach zero, senders pause data transmission.

## 3. HPACK vs QPACK Compression

- **HPACK (HTTP/2)**: Uses a shared stateful dynamic table between client and server to compress headers. (Requires strict in-order delivery).
- **QPACK (HTTP/3)**: Redesigned for QUIC over UDP; avoids head-of-line blocking by decoupling dynamic table updates from stream processing.

## Summary & Key Takeaways

- HTTP/2 divides connections into multiplexed streams transporting binary frames.
- Stream IDs enable hundreds of concurrent requests without opening extra TCP sockets.
- Credit-based flow control prevents buffer overflows.
- QPACK redesigns header compression for unordered UDP transport in HTTP/3.

## Best Practices & Senior Guidance

1. **Tune Initial Window Sizes**: On high-bandwidth enterprise backbones, increase TCP and HTTP/2 flow control window sizes to avoid premature throttling.
