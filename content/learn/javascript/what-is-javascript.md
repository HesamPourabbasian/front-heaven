---
title: What is JavaScript?
description: The programming language of the browser. Understand what JavaScript is, where it runs, and write your first interactive code.
order: 1
difficulty: beginner
category: Fundamentals
estimatedMinutes: 20
prerequisites:
  - learn/html/what-is-html
  - learn/css/what-is-css
---

## Introduction

JavaScript is the programming language of the web. HTML gives a page its structure, CSS gives it its presentation, and JavaScript gives it *behaviour*: the buttons that respond to clicks, the menus that open, the forms that validate, the data that loads without reloading the page, the games, the dashboards, the entire interactive web. It is also — by most measures — the most widely used programming language on Earth, because it runs in every browser and, through platforms like Node.js, on servers, in desktop apps and on embedded devices.

This lesson answers three questions before any code: what JavaScript *is* (and is not), where it runs, and how you attach it to a web page. The concepts matter because the rest of this stage builds directly on them — and because the single most common beginner confusion — "why is nothing happening on my page?" — is almost always a misunderstanding of one of these three foundations.

## JavaScript is a programming language

A programming language is a way of giving precise instructions to a computer. "If the user clicks this button, add the item to the cart and update the total" — that logic, the decisions and calculations behind an interface, is programming. JavaScript is what lets you write those instructions for the browser. Unlike HTML and CSS — which *describe* things — JavaScript *computes* things: it stores values in variables, compares them, repeats work in loops, and reacts to events.

JavaScript is also, and this surprises beginners, a **dynamically typed** language: values have types, but variables do not declare them up front. The same variable can hold a number, then later a string, without complaint. This flexibility is what makes JavaScript forgiving to start with — you can write working programs before you understand types deeply. The JavaScript stage will teach you the types properly soon; for now, know that the freedom exists and comes with responsibilities (mostly: check what kind of value you are actually holding before you use it).

## Where JavaScript runs

JavaScript's home is the browser, but the language itself is not the browser. The core of JavaScript — its variables, functions, objects, loops — is defined by a specification called ECMAScript, and *engines* implement that specification. Chrome and Edge use V8, Firefox uses SpiderMonkey, Safari uses JavaScriptCore. Each engine reads your JavaScript and executes it, and they all agree on the language because they implement the same spec.

Two other runtimes matter for your future. **Node.js** is a JavaScript runtime outside the browser — it lets JavaScript run on servers, reading files, responding to HTTP requests, building command-line tools. It is built on the same V8 engine that powers Chrome. And the ecosystem around JavaScript — the package managers, build tools and frameworks like React and Vue you will meet on the roadmap — is powered by Node. The skill you are learning now, the language itself, is identical everywhere; only the surroundings differ.

## How JavaScript attaches to a page

You attach JavaScript to a page in three ways. The classic way is a `<script>` tag in the HTML. Placed at the end of the body, it loads the file and runs it:

```html
<body>
  <h1 id="greeting">Hello</h1>
  <script src="script.js"></script>
</body>
```

```js
const greeting = document.getElementById('greeting')
greeting.textContent = 'Hello, Front-Heaven!'
```

Read the JavaScript line by line. `document` is the browser's built-in object representing the page. `getElementById('greeting')` searches it for the element with that id, and returns it — a *reference* to the actual heading on the page. Then `.textContent` — a property on that element — is assigned the string `'Hello, Front-Heaven!'`, and the heading's text updates instantly. Two lines, and the page is no longer static: it is behaving.

The `<script>` tag can also hold the code directly between opening and closing tags, and modules — JavaScript files that can import from each other — use `<script type="module" src="app.js">`. Which variant you use matters less than *where*: scripts placed in the head run before the body exists, so code that looks for elements finds nothing. That is why the end-of-body placement above is the reliable beginner pattern — and why modern pages use the `defer` attribute on head scripts to achieve the same effect:

```html
<script src="app.js" defer></script>
```

## The console: your first tool

Before building pages, meet the developer's best friend: the **console**. Every browser has one (right-click → Inspect → Console), and it is where JavaScript speaks to you. `console.log()` prints values, and the console is also where errors appear when something goes wrong.

```js
console.log('Hello from JavaScript!')
const answer = 6 * 7
console.log(answer)
```

Open the console on any site and you can type JavaScript directly — the console is a live playground. The habit of *using* the console — printing values, testing snippets, reading errors — is the single fastest way to learn a language. Professionals use it every single day; beginners who avoid it are learning with a hand tied behind their back, because every error message is a teacher explaining exactly what went wrong.

## JavaScript in the modern web

The JavaScript you will write this stage is the same language powering everything modern. Frameworks like React and Vue are JavaScript libraries that generate HTML for you and react to changes automatically — but under the hood, they do exactly what you just did: find elements, read values, update text. The difference is scale and structure, not magic. Even the newest web platform features — Web Components, view transitions, the File System API — are JavaScript APIs you call from code like the two lines above.

It is also worth knowing how JavaScript behaves while pages load: by default, scripts are *blocking* — the browser stops rendering while a script downloads and runs, which is why script placement and the `defer`/`async` attributes are performance decisions. You will meet those details in the performance stage; for now, the end-of-body script is always safe, and the console is always open.

## Common mistakes

The beginner trinity: (1) putting the script in the `<head>` without `defer`, then wondering why `getElementById` finds nothing — the body does not exist yet when the script runs; (2) forgetting to save the file or hard-refreshing the browser, so "my changes do nothing" is really "the old file is running" (Ctrl/Cmd+Shift+R is the fix); (3) never opening the console, so errors accumulate invisibly — if nothing happens on the page, the console already told you why. Also common: `<script>` with a broken `src` path (the console shows a 404), code typed in a `.html` file outside a script tag, and expecting `console.log` to *display* something on the page — it prints to the console, not the page.

## Best practices

- Keep the console open while you work; read every error message as a gift.
- Place scripts at the end of `<body>`, or use `defer` in the head.
- Use `const` by default for variables — you will learn why in the next lesson.
- Use `console.log` liberally while learning; delete the logs before shipping.
- Write one small script per learning session; repetition builds fluency.
- Test every snippet in the console first, then move it into your file.
- Use meaningful names for everything — code is read far more than it is written.
- When something "does not work", change one thing at a time and re-test.

## Summary

JavaScript is the programming language of the browser: it stores values, makes decisions and reacts to events. It runs in browser engines that implement the ECMAScript spec — and, via Node.js, on servers. Scripts attach to pages through `<script>` tags; `document.getElementById` finds elements and `.textContent` updates them. The console is the developer's live laboratory and the home of error messages. This language, learned properly now, is the foundation of every framework and tool you will meet on the rest of the roadmap.

## Practice

Create `hello.js` and a small HTML page that links it at the end of the body. Write JavaScript that finds your page's `<h1>` and changes its text, finds the `<p>` and adds a word to its content, and logs `"Script loaded"` to the console. Then make three deliberate mistakes, one at a time, and read the console's verdict on each: a typo in the `getElementById` id, a `<script>` tag placed in the `<head>` without `defer`, and a broken `src` path. Understanding the console's three most common complaints — "null", "ReferenceError", "404" — will serve you for your entire career.