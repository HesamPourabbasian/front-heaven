---
title: 'What is CSS?'
description: 'The presentation layer of the web. Learn how CSS rules work, the cascade, and the three ways to apply styles to HTML.'
order: 1
difficulty: 'beginner'
category: 'Fundamentals'
estimatedMinutes: 20
prerequisites:
  - learn/html/what-is-html
---

## Introduction

HTML gives a web page its structure; CSS — **Cascading Style Sheets** — gives it its presentation. CSS is the language that decides how every element looks: its colours, fonts, sizes, spacing, position and animation. It is the difference between a bare text document and the polished, premium interfaces you use daily. If HTML is the skeleton, CSS is the skin, the clothes and the lighting.

What makes CSS special — and what makes it deeply misunderstood by beginners — is the word *cascading*. Unlike HTML, where a tag means one thing, CSS is a system of rules that compete to style the same element, with a precise set of rules deciding who wins. Understanding that system is the single biggest unlock in CSS: most "CSS is broken" moments are actually "I don't understand the cascade yet" moments. This lesson introduces how CSS works: rules, selectors, declarations, the cascade, and the three ways to attach styles to your pages.

## Anatomy of a CSS rule

A CSS stylesheet is a list of rules. Each rule has two parts: a **selector** that chooses which elements it applies to, and a **declaration block** containing one or more **declarations** — property/value pairs that set the styles.

```css
h1 {
  color: #6366f1;
  font-size: 2rem;
}
```

Reading this rule out loud: "Every `h1` element should have its color set to `#6366f1` and its font size set to `2rem`." The selector is `h1`, the declarations are `color: #6366f1` and `font-size: 2rem`. Each declaration ends with a semicolon, the property and value are separated by a colon, and the whole block is wrapped in curly braces. Once you can read one rule, you can read all of CSS — every framework and design system is built from exactly this shape.

```css
/* A comment explains the code */
.alert {
  background-color: #fef2f2;   /* property: value; */
  border: 1px solid #fca5a5;
  border-radius: 8px;
  padding: 12px 16px;
}
```

## Selectors

Selectors are how CSS finds elements. The most common selector is the type selector — the element name itself: `h1`, `p`, `a`, `div`. More powerful are the class selector `.alert` (matches every element with `class="alert"`) and the id selector `#main` (matches the single element with `id="main"`). Classes are the selector you will use most, because they are reusable and precise.

```css
p { color: #3f4150; }              /* all paragraphs */
.card { border-radius: 12px; }    /* every element with class="card" */
#hero { padding: 6rem 0; }        /* the element with id="hero" */
```

Selectors combine into powerful patterns. `.card .title` selects elements with class `title` that are *descendants* of an element with class `card`. `.card > .title` selects only direct children. `h2 + p` selects the paragraph immediately after an `h2`. `input[type="email"]` selects inputs with a specific attribute. You will master these in the next lesson — for now, remember that the selector side of a rule is a question CSS asks about every element: "Are you one of these?"

## The three ways to apply CSS

There are three places CSS can live, and they are not equal. The first is a **separate stylesheet file** linked from the `<head>` — this is the professional default. It keeps content and presentation in different files, works for every page that links it, and can be cached by the browser so repeat visits load instantly.

```html
<link rel="stylesheet" href="styles.css">
```

The second is a `<style>` block inside the `<head>` — fine for small experiments and single-file prototypes, but it mixes presentation into the document and cannot be reused across pages. The third is inline styling — a `style` attribute directly on an element: `<p style="color: red">`. Inline styles are the most specific and therefore the hardest to override; they bypass the cascade's normal order, they cannot respond to media queries, and they make maintenance painful. Use a stylesheet file for real work, and treat inline styles as a code smell.

## The cascade and the order of rules

The cascade is the algorithm that decides, when several rules target the same element, which declaration wins. Three forces combine. First, **specificity**: more specific selectors beat less specific ones — an id selector beats a class selector, which beats a type selector. Second, **source order**: with equal specificity, the rule that appears later in the stylesheet wins. Third, **importance**: declarations marked `!important` override everything else — which is why `!important` is a last-resort escape hatch, and its overuse is a famous anti-pattern.

```css
p { color: gray; }
p { color: black; }       /* later — wins */

.note { color: blue; }    /* class beats type */
p { color: gray; }        /* loses to the class above */
```

Because of the cascade, the order of your stylesheets and the placement of your rules matter. The typical professional workflow is: write a base layer (element defaults), then component classes, then utilities and overrides. Modern CSS formalises this with cascade layers — you will meet them in the modern CSS lesson. For now, when a style "does not apply", the debugger's first question is not "why is my CSS broken?" but "what else is targeting this element, and is it more specific or later?"

## Specificity, inheritance and the box model

Three mental models complete the CSS worldview. **Specificity** is the scoring system just described: in practice, id selectors score highest, classes next, type selectors lowest, and inline styles beat them all. **Inheritance** is the other side of the coin: some properties — notably `color`, `font-family` and `line-height` — are *inherited*, meaning a child element uses its parent's value unless it sets its own. That is why setting `color` on `body` colours nearly everything on the page. Properties like `margin`, `padding` and `border` do not inherit, because layout must be per-element.

The **box model** — the subject of a dedicated lesson coming soon — describes how every element's size is computed from content, padding, border and margin. Together these three ideas — cascade, inheritance, box model — are what a senior developer means by "CSS fundamentals". Everything else, from flexbox to animations, is built on them.

## Real-world usage

Every interface you have ever seen is a CSS production. Design systems like Material Design and Tailwind are CSS architectures; every framework's styling layer is CSS in disguise (even inline-styles-in-JS approaches eventually render CSS). Modern CSS is doing work that used to require JavaScript: responsive layout, dark mode via media queries, sticky headers, scroll-driven animations. When you open DevTools and see an element's computed styles — the final values after the cascade — you are watching the cascade's verdict.

CSS also has a professional dimension beyond aesthetics: accessibility. Colour contrast, focus visibility, spacing for touch targets and `prefers-reduced-motion` support are all CSS responsibilities. A site can be perfectly structured in HTML and still fail users if its CSS breaks contrast or traps focus.

## Common mistakes

The classic beginner cascade is applying styles that "do not work": a rule in a linked stylesheet overridden by a later, equally specific rule; a class selector defeated by an id selector; an inline style refusing to be overridden. Debugging "why isn't my style applying" without checking specificity and source order wastes hours. Another classic: putting a `<style>` block in the `<body>` or adding styles inline everywhere instead of one stylesheet, producing a page where nothing can be overridden predictably. Also common: confusing the selector and declaration syntax (colons vs semicolons), forgetting the closing brace, and typos in property names — the browser silently ignores invalid declarations, which is why nothing happens.

## Best practices

- Keep styles in external `.css` files linked from the `<head>`.
- Write rules from general to specific: base elements, then classes, then modifiers.
- Prefer classes over id selectors and type selectors for styling.
- Reserve `!important` for true emergencies; treat its use as a bug report about the cascade.
- Learn to read the DevTools "Computed" and "Styles" panels — they show exactly what won the cascade and why.
- Name things by purpose (`.card`, `.btn--primary`) not appearance (`.red`, `.big`).
- Keep the specificity of your rules low and even; a stylesheet where every selector is equally weighted is predictable.
- Style for accessibility: contrast, focus and reduced motion are part of the job.

## Summary

CSS is the presentation language of the web, built from rules composed of selectors and declarations. Styles attach via external files, `<style>` blocks or inline attributes, and the cascade resolves conflicts using specificity, source order and importance. Inheritance passes some properties down the tree, and the box model computes every element's size. Together these ideas explain nearly every CSS behaviour — and debugging CSS is mostly a matter of asking what the cascade decided and why.

## Practice

Create `style.css` and link it from a small HTML page with three paragraphs and one heading. Style the heading with a colour and font size; give the paragraphs a readable text colour and line height by styling `body` (watch inheritance work). Add two class-based rules where one class is applied to two different elements, and write two rules with identical specificity targeting the same property — then swap their order and observe which value wins. Finally, open DevTools, inspect the heading, and look at the "Computed" tab to see the cascade's final verdict on every property.