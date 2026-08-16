---
title: "Advanced Data Fetching & Real-Time Streams"
technology: "react"
difficulty: "advanced"
estimatedMinutes: 30
order: 37
description: "Request deduplication, infinite pagination, WebSockets, Server-Sent Events (SSE), and offline-first caching."
---

# Advanced Data Fetching & Real-Time Streams

Modern web applications demand real-time collaboration, instant live notifications, infinite scrolling feeds, and resilient offline capabilities. Standard polling mechanisms are insufficient for high-frequency updates.

In this lesson, you will master advanced data synchronization techniques: infinite query pagination, real-time **WebSockets**, **Server-Sent Events (SSE)**, and offline caching.

## Infinite Queries with TanStack Query

Implementing infinite scrolling feeds (like Twitter or Instagram) is seamless with `useInfiniteQuery`:

```jsx
import { useInfiniteQuery } from '@tanstack/react-query';

async function fetchPostsPage({ pageParam = 1 }) {
  const res = await fetch(`/api/posts?page=${pageParam}&limit=10`);
  return res.json();
}

export function InfinitePostFeed() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts', 'infinite'],
    queryFn: fetchPostsPage,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    initialPageParam: 1,
  });

  return (
    <div>
      {data?.pages.map((page, i) => (
        <React.Fragment key={i}>
          {page.items.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </React.Fragment>
      ))}

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="btn-secondary"
        >
          {isFetchingNextPage ? 'Loading more...' : 'Load More Posts'}
        </button>
      )}
    </div>
  );
}
```

## Real-Time Updates with WebSockets & React Hooks

For bi-directional real-time communication (e.g. live chat, stock tickers, or multi-user collaborative editors), manage WebSocket connections with custom hooks:

```javascript
import { useEffect, useState, useRef } from 'react';

export function useWebSocket(url) {
  const [messages, setMessages] = useState([]);
  const wsRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages(prev => [...prev, data]);
    };

    return () => {
      ws.close();
    };
  }, [url]);

  const sendMessage = (msg) => {
    wsRef.current?.send(JSON.stringify(msg));
  };

  return { messages, sendMessage };
}
```

## Best Practices

- **Use SSE for One-Way Live Streams**: Prefer Server-Sent Events (SSE) over WebSockets for one-way live notifications and LLM token streaming.
- **Implement Virtualization with Infinite Feeds**: Combine `useInfiniteQuery` with `@tanstack/react-virtual` to keep DOM node counts bounded.
- **Deduplicate Concurrent Requests**: Let TanStack Query automatically deduplicate multiple identical API requests triggered across different components.

## Summary

Advanced data fetching moves beyond standard REST requests to include infinite pagination, real-time WebSocket subscriptions, and streaming architectures for high-throughput live applications.
