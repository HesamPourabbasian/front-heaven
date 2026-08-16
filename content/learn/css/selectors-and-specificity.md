---
title: 'Selectors and Specificity'
description: 'Choose elements with precision. Master the selector toolbox and the specificity system that decides which styles win.'
order: 2
difficulty: 'beginner'
category: 'Fundamentals'
estimatedMinutes: 25
prerequisites:
  - learn/css/what-is-css
---

## Introduction

If CSS rules are questions asked of every element, selectors are how you phrase those questions — and the browser answers with a match or a miss. "Give me every link inside a navigation", "give me the first paragraph of every section", "give me every input that is currently invalid" — each of these is a selector. Learning the selector language transforms you from a developer who slaps classes on everything to one who writes precise, minimal rules that survive refactoring.

The second half of this lesson — specificity — answers the question every beginner eventually screams: *"Why is my style not applying?"* Specificity is the scoring system the cascade uses to break ties, and it is the most misunderstood concept in CSS. Once you can compute specificity in your head, the mysterious "CSS that ignores you" largely disappears from your life.

## The selector toolbox

Every selector you will ever need belongs to a small family. **Type selectors** match by element name: `p`, `a`, `h2`. **Class selectors** match any element carrying the class: `.card`, `.nav-link`. **ID selectors** match the unique element with that id: `#main-content`. **Attribute selectors** match by attribute: `[type="email"]`, `[href^="https"]`. **Pseudo-classes** match by state: `:hover`, `:focus`, `:first-child`, `:disabled`. **Pseudo-elements** target parts of elements: `::before`, `::after`, `::first-line`.

```css
p { font-size: 1rem; }
.card { border-radius: 12px; }
#main-content { max-width: 800px; }
input[type="email"] { border-color: blue; }
a:hover { text-decoration: underline; }
li::marker { color: var(--primary); }
```

The attribute selector family is worth studying closely because it reads like a filter language. `[href^="https"]` matches links whose `href` *starts with* "https" (secure external links). `[alt]` matches elements that have an alt attribute at all. `[class~="featured"]` matches class lists containing the word. These selectors let you style by data and state, not just by class names — which keeps your HTML cleaner and your CSS more expressive.

## Combinators: selectors that relate

A **combinator** connects two selectors to express a relationship. This is where selectors become powerful. The descendant combinator (a space) selects elements nested anywhere inside: `.card p` matches every paragraph inside a card. The child combinator (`>`) requires direct parentage: `.card > p`. The adjacent sibling (`+`) selects the next sibling: `h2 + p` matches the paragraph immediately after an h2. The general sibling (`~`) selects any later sibling: `h2 ~ p`.

```html
<div class="card">
  <h2>Title</h2>
  <p>Direct child paragraph.</p>
  <div class="body">
    <p>Nested deeper paragraph.</p>
  </div>
</div>
```

```css
.card > p { color: #14151f; }   /* only the direct child */
.card p { font-size: 14px; }    /* both paragraphs */
h2 + p { margin-top: 0; }       /* only the paragraph right after the h2 */
```

The child combinator is the boundary between "inside" and "directly inside" — a distinction that prevents the most common styling leak: a rule intended for direct children accidentally styling grandchildren. When you see a component's styles bleeding into nested copies of itself, the child combinator is usually the fix.

## Grouping and the comma

Several selectors that share the same declarations can be grouped with commas. This is pure readability — it avoids duplicating declaration blocks.

```css
h1, h2, h3 {
  font-family: "Space Grotesk", sans-serif;
  letter-spacing: -0.02em;
}
```

One comma mistake is worth flagging: `h1, h2, h3` (three separate selectors) is completely different from `h1 h2 h3` (a descendant chain) — the comma never means "inside". Mixed chains are fine: `.card h2, .card h3` groups two descendant selectors. Reading CSS aloud — "h1, h2 and h3 get this font" versus "an h3 inside an h2 inside an h1" — instantly reveals which you wrote.

## How specificity is scored

Specificity is a points system that decides ties between competing rules. The conventional way to describe it: count the ids, the classes (plus attributes and pseudo-classes), and the type selectors (plus pseudo-elements) in a selector. The rule with the higher count in the first category wins; if equal, the second category; then the third; and only then does source order decide.

```css
/* (0 ids, 0 classes, 1 type) */
p { color: gray; }

/* (0 ids, 1 class, 0 types) — beats the type selector */
.note { color: blue; }

/* (0 ids, 1 class, 1 type) — more specific still */
p.note { color: green; }

/* (1 id, 0 classes, 0 types) — beats everything above */
#intro { color: black; }
```

Work through the numbers: the type selector `p` scores 0-0-1. The class `.note` scores 0-1-0 — higher, so it wins. `p.note` scores 0-1-1 — higher again. `#intro` scores 1-0-0 — it beats all of them, regardless of order. This is why ids make such heavy-handed selectors: a single id defeats an entire stylesheet of classes, and overriding it requires `!important` or another id. The professional pattern is to keep specificity low and flat — almost everything at the 0-1-0 level — so that later rules can override earlier ones predictably.

## Specificity in practice: the 0-1-0 habit

The modern professional habit is simple: **style with classes**. One class per rule keeps every selector at the same weight, which means the cascade falls back to source order — easy to reason about, easy to override. Avoid styling type selectors directly for components (they leak into everything) and avoid ids for styling (they are for anchors and scripting hooks). When you need variants, use an extra class: `.btn` for the base, `.btn--primary` for the variant, both scoring equally.

```css
.btn { padding: 0.5rem 1rem; }
.btn--primary { background: #6366f1; color: #fff; }
.btn--danger { background: #dc2626; color: #fff; }
```

The `--` in variant class names is a naming convention (BEM) that signals "this class modifies the base". It is one of several naming systems — what matters is the underlying principle: equal specificity, semantic names, predictable overrides. When you later use frameworks like Tailwind, you will see this philosophy taken to its extreme with utility classes, all deliberately tied at the same specificity level.

## The modern override: cascade layers

Modern CSS adds a tool that makes specificity almost irrelevant: cascade layers. The `@layer` rule lets you define explicit layers — say `base`, `components`, `utilities` — and declare that later layers always beat earlier ones, *regardless of specificity inside them*.

```css
@layer base, components, utilities;

@layer components {
  .btn { padding: 8px 16px; }
}

@layer utilities {
  .p-4 { padding: 16px; }
}
```

A utility class now overrides a component class even though both score 0-1-0 and the component rule might come later in the file — the *layer order* decides. This restores the oldest promise of CSS: authors control precedence, not accidental specificity accidents. You will meet layers again in the modern CSS lesson; for now, know that the specificity crisis of the 2010s — the arms race of nested selectors and `!important` — is officially over.

## Real-world usage

Selectors are the daily vocabulary of styling. A developer writing a theme asks: "how do I reach the third column of the first row?" — the answer is a chain: `.table > tbody > tr:first-child > td:nth-child(3)`. A developer fixing a hover bug asks whether the pseudo-class is on the right element: `button:hover` versus `button:hover svg`. Design systems ship selector conventions — BEM, utility classes, CSS modules — and framework users write selectors inside scoped styles or template classes. Accessibility styles like `:focus-visible` are selectors; dark mode toggles are typically a `:root.dark` selector; the entire modern CSS you will learn rests on the selector language.

Even performance has a selector dimension: the browser matches rules right-to-left, and very long descendant chains — `.card .wrapper .inner p span` — cost more than a class on the target element. This is a secondary concern with modern browsers, but it reinforces the same habit: target the element directly with a class.

## Common mistakes

The specificity trinity of beginner pain: (1) styling with ids, then fighting to override them; (2) stacking selectors deeper and deeper — `.nav ul li a` — because "it needs to be more specific", when one class on the link would do; (3) reaching for `!important` as the universal solvent, until every override requires another `!important`. All three are the same disease: specificity escalation. Also common: the descendant/child confusion (`> ` missing, styles leaking into grandchildren), the comma/space confusion (groups turning into chains), and attribute values in wrong quotes — `[type=email]` unquoted works for simple values but breaks with spaces; quoted is always safe.

## Best practices

- Style with classes; keep the whole stylesheet near the 0-1-0 specificity level.
- Reserve ids for anchors and JavaScript hooks — never for styling.
- Use `>` when you mean direct children; use it far more than beginners do.
- Group selectors with commas only when sharing declarations.
- Prefer `:focus-visible` over `:focus` for keyboard-friendly focus rings.
- Let cascade layers (or at least consistent source order) handle override priority.
- Read selectors aloud to verify intent — a chain and a group read completely differently.
- When a style "won't apply", compute the specificity first; DevTools shows the winner.

## Summary

Selectors phrase the question "which elements?" — through types, classes, ids, attributes, pseudo-classes and combinators that express relationships. Specificity — counted as ids, then classes/attributes/pseudo-classes, then types — breaks ties between rules, and equal specificity falls back to source order. Professional CSS keeps specificity flat with classes and reserves layers for explicit priority, making overrides predictable. Master both halves and the dreaded "why isn't my CSS applying" becomes a solved problem.

## Practice

Build a small card component and style it twice. First, write it the beginner way: ids for the title and body, a deep descendant chain for the button — then try to override one style from a second stylesheet and watch specificity fight you. Second, rebuild it the professional way: flat class selectors (`.card`, `.card-title`, `.card-text`, `.card-btn`) and one variant class (`.card-btn--primary`). Verify that in the second version, placing a later rule in the stylesheet overrides the earlier one cleanly. Finally, use the DevTools Styles panel on the first version and read off exactly why the override lost.