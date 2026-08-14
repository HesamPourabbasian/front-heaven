---
title: The DOM and Events
description: Where JavaScript meets the page. Select elements, manipulate them, and respond to user interaction with events.
order: 7
difficulty: beginner
category: Browser APIs
estimatedMinutes: 30
prerequisites:
  - learn/javascript/arrays-and-objects
  - learn/html/semantic-html
---

## Introduction

The **DOM** — Document Object Model — is the browser's living representation of your HTML. When a page loads, the browser parses the HTML and builds a tree of nodes: elements, text, attributes — everything. JavaScript's superpower is that it can *reach into that tree*: find any element, read and change it, create and remove nodes, and listen for user interaction. This is what "making a page interactive" actually means, and it is the entire frontier between static HTML and web applications.

This lesson teaches the DOM from three directions: **selecting** elements (the query APIs), **manipulating** them (text, attributes, classes, style, creating nodes), and **events** (the mechanism of interactivity — clicks, keys, form submissions — and the delegation pattern that makes event handling scale). The `this` note about arrow functions from the functions lesson finally pays off here.

## The DOM tree

Think of the page as a family tree. `<html>` is the root; its children are `<head>` and `<body>`; `<body>`'s children are the visible elements; every element has *parent, children and siblings* relationships. The DOM APIs express exactly this vocabulary: `element.parentElement`, `element.children`, `element.firstElementChild`, `element.nextElementSibling` — and the query methods that search the tree.

```js
const main = document.querySelector('main')          // first <main>
const card = document.querySelector('.card')          // first .card
const allCards = document.querySelectorAll('.card')   // all .cards — a NodeList
const byId = document.getElementById('hero')          // by id
```

`querySelector` takes any CSS selector — the entire selector language you learned in the CSS stage — and returns the first match, or `null` when nothing matches. `querySelectorAll` returns all matches as a `NodeList`, which supports `forEach` and indexing. These two methods, plus `getElementById`, are the modern selection toolkit; the legacy `getElementsByClassName` family returns live collections that change as the DOM changes, which beginners find baffling — prefer the query methods.

## Manipulating content

Once selected, an element is a live handle to the page. Content changes through four properties, and which one you use depends on whether you are setting text or markup — and how you feel about security:

```js
const title = document.querySelector('h1')

title.textContent = 'New title'             // safe: sets plain text
title.innerHTML = '<em>Styled</em>'          // powerful: parses HTML — dangerous with user input
title.style.color = '#6366f1'               // inline style
title.classList.add('highlight')            // the class API
```

`textContent` sets the element's text — any HTML in the string is displayed literally as text, which is *safe*: it cannot execute or inject markup. `innerHTML` parses and inserts real HTML — powerful and fast, but if the string contains user input (a comment, a search term), you open the door to **XSS** (cross-site scripting), one of the web's most serious vulnerabilities. The professional rule: use `textContent` unless you genuinely need markup, and *never* put unescaped user input into `innerHTML`. `classList` — `add`, `remove`, `toggle` — is the standard way to flip styles on and off, which is how most UI state changes are expressed.

## Creating and removing elements

Building DOM by hand uses the factory methods: `document.createElement` creates a detached element, properties fill it in, and `append`/`prepend`/`before`/`after` attach it into the tree. Removing is one method: `element.remove()`.

```js
const item = document.createElement('li')
item.textContent = 'New lesson'
item.classList.add('lesson-item')
document.querySelector('ul').append(item)

// …and later:
item.remove()
```

The create-fill-attach dance is the low-level form of what frameworks automate — when you learn React or Vue, `document.createElement` becomes a compiled implementation detail. But the underlying model — detached nodes, then attachment — explains how all frameworks think about rendering. Two related APIs complete the picture: `element.cloneNode(true)` for copying, and the modern `insertAdjacentHTML` for injecting markup relative to an element.

## Events: the interactivity engine

An **event** is the browser's announcement that something happened: a click, a keypress, a form submission, a scroll, a resize. JavaScript *listens* with `addEventListener`, which takes the event name and a callback:

```js
const button = document.querySelector('#like-button')

button.addEventListener('click', (event) => {
  console.log('Button clicked!', event)
  button.textContent = 'Liked ❤️'
})
```

The callback receives the **event object** — `event.target` is the element that was actually clicked, `event.currentTarget` the element the listener is attached to, and `event.preventDefault()` cancels the browser's default behaviour (stopping a form from navigating, for instance). The callback can be any function — an arrow here — and this is where the `this` note from the functions lesson bites: inside a regular `function` callback, `this` refers to the element; inside an arrow, it refers to the surrounding scope. Professionals use the event object rather than `this`, which sidesteps the confusion entirely.

## The common events

A handful of events covers most interactivity. Mouse and pointer: `click`, `dblclick`, `mouseenter`, `mouseleave`. Keyboard: `keydown`, `keyup` (check `event.key` — `'Enter'`, `'Escape'`). Focus: `focus`, `blur`. Forms: `submit` on the form (not the button — catch it once), `input` on fields (fires on every keystroke). And the document-level ones: `scroll`, `resize`, `DOMContentLoaded`.

```js
const form = document.querySelector('#search-form')

form.addEventListener('submit', (event) => {
  event.preventDefault()                       // stop the page from reloading
  const query = form.querySelector('input').value
  console.log(`Searching for: ${query}`)
})
```

The form pattern is the most important in web development: `preventDefault` stops the browser's native navigation, the handler reads the input's `value`, and the application does its work without reloading — the foundation of every modern single-page app. Note the event is on the *form*, not the submit button: the browser fires `submit` on the form itself, and catching it there works regardless of how submission was triggered.

## Event propagation and delegation

Events **propagate**: a click on a button fires first on the button (the *target* phase), then bubbles up through its ancestors — the button's parent, grandparent, all the way to the document. This bubbling is a feature: it enables **event delegation** — attach one listener to a container, and handle clicks from any current *or future* child:

```js
const list = document.querySelector('#todo-list')

list.addEventListener('click', (event) => {
  if (event.target.matches('.delete-btn')) {
    event.target.closest('li').remove()
  }
})
```

One listener handles every delete button in the list — even ones added later. The two helper methods: `event.target.matches(selector)` tests whether the clicked element is the one we care about, and `element.closest(selector)` walks upward to find the nearest matching ancestor (the `li`). Delegation is the professional pattern for lists, tables and dynamic content: one listener instead of hundreds, and no re-attachment after DOM changes. `stopPropagation` exists to halt the bubble when a listener must be isolated — use it rarely, because it can break other listeners relying on the bubble.

## Real-world usage

The DOM and events are the runtime of the entire interactive web. Every accordion, dropdown, tab bar and modal is a class toggle driven by a click listener. Every search box is an `input` listener filtering a list. Every form validation is submit and input handlers reading values. Libraries like React and Vue sit *on top of* this system — they listen for the same events and update the same DOM, just automatically and efficiently. Even the platform's newest APIs (view transitions, scroll-driven animations) are DOM APIs. When you debug any interactive feature — "why doesn't my click work?" — you are debugging exactly the three subjects of this lesson: did the element exist, was the listener attached, and did the event reach it?

## Common mistakes

Selecting before the DOM exists — scripts in the head find `null` (the `defer` attribute or end-of-body placement fixes it). Re-selecting every time instead of caching `const el = document.querySelector(...)` once. Forgetting `event.preventDefault()` on form submissions, so the page reloads and "the app broke". Using `innerHTML` with user input (XSS). Confusing `target` and `currentTarget` during bubbling. Attaching listeners in loops that re-query and re-attach on every render (duplicate listeners → duplicate behaviour). Listening on the wrong element — a `submit` listener on the button instead of the form. And expecting `querySelectorAll` results to be an array: it is a NodeList — mostly array-like, but spread it (`[...nodes]`) when you need the full array toolkit.

## Best practices

- Cache selections: query once, reuse the reference.
- Use `textContent` for text and reserve `innerHTML` for trusted, controlled markup.
- Listen for `submit` on forms and `click` on buttons — never the reverse.
- Use event delegation for lists and dynamic content.
- Prefer `classList.toggle` over reading and rewriting classes manually.
- Keep handlers small; extract named functions instead of giant anonymous callbacks.
- Clean up: `removeEventListener` (or framework-lifecycle hooks) when a listener outlives its element.
- Set `defer` (or end-of-body scripts) so the DOM exists before your code runs.

## Summary

The DOM is the browser's live tree of your HTML, and JavaScript manipulates it directly: `querySelector`/`querySelectorAll` select nodes, `textContent`/`classList`/`style` modify them, and `createElement`/`append`/`remove` restructure the tree. Events — attached with `addEventListener` — announce interaction, and bubbling enables delegation: one listener per container, handling clicks from any child, present or future. This three-part system is the entire substrate on which frameworks and the interactive web are built.

## Practice

Build a todo list page: a form with an input and a button, and an empty `<ul>`. Write JavaScript that: (1) listens for `submit` on the form, prevents the default, creates an `<li>` with the input's text and a delete button, and appends it; (2) uses *delegation* — one listener on the `<ul>` — so clicking any delete button removes its `li`, including ones added later; (3) toggles a `.done` class on the item text when the text itself is clicked. Then add a keyboard touch: an `input` listener that shows a live character count, and a `keydown` handler that clears the input when Escape is pressed — a complete interactive component in pure DOM APIs.