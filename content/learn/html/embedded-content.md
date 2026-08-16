---
title: 'Embedded Content & iframes'
description: 'Learn how to safely embed external web pages, YouTube videos, maps, and widgets using iframe, sandbox security attributes, and embed tags.'
order: 13
difficulty: 'beginner'
category: 'Level 4 - Images & Media'
estimatedMinutes: 20
prerequisites:
  - /learn/html/audio-and-video
---

## Inline Frames (`<iframe>`)

An `<iframe>` (inline frame) embeds another independent HTML document inside the current web page. Common use cases include YouTube video players, Google Maps, payment widgets, and interactive code sandboxes.

```html
<iframe
  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
  title="Front-End Tutorial Video"
  width="560"
  height="315"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
  loading="lazy"
></iframe>
```

---

## Security with the `sandbox` Attribute

Embedding third-party sites introduces security risks. The `sandbox` attribute restricts what the embedded page can execute:

```html
<!-- High security: restricts scripts, forms, and top-level navigation -->
<iframe src="https://example.com/widget" sandbox="allow-scripts allow-same-origin" title="User widget"></iframe>
```

| Sandbox Flag | Permission Granted |
| :--- | :--- |
| `allow-scripts` | Allows JavaScript execution inside the iframe |
| `allow-forms` | Allows form submission from within the iframe |
| `allow-same-origin` | Treats iframe content as being from its origin |
| `allow-popups` | Allows opening popup windows (`window.open`) |

---

## Other Embedding Tags: `<embed>` and `<object>`

- `<object>`: Embeds external resources (like PDFs, Flash, SVG) with fallback content.
- `<embed>`: Self-closing element for embedding external applications or plugins.

```html
<object data="document.pdf" type="application/pdf" width="600" height="800">
  <p>Your browser cannot render PDFs. <a href="document.pdf">Download PDF</a>.</p>
</object>
```

---

## Summary & Key Takeaways

- Every `<iframe>` must have a descriptive `title` attribute for accessibility.
- Use `sandbox` to lock down permissions on untrusted third-party iframe content.
- Add `loading="lazy"` to off-screen iframes to save network bandwidth.

---

## Practice Challenge

Create an HTML snippet that embeds:
1. A YouTube video with `allowfullscreen` and an accessible `title`.
2. A sandboxed interactive iframe with restricted permissions (`allow-scripts`).
