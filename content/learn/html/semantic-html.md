---
title: Semantic HTML
description: HTML that means what it says. Structure your pages with meaningful elements for accessibility, SEO and maintainability.
order: 7
difficulty: beginner
category: Best Practices
estimatedMinutes: 25
prerequisites:
  - learn/html/lists-and-tables
---

## Introduction

Two developers can build visually identical pages with very different HTML. One uses a wall of `<div>` elements; the other uses elements that say what they mean — `<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`. The pages look the same in a browser. But to a screen reader, to a search engine, and to the next developer who inherits the code, they are completely different documents. This is the difference between generic HTML and **semantic HTML**.

Semantics is the act of choosing elements by meaning. It is the single highest-leverage habit in front-end development: it improves accessibility, SEO, maintainability and robustness — all at once, with zero visual cost. This lesson defines semantic HTML, introduces the semantic landscape, and shows you the modern page structure that every professional website shares.

## Why semantics matter

Consider the word "button". A `<div>` styled to look like a button is clickable by mouse but invisible to the keyboard — you cannot Tab to it or press Enter on it. A real `<button>` is clickable, focusable, activatable with Enter and Space, announced as "button" by screen readers, and handled automatically by form submissions. The element's *meaning* creates all those behaviours. This is the core argument for semantics: browsers, assistive technology and tools derive behaviour from meaning. When you strip meaning away, you strip behaviour away.

Semantics also power the "reading order" experience of the web. Screen-reader users navigate with landmark commands: "jump to main content", "skip to navigation", "go to the footer". These landmarks exist only when the page uses semantic elements. Search engines similarly build their understanding of your page from its headings and landmarks. And for you, the developer, semantic HTML is self-documenting — you can open a well-structured page and instantly understand which parts are header, navigation, content and footer.

## The semantic elements

HTML provides a family of elements whose names describe their role. The structural landmarks are `<header>` (introductory content, often the site masthead), `<nav>` (navigation links), `<main>` (the page's primary content — one per page), `<section>` (a themed grouping of content, with a heading), `<article>` (self-contained content: a blog post, a news story, a comment), `<aside>` (tangential content: sidebars, pull quotes), and `<footer>` (closing information for a page or section).

Beyond the landmarks, meaning continues into every part of the language you have already learned: headings describe hierarchy; `<p>` is prose; `<ul>` and `<ol>` are lists; `<a>` is a link; `<button>` is an action; `<form>` collects input; `<figure>`/`<figcaption>` caption media; `<time>` marks dates; `<strong>` and `<em>` add emphasis — and `<mark>` highlights, `<blockquote>` quotes, and `<address>` contact information. The `<div>` and `<span>` elements are the exceptions that prove the rule: they exist for grouping *when no more meaningful element exists*, and a page dominated by them is a page that has given up on semantics.

## The classic page structure

Here is a typical modern page built with semantic structure — the layout virtually every content site on the web follows:

```html
<body>
  <header>
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/roadmap">Roadmap</a></li>
        <li><a href="/about">About</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <article>
      <h1>Semantic HTML</h1>
      <p>Published <time datetime="2026-08-14">August 14, 2026</time></p>
      <p>This article explains why markup should mean what it says…</p>
      <section>
        <h2>The semantic elements</h2>
        <p>Details about the semantic landscape…</p>
      </section>
    </article>

    <aside>
      <h2>Related articles</h2>
      <ul>
        <li><a href="/learn/html/forms">Forms</a></li>
      </ul>
    </aside>
  </main>

  <footer>
    <p>© 2026 Front-Heaven</p>
  </footer>
</body>
```

Notice what is happening at each level. The `<header>` wraps the navigation, and the `<nav>` contains a real list of real links. `<main>` holds the page's unique content. Inside it, `<article>` marks the self-contained blog post, `<section>` divides the article into titled themes, and `<aside>` carries related-but-separate content. The `<footer>` closes the page with copyright. Each element earns its place by meaning, and a screen reader can now navigate this page by landmarks alone.

## Articles and sections: choosing correctly

Two elements confuse almost every beginner: `<article>` and `<section>`. The rule of thumb: an `<article>` is *self-contained* — it would still make sense if you lifted it out of the page and published it alone. A blog post, a news story, a user review, a comment — these are articles. A `<section>` is a *themed grouping* — it exists as part of a larger document, and it should always have a heading. Every major block of your page that has a title is a candidate for `<section>`; every standalone piece of content is a candidate for `<article>`.

A blog page is therefore `<article>` containing `<section>`s. A page of search results is a list of `<article>` elements. An `<article>` can contain other `<article>`s (a forum thread containing posts). And both elements gain meaning from headings: an element without a heading is rarely a genuine section. When in doubt, ask: "If this were the only thing on the page, would it make sense?" — yes means article, no means section.

## Real-world usage

Open any major website and inspect it with the DevTools: you will find the semantic landmarks. News sites wrap stories in `<article>`; e-commerce sites use `<main>` for the product listing and `<aside>` for filters; documentation sites put chapters in `<article>` and topics in `<section>`. Modern frameworks generate semantic markup — React components render `<nav>`, `<button>`, `<form>` — and design systems enforce it. Accessibility audits (like Lighthouse) flag pages without landmarks, and many companies' accessibility policies require them.

The practical benefits are measurable. Search engines reward clear structure; the "People also ask" features and featured snippets are extracted from semantically structured content. Screen-reader efficiency skyrockets when landmarks exist. And maintenance improves: a codebase where components correspond to meaning is easier to refactor, easier to test, and easier to hand to a new team member.

## Common mistakes

The number one mistake is div-soup: wrapping everything in `<div>` and `<span>` because they are the elements the developer always uses. The number two mistake is semantic theatre — using the right element for the wrong purpose, like wrapping a button in an `<a>` or making a whole card clickable with JavaScript on a `<div>`. If it performs an action, it is a `<button>`; if it navigates, it is an `<a>`.

Also common: multiple `<main>` elements (there must be exactly one), `<header>`/`<footer>` inside `<main>` when they mean page-level chrome, `<aside>` used for content that is actually central, `<section>` used without headings, and `<article>` used for decorative groupings. And the classic: `<nav>` wrapped around every list of links, even ones that are not navigation, like a list of social icons in the footer (that is arguably fine — navigation is navigation) — versus the reverse mistake: navigation built from divs with click handlers, which are invisible to every assistive technology.

## Best practices

- Start every page's body with the landmark structure: header, nav, main, footer.
- Use exactly one `<main>` per page.
- Use `<article>` for self-contained content, `<section>` for themed groups with headings.
- Use `<button>` for actions and `<a>` for navigation — never style one as the other.
- Keep the `<div>` count honest: reach for a meaningful element first.
- Verify with the browser's accessibility tree that your landmarks and headings announce correctly.
- Pair every section, article and form group with a heading.
- When you refactor, improve semantics alongside visuals — they belong together.

## Summary

Semantic HTML means choosing elements by meaning: landmarks like `<header>`, `<nav>`, `<main>`, `<aside>` and `<footer>` structure the page; `<article>` and `<section>` organise content; and every element from `<button>` to `<time>` carries behaviour that generic containers cannot. This yields pages that screen readers can navigate, search engines can understand, and developers can maintain — the invisible quality that separates professional markup from beginner markup.

## Practice

Take the `about-me.html` page you built in the first lesson and rebuild it semantically: a `<header>` with a `<nav>` of three links, a `<main>` containing a single `<article>` about yourself divided into at least two headed `<section>`s, an `<aside>` with a list of links you recommend, and a `<footer>` with a copyright line. Use `<time>` for a date and at least one `<figure>` with a caption. Then open the browser's accessibility tree in DevTools and walk the landmarks with your keyboard — you should be able to jump from header to main to footer and hear each region announced.
