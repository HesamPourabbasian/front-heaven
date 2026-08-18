---
title: 'Text Formatting, Headings & Typography Elements'
description: 'Master HTML text formatting: Heading hierarchy (h1-h6), paragraphs, line breaks, semantic emphasis (strong, em), citations, blockquotes, code blocks, and typographic modifiers.'
order: 2
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 25
prerequisites:
  - /learn/html/01-html-fundamentals
---

# Text Formatting, Headings & Typography Elements

Text is the primary vehicle for human knowledge on the web. Search engines, accessibility screen readers, and human readers all rely on HTML's typographic elements to understand hierarchy, emphasis, quotes, technical code snippets, and structural relationships.

In this lesson, we explore the heading hierarchy (`<h1>` through `<h6>`), paragraphs, line breaks, horizontal dividers, semantic text formatting tags (`<strong>`, `<em>`, `<mark>`, `<del>`, `<ins>`), and structural quoting elements (`<blockquote>`, `<pre>`, `<code>`).

```text
┌────────────────────────────────────────────────────────────┐
│                    Heading Hierarchy Pyramid               │
├────────────────────────────────────────────────────────────┤
│ <h1>  Single Primary Document Title (Exactly 1 per page)   │
│   ├── <h2>  Major Conceptual Section                       │
│   │     ├── <h3>  Sub-topic within Section                 │
│   │     │     └── <h4>  Granular Detail Point              │
│   └── <h2>  Second Major Section                           │
├────────────────────────────────────────────────────────────┤
│ Golden Rule: Never skip heading levels (e.g. h1 -> h3)!    │
└────────────────────────────────────────────────────────────┘
```

## 1. Heading Hierarchy (`<h1>` through `<h6>`)

HTML provides six levels of section headings. `<h1>` represents the highest structural importance, while `<h6>` represents the lowest:

```html
<h1>Modern Web Development with HTML5</h1>
<h2>Core Foundations</h2>
<h3>HTML Document Structure</h3>
<h4>DOCTYPE Declarations</h4>
```

### Critical Rules for Headings:
1. **Single `<h1>` per Page**: A document should have exactly one `<h1>` that accurately describes the entire page's topic.
2. **Never Skip Levels for Styling**: Do not jump from `<h2>` directly to `<h4>` just to make text appear smaller; use CSS to adjust font sizes while maintaining a strict semantic document outline.
3. **Screen Reader Navigation**: Visually impaired users navigate pages by jumping from heading to heading; a clean hierarchy is essential for digital accessibility.

## 2. Paragraphs, Line Breaks & Horizontal Dividers

- **`<p>` (Paragraph)**: Groups related sentences into a cohesive block of text. Browsers automatically add vertical margin before and after paragraphs.
- **`<br>` (Line Break)**: Produces a line break inside a paragraph or address without creating a new block margin. Use `<br>` only for content where line breaks are meaningful (e.g., poetry or physical postal addresses), never for visual spacing!
- **`<hr>` (Horizontal Rule)**: Represents a **thematic break** or topic transition between paragraphs.

```html
<p>
  Front-Heaven Academy<br />
  100 Developer Way, Suite 400<br />
  San Francisco, CA 94105
</p>
<hr />
<p>Our curriculum is updated monthly to reflect modern industry practices.</p>
```

## 3. Semantic Importance vs Visual Styling

HTML distinguishes between elements that convey **semantic importance** versus elements that are purely visual:

- **`<strong>`**: Indicates strong importance, seriousness, or urgency (screen readers announce with emphatic inflection).
- **`<b>`**: Stylistic bold text without conveying extra semantic importance (e.g., product keywords or review summaries).
- **`<em>`**: Semantic emphasis that alters the linguistic meaning of a sentence.
- **`<i>`**: Alternate voice or mood (e.g., technical terms, foreign phrases, thoughts).
- **`<mark>`**: Highlights text for reference or search relevance.
- **`<small>`**: Represents side comments, legal disclaimers, or copyright text.
- **`<del>` & `<ins>`**: Represents deleted text (strikethrough) and inserted text (underline) in document revision diffs.
- **`<sub>` & `<sup>`**: Subscript (e.g., $H_2O$) and superscript (e.g., $E = mc^2$).

```html
<p>
  <strong>Warning:</strong> Deleting this repository is <em>permanent</em> and
  cannot be undone.
</p>
<p>Special Promotion: <del>$199</del> <ins>$99</ins> (Save 50% today!)</p>
<p>Water formula: H<sub>2</sub>O | Einstein's equation: E = mc<sup>2</sup></p>
```

## 4. Quotations & Code Formatting

- **`<blockquote>`**: Represents an extended quotation from another source, typically indented as a block. Include a `cite` attribute with the source URL.
- **`<q>`**: Represents an inline quotation. Browsers automatically wrap the content in quotation marks.
- **`<code>`**: Denotes inline programming code, function names, or file paths.
- **`<pre>` (Preformatted Text)**: Preserves exact whitespace and line breaks, typically used to wrap multi-line `<code>` blocks.

```html
<blockquote cite="https://www.w3.org/TR/html52/">
  <p>HTML is the World Wide Web's core markup language.</p>
</blockquote>

<p>Use the <q>semantic</q> web to build inclusive experiences.</p>

<pre><code>function calculateTotal(price, taxRate) {
  return price + (price * taxRate);
}</code></pre>
```

## Summary

- Headings (`<h1>`–`<h6>`) create the structural document outline for accessibility and SEO.
- Always maintain exactly one `<h1>` per page and never skip heading levels.
- Use `<strong>` and `<em>` for semantic importance rather than purely visual `<b>` and `<i>`.
- Multi-line code blocks combine `<pre>` and `<code>` to preserve formatting and font glyphs.
- `<del>` and `<ins>` represent editorial additions and deletions.

## Best Practices

1. **Keep Exactly One `<h1>` on Every Page**: Ensure search engines and screen readers identify the primary page topic.
2. **Never Use `<br>` for Paragraph Margins**: Use CSS `margin-bottom` for spacing; use `<br>` only for addresses and poems.
3. **Use Semantic `<strong>` Over Visual `<b>`**: Give assistive technologies the ability to express emphasis vocally.
4. **Wrap Code Blocks with `<pre><code>`**: Ensure indentation and monospaced typography are preserved in code examples.
