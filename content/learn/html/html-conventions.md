---
title: 'HTML Conventions & Code Style'
description: 'Write professional, clean HTML: formatting rules, 2-space indentation, lowercase tags, quotation standards, and clean DOM trees.'
order: 31
difficulty: 'beginner'
category: 'Level 10 - HTML Best Practices'
estimatedMinutes: 15
prerequisites:
  - /learn/html/seo-friendly-html
---

## Industry Standards for HTML Code

Professional teams follow strict style guides to ensure codebases are readable and maintainable.

---

## Key Formatting Rules

### 1. Always Use Lowercase Tags and Attributes
```html
<!-- GOOD -->
<div class="card">
  <img src="avatar.jpg" alt="User avatar" />
</div>

<!-- BAD (Legacy Uppercase) -->
<DIV CLASS="card">
  <IMG SRC="avatar.jpg" ALT="User avatar" />
</DIV>
```

### 2. Always Quote Attribute Values
```html
<!-- GOOD -->
<input type="text" name="username" class="form-control" />

<!-- BAD (Unquoted or mixed quotes) -->
<input type=text name='username' class=form-control />
```

### 3. Consistent 2-Space Indentation
Indent nested child elements with 2 spaces to maintain clear visual hierarchy:

```html
<nav aria-label="Main menu">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/about">About</a></li>
  </ul>
</nav>
```

### 4. Avoid Redundant Attributes
```html
<!-- GOOD (type="text/css" and type="text/javascript" are default in HTML5) -->
<link rel="stylesheet" href="styles.css" />
<script src="app.js" defer></script>
```

---

## Summary & Key Takeaways

- Write all tags and attributes in lowercase.
- Always use double quotes for attribute values.
- Indent nested children by 2 spaces.
- Omit deprecated attributes like `type="text/javascript"`.

---

## Practice Challenge

Format an unformatted, messy HTML document using clean 2-space indentation and lowercase conventions.
