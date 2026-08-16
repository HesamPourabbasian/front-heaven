---
title: 'Text Formatting'
description: 'Learn inline text formatting elements: strong, em, b, i, mark, small, del, ins, sub, sup, br, and hr with semantic precision.'
order: 5
difficulty: 'beginner'
category: 'Level 2 - Text & Content'
estimatedMinutes: 20
prerequisites:
  - /learn/html/headings-and-paragraphs
---

## Semantic vs. Visual Formatting

In modern HTML5, text formatting tags provide **semantic meaning** to screen readers and search engines, not merely visual decoration.

---

## Emphasis & Importance

### `<strong>` vs. `<b>`
- `<strong>`: Indicates **strong importance, seriousness, or urgency**. Screen readers emphasize the spoken voice.
- `<b>`: Applies bold styling for visual distinction without conveying semantic importance (e.g. keywords in a summary).

```html
<p><strong>Warning:</strong> Always save your work before closing the editor.</p>
<p>The <b>Vue</b> and <b>React</b> frameworks are popular choices.</p>
```

### `<em>` vs. `<i>`
- `<em>`: Indicates **stress emphasis** that alters the meaning of a sentence.
- `<i>`: Represents text in an alternate voice or mood (technical terms, foreign words, ship names).

```html
<p>I <em>love</em> writing clean HTML.</p>
<p>The term <i>de facto</i> describes practices accepted in reality.</p>
```

---

## Content Edits & Annotations

| Tag | Purpose | Default Visual Style |
| :--- | :--- | :--- |
| `<mark>` | Highlighted text for reference or search results | Yellow background |
| `<small>` | Side comments, disclaimers, legal copyright text | Smaller font size |
| `<del>` | Deleted / removed content (e.g. old sale price) | Strikethrough line |
| `<ins>` | Inserted / added content (e.g. new sale price) | Underlined |
| `<sub>` | Subscript text (chemical formulas, math indices) | Lower baseline |
| `<sup>` | Superscript text (exponents, footnotes, ordinals) | Raised baseline |

```html
<!-- Sale pricing example -->
<p>Original price: <del>$99</del> — Now only <ins>$49</ins>!</p>

<!-- Chemical formula and mathematical exponent -->
<p>Water formula: H<sub>2</sub>O</p>
<p>Einstein's equation: E = mc<sup>2</sup></p>
<p><small>&copy; 2026 Front-Heaven. All rights reserved.</small></p>
```

---

## Breaks & Rules

- `<br>`: A line break within a single paragraph (best for poems, addresses, or lyrics).
- `<hr>`: A thematic break or scene shift between paragraphs.

```html
<p>
  123 Web Dev Avenue<br />
  Silicon Valley, CA 94016
</p>
<hr />
<p>Next section begins here.</p>
```

---

## Summary & Key Takeaways

- Use `<strong>` and `<em>` when you want semantic weight and screen reader emphasis.
- Use `<del>` and `<ins>` for tracking revisions and discount pricing.
- Use `<sub>` and `<sup>` for chemical equations, math powers, and footnotes.
- Use `<hr>` to denote a thematic transition between content sections.

---

## Practice Challenge

Write an e-commerce product summary that includes:
1. Product name with `<strong>`.
2. A promotional badge with `<mark>`.
3. Original and discounted price with `<del>` and `<ins>`.
4. Legal copyright disclaimer with `<small>` and an `<hr>` separator.
