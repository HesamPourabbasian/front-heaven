---
title: 'Server-Sent Events (SSE) & Stream Processing'
description: 'Master Server-Sent Events (SSE): text/event-stream format, EventSource API, unidirectional real-time data streaming, automatic reconnection, and SSE vs WebSockets comparison.'
order: 27
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 45
prerequisites: ['/learn/http-and-apis/26-websockets']
---

# Server-Sent Events (SSE) & Stream Processing

When an application requires real-time updates pushed from the server to the client—such as live sports scores, notification feeds, or streaming LLM AI token responses (ChatGPT-style)—full-duplex WebSockets are often over-engineered.

**Server-Sent Events (SSE)** is a lightweight, standard web technology that enables a server to push real-time events to web browsers over standard HTTP using the **`EventSource`** API.

```text
┌─────────────────────────────────────────────────────────────┐
│                 WebSockets vs Server-Sent Events (SSE)      │
├──────────────────────────────┬──────────────────────────────┤
│ WebSockets                   │ Server-Sent Events (SSE)     │
├──────────────────────────────┼──────────────────────────────┤
│ - Bidirectional (Full-duplex)│ - Unidirectional (Server ->) │
│ - Custom WS protocol         │ - Standard HTTP (HTTP/2/3)   │
│ - Requires custom reconnect  │ - Built-in auto-reconnection │
│ - Complex firewall/proxy cfg │ - Works with standard CDNs   │
│ - Ideal for: Real-time chat, │ - Ideal for: AI token stream,│
│   multiplayer games          │   news feeds, notifications  │
└──────────────────────────────┴──────────────────────────────┘
```

## 1. The `text/event-stream` Format

The server streams plain-text events formatted with standard field prefixes separated by double newlines:

```text
event: userNotification
id: 101
data: {"title": "New Order Placed", "amount": 99.00}

event: messageDelta
id: 102
data: {"token": "Hello "}
```

## 2. Using the `EventSource` API in JavaScript

```typescript
export function subscribeToLiveFeed(url: string) {
  const eventSource = new EventSource(url);

  // Listen for default messages
  eventSource.onmessage = (event) => {
    console.log('Received live data:', JSON.parse(event.data));
  };

  // Listen for custom named events
  eventSource.addEventListener('userNotification', (event: MessageEvent) => {
    const notification = JSON.parse(event.data);
    alert(`Notification: ${notification.title}`);
  });

  eventSource.onerror = (err) => {
    console.error('SSE connection error:', err);
    // Browser automatically handles reconnection!
  };

  return () => eventSource.close();
}
```

## Summary & Key Takeaways

- SSE provides unidirectional server-to-client streaming over standard HTTP.
- Uses `Content-Type: text/event-stream`.
- Browsers handle automatic reconnection and event IDs natively via `EventSource`.
- Ideal for LLM AI streaming responses and real-time notification feeds.

## Best Practices & Senior Guidance

1. **Pair SSE with HTTP/2**: On HTTP/1.1, browsers restrict max concurrent SSE streams to 6 per domain; on HTTP/2, multiplexing supports 100+ concurrent streams.
