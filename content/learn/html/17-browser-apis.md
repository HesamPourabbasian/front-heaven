---
title: 'HTML5 Browser APIs & Client Storage'
description: 'Master HTML5 browser platform APIs: DOM manipulation, Web Storage (localStorage, sessionStorage), Cookies, IndexedDB, History API, Clipboard API, Geolocation, and Worker threads.'
order: 17
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 30
prerequisites:
  - /learn/html/16-performance
---

# HTML5 Browser APIs & Client Storage

HTML5 is far more than a document markup standard; it is a rich application runtime platform equipped with powerful JavaScript **Browser APIs**. These APIs allow web applications to store megabytes of data locally, manipulate browser history without reloading the page, interact with the system clipboard, access device geolocation, and process data off the main thread.

In this lesson, we explore client-side storage mechanisms (**`localStorage`**, **`sessionStorage`**, **IndexedDB**), the **History API**, the **Clipboard API**, the **Drag and Drop API**, and **Web Workers**.

```text
┌────────────────────────────────────────────────────────────┐
│                    Client-Side Storage Comparison          │
├──────────────┬──────────────┬──────────────┬───────────────┤
│ Storage Type │ Capacity     │ Persistence  │ Access Model  │
├──────────────┼──────────────┼──────────────┼───────────────┤
│ localStorage │ ~5 MB        │ Permanent    │ Sync (Main)   │
│ sessionStorage│ ~5 MB       │ Tab Session  │ Sync (Main)   │
│ Cookies      │ 4 KB         │ Set Expiry   │ Sent on HTTP  │
│ IndexedDB    │ 100+ MB      │ Permanent    │ Async NoSQL   │
└──────────────┴──────────────┴──────────────┴───────────────┘
```

## 1. Web Storage: `localStorage` vs `sessionStorage`

Web Storage provides synchronous key-value string storage scoped per origin:

- **`localStorage`**: Persists indefinitely until cleared by user or code:
  ```typescript
  // Save user theme preference
  localStorage.setItem("user_theme", "dark");
  const currentTheme = localStorage.getItem("user_theme"); // "dark"
  ```
- **`sessionStorage`**: Data is cleared automatically as soon as the specific browser tab or window is closed. (Ideal for transient wizard form progress).

## 2. The Modern History & URL APIs

Single Page Application (SPA) routers (Vue Router, Nuxt, React Router) navigate between views without full-page reloads using the **History API**:

```typescript
// 1. Push a new history entry without triggering a page reload
history.pushState({ page: 2 }, "Catalog Page 2", "/catalog?page=2");

// 2. Listen for browser Back and Forward button clicks
window.addEventListener("popstate", (event) => {
  console.log("Navigated to state:", event.state);
  renderViewForCurrentUrl();
});

// 3. Cleanly parse URL parameters with URL and URLSearchParams
const url = new URL(window.location.href);
const currentPage = url.searchParams.get("page"); // "2"
```

## 3. The Modern Async Clipboard API

Read and write text or binary images to the operating system clipboard asynchronously:

```typescript
// Copy code snippet to clipboard with error handling
export async function copyToClipboard(textToCopy: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(textToCopy);
    return true; // Successfully copied
  } catch (err) {
    console.error("Failed to copy clipboard text", err);
    return false;
  }
}
```

## 4. Drag and Drop API

HTML5 elements can be made draggable by adding the `draggable="true"` attribute:

```html
<div id="task-card-1" draggable="true" class="task-card">
  Implement Accessible Modal Dialog
</div>

<div id="dropzone-done" class="kanban-column">
  Drop completed tasks here
</div>

<script>
  const card = document.getElementById('task-card-1');
  const dropzone = document.getElementById('dropzone-done');

  card.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', e.target.id);
  });

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault(); // Necessary to allow dropping!
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('text/plain');
    dropzone.appendChild(document.getElementById(cardId));
  });
</script>
```

## 5. Web Workers: Off-Main-Thread Processing

Heavy JavaScript calculations (image filters, cryptography, massive data sorting) freeze the UI. **Web Workers** run scripts on separate background OS threads:

```typescript
// main.js
const worker = new Worker('/workers/compute.js');
worker.postMessage({ dataset: [1, 2, 3, 4, 5] });

worker.onmessage = (event) => {
  console.log('Heavy computation complete:', event.data.result);
};

// workers/compute.js
self.onmessage = (event) => {
  const result = runIntenseAlgorithm(event.data.dataset);
  self.postMessage({ result });
};
```

## Summary

- `localStorage` and `sessionStorage` provide simple synchronous key-value storage up to ~5 MB.
- IndexedDB provides asynchronous, high-capacity transactional storage for offline databases.
- The History API (`pushState`, `popstate`) powers client-side SPA routing.
- The Clipboard API (`navigator.clipboard`) reads and writes system clipboard data asynchronously.
- Web Workers run heavy CPU workloads on background threads, keeping the UI smooth.

## Best Practices

1. **Never Store Sensitive Auth Tokens in `localStorage`**: Protect against XSS by storing session tokens in `HttpOnly` cookies.
2. **Always Prevent Default on `dragover`**: Ensure browser dropzones accept incoming drag items.
3. **Use Web Workers for Computations Longer than 50ms**: Keep the Main Thread responsive and maintain excellent INP scores.
4. **Always Wrap Clipboard Calls in `try...catch`**: Handle browser permission rejections gracefully.
