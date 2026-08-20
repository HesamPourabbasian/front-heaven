---
title: 'Advanced Web APIs'
description: 'Master advanced browser APIs: Web Workers, Shared Workers, Service Workers, Cache API, IndexedDB storage, WebSockets, WebRTC peer-to-peer data channels, Web Streams, Web Crypto API, WebAssembly (Wasm), BroadcastChannel, and Push API.'
order: 37
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 45
prerequisites:
  - /learn/javascript/36-web-performance
---

# Advanced Web APIs

Modern browsers provide an expansive suite of low-level, high-performance system APIs that transform web applications into offline-capable, real-time, hardware-accelerated platforms. From peer-to-peer audio/video streaming with **WebRTC** and structured local databases with **IndexedDB** to client-side cryptographic hashing via **Web Crypto** and near-native execution speeds with **WebAssembly (Wasm)**, these APIs empower engineers to build sophisticated web applications.

In this lesson, we will explore the worker family (Web Workers, Shared Workers, Service Workers), offline persistence with the Cache API and IndexedDB, real-time bidirectional communication via WebSockets and WebRTC Data Channels, high-throughput Web Streams, hardware cryptography with Web Crypto, inter-tab communication with `BroadcastChannel`, and WebAssembly compilation pipelines.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        Advanced Web API Ecosystem                      │
├──────────────────────┬─────────────────────────────────────────────────┤
│ Concurrency & Threads│ Web Workers (Dedicated), Shared Workers         │
│ Offline & Networking │ Service Workers, Cache API, Background Sync     │
│ Storage              │ IndexedDB (NoSQL Client Object Store)           │
│ Streaming & P2P      │ Web Streams API, WebSockets, WebRTC DataChannel │
│ Security & Hardware  │ Web Crypto API (SHA-256, AES-GCM), WebAssembly  │
│ Cross-Tab Sync       │ BroadcastChannel API, Storage Events            │
└──────────────────────┴─────────────────────────────────────────────────┘
```

## Structured Offline Storage: IndexedDB

While `localStorage` is synchronous, string-only, and capped at 5MB, **IndexedDB** is an asynchronous, transactional, indexed NoSQL object database built directly into the browser capable of storing gigabytes of structured data (objects, Blobs, typed arrays, files):

```javascript
class DatabaseService {
  constructor(dbName = "AppDatabase", version = 1) {
    this.dbName = dbName;
    this.version = version;
    this.db = null;
  }

  async open() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("cachedOrders")) {
          const store = db.createObjectStore("cachedOrders", { keyPath: "id" });
          store.createIndex("by_status", "status", { unique: false });
        }
      };

      request.onsuccess = () => { this.db = request.result; resolve(this.db); };
      request.onerror = () => reject(request.error);
    });
  }

  async saveOrder(order) {
    const tx = this.db.transaction("cachedOrders", "readwrite");
    const store = tx.objectStore("cachedOrders");
    store.put(order);
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  }
}
```

## Service Workers & The Cache API (Offline PWA)

A **Service Worker** acts as a client-side programmable network proxy. It intercepts outgoing network `fetch` requests, enabling custom caching strategies (Cache-First, Network-First, Stale-While-Revalidate) using the **Cache API**:

```javascript
// service-worker.js - Stale-While-Revalidate Strategy
const CACHE_NAME = "v1-app-cache";

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(event.request);
      
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse.status === 200) {
          cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
```

## Cross-Tab Communication: `BroadcastChannel`

The `BroadcastChannel` API allows different browser tabs, windows, and iframes from the same origin to communicate bidirectionally with zero server involvement:

```javascript
// Tab A and Tab B:
const authChannel = new BroadcastChannel("auth_sync_channel");

// Listen for global logout events across all open tabs
authChannel.onmessage = (event) => {
  if (event.data.type === "LOGOUT") {
    console.log("User logged out in another tab. Resetting local session...");
    window.location.href = "/login";
  }
};

// Trigger logout event to all other tabs
function triggerGlobalLogout() {
  authChannel.postMessage({ type: "LOGOUT", timestamp: Date.now() });
}
```

## Web Crypto API (Secure Client-Side Cryptography)

The `window.crypto.subtle` API provides hardware-accelerated cryptographic primitives for hashing, key generation, encryption, and digital signatures:

```javascript
// Generating a SHA-256 cryptographic hash from a string
async function calculateSha256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  
  // Convert ArrayBuffer to hexadecimal string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

calculateSha256("secure_password_string").then(hash => console.log("Hash:", hash));
```

## Web Streams API

The **Web Streams API** allows JavaScript to process large binary or text streams piece-by-piece as data chunks arrive over the network, without buffering the entire payload into RAM:

```javascript
async function streamLargeResponse(url) {
  const response = await fetch(url);
  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunkText = decoder.decode(value, { stream: true });
    console.log(`Stream Chunk (${value.byteLength} bytes):`, chunkText);
  }
}
```

## Shared Workers for Multi-Tab Coordination

A **Shared Worker** is a specialized web worker accessible by multiple browser tabs, iframes, or windows operating from the same origin.

Unlike standard dedicated Web Workers that are owned by a single script context, Shared Workers maintain a single shared execution thread and memory state. Communication is managed via explicit `MessagePort` connections, making them ideal for managing shared WebSocket connections and coordinating multi-window state.

## WebRTC Peer-to-Peer Data Channels

**WebRTC (Web Real-Time Communication)** allows browsers to establish direct, peer-to-peer data, audio, and video connections with other browsers without routing heavy traffic through a central server.

Using the `RTCDataChannel` API, web applications can exchange arbitrary binary data with ultra-low latency, making it ideal for multiplayer games, file-sharing tools, and distributed applications.

## WebAssembly (Wasm) Integration

**WebAssembly** is a low-level binary format designed to execute code written in C, C++, or Rust in the browser at near-native speed. JavaScript can seamlessly instantiate and invoke WebAssembly modules:

```javascript
async function loadWasmModule() {
  // Stream and compile WebAssembly module in parallel with download
  const { instance } = await WebAssembly.instantiateStreaming(
    fetch("/wasm/imageProcessing.wasm"),
    { env: { memory: new WebAssembly.Memory({ initial: 256 }) } }
  );

  // Invoke high-performance exported C/Rust function directly from JS
  const processedPixelCount = instance.exports.applyGaussianBlur(1024, 768);
  console.log("Wasm execution completed:", processedPixelCount);
}
```

## Summary

Advanced Web APIs expand web applications into powerful native-like platforms. IndexedDB provides structured, transactional offline storage. Service Workers and the Cache API enable progressive web apps and offline capabilities. `BroadcastChannel` synchronizes cross-tab state in real time. The Web Crypto API performs secure cryptographic operations, Web Streams process large datasets incrementally, and WebAssembly executes computation-heavy modules at near-native speed.

## Best Practices

1. **Use IndexedDB for Large Offline Datasets**: Avoid storing heavy datasets or binary Blobs in `localStorage`; use IndexedDB.
2. **Implement Stale-While-Revalidate for Static Assets**: Serve cached responses immediately while updating the cache in the background.
3. **Use `BroadcastChannel` for Cross-Tab Auth Synchronization**: Ensure logging out of one tab immediately updates all other active tabs.
4. **Use `crypto.subtle` for Cryptography**: Never implement custom JavaScript cryptography algorithms; always rely on hardware-accelerated Web Crypto.
5. **Use Web Streams for Large Downloads**: Process streaming files, large JSON arrays, or video chunks as they arrive to prevent main-thread memory spikes.
