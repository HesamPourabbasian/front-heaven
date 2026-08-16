---
title: 'Introduction to JavaScript'
description: 'Meet the language of the web, its history, versions, runtimes and the ways to run your first script.'
order: 1
difficulty: 'beginner'
category: 'Level 1 - Fundamentals'
estimatedMinutes: 20
prerequisites: []
---

## Introduction

JavaScript adds behavior to HTML and CSS. It runs in browser engines such as V8, SpiderMonkey and JavaScriptCore, and also runs outside browsers through Node.js. ECMAScript is the language standard; JavaScript is the practical implementation and ecosystem built around it.

## History and versions

JavaScript began at Netscape in 1995 and was standardized as ECMAScript. Modern language features arrive through yearly ECMAScript editions. Features such as `let`, `const`, modules, promises and optional chaining are standardized additions, not separate languages.

## Running JavaScript

Use the browser console, a script element, or Node.js:

```html
<script src="app.js" defer></script>
```

```js
console.log('JavaScript is running')
```

`defer` waits until HTML is parsed. Use the console and DevTools as your first debugging tools.

## Summary

JavaScript is a standardized, dynamically typed language used in browsers and servers. Start with small scripts, read console errors, and learn the language before adding a framework.

## Practice

Run the same `console.log` script in a browser console and with Node.js. Add a deliberate syntax error and identify the error location from each runtime.
