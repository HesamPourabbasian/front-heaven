---
title: What is HTML?
description: Meet the language that structures the entire web. Learn what HTML is, how the web works, and write your very first web page.
order: 1
difficulty: beginner
category: Fundamentals
estimatedMinutes: 15
prerequisites: []
---

## Introduction

HTML is short for **HyperText Markup Language**, and it is the foundation of the entire World Wide Web. Every single web page you have ever visited — news sites, shopping pages, video platforms, banking apps — is built from HTML. When you open a website, your browser downloads a text file written in HTML and turns it into the visual page you see on screen.

Understanding what HTML actually is matters more than memorising tags. HTML is not a programming language. It cannot calculate sums, remember data, or make decisions. It is a *markup language*: a system of labels, called tags, that describe the meaning and structure of content. Think of HTML as the blueprint or the skeleton of a building — CSS is the interior design, and JavaScript is the electricity and plumbing. You cannot build a house without a skeleton, and you cannot build a website without HTML. That is why every front-end development roadmap on earth starts here.

## How the web works

Before you write your first tag, it helps to understand what happens when you visit a website. When you type an address like `example.com` into a browser, the browser sends a request over the internet to a server — a powerful computer that stores the website's files. The server responds by sending back files, and among the first and most important of those files is an HTML document. The browser then reads that document from top to bottom and constructs the page you interact with.

This exchange is important because it explains two things. First, HTML is just plain text — you can open it in any text editor and read it. Second, the browser is the *interpreter*: HTML has no power by itself, but every browser follows the same rules to turn tags into visible content. That shared standard is why the same page looks essentially the same in Chrome, Firefox, Safari and Edge.

## Your first HTML document

HTML is written as plain text in files ending with `.html`. You can create one right now: open any text editor (like VS Code, Notepad, or TextEdit in plain-text mode), type the following, and save the file as `first-page.html`.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>My First Page</title>
  </head>
  <body>
    <h1>Hello, Front-Heaven!</h1>
    <p>This is my very first HTML page.</p>
  </body>
</html>
```

Now double-click the file — it will open in your browser and display "Hello, Front-Heaven!" as a large heading with a paragraph underneath. Congratulations, you have just written a working web page.

## What the example is doing

Let's walk through that document piece by piece, because every web page ever built follows this same shape. The very first line, `<!DOCTYPE html>`, is not a tag but an instruction that tells the browser: "This document is written in modern HTML — render it in standards mode." In the early days of the web, browsers had to guess how to render pages, and `DOCTYPE` removed that guessing.

Next comes `<html lang="en">`. This opening tag marks the root of the entire document, and the `lang="en"` attribute declares that the page's content is in English. That tiny detail matters enormously for accessibility: screen readers use it to pronounce words correctly, and translation tools use it to decide which language to translate from. Inside `<html>` there are exactly two children. The `<head>` holds *metadata* — information about the page that is not displayed, such as the character encoding and the title shown in the browser tab. The `<body>` holds everything that *is* displayed: the `<h1>` heading and the `<p>` paragraph.

## Tags, and how they pair

Every piece of HTML content is wrapped in tags, and most tags come in pairs: an opening tag `<h1>` and a closing tag `</h1>`. The closing tag is identical to the opening one except for the forward slash. The opening tag, closing tag and everything between them together form an **element**. A few tags — like the image tag you will meet in a later lesson — have no content of their own and are written as self-closing: `<img src="photo.jpg" alt="A photo">`.

The most important rule in HTML is **nesting**: elements must close in the reverse order they opened. Think of tags like boxes inside boxes. If you open a `<p>` inside a `<div>`, the `<p>` must close before the `<div>` does. In the example above, `<h1>` and `<p>` are correctly closed before `</body>`, which closes before `</html>`. A browser will usually still render incorrectly nested markup, but it has to guess your intent — and guessing can lead to broken layouts and confusing bugs later.

## Why HTML matters for front-end developers

It is easy to underestimate HTML because it is simple, but professionals care about it deeply. Modern HTML is *semantic*: it uses meaningful tags like `<nav>` for navigation, `<article>` for content and `<button>` for buttons, so that browsers, search engines and assistive technology all understand what each part of the page is for. A search engine that understands your page's structure ranks it better. A screen reader that understands it lets someone with a visual impairment navigate it comfortably. A browser that understands it renders it correctly on every device.

Every career skill you will learn next — CSS, JavaScript, React, Vue — operates on top of HTML. CSS styles HTML elements; JavaScript selects and manipulates them; frameworks generate them for you. When you eventually use a framework, you will spend most of your time writing what is effectively HTML with extras. The better you understand plain HTML now, the faster every future technology will make sense.

## Common mistakes

Beginners trip over a handful of predictable things. The most common is forgetting closing tags — always ask yourself: "What did I open, and have I closed it?" Next is using the wrong element for the job, like wrapping paragraphs in `<div>` tags when `<p>` exists, or making a heading with a `<span>` that you later size up with CSS. This is not just untidy; it breaks the meaning that search engines and screen readers rely on.

Another classic mistake is nesting incorrectly, such as placing a `<p>` inside a `<h1>`, or putting block elements inside inline ones without understanding why it matters. A subtler one is ignoring attributes like `lang` and `alt` because "they don't change how it looks" — they change how it *works* for the people and machines that matter. Finally, many beginners copy code from the internet without checking the file extension: HTML only works in `.html` files, and a `.txt` file will display your tags as plain text instead of rendering them.

## Best practices

- Always start with `<!DOCTYPE html>` and a `<html lang="...">` root.
- Use lower-case tag names and double quotes for attributes — consistent and conventional.
- Close every element you open, and nest elements in the correct order.
- Put metadata in `<head>` and visible content in `<body>`, nothing else.
- Use meaningful, semantic elements (`<h1>`, `<p>`, `<nav>`, `<main>`) rather than styling with empty containers.
- Validate your pages with the W3C validator whenever something looks wrong — it explains exactly what your browser is forgiving.
- Write a little HTML every day; it is the one skill you will use literally forever.

## Summary

HTML is the markup language that structures every web page. Browsers request HTML files from servers and render them as visual pages. Documents are built from paired tags that form elements, nested correctly inside a root `<html>` element with `<head>` (metadata) and `<body>` (visible content). HTML is semantic, accessible and the foundation that CSS and JavaScript build upon. Master the basics now, and everything that follows becomes easier.

## Practice

Create a file called `about-me.html` and build your first page: a large heading with your name, a paragraph introducing yourself, a second paragraph about why you want to learn front-end development, and a third paragraph describing your favourite website. Make sure your document starts with `<!DOCTYPE html>`, declares the `lang` attribute, uses a proper `<head>` and `<body>`, and closes every tag it opens. Open it in the browser — and in a text editor side by side — and notice how each line you write becomes something visible on screen.
