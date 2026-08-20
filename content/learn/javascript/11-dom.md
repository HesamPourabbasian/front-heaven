---
title: 'The DOM'
description: 'Master the Document Object Model (DOM) in JavaScript: element selection, DOM querying, node creation, removal, innerText vs textContent vs innerHTML, attribute and class manipulation, inline styles, and tree traversal.'
order: 11
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 40
prerequisites:
  - /learn/javascript/10-objects
---

# The Document Object Model (DOM)

The Document Object Model (DOM) is the language-agnostic programming interface provided by web browsers that represents structured HTML and XML documents as an object-oriented tree hierarchy. When a browser downloads an HTML document over the network, its internal HTML parser constructs the DOM tree—where every HTML tag, attribute, comment, and text segment is instantiated as a distinct, programmable JavaScript `Node` or `Element` object.

Through the DOM API, JavaScript bridges static markup and dynamic, interactive web experiences. Scripting languages can query elements, create new nodes dynamically, alter text and attribute values, manipulate CSS classes and styles, respond to user gestures, and remove components from the rendering tree in real time.

In this lesson, we will explore what the DOM is, master modern element querying (`querySelector`, `querySelectorAll`, `getElementById`), create and remove elements, manipulate text and markup (`textContent` vs `innerHTML`), manage attributes and `classList`, apply inline styles, and traverse parent-child-sibling relationships.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                          The DOM Node Hierarchy                        │
├────────────────────────────────────────────────────────────────────────┤
│                           Document (Root Node)                         │
│                                    │                                   │
│                           <html> (Root Element)                        │
│                                    ├── <head>                          │
│                                    │     └── <title>                   │
│                                    └── <body>                          │
│                                          ├── <header>                  │
│                                          │     └── <h1>                │
│                                          └── <main>                    │
│                                                ├── <section class="a"> │
│                                                └── <button id="btn">   │
└────────────────────────────────────────────────────────────────────────┘
```

## What is the DOM?

The DOM is an in-memory tree representation of the active document. The global `document` object acts as the primary entry point to this hierarchy. It is important to note that the DOM is **not** the raw HTML source string, nor is it the browser's internal Render Tree (which only contains visibly rendered elements).

Every entity in the DOM inherits from the base `Node` interface, which is specialized into subclasses such as `Document`, `Element`, `Text`, and `Comment`. As a frontend engineer, you will primarily interact with `Element` and `HTMLElement` instances.

## Selecting Elements: `querySelector`, `querySelectorAll`, and `getElementById`

Modern JavaScript provides powerful query methods that leverage standard CSS selector syntax:

- **`document.querySelector(selector)`**: Returns the **first** `Element` within the document that matches the specified CSS selector string, or `null` if no matches are found.
- **`document.querySelectorAll(selector)`**: Returns a static `NodeList` containing **all** matching elements. Unlike legacy HTMLCollections, modern `NodeList` supports `.forEach()`.
- **`document.getElementById(id)`**: High-performance lookup that returns an element matching a specific `id` attribute.

```javascript
// Selecting single elements
const mainHeading = document.querySelector(".hero-section h1");
const submitButton = document.getElementById("submit-btn");

// Selecting multiple elements
const navLinks = document.querySelectorAll("nav.primary-nav a.nav-item");
navLinks.forEach(link => {
  console.log(`Link destination: ${link.href}`);
});

// Converting NodeList to true Array for map/filter
const linksArray = Array.from(navLinks);
```

## Creating and Removing Elements

Dynamic user interfaces require creating new nodes and appending them to the document:

- **`document.createElement(tagName)`**: Instantiates a new element node in memory (unattached to the visible document).
- **`parent.appendChild(childNode)`** / **`parent.append(...nodesOrStrings)`**: Appends nodes to the end of the parent element's children.
- **`parent.insertBefore(newNode, referenceNode)`**: Inserts a new node before an existing child.
- **`element.remove()`**: Removes the element from the DOM tree directly.
- **`parent.removeChild(childNode)`**: Legacy method removing a specific child node.

```javascript
// Creating a dynamic alert card
const alertBox = document.createElement("div");
alertBox.classList.add("alert-banner", "alert-success");

const alertText = document.createElement("p");
alertText.textContent = "Your settings have been saved successfully.";

const dismissBtn = document.createElement("button");
dismissBtn.textContent = "Dismiss";
dismissBtn.addEventListener("click", () => alertBox.remove());

alertBox.append(alertText, dismissBtn);
document.body.appendChild(alertBox);
```

## Changing Content: `textContent` vs `innerText` vs `innerHTML`

- **`textContent`**: Reads or sets the raw textual content of an element and all its descendants, including `<script>` and hidden elements. It does not trigger layout recalculations and is immune to Cross-Site Scripting (XSS) injection.
- **`innerText`**: Reads or sets the rendered text content as it appears visually on screen, taking into account CSS styles (e.g., hidden with `display: none`). It triggers expensive browser reflows/layouts.
- **`innerHTML`**: Reads or sets the HTML markup content inside an element. **Caution**: Inserting untrusted user input via `innerHTML` opens severe XSS security vulnerabilities.

```javascript
const banner = document.querySelector("#banner");

// Safe text updates
banner.textContent = "Welcome back, Alex!";

// DANGEROUS - XSS Vulnerability if payload is from user input
// banner.innerHTML = `<p>${userSuppliedComment}</p>`;

// Safe markup generation with sanitized data
banner.innerHTML = `<span class="badge">Updated</span> Live Metrics`;
```

## Changing Attributes, Classes, and Inline Styles

- **Attributes**: Use `element.getAttribute(name)`, `element.setAttribute(name, value)`, `element.removeAttribute(name)`, and `element.hasAttribute(name)`. For `data-*` attributes, use `element.dataset`.
- **Classes**: The `element.classList` API provides intuitive methods: `.add()`, `.remove()`, `.toggle(className, forceBoolean)`, and `.contains(className)`.
- **Inline Styles**: The `element.style` property allows setting inline CSS styles using camelCase property names (`element.style.backgroundColor = "#ff0000"`).

```javascript
const userCard = document.querySelector(".user-card");

// Attribute manipulation
userCard.setAttribute("aria-expanded", "true");
userCard.dataset.userId = "10482"; // data-user-id="10482"

// Class manipulation
userCard.classList.add("active", "highlighted");
userCard.classList.remove("dimmed");
userCard.classList.toggle("selected");

// Inline styles (prefer CSS classes for complex styles)
userCard.style.maxWidth = "450px";
userCard.style.borderLeft = "4px solid #3b82f6";
```

## DOM Traversal

Navigating relative relationships between nodes without running new document queries:
- **Parent Navigation**: `element.parentElement` or `element.parentNode`.
- **Child Navigation**: `element.children` (HTML elements only) or `element.childNodes` (includes text and comment nodes), `element.firstElementChild`, `element.lastElementChild`.
- **Sibling Navigation**: `element.nextElementSibling`, `element.previousElementSibling`.
- **Ancestor Lookup**: `element.closest(cssSelector)` finds the closest ancestor matching a selector.

```javascript
const deleteButton = document.querySelector(".delete-item-btn");

// Find the parent table row container
const row = deleteButton.closest("tr.data-row");

// Find sibling status indicator
const statusBadge = row.querySelector(".status-badge");
```

## Summary

The Document Object Model (DOM) is an object tree representing active browser documents. Use `querySelector` and `querySelectorAll` for CSS-based node selection. Create elements with `createElement` and insert them via `append()`. Always prefer `textContent` over `innerHTML` when handling dynamic user text to prevent XSS attacks. Manage CSS states efficiently using `element.classList` and navigate relatives via `closest()`, `parentElement`, and `children`.

## Best Practices

1. **Never Insert Untrusted User Strings via `innerHTML`**: Always use `textContent` or `document.createTextNode` to eliminate Cross-Site Scripting (XSS) risks.
2. **Prefer `classList` Over `element.style`**: Keep styling declarations in CSS stylesheets and toggle descriptive class names (`.is-open`, `.is-active`) in JavaScript.
3. **Cache DOM Lookups**: Avoid executing repetitive queries like `document.querySelector` inside fast loops or animation frames; query once and cache the node reference.
4. **Use `DocumentFragment` for Batch DOM Insertions**: When inserting multiple nodes, append them to a `new DocumentFragment()` first, then append the fragment to the DOM in a single reflow operation.
5. **Use `element.closest()` for Upward Delegation**: Avoid brittle chains like `btn.parentElement.parentElement.parentElement`; use `btn.closest('.card-container')`.
