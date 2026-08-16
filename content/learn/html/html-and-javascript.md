---
title: 'HTML & JavaScript Integration'
description: 'Connect JavaScript to HTML: script tag placement, async vs defer loading attributes, DOM manipulation, and HTML5 data-* attributes.'
order: 39
difficulty: 'intermediate'
category: 'Level 12 - HTML in Real Projects'
estimatedMinutes: 20
prerequisites:
  - /learn/html/html-and-css
---

## Connecting JavaScript to HTML

JavaScript is embedded or linked using the `<script>` tag:

---

## Script Loading: `async` vs. `defer`

By default, `<script src="...">` pauses HTML parsing until the script downloads and executes (render-blocking). Modern scripts use `defer` or `async`:

| Attribute | Download Behavior | Execution Time | Order Preserved? | Best For |
| :--- | :--- | :--- | :--- | :--- |
| **Default** | Blocks HTML parsing | Immediately | Yes | Legacy scripts |
| **`defer`** | Downloads in background | When DOM parsing finishes | **Yes** | App code, libraries |
| **`async`** | Downloads in background | Immediately upon download | **No** | Analytics, ads |

```html
<!-- Recommended best practice for application code -->
<head>
  <script src="app.js" defer></script>
</head>
```

---

## HTML5 Custom Data Attributes (`data-*`)

Data attributes let you store custom data directly on HTML elements for JavaScript access:

```html
<button
  type="button"
  class="btn-buy"
  data-product-id="4920"
  data-price="29.99"
  data-currency="USD"
>
  Add to Cart
</button>

<script>
const btn = document.querySelector('.btn-buy');
console.log(btn.dataset.productId); // "4920"
console.log(btn.dataset.price);     // "29.99"
</script>
```

---

## Summary & Key Takeaways

- Use `<script src="..." defer>` in the `<head>` for standard application code.
- Use `async` only for independent scripts like analytics trackers.
- Use `data-*` attributes and `element.dataset` to pass data from HTML to JavaScript.

---

## Practice Challenge

Build an interactive counter component using `data-step="5"` on increment buttons and read the values in JavaScript.
