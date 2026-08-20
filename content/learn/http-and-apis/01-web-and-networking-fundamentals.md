---
title: 'Web & Networking Fundamentals'
description: 'Master core internet networking: client vs server architecture, DNS resolution, IP addressing, TCP vs UDP transport protocols, HTTP vs HTTPS, and URL anatomy.'
order: 1
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 35
prerequisites: []
---

# Web & Networking Fundamentals

Before writing a single line of frontend JavaScript or sending API requests, a software engineer must understand the global physical and logical infrastructure that powers the World Wide Web. The internet is a worldwide system of interconnected computer networks that communicate via standardized protocols defined by the Internet Engineering Task Force (IETF).

Every time a user types a URL into a web browser, clicks a link, or fetches data inside a web application, a complex chain of networking events is triggered across the **Client-Server Model**, **Domain Name System (DNS)**, **Internet Protocol (IP)**, and **Transmission Control Protocol (TCP)** before an HTTP request is ever evaluated.

```text
┌─────────────────────────────────────────────────────────────┐
│                 The Web Request Journey                     │
│                                                             │
│  1. User enters: https://api.front-heaven.com/users         │
│             │                                               │
│             ▼                                               │
│  2. DNS Lookup: api.front-heaven.com ──> IP: 104.21.48.12   │
│             │                                               │
│             ▼                                               │
│  3. TCP 3-Way Handshake (SYN -> SYN-ACK -> ACK) [Port 443]  │
│             │                                               │
│             ▼                                               │
│  4. TLS 1.3 Cryptographic Handshake (HTTPS Encryption)      │
│             │                                               │
│             ▼                                               │
│  5. HTTP Request Transmitted (GET /users HTTP/1.1)          │
│             │                                               │
│             ▼                                               │
│  6. Server evaluates request & streams HTTP Response (200)  │
└─────────────────────────────────────────────────────────────┘
```

## 1. Client vs Server Architecture

- **Client**: Any device or software program that initiates network requests to consume resources (e.g. Google Chrome web browser, mobile apps, curl CLI scripts).
- **Server**: A high-availability computer program running in a cloud datacenter that listens on specific network ports, processes incoming requests, evaluates authentication and business logic, and returns structured responses.

## 2. IP Addresses & Ports

- **IP Address (Internet Protocol)**: The unique numerical address identifying every device on the internet. IPv4 uses 32-bit decimal strings (`192.0.2.1`), while modern IPv6 uses 128-bit hexadecimal strings (`2001:0db8:85a3::8a2e:0370:7334`).
- **Ports**: A 16-bit number (ranging from 0 to 65535) identifying a specific application or process running on a server:
  - **Port 80**: Standard unencrypted HTTP traffic.
  - **Port 443**: Standard TLS/SSL encrypted HTTPS traffic.
  - **Port 22**: SSH remote shell access.
  - **Port 5432 / 3306**: PostgreSQL / MySQL database ports.

## 3. The Domain Name System (DNS)

Computers route packets using numerical IP addresses, but humans remember domain names (`front-heaven.com`). **DNS** acts as the phonebook of the internet. When you query a domain, your browser checks:
1. Browser DNS Cache.
2. Operating System DNS Cache (`/etc/hosts`).
3. Local Router DNS Cache.
4. Internet Service Provider (ISP) Recursive DNS Resolver.
5. Authoritative DNS Name Servers (Route 53, Cloudflare).

## 4. Transport Protocols: TCP vs UDP

At the transport layer (Layer 4 of the OSI model), web traffic travels over either TCP or UDP:

| Feature | TCP (Transmission Control Protocol) | UDP (User Datagram Protocol) |
| :--- | :--- | :--- |
| **Connection Model** | Connection-oriented (3-Way Handshake) | Connectionless (Fire and forget) |
| **Reliability** | Guaranteed delivery (retransmits lost packets) | No delivery guarantee (packets may drop) |
| **Ordering** | Strict packet ordering | Unordered packet delivery |
| **Speed & Overhead** | Higher latency (acknowledgment overhead) | Ultra-low latency |
| **Primary Use Cases** | HTTP/1.1, HTTP/2, REST APIs, WebSockets | Live video streaming, VoIP, Gaming, HTTP/3 (QUIC) |

## 5. HTTP vs HTTPS: The Encryption Boundary

**HTTPS** (Hypertext Transfer Protocol Secure) encrypts all data transmitted between the client and server using **Transport Layer Security (TLS)**. On plain HTTP, data (including passwords, cookies, and credit card numbers) travels as plain readable text over public Wi-Fi routers and internet backbones. HTTPS guarantees:
1. **Confidentiality**: Encrypts data to prevent eavesdropping.
2. **Integrity**: Detects if data was modified or tampered with in transit.
3. **Authentication**: Uses digital certificates issued by Certificate Authorities (CAs) to verify that the server truly belongs to the claimed domain.

## Summary & Key Takeaways

- The web relies on the Client-Server request/response architectural model.
- DNS translates human-friendly domains into routable IP addresses.
- Ports direct incoming network packets to specific listening server applications.
- TCP guarantees reliable, ordered packet delivery; UDP prioritizes ultra-low latency.
- HTTPS wraps HTTP inside TLS encryption to guarantee privacy, authenticity, and data integrity.

## Best Practices & Senior Guidance

1. **Always Enforce HTTPS in Production**: Configure HTTP-to-HTTPS automatic redirects and enable HTTP Strict Transport Security (HSTS) headers.
2. **Minimize DNS Lookups**: Connect to third-party APIs using dedicated connection pooling or configure `<link rel="dns-prefetch">` for external CDN domains.
