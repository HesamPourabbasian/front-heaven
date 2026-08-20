---
title: 'Data Formats: JSON, Multipart & Content Negotiation'
description: 'Master web data representation formats: JSON serialization, XML, URL-encoded forms, Multipart form data for binary file uploads, and Content Negotiation.'
order: 7
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 35
prerequisites: ['/learn/http-and-apis/05-http-headers']
---

# Data Formats: JSON, Multipart & Content Negotiation

In web application development, clients and servers exchange data in structured formats. While HTML is used for rendering document pages in browsers, APIs exchange structured data using formats like **JSON (JavaScript Object Notation)**, **Multipart Form Data** for file uploads, **URL-Encoded Forms**, and legacy **XML**.

Understanding how to serialize, parse, and negotiate these formats ensures seamless data transfer between frontend user interfaces and backend database engines.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Core Web Data Formats Matrix                │
├───────────────────┬───────────────────┬─────────────────────┤
│ Format            │ Media Type        │ Primary Use Case    │
├───────────────────┼───────────────────┼─────────────────────┤
│ JSON              │ application/json  │ REST APIs, Modern   │
│                   │                   │ Web Application Data│
├───────────────────┼───────────────────┼─────────────────────┤
│ Multipart Form    │ multipart/form-   │ File Uploads, Binary│
│                   │ data              │ Media + Metadata    │
├───────────────────┼───────────────────┼─────────────────────┤
│ URL-Encoded Form  │ application/x-www-│ Standard HTML Form  │
│                   │ form-urlencoded   │ Submissions         │
├───────────────────┼───────────────────┼─────────────────────┤
│ XML               │ application/xml   │ Legacy SOAP Services│
└───────────────────┴───────────────────┴─────────────────────┘
```

## 1. JSON (JavaScript Object Notation)

JSON is the universal lingua franca of modern REST APIs. Lightweight, text-based, and human-readable, JSON maps directly to data structures in virtually every programming language:

```json
{
  "id": 101,
  "title": "Ergonomic Office Chair",
  "price": 299.50,
  "isAvailable": true,
  "tags": ["furniture", "office", "ergonomic"],
  "dimensions": {
    "widthCm": 65,
    "heightCm": 110
  },
  "discontinuedAt": null
}
```

### JSON Serialization in JavaScript:

```javascript
// Object to JSON string (Serialization)
const jsonString = JSON.stringify({ name: "Hesam", role: "admin" });

// JSON string to JavaScript Object (Deserialization)
const user = JSON.parse(jsonString);
```

## 2. File Uploads with `multipart/form-data`

When uploading binary files (images, PDFs, videos) alongside metadata fields, JSON is inefficient because binary data must be base64 encoded (increasing file size by ~33%). **`multipart/form-data`** streams binary files directly using MIME boundary delimiters:

```javascript
// Client-side file upload in JavaScript
const formData = new FormData();
formData.append("userId", "u123");
formData.append("avatar", fileInputElement.files[0]); // Binary file blob

fetch("/api/v1/upload-avatar", {
  method: "POST",
  body: formData // Browser sets Content-Type: multipart/form-data; boundary=... automatically!
});
```

> [!IMPORTANT]
> When transmitting a `FormData` object with `fetch()`, **DO NOT manually set the `Content-Type` header**. The browser must automatically generate the `Content-Type` header along with its unique boundary string (`boundary=----WebKitFormBoundary...`).

## Summary & Key Takeaways

- JSON (`application/json`) is the standard format for modern REST APIs.
- `FormData` and `multipart/form-data` handle binary file uploads efficiently.
- `JSON.stringify()` serializes objects; `JSON.parse()` deserializes JSON strings.
- Never manually set `Content-Type` when transmitting `FormData` payloads.

## Best Practices & Senior Guidance

1. **Defensively Parse JSON with `try/catch`**: `JSON.parse()` throws a fatal syntax error if input is malformed; always wrap parsing in `try/catch` or schema validators.
2. **Avoid Base64 for Large Files**: Always use `multipart/form-data` or presigned S3 URLs for uploading files larger than 1MB.
