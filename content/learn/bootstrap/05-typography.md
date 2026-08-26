---
title: 'Typography, Text Utilities & Headings'
description: 'Master Bootstrap 5 typography: standard headings, display headings, lead paragraphs, text transformation, font weight utilities, text alignment, wrapping, and truncation.'
order: 5
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 25
prerequisites:
  - /learn/bootstrap/01-bootstrap-fundamentals
---

# Typography, Text Utilities & Headings

Bootstrap 5 provides a robust typography system built on native system font stacks, responsive font scaling via RFS (Responsive Font Sizing), and comprehensive text utility classes. Typography classes establish clean visual hierarchy across hero sections, body copy, and UI micro-text.

In this lesson, you will master standard headings, display headings, lead paragraphs, font styling utilities, text alignment, text wrapping, and truncation.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                      Bootstrap Typography Hierarchy                         │
├─────────────────────────────────────────────────────────────────────────────┤
│  Display 1    .display-1    5rem (80px)      Hero headers                   │
│  Display 4    .display-4    3.5rem (56px)    Landing section titles         │
│  Heading 1    h1 / .h1      2.5rem (40px)    Page titles                    │
│  Heading 2    h2 / .h2      2rem (32px)      Section titles                 │
│  Lead Text    .lead         1.25rem (20px)   Introductory lead copy         │
│  Body Text    p / body      1rem (16px)      Standard article text          │
│  Small Text   small / .small 0.875rem (14px) Disclaimers & metadata         │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Headings & Heading Classes

Bootstrap styles all HTML heading elements (`<h1>` through `<h6>`) with calibrated margins, line heights, and font weights. You can also apply `.h1` through `.h6` classes to style non-heading elements with matching typography:

```html
<h1>h1. Bootstrap heading (2.5rem)</h1>
<h2>h2. Bootstrap heading (2.0rem)</h2>
<h3>h3. Bootstrap heading (1.75rem)</h3>
<h4>h4. Bootstrap heading (1.5rem)</h4>
<h5>h5. Bootstrap heading (1.25rem)</h5>
<h6>h6. Bootstrap heading (1.0rem)</h6>

<!-- Semantic paragraph styled visually as an h3 -->
<p class="h3">Paragraph styled as h3 heading</p>
```

---

## 2. Display Headings (`.display-1` to `.display-6`)

Display headings provide larger, more prominent typographic scales designed for hero banners and marketing headlines:

```html
<h1 class="display-1">Display 1</h1>
<h1 class="display-2">Display 2</h1>
<h1 class="display-3">Display 3</h1>
<h1 class="display-4">Display 4</h1>
<h1 class="display-5">Display 5</h1>
<h1 class="display-6">Display 6</h1>
```

---

## 3. Paragraphs & Lead Text

Make an introductory paragraph stand out by applying the `.lead` class:

```html
<p class="lead">
  This is a lead paragraph. It uses a slightly larger font size (1.25rem) and lighter font weight to capture user attention.
</p>
<p>
  This is standard body copy styled with Bootstrap's default 1rem font size and 1.5 line height.
</p>
```

---

## 4. Font Weight & Style Utilities

Control typography weight and slant with explicit utility classes:

```html
<p class="fw-bold">Bold text (font-weight: 700)</p>
<p class="fw-bolder">Bolder text</p>
<p class="fw-semibold">Semibold text (font-weight: 600)</p>
<p class="fw-medium">Medium text (font-weight: 500)</p>
<p class="fw-normal">Normal text (font-weight: 400)</p>
<p class="fw-light">Light text (font-weight: 300)</p>
<p class="fw-lighter">Lighter text</p>
<p class="fst-italic">Italicized text</p>
<p class="fst-normal">Normal text (un-italicized)</p>
```

---

## 5. Text Alignment & Transformation

Align and transform text with concise utilities:

```html
<!-- Text Alignment -->
<p class="text-start">Left-aligned text on all viewports (LTR)</p>
<p class="text-center">Center-aligned text</p>
<p class="text-end">Right-aligned text</p>

<!-- Text Transformations -->
<p class="text-lowercase">LOWERCASED TEXT</p>
<p class="text-uppercase">uppercased text</p>
<p class="text-capitalize">capitalized text string</p>
```

---

## 6. Text Wrapping & Truncation

Prevent text overflow and truncate long strings with ellipses:

```html
<!-- Prevent wrapping -->
<div class="text-nowrap bg-light border p-2" style="width: 8rem;">
  This text will overflow its container without wrapping.
</div>

<!-- Single-line text truncation with ellipsis (...) -->
<div class="text-truncate" style="max-width: 200px;">
  Praeterea iter est quasdam res quas nemo videt nec scit.
</div>
```

---

## 7. Blockquotes & Inline Formatting Elements

Bootstrap styles HTML semantic typography elements cleanly:

```html
<!-- Blockquote with Custom Source Footer -->
<figure class="p-3 bg-light border-start border-primary border-4 rounded">
  <blockquote class="blockquote">
    <p>Simplicity is prerequisite for reliability.</p>
  </blockquote>
  <figcaption class="blockquote-footer">
    Edsger W. Dijkstra in <cite title="Source Title">Selected Writings</cite>
  </figcaption>
</figure>

<!-- Inline Semantic Tags -->
<p>You can use the mark tag to <mark>highlight</mark> text.</p>
<p><del>This line of text is meant to be treated as deleted text.</del></p>
<p><s>This line of text is meant to be treated as no longer accurate.</s></p>
<p><ins>This line of text is meant to be treated as an addition to the document.</ins></p>
<p><u>This line of text will render as underlined.</u></p>
<p><small>This line of text is meant to be treated as fine print.</small></p>
<p><strong>This line rendered as bold text.</strong></p>
<p><em>This line rendered as italicized text.</em></p>
```

---

## Summary & Key Takeaways

- Standard headings range from `h1` (2.5rem) to `h6` (1.0rem) with matching `.h1`–`.h6` classes.
- Display headings (`.display-1` through `.display-6`) produce oversized marketing headers.
- `.lead` highlights introductory body text.
- Font weight classes (`fw-bold`, `fw-semibold`, `fw-light`) and text alignment utilities (`text-start`, `text-center`, `text-end`) customize formatting without custom CSS.
- `.text-truncate` adds ellipsis overflow protection to single-line text containers.
- `.blockquote` and `.blockquote-footer` format editorial quotes.

## Best Practices & Senior Guidance

1. **Maintain Semantic Heading Structure**: Always use semantic `<h1>`–`<h6>` tags for document accessibility and SEO; use `.display-*` or `.h*` classes purely for visual sizing.
2. **Combine `.text-truncate` with Block Containers**: Truncation requires `display: inline-block` or `display: block` with an explicit or constrained width.
3. **Use `.blockquote-footer` for Author Citations**: Automatically adds an em-dash prefix before author names.
