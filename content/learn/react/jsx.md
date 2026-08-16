---
title: "JSX: JavaScript XML"
technology: "react"
difficulty: "beginner"
estimatedMinutes: 20
order: 4
description: "Understanding JSX syntax, embedding JavaScript expressions, JSX rules, fragments, and compilation."
---

# JSX: JavaScript XML

JSX stands for **JavaScript XML**. It is a syntax extension for JavaScript that allows you to write HTML-like markup directly inside your JavaScript and TypeScript files. JSX combines the visual clarity of markup with the full programming power of JavaScript.

In this lesson, you will learn how JSX works under the hood, how to embed dynamic JavaScript expressions, the strict rules of JSX syntax, and why React Fragments are essential.

## What is JSX?

Browsers do not understand JSX natively. When you write JSX, build tools (like Vite and Babel) compile it down to regular JavaScript function calls (`React.createElement` or the modern JSX runtime `_jsx`).

For example, this JSX snippet:
```jsx
const element = <h1 className="title">Hello World</h1>;
```
compiles into regular JavaScript:
```javascript
const element = React.createElement('h1', { className: 'title' }, 'Hello World');
```
This compiled object describes the DOM node React should create.

## Embedding JavaScript Expressions in JSX

Inside JSX, curly braces `{ }` act as an escape hatch into JavaScript. You can place any valid JavaScript expression between curly braces:

```jsx
function UserGreeting() {
  const user = { firstName: 'Hesam', role: 'Frontend Engineer' };
  const currentYear = new Date().getFullYear();

  return (
    <section>
      <h2>Welcome, {user.firstName}!</h2>
      <p>Role: {user.role.toUpperCase()}</p>
      <p>Active since: {2020 + 4}</p>
      <p>Copyright © {currentYear}</p>
    </section>
  );
}
```

You can execute function calls, perform math calculations, concatenate strings, and access object properties directly inside JSX braces. However, you cannot put statements like `if/else` or `for` loops directly inside `{ }` (use ternary operators or array `.map()` instead).

## Strict Rules of JSX

To write valid JSX, you must follow three fundamental rules:

### 1. Return a Single Root Element
Every component must return a single top-level element. If you have multiple adjacent elements, wrap them in a parent container or a Fragment (`<>` and `</>`):
```jsx
// ❌ Invalid
return (
  <h1>Title</h1>
  <p>Description</p>
);

// ✅ Valid
return (
  <>
    <h1>Title</h1>
    <p>Description</p>
  </>
);
```

### 2. Close All Tags Explicitly
In standard HTML, tags like `<img>`, `<input>`, and `<br>` can be left open. In JSX, every tag must be self-closing:
```jsx
<img src="/logo.png" alt="Logo" />
<input type="text" />
<br />
```

### 3. Use CamelCase for Most Attributes
Because JSX compiles to JavaScript objects, attribute names must follow JavaScript identifier rules rather than HTML standards:
- Use `className` instead of `class` (since `class` is a reserved keyword in JS).
- Use `htmlFor` instead of `for`.
- Use camelCase event names like `onClick`, `onChange`, and `onSubmit`.

## React Fragments (`<>` and `</>`)

When building accessible, semantically clean web pages, adding unnecessary wrapping `<div>` elements just to satisfy the single-root rule can break CSS Flexbox and Grid layouts, or violate HTML specifications (e.g. inside tables or lists).

React Fragments allow you to group multiple JSX elements without rendering an extra node to the real DOM:
```jsx
import { Fragment } from 'react';

// Short syntax:
return (
  <>
    <li>Item 1</li>
    <li>Item 2</li>
  </>
);

// Explicit syntax (needed when passing key in loops):
return (
  <Fragment key={item.id}>
    <dt>{item.term}</dt>
    <dd>{item.description}</dd>
  </Fragment>
);
```

## Inline Styles in JSX

In JSX, inline styles are passed as JavaScript objects rather than strings. Property names are written in camelCase:
```jsx
const badgeStyle = {
  backgroundColor: '#06b6d4',
  color: '#ffffff',
  padding: '4px 8px',
  borderRadius: '6px',
};

return <span style={badgeStyle}>Active</span>;
```

## Best Practices

- **Use Fragments to Prevent Div Soup**: Avoid wrapping adjacent elements in extra `<div>` containers when a Fragment suffices.
- **Keep JSX Clean and Readable**: If JSX contains deeply nested ternary operators or complex logic, extract that logic into helper functions or sub-components.
- **Escape Dangerous Strings**: React automatically escapes strings before rendering, protecting your application from Cross-Site Scripting (XSS) attacks by default.

## Summary

JSX is a syntax extension that combines the structure of HTML with the logic of JavaScript. By following JSX rules—single root elements, self-closing tags, camelCase properties, and curly brace expressions—you can write intuitive, expressive UI components with full type safety.
