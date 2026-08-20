---
title: 'Transport & Cryptography: TCP, TLS 1.3 & QUIC'
description: 'Master deep transport networking: DNS recursive resolution, TCP 3-way handshake and congestion control (BBR, CUBIC), TLS 1.3 0-RTT handshakes, ALPN, PKI certificates, and QUIC connection migration.'
order: 32
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 55
prerequisites: ['/learn/http-and-apis/01-web-and-networking-fundamentals']
---

# Transport & Cryptography: TCP, TLS 1.3 & QUIC

Network performance is governed by the speed of light and transport-layer physics. A request from London to Tokyo incurs unavoidable round-trip times (RTT) across fiber-optic cables.

Understanding the internal mechanics of **TCP 3-Way Handshakes**, **TCP Congestion Control Algorithms (BBR vs CUBIC)**, **TLS 1.3 Cryptographic Handshakes**, and **QUIC Connection Migration** enables engineers to optimize global latency at the millisecond scale.

```text
┌─────────────────────────────────────────────────────────────┐
│                 TLS 1.2 vs TLS 1.3 Handshake Latency        │
├──────────────────────────────┬──────────────────────────────┤
│ Legacy TLS 1.2 (2-RTT)       │ Modern TLS 1.3 (1-RTT / 0-RTT)│
├──────────────────────────────┼──────────────────────────────┤
│ 1. TCP Handshake (1 RTT)     │ 1. TCP Handshake (1 RTT)     │
│ 2. ClientHello / ServerHello │ 2. Combined Key Exchange     │
│ 3. Key Exchange Handshake    │    + Cipher Negotiation      │
│    (Total: 3 RTT before data)│    (Total: 1 RTT before data)│
│                              │ 0-RTT on Reconnection!      │
└──────────────────────────────┴──────────────────────────────┘
```

## 1. TCP Congestion Control: CUBIC vs BBR

When a TCP connection begins, it cannot immediately transmit at 10 Gbps because network capacity is unknown:
- **Slow Start**: Transmission starts with a small Congestion Window (`cwnd`, typically 10 packets / ~14KB) and doubles with every successful ACK.
- **Loss-Based (CUBIC)**: Treats dropped packets as congestion signals, drastically cutting throughput.
- **Model-Based (Google BBR)**: Measures bottleneck bandwidth and round-trip propagation time directly, delivering maximum throughput on packet-lossy mobile networks.

## 2. Application-Layer Protocol Negotiation (ALPN)

During the TLS handshake, the client and server negotiate which application protocol to speak (e.g. `h2` for HTTP/2, `http/1.1`) inside the TLS `ClientHello` extension using **ALPN**, eliminating the need for extra network round-trips!

## 3. QUIC Connection Migration

In TCP, a connection is identified by the 4-tuple: `(Source IP, Source Port, Dest IP, Dest Port)`. If a user walks out of their house and transitions from Wi-Fi to 5G cellular, their IP address changes, breaking the TCP socket.

**QUIC** identifies connections by an opaque 64-bit **Connection ID (CID)** independent of IP addresses. The connection continues streaming seamlessly across network handoffs!

## Summary & Key Takeaways

- TLS 1.3 reduces cryptographic handshake latency to 1 RTT (and 0-RTT on resumption).
- BBR congestion control optimizes throughput without suffering from packet-loss penalties.
- ALPN negotiates HTTP/2 or HTTP/1.1 during the TLS handshake.
- QUIC Connection IDs enable seamless IP migration across mobile networks.

## Best Practices & Senior Guidance

1. **Deploy TLS 1.3 with ECC (Elliptic Curve Cryptography)**: ECDSA certificates (e.g. P-256) offer faster cryptographic handshakes and smaller certificate payloads than legacy RSA 4096.
