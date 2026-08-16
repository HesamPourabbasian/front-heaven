---
title: 'HTTP & APIs'
description: 'How browsers and servers talk. Master requests, responses and the JSON APIs that power modern applications.'
order: 7
difficulty: 'intermediate'
estimatedHours: 5
status: 'available'
color: '#22d3ee'
icon: 'network'
prerequisites:
  - javascript
---

## Why HTTP & APIs matter

Every time your page loads data from a server, HTTP is doing the talking. Understanding it transforms you from a developer who "copies fetch examples" into one who understands how the web actually works — and can debug it when things go wrong.

It is also the layer where the professional front-end lives: reading status codes and headers fluently, writing `fetch` wrappers that survive production, handling authentication and CORS correctly, and using the Network tab as the ground truth for every problem. APIs power modern applications — and this stage makes you fluent in the protocol beneath them all.

## What you will learn

- What HTTP is: requests, responses, URLs and statelessness
- Methods: GET, POST, PUT, PATCH, DELETE — and safe versus idempotent
- Status codes: reading the 1xx–5xx classes and handling them in `fetch`
- Headers: content negotiation, caching (`Cache-Control`, `ETag`) and cookies
- JSON: the language of APIs — parsing, serialising and validating data
- RESTful API design: resources, pagination, filtering and versioning
- `fetch` in depth: options, timeouts, cancellation, uploads, concurrency
- Authentication: API keys, bearer tokens, refresh flows and secure storage
- CORS and the same-origin policy — and how to read the errors
- Debugging with DevTools' Network tab and `curl`

By the end of this stage you will be able to build a production-grade data layer — fetching, authenticating, error-handling and debugging any API with confidence.
