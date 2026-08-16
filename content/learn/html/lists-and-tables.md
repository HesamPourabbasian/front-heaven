---
title: 'Lists and Tables'
description: 'Organise information the way the web understands it. Master ordered, unordered and description lists, then build accessible tables.'
order: 5
difficulty: 'beginner'
category: 'Core Content'
estimatedMinutes: 20
prerequisites:
  - learn/html/tags-elements-and-attributes
---

## Introduction

Humans have organised information into lists and tables for thousands of years, and the web is no different — but the web adds a rule beginners find hard to believe: how you structure information matters more than how it looks. A list that is marked up as a list is announceable, navigable and countable. A table that is marked up properly is skimmable by screen readers in both directions. The same information marked up as a pile of paragraphs and divs is just noise.

This lesson covers the three list types HTML provides — unordered, ordered and description lists — and then tables: the elements involved, the header/body structure, and the accessibility attributes that make complex tables usable. By the end you will be able to structure any kind of grouped information correctly.

## Unordered lists: groups without order

An unordered list is a group of related items where order does not matter. Its container is `<ul>` and each item inside is `<li>`. Browsers render `<ul>` items with bullet points by default — though styling them is CSS's job — and, crucially, browsers and assistive technology automatically announce "list of N items" when they encounter a `<ul>`. That announcement is the payoff of correct structure.

```html
<ul>
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
</ul>
```

An `<ul>` may only contain `<li>` elements directly — no text, no headings, no divs floating around. But each `<li>` can contain anything at all: paragraphs, links, images, even entire nested lists. This is the nesting pattern that powers everything from navigation menus to comment threads.

```html
<ul>
  <li>Front-end
    <ul>
      <li>HTML</li>
      <li>CSS</li>
      <li>JavaScript</li>
    </ul>
  </li>
  <li>Back-end
    <ul>
      <li>Databases</li>
      <li>APIs</li>
    </ul>
  </li>
</ul>
```

Here "Front-end" and "Back-end" are items that each contain their own sub-list. Nested lists are extremely common — any multi-level menu, outline, or folder-tree display is a nested `<ul>`. Notice the nesting rule from the earlier lesson applies: the inner `<ul>` must close before its parent `<li>` closes.

## Ordered lists: sequences that matter

An ordered list is for items whose order is meaningful. Its container is `<ol>`, and it renders with numbers instead of bullets. Any time you are describing steps, rankings, recipes or priorities, `<ol>` is the correct choice — and the numbering is handled by the browser, so if you insert an item in the middle, everything renumbers automatically. Try that with manually typed numbers and you will see why this matters.

```html
<ol>
  <li>Write the HTML structure</li>
  <li>Style it with CSS</li>
  <li>Add interactivity with JavaScript</li>
</ol>
```

The `start` attribute lets you begin at a number other than one — useful when a list continues across sections. The `reversed` attribute counts down. And a powerful trick is that the browser keeps counting across the gap when a list is interrupted by content, as long as you resume with the same `<ol>` — a pattern used for long instructions that span pages.

```html
<ol start="3">
  <li>Practice with small projects</li>
</ol>
```

## Description lists: terms and definitions

The third list type is the description list `<dl>`, used for name-value pairs: glossaries, product specifications, frequently-asked questions. Its items come in two parts: `<dt>` for the term and `<dd>` for the description. A `<dt>` can have multiple `<dd>`s (one term, several definitions), and a `<dd>` can itself contain whole blocks of content.

```html
<dl>
  <dt>HTML</dt>
  <dd>HyperText Markup Language — the structure of web pages.</dd>

  <dt>CSS</dt>
  <dd>Cascading Style Sheets — the presentation of web pages.</dd>
</dl>
```

Description lists are underused. Every FAQ, every settings page with label/value rows, and every glossary is a `<dl>` waiting to happen. Marking them up correctly means a screen-reader user can jump between terms and hear them paired with their definitions, and search engines understand the semantic relationship too.

## Tables: the elements

Tables present data in rows and columns. HTML tables are built from four elements: `<table>` wraps everything, `<tr>` is a table row, `<th>` is a header cell (bold and centred by default), and `<td>` is a regular data cell. A basic two-column table looks like this:

```html
<table>
  <tr>
    <th>Technology</th>
    <th>Purpose</th>
  </tr>
  <tr>
    <td>HTML</td>
    <td>Structure</td>
  </tr>
  <tr>
    <td>CSS</td>
    <td>Presentation</td>
  </tr>
</table>
```

The first `<tr>` contains two `<th>` elements, making it the header row; the following rows contain `<td>` data cells. Browsers size columns to fit their content, and CSS takes over from there. This simple structure is a complete, valid table — and screen readers already treat the first row as column headers for the whole table.

## Tables: proper structure with thead, tbody and scope

Simple tables work, but real tables deserve the full structure. The `<thead>`, `<tbody>` and `<tfoot>` elements divide a table into semantic regions: header, body and footer. This matters for long tables — `<thead>` can be repeated when a table prints across pages — and it clarifies meaning. Even more important is the `scope` attribute on `<th>`, which tells assistive technology whether a header applies to its column, its row, or both:

```html
<table>
  <thead>
    <tr>
      <th scope="col">Day</th>
      <th scope="col">Lesson</th>
      <th scope="col">Minutes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Monday</th>
      <td>What is HTML?</td>
      <td>15</td>
    </tr>
    <tr>
      <th scope="row">Tuesday</th>
      <td>Document structure</td>
      <td>15</td>
    </tr>
  </tbody>
</table>
```

With `scope="col"` on the top headers and `scope="row"` on the row headers, a screen reader can announce "Tuesday — Document structure — 15 minutes" with full context. The `<caption>` element — the table's title, placed directly inside `<table>` — gives the whole table a name. A table with a caption, header row, body and scoped headers is not just valid HTML; it is a usable data interface for everyone.

## Real-world usage

Lists are everywhere: navigation menus, breadcrumbs, search results, comment threads, FAQ sections, feature lists on landing pages — every one is a `<ul>` or `<ol>` at heart. Tools that analyse page structure for SEO and accessibility report on list usage, and every modern CSS framework styles lists as the backbone of menus. Tables power pricing comparison pages, dashboards, schedules, specification sheets and financial data. If you have ever used an online shop's size guide or a sports site's standings table, you have used a semantically structured table.

The accessibility angle is not theoretical: screen readers offer navigation commands like "go to next list" and "move to next table", and they read tables with full header context only when `scope` and `thead` are present. This is why the WCAG accessibility guidelines treat table headers as a requirement, not a nicety — and it is exactly the kind of detail that reviewers look for in code reviews.

## Common mistakes

The classic list mistake is using `<div>` or `<p>` elements to fake bullets — the browser shows bullets, but no assistive technology announces a list, and the structure conveys nothing. Related: using `<ul>` when the order matters and `<ol>` when it does not. On tables, the grand old mistake is using tables for *layout* — arranging the whole page in table rows — which was common in the 1990s and is now considered harmful: layout tables are inflexible, inaccessible and impossible to make responsive. Modern layout belongs to CSS Grid and Flexbox, which you will learn soon.

Within legitimate tables, the mistakes are skipping `<thead>`/`<tbody>`, omitting `scope`, leaving `<th>` out entirely (using `<td>` for everything), and nesting tables. A table inside a table is nearly always a sign of confused structure. And one more: `border` and `bgcolor` attributes belong to the past — presentational attributes on tables should be replaced by CSS classes.

## Best practices

- Use `<ul>` for unordered groups, `<ol>` for ordered sequences, `<dl>` for terms and definitions.
- Only `<li>` elements belong directly inside `<ul>`/`<ol>`.
- Nest lists for hierarchy; every real menu is a nested list.
- Use `<table>` only for data — never for page layout.
- Structure every table with `<thead>`, `<tbody>`, `<caption>` and `scope` attributes.
- Use `<th>` for headers and `<td>` for data, always.
- Let the browser handle numbering in `<ol>` — never type numbers manually.
- Test your lists and tables by navigating them with a keyboard or screen reader.

## Summary

Lists and tables organise information structurally. Unordered lists group related items, ordered lists sequence steps, and description lists pair terms with definitions — each announceable as a unit by assistive technology. Tables combine `<table>`, `<tr>`, `<th>` and `<td>` with `<thead>`, `<tbody>`, `<caption>` and `scope` to present data accessibly. Structure, not appearance, is what makes these elements powerful — and it is the difference between information users can navigate and noise they must struggle through.

## Practice

Build a weekly study plan page using all three list types: an `<ol>` for your daily routine steps, a nested `<ul>` breaking each day's topics into subtopics, and a `<dl>` defining three terms from this lesson. Then create a study-log `<table>` with a caption, `thead`/`tbody`, and columns for Day, Topic, Minutes and Completed — using `scope="col"` and `scope="row"` correctly. Finally, open the browser's accessibility tree (in DevTools) and inspect how your lists and table appear to assistive technology.
