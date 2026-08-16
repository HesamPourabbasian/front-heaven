---
title: 'Quotes & Code'
description: 'Learn blockquote, q, cite, code, pre, kbd, samp, and var elements for formatting quotations and technical computer text.'
order: 7
difficulty: 'beginner'
category: 'Level 2 - Text & Content'
estimatedMinutes: 20
prerequisites:
  - /learn/html/lists
---

## Quotation Elements

### 1. Block Quotes (`<blockquote>`)
Represents an extended quotation from an external source. Browsers typically indent the block:

```html
<blockquote cite="https://www.w3.org/standards/">
  <p>
    The Web is fundamentally designed to work for all people, whatever their hardware, software, language, location, or ability.
  </p>
  <footer>— <cite>Tim Berners-Lee, W3C Director</cite></footer>
</blockquote>
```

### 2. Inline Quotes (`<q>`) & Citations (`<cite>`)
- `<q>`: For short, inline quotes. Browsers automatically wrap the text in localized quotation marks.
- `<cite>`: Refers to the title of a work (book, paper, movie, song, article).

```html
<p>
  As Steve Jobs once said, <q>Design is not just what it looks like and feels like. Design is how it works.</q>
</p>
<p>Source referenced in <cite>The Web Ahead</cite>.</p>
```

---

## Code & Computer Output Elements

HTML provides dedicated semantic elements for displaying programming code, user keyboard input, and terminal output:

| Tag | Purpose | Example |
| :--- | :--- | :--- |
| `<code>` | Inline computer code fragment | `<code>const x = 10;</code>` |
| `<pre>` | Preformatted text preserving whitespace & line breaks | Multi-line code blocks |
| `<kbd>` | Keyboard shortcut or user input | `<kbd>Ctrl</kbd> + <kbd>C</kbd>` |
| `<samp>` | Sample output from a program or script | `<samp>Build completed in 2.4s</samp>` |
| `<var>` | Mathematical or programming variable | `<var>radius</var>` |

---

## Multi-Line Code Blocks with `<pre>` and `<code>`

Combine `<pre>` with `<code>` to present formatted multi-line code snippets without losing indentation:

```html
<pre><code>function calculateArea(radius) {
  return Math.PI * radius * radius;
}</code></pre>
```

> **Note**: Because HTML reserves `<` and `>`, you must escape them inside code blocks as `&lt;` and `&gt;`!

---

## Summary & Key Takeaways

- Use `<blockquote>` for multi-line block quotes with an optional `cite` attribute.
- Use `<q>` for inline quotes and `<cite>` for citing the title of a work.
- Combine `<pre><code>` for multi-line syntax-preserving code blocks.
- Use `<kbd>` for keyboard shortcuts and `<samp>` for console output.

---

## Practice Challenge

Build a technical documentation card containing:
1. An inline code snippet describing a JavaScript function.
2. A multi-line `<pre><code>` block demonstrating its usage.
3. A keyboard shortcut formatted with `<kbd>`.
4. A terminal success message formatted with `<samp>`.
