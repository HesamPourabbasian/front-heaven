---
title: 'Introduction to HTML'
description: 'Discover the foundations of the web: what HTML is, how browsers interpret markup, the trio of HTML/CSS/JavaScript, and core syntax rules.'
order: 1
difficulty: 'beginner'
category: 'Level 1 - HTML Fundamentals'
estimatedMinutes: 15
prerequisites: []
---

## What is HTML?

**HTML** stands for **HyperText Markup Language**. It is the standard markup language used worldwide to create and structure web pages and web applications.

- **HyperText**: Text that links to other pieces of text, media, or documents, allowing non-linear navigation across the global internet.
- **Markup Language**: A system of annotating a document with tags that tell web browsers how to structure, group, and present content.

HTML is not a programming language—it does not contain algorithms, variables, loops, or business logic. Instead, it defines the *semantics* and *skeleton* of a document.

---

## What is HTML Used For?

Every website you visit—from search engines and social platforms to blogs and online stores—is built on a foundation of HTML. HTML is responsible for:

1. **Structuring Content**: Grouping headings, paragraphs, lists, quotes, and articles.
2. **Embedding Media**: Inserting images, videos, audio players, SVGs, and interactive maps.
3. **User Interaction**: Capturing inputs through text boxes, buttons, checkboxes, dropdowns, and file uploaders.
4. **Linking Resources**: Connecting pages via hyperlinks (`<a>`) and loading external stylesheets, scripts, and fonts.
5. **Accessibility & SEO**: Giving screen readers, search engines, and web crawlers the semantic context needed to understand page content.

---

## HTML vs CSS vs JavaScript

The modern front-end web is built on three foundational technologies that work in unison:

| Technology | Role | Analogy (Building a House) | Analogy (Human Body) |
| :--- | :--- | :--- | :--- |
| **HTML** | **Structure & Meaning** | Foundation, walls, doors, windows | Skeleton & internal organs |
| **CSS** | **Presentation & Styling** | Paint, flooring, curtains, lighting | Skin, clothes, hair color |
| **JavaScript** | **Behavior & Interactivity** | Electrical wiring, smart locks, plumbing | Brain, nervous system & movement |

```html
<!-- HTML provides the structure -->
<button class="btn-purchase" onclick="handleBuy()">
  Buy Now
</button>
```

---

## How HTML Works in a Browser

When you enter a URL in a browser, here is the lifecycle of how HTML turns into a visual web page:

1. **HTTP Request**: The browser requests the HTML document from a web server.
2. **Byte Stream to Characters**: The browser receives raw bytes over the network and decodes them into text characters according to the specified encoding (typically `UTF-8`).
3. **Tokenization & Parsing**: The parser converts characters into discrete tokens (e.g., `StartTag: <p>`, `Character: Hello`, `EndTag: </p>`).
4. **DOM Tree Construction**: The tokens are turned into **DOM (Document Object Model)** nodes arranged in a hierarchical tree.
5. **Rendering**: The DOM is combined with CSS styles (CSSOM) to create the Render Tree, compute geometric layout, and paint pixels onto your screen.

---

## HTML Syntax: Tags, Elements, and Attributes

Understanding the core vocabulary is crucial for writing clean markup:

### 1. HTML Tags
A tag is markup notation enclosed in angle brackets:
- **Opening tag**: `<p>` marks the beginning of an element.
- **Closing tag**: `</p>` marks the end of an element (prefixed with a forward slash `/`).

### 2. HTML Elements
An element is the complete unit consisting of the opening tag, any attributes, inner content, and the closing tag:

```html
<p class="intro-text">Welcome to Front-Heaven!</p>
```

### 3. HTML Attributes
Attributes provide extra information or configuration about an element. They are always written inside the opening tag as `name="value"` pairs:

```html
<a href="https://front-heaven.dev" target="_blank" rel="noopener">Visit Website</a>
```

### 4. HTML Comments
Comments are ignored by browsers during parsing. They are used for notes and documentation:

```html
<!-- This is an HTML comment. It will not render on screen. -->
```

---

## Summary & Key Takeaways

- HTML is the foundational markup language defining the structure of web pages.
- HTML provides meaning and layout, CSS styles the appearance, and JavaScript enables interactivity.
- Browsers parse HTML into the Document Object Model (DOM) tree.
- Elements are composed of opening tags, content, closing tags, and attributes.

---

## Practice Challenge

Create an HTML file in your editor and write a snippet containing:
1. A main heading for your favorite hobby.
2. A short paragraph describing why you enjoy it.
3. An HTML comment explaining your code.
4. A link leading to a resource or website about that hobby.
