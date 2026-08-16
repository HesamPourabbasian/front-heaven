---
title: 'What is HTTP?'
description: 'Understand the protocol behind every request your page makes — clients, servers, request/response pairs, URL anatomy, statelessness and HTTPS.'
order: 1
difficulty: 'intermediate'
category: 'Fundamentals'
estimatedMinutes: 25
prerequisites: []
---

## Introduction

Every time your page loads data from a server, HTTP is doing the talking. The browser sends a **request** — "give me the weather for London" — and the server answers with a **response** — "here is the data". This exchange, repeated millions of times a second across the world, is the fundamental act of the web. Understanding it transforms you from a developer who copies `fetch` examples into one who understands how the web actually works — and can debug it when things go wrong.

## Clients and servers

The web is a conversation between two roles. The **client** — typically your browser, but also mobile apps, scripts and servers talking to other servers — *initiates* the conversation. The **server** — a machine running an application, often far away — *listens* for requests and *responds* to them.

```text
Client (browser)                          Server
      │  GET /api/weather?city=London        │
      │ ───────────────────────────────────► │
      │                                      │  processes the request,
      │                                      │  looks up the data
      │  HTTP/1.1 200 OK                     │
      │ ◄─────────────────────────────────── │
```

The asymmetry is structural: clients ask, servers answer. A server can never *push* a message to a client unprompted — it can only respond. (WebSockets and server-sent events bend this rule, but they build on the same foundation: the client initiates the connection.) This is why your page must *request* data rather than expect the server to volunteer it.

## The anatomy of a request

A request is a small text document with a precise shape. Its first line states the **method**, the **path**, and the **protocol version**; then come **headers** — key-value metadata — and optionally a **body**:

```text
GET /api/weather?city=London HTTP/1.1
Host: api.example.com
Accept: application/json
User-Agent: Mozilla/5.0 ...

[no body for GET]
```

```text
POST /api/users HTTP/1.1
Host: api.example.com
Content-Type: application/json

{"name": "Ada", "email": "ada@example.com"}
```

The **method** says what the client wants to do — `GET` retrieves, `POST` creates, and so on (the next lesson covers them all). The **path** says *where* — the resource on the server. The **headers** describe the request itself: what formats the client accepts, who it is, how long it can wait. The **body** carries payload — for methods that send data.

## The anatomy of a response

The response mirrors the request. Its first line is the **status line** — the protocol version and a three-digit **status code** ("200 OK", "404 Not Found"); then headers describing the response; then the **body** — the actual content:

```text
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 84
Cache-Control: max-age=300

{"city": "London", "temp": 17, "condition": "Cloudy"}
```

The status code is the first thing your code should read — it tells you whether the request succeeded (2xx), whether the URL was wrong (404), whether the server broke (500), and much more. The **Content-Type** header tells the client *how to interpret* the body — JSON, HTML, an image, a video. The body is the payload: data, a page, a file.

## URL anatomy

The path in a request comes from the **URL** — the address you type or fetch. Every part has a job:

```text
https://api.example.com:443/api/weather?city=London#current
└─┬──┘ └──┬───┘ └──┬──┘ └──┬───┘└──┬───────┘ └──┬───┘
scheme   host     port    path    query       fragment
```

- **Scheme** — `https` (the secure variant of HTTP). This is not optional decoration: it means the conversation is encrypted.
- **Host** — the server's name. `api.example.com` resolves to an IP address via DNS.
- **Port** — the service's door on that machine. `443` is HTTPS's default, `80` HTTP's.
- **Path** — the resource within the application, exactly as it appears in the request line.
- **Query** — `key=value` pairs after `?`, separated by `&`. Used for parameters: search terms, filters, pagination. Query values must be URL-encoded — spaces become `%20`, and special characters get escaped.
- **Fragment** — after `#`; it never reaches the server, it only scrolls the page.

Notice what the fragment reveals: some parts of a URL are for the browser alone, and the server never sees them. When you debug a network request, checking exactly what the server received — path, query, headers — is the first discipline.

## Statelessness and why it matters

HTTP is **stateless**: every request is independent, carrying no memory of the ones before it. The server does not remember you between requests — the request that fetches a user's profile contains no record that the same user just logged in.

This sounds like a flaw, but it is a feature. Statelessness is why the web scales: any server can handle any request, no session memory to synchronise across a fleet of machines. The state that *does* exist — "this user is logged in" — is carried *with* each request: in a **cookie** header, an **Authorization** header with a token, or data in the body. The state is the client's responsibility to present, and the server's to verify. This principle — called **token-based authentication** in API design — drives the authentication lesson later in this stage.

## HTTPS: HTTP with a bodyguard

`https://` is not a different protocol — it is HTTP running inside an encrypted connection (TLS). The scheme guarantees three things:

- **Confidentiality** — the request and response are encrypted; a network observer sees only the connection, not the contents. Without it, passwords and tokens travel in plain text and anyone on the network — a café's Wi-Fi, an ISP — can read them.
- **Integrity** — the content cannot be modified in transit. A tampered response fails the cryptographic check and the connection is aborted.
- **Authentication** — the server proves its identity with a certificate signed by a trusted authority, so you know you are talking to `example.com`, not an impostor.

Every public API today is HTTPS-only. Browsers mark plain-HTTP sites as "Not secure", and modern browser features (service workers, geolocation, many storage APIs) require a secure context. As a front-end developer, you will essentially never send a request over plain HTTP in production — and if you see one, treat it as a bug.

## Common mistakes

Confusing the *path* with the *full URL* when reading requests — the path is what the server routes on; the host decides *which* server. Forgetting that query strings must be URL-encoded. Assuming the server remembers you between requests, and wondering why the second request fails auth. Treating a 404 as "the server is broken" — it means the *path or resource* was not found, which is usually the client's fault, not the server's. And building URLs with string concatenation instead of `URL`/`URLSearchParams`:

```js
const url = new URL('https://api.example.com/search')
url.searchParams.set('q', 'coffee & tea')
url.searchParams.set('page', '2')
fetch(url)  // correctly encoded: ?q=coffee+%26+tea&page=2
```

## Best practices

- Always use HTTPS in production; treat plain HTTP as a defect.
- Build URLs with `URL` and `URLSearchParams`, never by concatenating strings.
- Read the status code and `Content-Type` of every response before touching the body.
- Remember HTTP is stateless: carry authentication with every request.
- Know which URL parts reach the server (path, query) and which do not (fragment).
- When debugging, look at the *actual* request — method, path, headers — not what you intended to send.

## Summary

HTTP is the request/response protocol of the web: a client initiates, a server responds. A request is method + path + headers + body; a response is status code + headers + body; a URL decomposes into scheme, host, port, path, query and fragment. HTTP is stateless — each request stands alone, and any state (like authentication) travels with it. HTTPS wraps the whole conversation in encryption, integrity checking and identity verification. This is the foundation: every `fetch`, every API call, every network debug session you will ever do operates on these parts.

## Practice

Open the DevTools **Network** tab (Cmd+Shift+I → Network) on any page you use — this very site works. Reload the page, then click the first request that looks like data (a JSON file, or the document itself). Read it like a text: the request line (method and path), the request headers, the status code and its meaning, the response headers — especially `Content-Type` — and the body. Then inspect the URLs of five requests you find: split each into scheme, host, path and query. Write down one request of each method you can find, and note the exact status code of each response. This is the single most valuable debugging habit in this entire stage — you are now literate in what the browser actually sends and receives.