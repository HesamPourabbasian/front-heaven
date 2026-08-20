---
title: 'URLs, Query Strings & Percent Encoding'
description: 'Master Uniform Resource Locators (URLs): protocol, domain, port, path, path parameters vs query parameters, fragment identifiers, and percent-encoding (encodeURIComponent).'
order: 6
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 35
prerequisites: ['/learn/http-and-apis/01-web-and-networking-fundamentals']
---

# URLs, Query Strings & Percent Encoding

A **Uniform Resource Locator (URL)** is a structured string that serves as the global address for a resource on the web. In modern REST API communication and frontend routing, URLs identify resources, pass hierarchical identifiers (**Path Parameters**), and provide non-hierarchical modifiers like pagination, sorting, and search terms (**Query Parameters**).

Mastering URL anatomy and **Percent-Encoding** guarantees that special characters, international text, and query strings are parsed safely across diverse servers and browsers.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Uniform Resource Locator (URL) Anatomy      │
│                                                             │
│  https://api.front-heaven.com:443/v1/users/42?sort=asc#bio │
│  └──┬──┘ └────────┬─────────┘ └┬┘ └────┬────┘ └───┬──┘ └┬─┘ │
│  Scheme        Host           Port    Path      Query  Frag │
└─────────────────────────────────────────────────────────────┘
```

## 1. Anatomy of a URL

- **Scheme / Protocol (`https://`)**: The protocol used to communicate.
- **Host / Domain (`api.front-heaven.com`)**: The target server address.
- **Port (`:443`)**: Optional port number (defaults to 80 for HTTP, 443 for HTTPS).
- **Path (`/v1/users/42`)**: Hierarchical path locating the specific resource.
- **Query String (`?sort=asc&limit=10`)**: Key-value parameters prefixed by `?` and separated by `&`.
- **Fragment Identifier (`#bio`)**: Client-side anchor pointer. The fragment is handled exclusively by the browser and is **never sent to the server in HTTP requests**.

## 2. Path Parameters vs Query Parameters

| Parameter Type | Purpose | Example |
| :--- | :--- | :--- |
| **Path Parameter** | Identifies a specific unique resource or entity. | `/api/v1/products/keyboard-pro-102` |
| **Query Parameter** | Modifies, filters, sorts, or paginates a collection. | `/api/v1/products?category=tech&page=2` |

## 3. URL Encoding & Percent-Encoding

URLs are restricted to the US-ASCII character set. Characters outside this set (spaces, non-Latin characters like emojis or Cyrillic/Persian/Arabic script), as well as reserved characters (`&`, `?`, `/`, `=`, `#`), must be converted into **Percent-Encoding** (`%XX` hexadecimal representation):
- Space ` ` becomes `%20` (or `+` in query strings).
- Slash `/` becomes `%2F`.
- Question mark `?` becomes `%3F`.
- Ampersand `&` becomes `%26`.

### JavaScript Encoding Functions:

```javascript
// 1. encodeURIComponent(): Encodes query parameter values (encodes &, =, ?)
const query = "React & Angular / Vue?";
const safeParam = encodeURIComponent(query);
// Output: "React%20%26%20Angular%20%2F%20Vue%3F"

// 2. Modern URLSearchParams API (Recommended):
const params = new URLSearchParams({
  search: "Mechanical Keyboard",
  price_max: "150",
  sort: "price:asc"
});
const url = `https://api.front-heaven.com/products?${params.toString()}`;
// Result: ".../products?search=Mechanical+Keyboard&price_max=150&sort=price%3Aasc"
```

## Summary & Key Takeaways

- URLs provide standardized global addresses for internet resources.
- Path parameters identify resources; query parameters filter and paginate collections.
- Fragment identifiers (`#hash`) remain on the client and are not sent over HTTP.
- Special characters must be percent-encoded using `encodeURIComponent()` or `URLSearchParams`.

## Best Practices & Senior Guidance

1. **Always Use `URLSearchParams`**: Avoid manually concatenating strings with `+ "&param=" + val`; `URLSearchParams` handles escaping and formatting safely.
2. **Keep URLs Lowercase and Kebab-Case**: Standardize endpoint paths with lowercase kebab-case (`/user-profiles`) to avoid case-sensitivity issues across Linux and Windows servers.
