---
title: 'Forms'
description: 'Collect input from users with confidence. Master form structure, inputs, labels, validation and accessible error handling.'
order: 6
difficulty: 'beginner'
category: 'Core Content'
estimatedMinutes: 25
prerequisites:
  - learn/html/tags-elements-and-attributes
---

## Introduction

Every time you log in, search, comment, order, or subscribe, you are using a form. Forms are how the web collects information from people, and they are among the most important things a front-end developer will ever build — a broken form means lost orders, lost sign-ups and lost trust. The browser gives you an extraordinary amount of form functionality for free: keyboard navigation, validation, autocomplete and assistive-technology announcements — but only if you build the form with the right elements and attributes.

This lesson teaches the anatomy of a form: the `<form>` element itself, the input types that cover virtually every kind of data, labels and the accessibility contract they create, and the validation attributes that turn the browser into your first quality gate. You will also learn what happens to form data when a user submits it.

## The form element

The `<form>` element wraps every input on the page that belongs together. Two attributes define what happens at submission: `action`, the URL the data is sent to, and `method`, how it travels — `get` puts the data in the URL (useful for searches, shareable results), and `post` sends it in the request body (required for sensitive or large data like passwords and messages).

```html
<form action="/search" method="get">
  <!-- inputs live here -->
</form>
```

When a user presses Enter in a text input or clicks the submit button, the browser collects every named input, encodes it, and sends it to the `action` URL. This is the moment where the second essential attribute appears: `name`. Every input's `name` is the key under which its value is sent. An input with `name="query"` and value "flexbox" produces `?query=flexbox` in a GET request. Without a `name`, an input's value is never sent at all — one of the most common beginner bugs in the world.

## Input types

The `<input>` element is the workhorse of forms, and its `type` attribute determines its behaviour. Changing the type does more than change appearance: it changes the keyboard that phones show, the validation the browser applies, and the semantics assistive technology announces. Modern HTML includes many specialised types:

```html
<input type="text" name="username" placeholder="e.g. alex">
<input type="email" name="email" placeholder="you@example.com">
<input type="password" name="password">
<input type="number" name="age" min="0" max="120" step="1">
<input type="date" name="birthday">
<input type="tel" name="phone">
<input type="url" name="website">
<input type="search" name="q">
<input type="checkbox" name="newsletter">
```

`type="email"` does not just style the field — the browser checks that the value looks like an email address on submit, and mobile devices show the email keyboard. `type="number"` shows a numeric keyboard and respects `min`/`max`/`step`. `type="date"` opens a native date picker. Choosing the correct type is the cheapest UX improvement in web development: the browser does the hard work, and users get the right keyboard and the right checks for free.

## Textareas, selects and buttons

Inputs cover simple values, but some data needs richer controls. `<textarea>` collects multiple lines of text — used for messages, comments and bios. `<select>` presents a dropdown of predefined options, each `<option>` carrying the value that gets submitted. And `<button>` triggers submission.

```html
<label for="message">Your message</label>
<textarea id="message" name="message" rows="4"></textarea>

<label for="level">Experience level</label>
<select id="level" name="level">
  <option value="beginner">Beginner</option>
  <option value="intermediate">Intermediate</option>
  <option value="advanced">Advanced</option>
</select>

<button type="submit">Send message</button>
```

Three details here matter enormously. First, every control has a `<label>` connected via the `for` attribute and the control's `id` — clicking the label focuses the control, and screen readers announce the label as the field's name. Second, `value` on options is what gets submitted, while the visible text is what users see — they can differ. Third, the button declares `type="submit"` explicitly; a button inside a form defaults to submit, but a button with `type="button"` does nothing on its own and is used with JavaScript — declaring the type always removes ambiguity.

## The label contract

Labels are not decoration; they are the accessibility contract between a field and its purpose. A screen reader announces "Email, text field" — the label providing the "Email" part. A label also dramatically improves usability: clicking it focuses the field, giving a bigger click target than the tiny input box. The connection is made by matching the label's `for` attribute to the control's `id`, exactly once per field.

When a label cannot be visible (for example, an icon-only search field), keep the connection with `aria-label` on the control — but reserve that for genuinely visual designs, because visible labels are the baseline expectation. Placeholder text is *not* a label: it disappears when the user types, vanishes in some browsers during input, and fails contrast requirements, leaving a user unsure what a filled field was for. If you remember one form rule, remember: every field gets a visible label, and placeholder is only ever a hint.

```html
<label for="email">Email address</label>
<input id="email" name="email" type="email" placeholder="you@example.com">
```

## Validation attributes

Modern HTML forms validate before the data ever reaches a server. The validation attributes are declarative — you state the rules, and the browser enforces them, blocking submission with a native message and focusing the offending field.

```html
<form action="/signup" method="post">
  <label for="username">Username</label>
  <input id="username" name="username" type="text" required minlength="3" maxlength="20">

  <label for="email">Email</label>
  <input id="email" name="email" type="email" required>

  <label for="age">Age</label>
  <input id="age" name="age" type="number" required min="13" max="120">

  <button type="submit">Create account</button>
</form>
```

`required` makes a field mandatory. `minlength`/`maxlength` constrain text length, `min`/`max` bound numbers, and `pattern` accepts a regular expression for custom rules. `type="email"` and `type="url"` validate format automatically. When any rule fails, the browser blocks submission and explains the problem to the user — in the user's language, by default. This native validation is free, consistent and accessible in a way that most hand-written JavaScript validation is not. Your JavaScript should enhance it, not replace it.

## What happens on submit

Understanding the journey of form data demystifies everything else in front-end development. The user clicks submit; the browser checks validation; if valid, it encodes the data as `name=value` pairs and sends the request to the `action` URL with the chosen `method`. In a classic multi-page website, the server responds with a new page. In modern single-page applications, JavaScript intercepts the submission with the event system you will learn about in the JavaScript stage, reads the values, and updates the interface without reloading.

That second path is why modern developers often omit `action` entirely and handle submission in JavaScript — but the form *semantics* remain essential. Even in the most JavaScript-heavy application, real `<form>`, `<input>`, `<label>` and `<button>` elements give users autofill, keyboard submission, screen-reader announcements and the browser's native validation. Building forms with proper HTML first, then enhancing with JavaScript, is the professional pattern.

## Common mistakes

Missing `name` attributes is the silent killer — everything validates, the button works, and the data never arrives. Missing or disconnected labels leave fields unnamed for screen readers. Using `placeholder` as a label abandons users the moment they start typing. `type` misuse — `type="text"` for emails, `type="button"` as a submit — forces users to fight the browser instead of being helped by it. Skipping `required`, `min`, `max` and `pattern` pushes validation to the server and makes forms slower and more frustrating than they need to be.

Also common: multiple fields sharing one `id` (breaking every label connection), forgetting the `value` on `<option>` elements (sending the visible text instead of a stable key), and wrapping every control in a `<div>` with an adjacent `<span>` label — which visually resembles a form but announces nothing. And nested forms are simply invalid: one `<form>` cannot contain another, so structure multi-part forms with fieldsets instead.

## Best practices

- Every field gets a `<label>` linked by `for`/`id` — no exceptions.
- Choose the most specific `type` for each piece of data.
- Give every submitted control a `name`; check the resulting URL or payload to verify.
- Declare `type="submit"` on submit buttons, `type="button"` on scripted buttons.
- Use `required`, `min`/`max`, `minlength`/`maxlength` and `pattern` for native validation.
- Never rely on placeholder text for a field's identity.
- Group related fields with `<fieldset>` and `<legend>` (radio groups especially).
- Test every form with the keyboard: tab through, submit empty, submit invalid, submit valid.

## Summary

Forms collect and send user data. The `<form>` element defines the destination (`action`) and travel method (`method`); inputs of many types collect the data, with `name` supplying the keys; labels make every field discoverable and accessible; and validation attributes let the browser enforce rules before submission. Choosing semantic elements and letting the browser do its native work yields forms that are keyboard-friendly, screen-reader-friendly and far less error-prone than hand-rolled imitations.

## Practice

Build a sign-up form with fields for name, email, password and age, plus a checkbox for agreeing to the terms — each with a proper label, the correct `type`, a `name`, and at least one validation attribute. Add a `<select>` for experience level and a `<textarea>` for "goals". Give the form an `action` and `method` of `get`, submit it, and look at the URL in the address bar — you will see your named data in plain text, which demonstrates exactly how GET forms transmit values. Then remove the `name` from one field, submit again, and observe what vanishes from the URL.