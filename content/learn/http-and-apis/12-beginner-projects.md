---
title: 'Beginner Projects & API Integration Labs'
description: 'Consolidate Level 1 HTTP & API skills with 6 practical labs: Live Weather Client, Movie Database Browser, GitHub User API Client, News Reader, and a full CRUD Product Catalog.'
order: 12
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 50
prerequisites: ['/learn/http-and-apis/09-javascript-apis']
---

# Beginner Projects & API Integration Labs

To solidify the foundational concepts mastered in Level 1—including HTTP Methods, Status Codes, Headers, URL Parameters, JSON Parsing, Fetch API, and Error Handling—you will build 6 real-world API client projects.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Level 1 API Projects Portfolio              │
├────┬─────────────────────────────┬──────────────────────────┤
│ #  │ Project Title               │ Core Technologies Tested │
├────┼─────────────────────────────┼──────────────────────────┤
│ 1  │ Live Weather Forecast App   │ Fetch, Query Params, JSON│
│ 2  │ Movie Database Explorer     │ Pagination, Search Params│
│ 3  │ GitHub User & Repo Finder   │ Headers, Auth, Status 404│
│ 4  │ Breaking News Feed Client   │ Content-Type, Error UI   │
│ 5  │ Full CRUD Product Catalog   │ GET, POST, PUT, DELETE   │
│ 6  │ File Upload & Media Portal  │ FormData, Multipart      │
└────┴─────────────────────────────┴──────────────────────────┘
```

## Lab 1: GitHub Profile & Repository Explorer

### Specifications & Objectives:
- Search for any GitHub username using the public GitHub REST API (`https://api.github.com/users/{username}`).
- Fetch and display avatar, bio, follower count, and public repositories (`https://api.github.com/users/{username}/repos?sort=updated`).
- Handle `404 Not Found` gracefully with a clean user-facing error message.
- Implement debounced search with `AbortController` cancellation.

```typescript
export async function searchGitHubUser(username: string, signal?: AbortSignal) {
  const url = `https://api.github.com/users/${encodeURIComponent(username)}`;

  const response = await fetch(url, {
    headers: { 'Accept': 'application/vnd.github+json' },
    signal
  });

  if (response.status === 404) {
    throw new Error('User not found. Please check the spelling.');
  }

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  return await response.json();
}
```

## Summary & Key Takeaways

- Building practical API projects establishes confidence in handling real-world network requests and edge cases.
- Always implement defensive error checking and loading state UI in every API consumer.

## Best Practices & Senior Guidance

1. **Always Handle the 3 States of API Fetching**: Every UI component fetching data must render **Loading**, **Error**, and **Success** states gracefully.
