---
title: 'HTML Forms & Submission'
description: 'Learn the form element, action and method attributes, GET vs POST HTTP verbs, form encoding types, and form submission lifecycle.'
order: 16
difficulty: 'beginner'
category: 'Level 6 - Forms & User Input'
estimatedMinutes: 20
prerequisites:
  - /learn/html/accessible-tables
---

## The Form Element (`<form>`)

The `<form>` element creates an interactive container that captures user input and transmits it to a web server or JavaScript handler.

```html
<form action="/api/login" method="POST">
  <label for="user-email">Email Address</label>
  <input type="email" id="user-email" name="email" required />

  <label for="user-password">Password</label>
  <input type="password" id="user-password" name="password" required />

  <button type="submit">Log In</button>
</form>
```

---

## Key Form Attributes

### 1. `action`
The URL destination where the submitted data will be sent (e.g., `/api/submit`, `/search`). If omitted, the form submits back to the current page URL.

### 2. `method`
Specifies the HTTP method used to send the payload:
- **`method="GET"`**: Appends form data directly to the URL as query parameters (`/search?query=html&page=2`). Used for non-sensitive searches, filters, and bookmarkable states.
- **`method="POST"`**: Sends data inside the HTTP request body. Used when modifying data, creating accounts, login credentials, or processing payments.

### 3. `enctype` (Encoding Type)
- `application/x-www-form-urlencoded` (default): URL-encoded string.
- `multipart/form-data`: Required whenever uploading files (`<input type="file">`).
- `text/plain`: Plain text without encoding.

---

## Summary & Key Takeaways

- Use `method="GET"` for idempotent searches and filters.
- Use `method="POST"` for passwords, sensitive data, and creating resources.
- Every input that should be submitted to the server **must** have a `name` attribute.
- Use `enctype="multipart/form-data"` when sending files.

---

## Practice Challenge

Create two separate forms:
1. A search form that uses `method="GET"` pointing to `/search`.
2. A user registration form using `method="POST"` with inputs for email and password.
