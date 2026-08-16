---
title: 'HTML & Backend Integration'
description: 'Learn how HTML interacts with web servers: HTTP request payloads, FormData API, Server-Side Rendering (SSR), and template engines.'
order: 40
difficulty: 'intermediate'
category: 'Level 12 - HTML in Real Projects'
estimatedMinutes: 20
prerequisites:
  - /learn/html/html-and-javascript
---

## How HTML Communicates with Servers

Every web application relies on a cycle of client-server requests:

1. **Client sends request**: HTML Form submit or JavaScript `fetch()`.
2. **Server processes payload**: Validates authentication, writes to database.
3. **Server responds**: Sends back new HTML page (SSR) or JSON data (SPA / API).

---

## Sending Form Payloads with JavaScript `FormData`

The `FormData` API automatically serializes all inputs inside an HTML form:

```javascript
const form = document.querySelector('#register-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const payload = new FormData(form);
  
  const response = await fetch('/api/register', {
    method: 'POST',
    body: payload // Automatically sets multipart/form-data boundary
  });
  
  const result = await response.json();
});
```

---

## Server-Side Rendering (SSR) vs. Client-Side Rendering (CSR)

- **Server-Side Rendering (SSR)**: The backend generates the complete HTML document on each request (Nuxt, Next.js, Laravel, Django). Fast initial load and perfect SEO.
- **Client-Side Rendering (CSR)**: The server sends an empty HTML skeleton (`<div id="app"></div>`) and JavaScript builds the DOM in the browser.

---

## Summary & Key Takeaways

- The `FormData` API simplifies sending form inputs to REST endpoints.
- Server-side rendering generates HTML on the server for speed and SEO.
- Client-side rendering relies on JavaScript executing in the browser.

---

## Practice Challenge

Write an asynchronous form submission script using `new FormData(form)` and handle server success/error responses in the DOM.
