---
title: 'Links and Images'
description: 'Connect your pages to the world. Master anchors, absolute and relative paths, and images that load fast and fail gracefully.'
order: 4
difficulty: 'beginner'
category: 'Core Content'
estimatedMinutes: 20
prerequisites:
  - learn/html/tags-elements-and-attributes
---

## Introduction

Two elements made the web the web. The first is the link — the ability to jump from one page to another with a single click, which is what "hypertext" in HTML means. The second is the image, which turned a text-only network into the visual medium we know today. Every front-end developer uses `<a>` and `<img>` constantly, and while both look simple, they are full of subtle decisions that affect usability, accessibility, performance and SEO.

This lesson teaches the anchor element properly — absolute versus relative paths, how `target` works, and what good link text sounds like — and then the image element, including the `alt` attribute, figure captions, and the difference between images that are content and images that are decoration.

## The anchor element: creating links

Links are created with the anchor element `<a>`, and the `href` attribute tells the browser where the link leads. The content between the opening and closing tags is the *visible* part — the text or image the user clicks. It is called an anchor because it can also "drop anchor" at a specific spot on a page: a link to `#section-two` scrolls to the element with that id on the current page, which is how table-of-contents links work.

```html
<a href="https://developer.mozilla.org/en-US/">Visit MDN</a>
<a href="/roadmap">The Front-Heaven roadmap</a>
<a href="about.html">About this site</a>
<a href="#summary">Jump to the summary</a>
```

The first link uses an absolute path: the full web address, including the protocol (`https://`). Absolute paths point to any page on the internet. The second link uses a root-relative path: it starts with `/`, meaning "from the top of this website" — on this site that is `/roadmap`. The third uses a relative path, resolved against the current location. The fourth is an in-page anchor, jumping to the element with `id="summary"`.

## Choosing between path types

Understanding path types prevents broken links — one of the most common bugs in any website. If your site lives at `example.com`, then `href="/roadmap"` always points to `example.com/roadmap`, no matter which page you are on. A relative path like `href="about.html"` points to a file named `about.html` in the *same folder as the current page*. If the current page is at `example.com/learn/html/`, the link points to `example.com/learn/html/about.html`. Relative paths are great for linking between pages that belong together and move together, but they break as soon as the folder structure changes.

A useful rule: use root-relative paths (`/about`) for your own site's pages — they survive reorganisation — and absolute paths (`https://other-site.com/page`) whenever you link to another website. For in-page navigation, anchors with `id` references are the only option. If you ever see a link with `href="#"` and nothing after the hash, that is a broken link in disguise — it scrolls to the top of the page, and its presence usually means a developer forgot to finish the job.

## The target attribute and link behavior

By default, clicking a link replaces the current page. The `target` attribute changes that. `target="_blank"` opens the link in a new tab, and `rel="noopener"` should accompany it for security: without it, the new page gains partial access to the window that opened it — a vulnerability called `reverse tabnabbing`. So the safe pattern for external links is:

```html
<a href="https://developer.mozilla.org" target="_blank" rel="noopener">
  MDN Documentation
</a>
```

Keep in mind that opening links in new tabs is a decision, not a default. Links to your own site should normally open in the same tab — users expect back and forward buttons to work. Links to external sites, or to documents like PDFs, are reasonable candidates for `_blank`. Also remember the `title` attribute on links can add context, but link *text* matters far more, as described below.

## Writing accessible link text

The text inside a link is read out loud by screen readers, announced to search engines, and scanned by sighted users who skim. That means link text should always describe where the link leads. "Read the documentation" is good; "click here" or "read more" is useless to someone who cannot see the surrounding context. Screen-reader users commonly jump from link to link, hearing only the link text — a page full of "click here" becomes a wall of identical, meaningless phrases.

The best link text is specific and natural: "the HTML specification", "our pricing page", "the full lesson on flexbox". If a link opens a PDF, mention it — "Download the syllabus (PDF)" — because a download is an unexpected action. The same principle applies when the link contains an image: the image's `alt` text becomes the link's text for assistive technology, so a logo linking home needs `alt="Front-Heaven home"`, not `alt="logo"`.

## The image element

Images are added with the void element `<img>`, which needs two attributes to work properly: `src`, the path to the image file, and `alt`, a text description of what the image shows. The paths follow exactly the same rules as link paths: absolute, root-relative or relative.

```html
<img src="/images/html-cheatsheet.png" alt="A diagram of HTML tags and their meanings" width="800" height="450">
```

The `alt` attribute is non-negotiable. Screen readers announce it in place of the image, so visually impaired users experience the same content as everyone else. If an image fails to load — a broken file, a slow connection — the browser displays the alt text instead, so a good `alt` also protects against broken images. If the image is purely decorative, set `alt=""` (empty): this tells assistive technology to skip it entirely rather than announcing "image" to users. Never omit `alt` or use vague text like "image" or "photo1".

## Width, height and figure captions

Specifying `width` and `height` on images is a quiet performance win. The browser reserves exactly that space while the image downloads, so the page does not jump around as images load in — a layout shift that frustrates users and hurts the metrics search engines measure. Modern CSS can then resize the image responsively without distortion, but the declared dimensions stop the jank.

When an image needs a caption, pair it with the `<figure>` and `<figcaption>` elements. `<figure>` wraps the image and its caption into one semantic unit, and `<figcaption>` provides the text that explains it. This is the correct, accessible way to caption media — far better than a `<p>` floating below the image, which is not connected to it in meaning.

```html
<figure>
  <img src="diagram.png" alt="The box model: content, padding, border and margin">
  <figcaption>Every element on a page follows the box model.</figcaption>
</figure>
```

## Real-world usage

Links and images are everywhere, and the decisions above are daily work. Navigation menus are lists of links; buttons that navigate are links styled to look like buttons; logos are images wrapped in links. Blogs and news sites are grids of image cards, each one an `<a>` wrapping an `<img>` with careful alt text. E-commerce pages are image galleries with anchors that scroll to product sections. Accessibility audits of real sites are dominated by missing `alt` attributes and bad link text — fixing those is often the highest-impact improvement a developer can make to a site's quality score.

Performance teams also obsess over images, because images are typically the heaviest resources on any page. The `width`/`height` attributes, responsive techniques like `srcset` (which you will meet in the responsive design stage), and choosing modern formats like WebP all start with the fundamentals taught here: every image needs a `src`, an `alt`, and explicit dimensions.

## Common mistakes

Broken links top the list: absolute paths pointing at pages that moved, relative paths that assume the wrong folder, and `href="#"` placeholders never replaced. On images, the mistakes are forgetting `alt`, using `alt=""` on meaningful images (which hides them from screen readers), or writing alt text that duplicates surrounding text — "an image of the diagram below" when the caption already explains it. Using huge images scaled down by CSS wastes megabytes of bandwidth; skipping `width` and `height` causes layout shift; and using a `<p>` instead of `<figure>`/`<figcaption>` severs the connection between image and caption.

Link-target mistakes matter too: forgetting `rel="noopener"` on `_blank` links introduces a real (if small) security risk, and overusing `_blank` destroys users' back-button mental model. Finally, wrapping clickable-looking elements in `<div>` instead of `<a>` breaks keyboard navigation — a `<div>` is not focusable or activatable with Enter, so "links" made of divs are unusable for keyboard and screen-reader users.

## Best practices

- Use meaningful link text that describes the destination; never "click here".
- Use root-relative paths (`/page`) for your own site, absolute paths for other sites.
- Add `rel="noopener"` to every `target="_blank"` link.
- Give every content image a descriptive `alt`; use `alt=""` for decorative images.
- Declare `width` and `height` on images to prevent layout shift.
- Wrap captioned images in `<figure>` with a `<figcaption>`.
- Link only real URLs — `href="#"` is a bug.
- Build navigation with real links (or real `<button>`s for actions), never divs.

## Summary

The `<a>` element creates links with `href` values that may be absolute, root-relative, relative or in-page anchors; accessible links say where they lead. The `<img>` element needs `src` and `alt`, with declared dimensions to avoid layout shift, and captions belong in `<figure>`/`<figcaption>`. Together these two elements connect your site to the rest of the web and make its content visible — and their accessibility details are exactly what separate polished sites from broken ones.

## Practice

Create a page called `links.html` that demonstrates every path type: an absolute link to your favourite documentation site (with `target="_blank"` and `rel="noopener"`), a root-relative link to `/roadmap`, a relative link to a second file in the same folder, and an in-page anchor link. Add an image of something meaningful to you with a descriptive `alt`, declared dimensions, and a `<figure>` caption. Then break one of the links deliberately, open the page, and use the browser DevTools Network panel to watch the failed request — understanding failures is how you build the skill of fixing them.
