---
title: 'Tags, Elements and Attributes'
description: 'The vocabulary of HTML. Learn how tags create elements, how attributes configure them, and master headings and paragraphs.'
order: 3
difficulty: 'beginner'
category: 'Fundamentals'
estimatedMinutes: 20
prerequisites:
  - learn/html/document-structure
---

## Introduction

HTML has a small vocabulary of building blocks: tags, elements and attributes. These three concepts are to HTML what letters, words and punctuation are to a language — you cannot write anything meaningful without them, and once you understand how they combine, every tag you ever encounter (including ones you have never seen) becomes immediately readable. This lesson teaches those three concepts properly, then applies them to the two most common content elements on the web: headings and paragraphs.

Beginners often treat tags as a list of things to memorise. That is backwards. There are over a hundred HTML tags, and no one has them all memorised — professionals look up unfamiliar tags constantly. What professionals do have memorised is how tags, elements and attributes *work*. That understanding transfers to every tag, which is why it is the real foundation of the language.

## Tags create elements

A tag is text wrapped in angle brackets: `<p>`. An opening tag marks where an element begins, and a closing tag — with a forward slash — marks where it ends: `</p>`. The opening tag, the closing tag and everything between them form an **element**. When a browser encounters `<p>Welcome</p>`, it creates a paragraph element containing the text "Welcome".

Most elements are container elements that wrap content, like headings, paragraphs, lists and links. Some elements are void elements with no content at all — they consist of a single tag and describe something self-contained, like an image (`<img>`), a line break (`<br>`) or an input field (`<input>`). Void elements never have closing tags. You can identify them by remembering that they represent things that have no "inside": an image is a single thing, whereas a paragraph has an inside and an outside.

```html
<p>This is a paragraph element.</p>
<img src="cat.jpg" alt="A cat">
```

In this example, `<p>This is a paragraph element.</p>` is a full paragraph element: opening tag, text content, closing tag. The `<img>` line is a void element: one tag that carries everything it needs through attributes.

## Attributes configure elements

An opening tag can carry **attributes** — extra pieces of information that configure how the element behaves. An attribute is written as a name, an equals sign, and a value in quotes: `src="cat.jpg"`. Most attributes are optional, but a few are essential. The image above has two attributes: `src`, which tells the browser where to find the image file, and `alt`, which provides a text description of the image for screen readers and for situations where the image cannot load.

Attributes fall into two broad groups. Global attributes work on every element: `id` gives an element a unique identifier, `class` assigns one or more reusable style hooks, `title` provides tooltip text, and `hidden` removes an element from display. Then there are element-specific attributes that only make sense on certain elements: `src` and `alt` on images, `href` on links, `type` and `placeholder` on form inputs. When you see an unfamiliar attribute, the question "what element is this on?" usually answers what it does.

```html
<h1 id="page-title" class="heading large">Document Structure</h1>
```

Here the heading carries three attributes: an `id` used for linking and scripting, and two `class` values that CSS can style individually. Notice that `class` accepts multiple space-separated values.

## Headings: the document outline

Headings are the most important content elements in HTML because they define the structure and hierarchy of your document. There are six levels — `<h1>` through `<h6>` — and they work like the chapters and sections of a book. The `<h1>` is the title of the entire page, and there should normally be exactly one of them per page. `<h2>` elements are the major sections, `<h3>` subsections, and so on down the hierarchy.

The golden rule of headings is: **never skip levels**. A page that jumps from `<h1>` straight to `<h4>` is like a book that jumps from chapter one to chapter four — the structure becomes meaningless. Browsers display headings at different sizes by default, which tempts beginners to pick a heading level based on how big they want text to look. That is a mistake: heading levels describe *importance and structure*, not size. If you want text bigger or smaller, that is CSS's job. Using headings semantically means a screen reader user can navigate your page by its outline, search engines can understand its topic hierarchy, and your document stays coherent forever.

```html
<h1>Front-Heaven</h1>
<h2>HTML Curriculum</h2>
<h3>Tags, Elements and Attributes</h3>
<p>This lesson covers the building blocks of HTML.</p>
<h3>Headings and Paragraphs</h3>
<p>Headings create structure; paragraphs carry content.</p>
```

Notice the pattern: a `<h2>` names a major section, and each `<h3>` names a subsection inside it, with paragraphs providing the actual content. This outline structure is what screen readers and search engines consume.

## Paragraphs: the default content container

If headings are the chapters, paragraphs are the prose. The `<p>` element marks a block of text as a paragraph, and it is the most common element on the web. Browsers give paragraphs automatic spacing above and below, which is why you never manually add blank lines between them.

One crucial detail: **how you write whitespace in your HTML file does not matter.** If you press Enter multiple times inside a paragraph, or add many spaces, the browser collapses all of it into a single space. This is called whitespace collapsing. If you want a line break *inside* a paragraph, you can use the void element `<br>`, but it should be used sparingly — a paragraph is a paragraph, and `<br>` is meant for things like addresses and poems, not for layout. If you find yourself adding many `<br>` tags, you are almost certainly fighting CSS, and CSS will win.

```html
<p>
  This paragraph contains   multiple   spaces
  and several line breaks in the source code,
  but the browser shows it as one continuous line of text.
</p>
```

## Real-world usage

Headings and paragraphs are the backbone of content-heavy sites: blogs, news sites, documentation, landing pages. Every content management system renders its articles as heading and paragraph elements. When you read documentation like this very lesson, you are reading an `<h1>`, several `<h2>` sections, and dozens of `<p>` paragraphs — and the table of contents on the side is generated purely from the heading structure. That is semantic HTML working in production: the document outline *is* the navigation.

Attributes are equally universal. Every link on the web uses the `href` attribute; every image uses `src`; every form input uses `type` and `name`. When you later learn CSS, you will select elements by their `class` and `id` attributes — they are the hooks that connect your HTML structure to your visual design. When you learn JavaScript, you will query elements by the same attributes. Master attributes now and you are learning the universal interface between HTML and every other front-end technology.

## Common mistakes

The most common mistakes are all about misuse of levels and whitespace. Choosing headings by visual size rather than meaning ("this looks small, I'll use h4") destroys the document outline. Skipping levels creates gaps that confuse navigation tools. Multiple `<h1>` elements on one page weaken the page's focus, since the single `<h1>` is what tells search engines the page's main topic. Using `<br>` for spacing instead of margin creates fragile, hard-to-maintain layouts. And many beginners expect their file's line breaks to appear on screen, then wonder why their paragraphs merged into one — that is whitespace collapsing working exactly as designed.

On attributes, the classic mistakes are forgetting them entirely (an `<img>` without `alt` is invisible to screen readers; an `<img>` without `src` is broken) and using `id` values that contain spaces — `id` must be a single unique identifier, while `class` is the one that accepts multiple values.

## Best practices

- Use exactly one `<h1>` per page, and descend the heading hierarchy without skipping levels.
- Choose heading levels by meaning, never by appearance — CSS controls size.
- Keep paragraphs for prose; use `<br>` only for true line breaks like addresses.
- Always add `alt` to images and `href` to links, `src` to media.
- Use `class` for styling hooks and `id` for unique anchors and scripting.
- Write attribute values in double quotes, lower-case attribute names.
- Read your page with a screen reader or the DevTools outline panel to verify your document structure makes sense.

## Summary

Tags, elements and attributes are the three building blocks of HTML. Opening and closing tags surround content to form elements; attributes inside opening tags configure them. Headings (`<h1>` to `<h6>`) define the document outline and must follow a strict hierarchy, while `<p>` elements carry the prose. Browsers collapse whitespace, so source formatting does not affect display. Choosing elements and attributes by meaning — not appearance — is the core habit of a professional front-end developer.

## Practice

Write a small page about your favourite hobby with a single `<h1>` title, three `<h2>` sections, and at least one `<h3>` subsection inside each section, with a paragraph under every heading. Include at least one element that uses both `id` and `class` attributes, and one void element. When you finish, open the page and use your browser's DevTools (right-click → Inspect) to check the Elements panel — you will see exactly how the browser interpreted your structure, and you can confirm your outline has no skipped heading levels.
