---
title: 'RESTful API design'
description: 'Learn how professional APIs are structured — resources, URLs, method mapping, pagination, filtering and versioning — so you can consume them like a native.'
order: 6
difficulty: 'intermediate'
category: 'API Design'
estimatedMinutes: 35
prerequisites:
  - learn/http-and-apis/http-methods
  - learn/http-and-apis/http-status-codes
---

## Introduction

You have the vocabulary — methods, status codes, headers, JSON. Now the architecture: how professional APIs organise their URLs and behaviour, the style called **REST**. You do not need to build APIs to benefit from this lesson — you will spend your career *consuming* them, and understanding the design conventions makes every API you touch legible: you can predict the URL for a resource you have never seen, guess the error codes, and write client code that survives API upgrades. This lesson teaches the conventions, the standard patterns, and the judgement to read any API's design.

## Resources, not actions

The central idea of REST: an API exposes **resources** — nouns the server manages — and the HTTP methods act on them. The URL names the *thing*; the method names the *operation*.

```text
GET    /api/users          → list users
POST   /api/users          → create a user
GET    /api/users/42       → read user 42
PUT    /api/users/42       → replace user 42
PATCH  /api/users/42       → update part of user 42
DELETE /api/users/42       → delete user 42
```

Six requests, two URLs, one resource. The design discipline is visible in what is *absent*: URLs do not contain verbs (`/api/getUser`, `/api/delete-user`) — the method already says it. A URL with an action in it is the first sign of an API that does not follow the convention. When you encounter a well-designed API, you can guess: to read a user's posts, the URL is `/api/users/42/posts` — a *nested* resource. The guess is right more often than not.

## Collections, singulars and nesting

The conventions extend to the shape of resources:

- **Collections are plural.** `/api/users` is a collection; `/api/users/42` is one member of it. Plural collections are the near-universal convention.
- **Nesting expresses ownership.** `/api/users/42/posts` reads "the posts owned by user 42". The owner appears first, the owned resource second.
- **Singular resources** exist for things that are one-of-a-kind: `/api/me` (the current user), `/api/profile` (the caller's own profile). No id needed — the identity comes from the auth token.

The response shapes follow the same logic: a collection returns an array of items (or a paginated envelope — below), a member returns a single object, and a create returns `201` with the new resource (and its id) in the body.

## Pagination: collections too big for one response

A collection with ten thousand users cannot arrive in one response. The universal answer is **pagination**, and the two dominant styles are offset and cursor:

```text
GET /api/users?page=2&per_page=50        — offset pagination
GET /api/users?cursor=abc123&limit=50    — cursor pagination
```

- **Offset** (`page`/`per_page`) is the simpler model: skip `page × per_page` items. Easy to build, easy to reason about — and fragile in practice: if items are inserted or deleted between page requests, the offset shifts and users see duplicates or gaps while scrolling.
- **Cursor** (`cursor`/`limit`) is the modern default for feeds: the server returns an opaque cursor pointing at "the next item after this one". No offset maths, no shifting under inserts — at the cost of no random access (you cannot jump to page 7).

Front-end reality: your job is to *follow* the API's pagination contract. The response usually tells you what to do — a `next` link or cursor in the payload, a `Link` header with `rel="next"`, or `total`/`page`/`per_page` fields you use to build "load more" and "page N" controls:

```json
{
  "data": [ ... ],
  "pagination": { "page": 2, "per_page": 50, "total": 342, "next": "/api/users?page=3&per_page=50" }
}
```

## Filtering, sorting and searching

Query parameters carry the views. The conventions are so standard you can guess them:

```text
GET /api/users?role=admin            — filter: equal to
GET /api/users?age>=18               — filter: range (server-dependent syntax)
GET /api/users?sort=-created_at      — sort: minus prefix means descending
GET /api/users?q=ada                 — search: free-text query
```

Front-end discipline: these parameters are part of the URL, so they are **shareable and bookmarkable** — a filtered, sorted, paginated view is just a URL. The professional front-end pattern keeps the filter state in the URL (`?role=admin&sort=-created_at&page=2`) rather than only in component state, so refreshing or sharing preserves the exact view. When you build the UI, read the API's parameter names from its docs and mirror them in your URL construction.

## Field selection and embedding

Two refinements you will meet on modern APIs:

```text
GET /api/users/42?fields=id,name,email         — only these fields
GET /api/users/42?include=posts                — embed related resources
```

`fields` selects a subset — valuable on mobile where bandwidth matters. `include` (or `expand`) embeds related data, trading a larger response for fewer round-trips: one request for the user *and* their posts instead of two. The front-end trade-off is real: fewer requests but larger payloads. Which wins depends on your context — an offline-first app wants the data in one response; a dashboard wants minimal fetches it can cache.

## Versioning: surviving change

APIs evolve; clients do not. **Versioning** is the contract that lets both sides change safely. The two dominant styles:

```text
https://api.example.com/v1/users/42    — version in the URL path
```

and version headers (`Accept: application/vnd.example.v2+json`) — rarer on public APIs. The path style dominates because it is explicit, cacheable and debuggable: a v1 URL stays v1 forever, and old clients keep working while v2 ships. The front-end consequence: your client code should treat the version as part of the URL you configure in one place — an `API_BASE` constant — so an upgrade is one change, not a codebase-wide find-and-replace.

## Common mistakes

Putting verbs in URLs (`/api/getUser`) instead of using methods. Using the wrong status for the outcome — returning 200 for a created resource (should be 201) or 200 for a missing resource (should be 404). Ignoring the API's pagination envelope and slicing the response client-side. Keeping filter state only in component memory, losing it on refresh. Hard-coding a version into dozens of files instead of one base constant. And — the most common consumer mistake — *guessing* the design instead of reading it: the Network tab and the API's own docs are the two sources of truth; your assumptions are not.

## Best practices

- Read URLs as resources + methods: the noun in the path, the verb in the method.
- Expect plural collections, member URLs with ids, nesting for ownership.
- Follow the API's pagination contract — cursor links and envelopes exist to be consumed, not ignored.
- Mirror query-parameter state in the URL so views are shareable and refresh-safe.
- Configure the API base (with version) in one constant.
- Verify behaviour against docs and the Network tab, never against assumptions.
- Treat breaking changes as versioned upgrades, not silent behaviour shifts.

## Summary

REST organises APIs around resources: URLs name the thing, methods do the operation, and conventions make the whole shape predictable — plural collections, member URLs, nested ownership, singular `/me` endpoints. Collections paginate (offset or cursor), filter, sort and search through query parameters that belong in the URL — and therefore in your app's URL state too. Fields and includes trade payload size for round-trips, and versioning keeps the contract stable while it evolves. As a consumer, this design literacy means you can read any API you meet and write client code that survives its changes.

## Practice

Pick a real public API with good docs — GitHub's REST API is ideal — and, without reading its endpoints list first, *predict* the URLs: the authenticated user, the repositories of a user, the issues of a repository. Fetch each with `fetch` and check your predictions — GitHub follows the conventions closely, and your success rate is a measure of your design literacy. Then read its pagination: fetch `/users/{name}/repos?per_page=1` and inspect the response headers for the `Link` header's `rel="next"` — the standard pagination signal. Finally, compare the design decisions you observed with the patterns in this lesson: which conventions matched, and which diverged? Write down the divergences — they are the API's personality, and the things a careful client must handle.