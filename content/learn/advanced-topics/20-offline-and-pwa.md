---
title: 'Offline-First Engineering, Service Workers & PWAs'
description: 'Master enterprise Progressive Web Apps: Service Worker lifecycle, Cache Storage strategies (Stale-While-Revalidate, Network First), IndexedDB offline databases, Background Sync, and Conflict Resolution.'
order: 20
difficulty: 'advanced'
category: 'Senior Front-End Engineering'
estimatedMinutes: 50
prerequisites:
  - /learn/advanced-topics/19-reliability-engineering
---

# Offline-First Engineering, Service Workers & PWAs

Modern web applications must function reliably in low-connectivity environments (airplanes, subways, developing markets). **Progressive Web Applications (PWAs)** elevate web apps to native-quality experiences through **Service Workers**, the **Cache API**, **IndexedDB**, and **Background Synchronization**.

In this lesson, we explore the Service Worker lifecycle, standard caching strategies, building local-first databases with IndexedDB, and offline mutation queues with conflict resolution.

```text
┌────────────────────────────────────────────────────────────┐
│              Service Worker Network Interception           │
├────────────────────────────────────────────────────────────┤
│ Web Application Page (Fetch Request)                       │
│       │                                                    │
│       ▼                                                    │
│ [ Service Worker (Programmable Network Proxy) ]            │
│       ├──► Strategy 1: Cache First (Static Assets)         │
│       ├──► Strategy 2: Stale-While-Revalidate (Avatars)    │
│       └──► Strategy 3: Network First (Real-Time Stock API) │
├────────────────────────────────────────────────────────────┤
│ Offline Mutation Queue ──► IndexedDB ──► Background Sync   │
└────────────────────────────────────────────────────────────┘
```

## 1. The Service Worker Lifecycle

A **Service Worker** is an event-driven background worker script that runs independently from the web page, operating as a programmable network proxy:

1. **Registration**: Triggered by the main thread (`navigator.serviceWorker.register('/sw.js')`).
2. **Install (`install` event)**: Pre-caches critical app shell assets (HTML, CSS, core JS).
3. **Activate (`activate` event)**: Purges outdated cache versions from previous releases.
4. **Fetch (`fetch` event)**: Intercepts every outgoing HTTP request, responding from Cache or Network.

```javascript
// public/sw.js
const CACHE_NAME = "app-shell-v2";
const PRECACHE_ASSETS = ["/", "/index.html", "/styles/main.css", "/app.js"];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_ASSETS))
  );
  self.skipWaiting(); // Activate new SW immediately
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim(); // Take control of all open client tabs
});
```

## 2. Standard Caching Strategies

### 1. Stale-While-Revalidate (Optimal for frequently updated UI assets)
Returns the cached version immediately for instant speed, while simultaneously fetching an updated copy in the background and updating the cache:

```javascript
self.addEventListener("fetch", event => {
  if (event.request.url.includes("/api/user-profile")) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async cache => {
        const cachedResponse = await cache.match(event.request);
        const fetchPromise = fetch(event.request).then(networkResponse => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
        return cachedResponse || fetchPromise;
      })
    );
  }
});
```

### 2. Cache-First (Optimal for hashed static bundles & fonts)
Checks cache first. If found, returns immediately without network access.

### 3. Network-First with Cache Fallback (Optimal for dynamic articles)
Attempts network fetch. If offline or timeout occurs, falls back to the cached copy.

## 3. Offline Data Storage with IndexedDB

`localStorage` is synchronous, blocking the main thread and limited to only 5 MB of string storage. **IndexedDB** is an asynchronous, transactional, NoSQL database supporting hundreds of megabytes of structured objects and binary blobs:

```typescript
// Using lightweight 'idb' wrapper for IndexedDB
import { openDB } from "idb";

export async function getOfflineDb() {
  return await openDB("OfflineStore", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("pendingMutations")) {
        db.createObjectStore("pendingMutations", { keyPath: "id", autoIncrement: true });
      }
    },
  });
}

export async function queueOfflineMutation(endpoint: string, payload: any) {
  const db = await getOfflineDb();
  await db.add("pendingMutations", {
    endpoint,
    payload,
    timestamp: Date.now(),
  });
}
```

## 4. Offline Mutation Synchronization & Conflict Resolution

When the device regains network connectivity:
1. **Listen for `online` event** (or Background Sync API `sync` event).
2. Drain the `pendingMutations` IndexedDB queue in chronological order.
3. Resolve server conflicts using **Last-Write-Wins (LWW)** timestamps or **Conflict-Free Replicated Data Types (CRDTs)**.

```typescript
window.addEventListener("online", async () => {
  const db = await getOfflineDb();
  const mutations = await db.getAll("pendingMutations");

  for (const item of mutations) {
    try {
      await fetch(item.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item.payload),
      });
      await db.delete("pendingMutations", item.id);
    } catch (err) {
      console.error("Sync failed for item:", item.id);
      break; // Pause queue on network failure
    }
  }
});
```

## Summary

- Service Workers act as programmable proxy layers intercepting network requests.
- Stale-While-Revalidate delivers instantaneous cache responses while asynchronously updating data.
- IndexedDB provides asynchronous, high-capacity client-side transactional NoSQL storage.
- Offline mutation queues record user actions locally during disconnections.
- Online event handlers drain and synchronize pending queues when connectivity is restored.

## Best Practices

1. **Purge Outdated Caches on `activate`**: Prevent stale assets from lingering indefinitely.
2. **Never Use `localStorage` for Offline Databases**: Use IndexedDB to avoid blocking the main thread.
3. **Notify Users of New App Versions**: Prompt users when a new Service Worker is waiting with an "Update Available" banner.
4. **Use Workbox for Production Service Workers**: Use Google's Workbox library to manage complex caching strategies reliably.
