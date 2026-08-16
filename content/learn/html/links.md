---
title: 'Links in HTML'
description: 'Master anchor tags (a), href attributes, absolute vs relative paths, email (mailto:), phone (tel:), and download links.'
order: 8
difficulty: 'beginner'
category: 'Level 3 - Links & Navigation'
estimatedMinutes: 20
prerequisites:
  - /learn/html/quotes-and-code
---

## The Anchor Element (`<a>`)

The `<a>` (anchor) element creates hyperlinks that connect one web page to another, jump to specific sections, dial phone numbers, or download files.

```html
<a href="https://front-heaven.dev">Visit Front-Heaven</a>
```

---

## Types of Link Destinations

### 1. Absolute URLs
Point to a complete address on the web (including protocol `https://` and domain):

```html
<a href="https://developer.mozilla.org" target="_blank" rel="noopener noreferrer">
  MDN Web Docs
</a>
```

### 2. Relative URLs
Point to a file or path within the current website:

```html
<!-- In the same directory -->
<a href="about.html">About Us</a>

<!-- In a subfolder -->
<a href="blog/post-1.html">Read Article</a>

<!-- In parent directory -->
<a href="../index.html">Back to Home</a>
```

### 3. Special URL Schemes
HTML links can launch native mail clients, phone dialers, and SMS apps:

```html
<!-- Email link -->
<a href="mailto:support@front-heaven.dev?subject=Help">Email Support</a>

<!-- Phone call link -->
<a href="tel:+15551234567">Call (555) 123-4567</a>

<!-- Direct download -->
<a href="cheatsheet.pdf" download="html5-cheatsheet.pdf">Download PDF</a>
```

---

## Summary & Key Takeaways

- `<a>` tags require an `href` attribute defining the destination.
- Use relative paths for internal site navigation and absolute paths for external websites.
- Use `mailto:` for emails and `tel:` for clickable phone numbers on mobile devices.
- The `download` attribute prompts the browser to save the linked file.

---

## Practice Challenge

Build a contact footer with:
1. An absolute link to your GitHub profile.
2. A relative link to your home page.
3. A `mailto:` link with a pre-filled email subject.
4. A `tel:` link for phone calls.
