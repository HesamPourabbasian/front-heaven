---
title: 'WebSockets: Full-Duplex Real-Time Communication'
description: 'Master WebSockets (RFC 6455): HTTP 101 Switching Protocols upgrade handshake, persistent full-duplex TCP connections, ping/pong heartbeats, reconnection logic, and authentication.'
order: 26
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 50
prerequisites: ['/learn/http-and-apis/01-web-and-networking-fundamentals']
---

# WebSockets: Full-Duplex Real-Time Communication

Traditional HTTP is unidirectional: the client requests, and the server responds. For real-time applications requiring instant updates—live chat messaging, financial stock tickers, collaborative document editing, and multiplayer gaming—polling the server every 2 seconds via HTTP is inefficient and introduces latency.

**WebSockets (RFC 6455)** provide a persistent, bidirectional, full-duplex TCP connection over which both the client and server can send text and binary messages at any time with minimal overhead.

```text
┌─────────────────────────────────────────────────────────────┐
│                 WebSocket Handshake & Lifecycle             │
│                                                             │
│  1. Client sends standard HTTP Request:                     │
│     GET /chat HTTP/1.1                                      │
│     Upgrade: websocket                                      │
│     Connection: Upgrade                                     │
│     Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==             │
│             │                                               │
│             ▼                                               │
│  2. Server accepts upgrade:                                 │
│     HTTP/1.1 101 Switching Protocols                        │
│     Upgrade: websocket                                      │
│     Connection: Upgrade                                     │
│             │                                               │
│             ▼                                               │
│  3. Connection upgraded to persistent Full-Duplex TCP Socket│
│     ├── Client pushes message frames (2–6 byte framing)     │
│     └── Server pushes message frames instantly to client    │
└─────────────────────────────────────────────────────────────┘
```

## 1. Browser WebSocket API in JavaScript

```typescript
export class LiveWebSocketClient {
  private socket: WebSocket | null = null;

  connect(url: string, token: string) {
    // Connect with token in query param (standard for initial WS handshake)
    this.socket = new WebSocket(`${url}?token=${encodeURIComponent(token)}`);

    this.socket.onopen = () => {
      console.log('WebSocket connection established.');
      this.startHeartbeat();
    };

    this.socket.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      console.log('Received message from server:', data);
    };

    this.socket.onerror = (err) => console.error('WebSocket Error:', err);

    this.socket.onclose = (event) => {
      console.warn(`Connection closed (Code: ${event.code}). Reconnecting...`);
      setTimeout(() => this.connect(url, token), 3000);
    };
  }

  sendMessage(payload: object) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(payload));
    }
  }

  private startHeartbeat() {
    setInterval(() => {
      this.sendMessage({ type: 'PING' });
    }, 30000);
  }
}
```

## Summary & Key Takeaways

- WebSockets establish persistent, full-duplex TCP connections initiated via HTTP 101 Upgrade.
- Both client and server can transmit messages independently without request overhead.
- Ping/Pong heartbeats keep connections alive through firewalls and load balancers.

## Best Practices & Senior Guidance

1. **Always Implement Exponential Backoff Reconnection**: Never reconnect in an infinite 0ms loop if the WebSocket server goes down.
2. **Authenticate During the Handshake**: Validate JWT tokens during the initial upgrade handshake or first connection frame.
