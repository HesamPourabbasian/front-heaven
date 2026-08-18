---
title: 'Advanced Browser Platform APIs & Offline PWAs'
description: 'Master enterprise browser platform APIs: Service Workers (Cache API), Offline Progressive Web Apps (PWAs), IndexedDB, Broadcast Channel, WebSockets, Web Crypto, and File System Access.'
order: 27
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 30
prerequisites:
  - /learn/html/26-web-components
---

# Advanced Browser Platform APIs & Offline PWAs

The modern browser is a full-fledged operating system application runtime. Through advanced platform APIs, web applications can function 100% offline, synchronize background mutations, communicate across multiple open tabs in real time, encrypt payloads with hardware cryptographic keys, and read local files with the **File System Access API**.

In this lesson, we explore **Service Workers** and the **Cache API**, building **Offline-First Progressive Web Apps (PWAs)**, the **Broadcast Channel API**, **WebSockets**, and the **Web Crypto API**.

```text
┌────────────────────────────────────────────────────────────┐
│                    Service Worker Proxy Pipeline           │
├────────────────────────────────────────────────────────────┤
│ Application Window / DOM (Fetch Request)                   │
│       │                                                    │
│       ▼                                                    │
│ [ Service Worker Network Interceptor (sw.js) ]             │
│       ├── (Network Online)  ──► Fetch & update Cache API   │
│       └── (Network Offline) ──► Serve cached response      │
│                                                            │
│ IndexedDB Storage ◄── Background Sync & Offline Mutations  │
└────────────────────────────────────────────────────────────┘
```

## 1. Service Workers & The Cache API

A **Service Worker** is an event-driven background worker script that acts as a programmable network proxy between your web application, the browser cache, and the internet:

```typescript
// sw.js - Service Worker Cache-First Strategy
const CACHE_NAME = 'app-shell-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/main.css',
  '/js/bundle.js',
  '/favicon.svg',
];

self.addEventListener('install', (event: any) => {
  // Pre-cache application shell assets during installation
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('fetch', (event: any) => {
  // Intercept all network fetch requests
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached version if found, or fetch from network
      return (
        cachedResponse ||
        fetch(event.request).catch(() => caches.match('/offline.html'))
      );
    })
  );
});
```

Registering a Service Worker allows your application to load instantly in under 50ms and remain completely functional when the user loses network connectivity.

## 2. Multi-Tab Synchronization with Broadcast Channel

The **Broadcast Channel API** allows different browser tabs and windows under the same origin to communicate seamlessly without requiring polling or complex server roundtrips:

```typescript
// tab1.js & tab2.js
const authChannel = new BroadcastChannel("auth_sync");

// When user logs out in Tab 1:
function handleLogout() {
  localStorage.removeItem("auth_token");
  authChannel.postMessage({ type: "USER_LOGGED_OUT" });
  window.location.href = "/login";
}

// Tab 2 receives the message and synchronizes instantly!
authChannel.onmessage = (event) => {
  if (event.data.type === "USER_LOGGED_OUT") {
    alert("You have been logged out in another tab.");
    window.location.href = "/login";
  }
};
```

## 3. High-Security Client Encryption with Web Crypto

The **Web Crypto API** provides native hardware-accelerated cryptographic operations (AES-GCM encryption, SHA-256 hashing, RSA key generation):

```typescript
export async function computeSHA256Hash(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}
```

## 4. File System Access API

Allow users to open, edit, and save files directly to their local desktop filesystem:

```typescript
export async function openAndEditLocalFile() {
  // Prompt user to pick a local file
  const [fileHandle] = await (window as any).showOpenFilePicker({
    types: [{ description: "Markdown Documents", accept: { "text/markdown": [".md"] } }],
  });

  const file = await fileHandle.getFile();
  const content = await file.text();

  // Modify content and save back to local disk
  const writableStream = await fileHandle.createWritable();
  await writableStream.write(content + "\n\n# Updated by Front-Heaven");
  await writableStream.close();
}
```

## Summary

- Service Workers run in the background, intercepting network traffic to deliver instant offline PWA experiences.
- The Cache API stores application shell assets and HTTP responses for offline retrieval.
- Broadcast Channel enables instant zero-latency message passing across multiple browser tabs.
- The Web Crypto API (`crypto.subtle`) performs hardware-accelerated hashing and encryption.
- The File System Access API enables native desktop-grade file editing within the browser.

## Best Practices

1. **Version Your Service Worker Caches**: Always bump `CACHE_NAME` (`v2`, `v3`) to ensure obsolete assets are cleaned up.
2. **Never Cache API Endpoints Containing Private User Data**: Prevent sensitive user payloads from persisting on shared devices.
3. **Always Clean Up Broadcast Channels**: Call `channel.close()` when components unmount to avoid memory leaks.
4. **Provide Fallback Offline HTML**: Show a friendly offline status screen when requested pages are uncached.
