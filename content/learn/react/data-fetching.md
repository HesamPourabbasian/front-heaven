---
title: "Data Fetching in React"
technology: "react"
difficulty: "intermediate"
estimatedMinutes: 25
order: 18
description: "Working with Fetch API and Axios, HTTP methods, headers, status codes, loading skeletons, and error handling."
---

# Data Fetching in React

Modern web applications are powered by dynamic data from external REST APIs and microservices. In React, orchestrating asynchronous network requests requires understanding the HTTP lifecycle, managing loading and error states, and handling component unmounts cleanly.

In this lesson, you will master data fetching in React using both the native **Fetch API** and **Axios**, implement defensive error handling, and handle race conditions.

## The Data Fetching Lifecycle in React

A standard data-fetching component requires three distinct pieces of state:
1. **`data`**: The returned payload (initially `null` or `[]`).
2. **`isLoading`**: A boolean indicating whether a network request is in flight.
3. **`error`**: An error object or message if the network request fails.

```jsx
import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    setError(null);

    fetch(`https://api.example.com/users/${userId}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (!ignore) {
          setUser(data);
          setIsLoading(false);
        }
      })
      .catch(err => {
        if (!ignore) {
          setError(err.message);
          setIsLoading(false);
        }
      });

    // Cleanup to prevent race conditions:
    return () => {
      ignore = true;
    };
  }, [userId]);

  if (isLoading) return <div className="skeleton">Loading profile...</div>;
  if (error) return <div className="error-card">Error: {error}</div>;
  if (!user) return <p>No user found.</p>;

  return (
    <article className="profile-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </article>
  );
}
```

## Handling Race Conditions with AbortController

If a user rapidly changes selection filters (triggering multiple consecutive fetch requests), responses might arrive out of order. If an older request resolves after a newer request, stale data overwrites fresh data.

The browser's native **AbortController** cancels in-flight fetch requests when dependencies change or the component unmounts:

```javascript
useEffect(() => {
  const controller = new AbortController();

  async function loadData() {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/search?q=${query}`, {
        signal: controller.signal,
      });
      const json = await res.json();
      setData(json);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  }

  loadData();

  return () => {
    controller.abort(); // Cancels pending HTTP request
  };
}, [query]);
```

## Using Axios for Clean API Communication

While `fetch` is built into every browser, **Axios** is a popular HTTP client that offers automatic JSON serialization, request/response interceptors, and default authorization headers:

```javascript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.example.com/v1',
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token automatically:
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## Best Practices

- **Always Handle Network Errors Defensively**: Check `response.ok` when using native `fetch`, as fetch only rejects on network failures, not 4xx/5xx HTTP errors.
- **Prevent Memory Leaks with Cleanup**: Use an `ignore` flag or `AbortController` to prevent setting state on unmounted components.
- **Adopt Server-State Libraries at Scale**: For production applications, replace manual `useEffect` data fetching with **TanStack Query**.

## Summary

Data fetching in React involves orchestrating asynchronous requests, managing loading, error, and success states, and preventing race conditions with cleanup mechanisms. Utilizing tools like Axios and AbortController ensures reliable client-server communication.
