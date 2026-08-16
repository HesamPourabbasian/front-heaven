---
title: HTTP methods
description: GET, POST, PUT, PATCH and DELETE — the verbs of the web. Learn what each method means, why safe and idempotent matter, and how to choose correctly.
order: 2
difficulty: intermediate
category: Core Content
estimatedMinutes: 25
prerequisites:
  - learn/http-and-apis/what-is-http
---

## Introduction

The method is the first word of every request — the verb that says what the client wants done. `GET /api/users` and `DELETE /api/users` hit the same path and mean opposite things. The web has five methods you will use constantly, each with a precise semantic meaning that your choice of verb should express: GET to read, POST to create, PUT to replace, PATCH to update in part, DELETE to remove. This lesson explains each, plus the two properties — *safe* and *idempotent* — that turn method choice from a habit into a discipline.

## GET: read without side effects

`GET` retrieves a representation of a resource: a page, an image, a user's profile, a search result. Its defining property is that it is **safe** — a correct GET changes nothing on the server. You can request the same URL a thousand times and the server's state is untouched.

```js
const res = await fetch('https://api.example.com/users/42')
const user = await res.json()
```

Because GET is safe, it is the method of *default behaviour*: browsers prefetch, caches store, crawlers index — all under the assumption that requesting is harmless. This is why two consequences follow. First, GET requests carry no body in practice — parameters go in the query string, so the request is shareable, bookmarkable and cacheable as a plain URL. Second, you must never hide a *state-changing* action behind GET — a link like `/delete?id=42` that deletes on visit is a bug that search engines and prefetchers will trigger by accident. If an action changes state, it needs a state-changing method.

## POST: create and trigger

`POST` sends data to the server for processing — most commonly, creating a new resource. It is neither safe (it changes server state) nor idempotent (repeating it creates again).

```js
const res = await fetch('https://api.example.com/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Ada', email: 'ada@example.com' }),
})

const created = await res.json()   // the new user, with its id
```

The idempotency property deserves emphasis because it has real user-visible consequences: submitting a form twice over a flaky network sends the request twice. If the endpoint blindly creates a user each time, you get two users; if it checks for duplicates, you get one. This is why professional APIs make creation endpoints *detect* duplicates — the client cannot guarantee a single delivery. POST is also the general-purpose verb for actions that fit no other method — "start a payment", "send an email" — and for any operation whose semantics are "make something happen, possibly more than once".

## PUT: replace, fully and idempotently

`PUT` sends a *complete replacement* of a resource at a specific URL. Where POST says "create a new one", PUT says "make the resource at this address equal to what I send, exactly".

```js
await fetch('https://api.example.com/users/42', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ id: 42, name: 'Ada', email: 'new@example.com' }),
})
```

The property that separates PUT from POST: **idempotency**. Sending the same PUT once or ten times produces the same result — the resource ends up equal to the request either way. This is a contract with the network: retries are safe. It also explains the semantic: the body must contain the *entire* resource, because the server will replace the whole thing. Send only a partial object and you will replace the full resource with a partial one.

## PATCH: update in part

`PATCH` applies a *partial* change — only the fields you send. Same URL as PUT, different contract: instead of replacing everything, the server merges the change.

```js
await fetch('https://api.example.com/users/42', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'new@example.com' }),  // name untouched
})
```

PATCH is not guaranteed idempotent — a partial update can be defined as "increment the counter", which is different every time. In practice, most PATCH implementations (set the email, overwrite the avatar) are idempotent in effect, but the standard does not promise it. The practical rule: replace whole resources with PUT, tweak parts with PATCH. The distinction matters to API designers — and to front-end developers reading the difference between a form that edits one field versus one that rewrites the record.

## DELETE: remove

`DELETE` removes a resource. It is not safe — it obviously changes state — but it is idempotent in the sense that matters: deleting an already-deleted resource is not an error. The first DELETE removes it; subsequent DELETEs should still succeed (or return a consistent "gone" answer), not crash.

```js
const res = await fetch('https://api.example.com/users/42', {
  method: 'DELETE',
})

if (res.status === 204) {
  console.log('Deleted — no body in the response')
}
```

Note the conventional response: `204 No Content`, confirming the deletion with an empty body. A surprising number of front-end bugs come from assuming a deleted resource's response contains the resource itself — it usually does not.

## Choosing the right method

The five methods map onto the five operations of the acronym **CRUD** — Create, Read, Update, Delete — and onto what the user is trying to do:

| Operation | Method | Safe? | Idempotent? | Body |
|-----------|--------|-------|-------------|------|
| Read a resource | `GET` | yes | yes | no |
| Create a resource | `POST` | no | no | yes |
| Replace a resource | `PUT` | no | yes | yes (full) |
| Update in part | `PATCH` | no | not guaranteed | yes (partial) |
| Delete a resource | `DELETE` | no | yes | usually no |

The decision procedure is simple: is it just reading? `GET`. Is it creating something new? `POST`. Does it replace an existing resource entirely? `PUT`. Does it tweak part of one? `PATCH`. Is it removal? `DELETE`. The method is part of the API's *meaning* — a request to `POST /api/users` and a request to `GET /api/users` are different messages even when the path matches, and the server routes them differently by design.

## Common mistakes

Using `GET` for state-changing actions ("delete by link") and letting crawlers, prefetchers or caches execute them. Sending `PUT` with a partial body and accidentally blanking every field you omitted. Sending a `PATCH` with the whole object when the server expects only changes (wasteful, and can overwrite concurrent edits). Forgetting that `fetch` defaults to `GET` — the classic bug where a request silently sends the wrong method. Hard-coding `'application/x-www-form-urlencoded'` for JSON payloads, making the server unable to parse the body. And treating `POST` as the only method that can send a body — `PUT` and `PATCH` send bodies too, and `GET` sends none in practice.

## Best practices

- Choose the method by meaning: GET to read, POST to create, PUT to replace, PATCH to tweak, DELETE to remove.
- Never change server state with `GET` — it is the contract that makes caching and prefetching safe.
- Send complete resources with `PUT`, partial changes with `PATCH`.
- Retry idempotent methods (`GET`, `PUT`, `DELETE`) freely; treat `POST` as potentially duplicating.
- Set the `Content-Type` header to match the body you actually send.
- Read the response's status code before its body — especially `204` for DELETE.

## Summary

The five HTTP methods are the verbs of the web, each with a precise meaning: `GET` reads without side effects, `POST` creates or triggers, `PUT` replaces a resource entirely and idempotently, `PATCH` applies partial changes, and `DELETE` removes. Two properties govern their use: *safe* (changes nothing — GET only) and *idempotent* (repeating is harmless — GET, PUT, DELETE). Choose methods by meaning, never hide state changes in GET, and let the method + path + body tell the server exactly what you want.

## Practice

Using a public API that allows it — a GitHub token, or the JSONPlaceholder test API (`jsonplaceholder.typicode.com`) — perform all five operations with `fetch` from your browser console or a small script: `GET /users/1` (read), `POST /users` (create — the API responds with a fake new id), `PUT /users/1` (replace), `PATCH /users/1` (tweak one field), and `DELETE /users/1` (observe the `204`). For each, log the request line, the status code, and the response body. Then test idempotency directly: send the same `PUT` twice and confirm identical results, then the same `POST` twice and observe the API creating (or faking) two records — the difference between the two properties, demonstrated live.