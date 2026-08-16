---
title: What is responsive design?
description: Understand why the web is mobile-first, what "responsive" actually means, and the universal playbook every site follows to work on every screen.
order: 1
difficulty: beginner
category: Fundamentals
estimatedMinutes: 20
prerequisites: []
---

## Introduction

Pick up your phone and open any major website — a news site, a shop, a bank. Now open the same site on your laptop. The experience is different: navigation collapses into a menu, images and text reflow into fewer columns, buttons get bigger. Same content, same brand, completely different layout. You are looking at responsive design — the discipline of making one page adapt to every screen size.

This is not a niche skill. Most of the world's web traffic comes from phones, and a site that only looks right on a desktop is broken for most of its users. Responsive design is the baseline expectation of modern front-end development — not a feature you add at the end, but a way of thinking that shapes how you build from the first line of CSS.

## What "responsive" really means

**Responsive design** is an approach where a single HTML document and a single set of styles adapt to the device viewing them: layouts reflow, images rescale, navigation collapses, and text stays readable at every size from a 320px phone to a 4K monitor.

Three properties define it:

- **Fluid** — layouts use flexible units (`%`, `rem`, `fr`) and resize smoothly, rather than fixed pixel widths that snap or overflow.
- **Adaptive** — layouts respond to conditions: screen width, orientation, whether the device can hover, whether the user prefers reduced motion. Media queries are the tool for this.
- **Content-first** — the design is driven by the content's needs, not by a list of device names. Breakpoints are chosen where the *layout* breaks, not where phones end.

Contrast this with the older **separate mobile site** approach — a second domain like `m.example.com` served to phones. That meant maintaining two codebases, doubling the work, and risking content drifting apart. Responsive design keeps one URL, one codebase, one content source, and lets CSS do the adapting. It is why Google recommends responsive as the standard, and why it became the default of the web.

## Why the web went mobile-first

The numbers have been decisive for over a decade: more than half of all web traffic comes from phones, and in many countries that figure is above 80%. A phone screen is a fraction of the size of a laptop display — often held one-handed, on a moving bus, under sunlight — and the failure modes are brutal: sideways scrolling, tap targets you cannot hit, text you must zoom into.

Responsive design exists because of physics: screens vary, so layouts must too. The professional response is **mobile-first development** — designing for the smallest, most constrained screen first and enhancing upward. You will learn the full workflow in the mobile-first lesson, but the mindset starts here: assume the phone, treat the desktop as the enhancement, and every screen in between just works.

## The universal playbook

Every major site runs the same handful of patterns. If you can recognise them, you can build them:

- **Fluid container** — the page content hugs the phone edge and centres itself on desktop with `max-width` and `margin-inline: auto`.
- **Collapsing navigation** — a full link row on desktop becomes a hamburger button opening a drawer on mobile.
- **Reflowing grids** — a 4-column card grid on desktop stacks to one column on a phone, usually with `minmax()` doing the work for free.
- **Adaptive tables** — tables either scroll horizontally inside their container or restructure into stacked cards on small screens.
- **Scaled media** — images and video never exceed their container (`max-width: 100%`).
- **Larger touch targets** — buttons and links sized for fingers (at least 44px), not just for mouse cursors.

You will build each of these in the coming lessons. Notice what they share: the content is the same at every size; only the presentation changes. That is the heart of the discipline.

## Common mistakes

The most common misunderstanding is treating responsive design as a final "make it fit" step — building a desktop page, then squashing it with `max-width` queries at the end. That produces fragile tangle-of-resets code. Another mistake is designing for specific devices ("iPhone 14 width") instead of content-driven breakpoints; devices change every year, but content breakpoints stay relevant. And a third is hiding content on mobile with `display: none` without thinking about what users lose — if it matters on desktop, it probably matters on the phone too.

## Best practices

- Start every project from the smallest screen and enhance upward.
- Keep one codebase, one URL, one content source — let CSS do the adapting.
- Recognise the universal patterns (fluid container, collapsing nav, reflowing grids, scaled media) and build them deliberately.
- Design for the content's breaking points, not for device names.
- Test on real phones as you build, not just at the end.
- Never delete content on mobile — reflow it.

## Summary

Responsive design is the discipline of making a single page adapt to every screen: fluid by default, adaptive where needed, and always content-first. It replaced separate mobile sites because maintaining one codebase beats maintaining two, and it became the baseline expectation because most users are on phones. The playbook is small and universal — fluid container, collapsing nav, reflowing grids, adaptive tables, scaled media, touch-friendly targets — and the rest of this stage teaches you to build each piece with confidence.

## Practice

Open five websites you use daily on your phone — a shop, a news site, a service you like, and two you find annoying. For each, note the exact patterns from the playbook: how does the navigation collapse? How many columns do cards have on mobile versus desktop? What is hard to tap? What scrolls sideways unexpectedly? Write your observations in a notes app. This field study is the best possible preparation: the patterns you catalogue are precisely the components you will build in the lessons ahead.