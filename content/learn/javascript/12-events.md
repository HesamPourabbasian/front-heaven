---
title: 'Events'
description: 'Master JavaScript events: addEventListener, mouse and keyboard events (click, submit, input, change, keydown, keyup), the Event object, preventDefault, stopPropagation, event bubbling, capturing phases, and event delegation patterns.'
order: 12
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 40
prerequisites:
  - /learn/javascript/11-dom
---

# Events

Events are signals emitted by the browser engine to indicate that an interaction, system state change, or network lifecycle transition has occurred. From user actions (clicks, mouse movements, keystrokes, form submissions) to asynchronous lifecycle milestones (page load completion, media buffering, websocket messages), JavaScript's event-driven architecture enables applications to respond dynamically to external inputs.

Writing high-performance interactive interfaces requires an understanding of the browser's three-phase **Event Flow Architecture** (Capturing, Target, and Bubbling) and leveraging powerful architectural patterns like **Event Delegation**.

In this lesson, we will explore registering listeners with `addEventListener()`, analyze common UI event types (`click`, `submit`, `input`, `change`, `keydown`, `keyup`), dissect the `Event` object, control browser defaults with `preventDefault()`, master event propagation (bubbling vs capturing), and implement high-efficiency event delegation.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        Event Propagation Phases                        │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Capturing Phase:  Window ──> Document ──> <body> ──> Parent Container│
│                                                                │       │
│ 2. Target Phase:     [ Target Element (Button/Input) ] <───────┘       │
│                                                                │       │
│ 3. Bubbling Phase:   Parent Container <── <body> <── Document <────────┘
└────────────────────────────────────────────────────────────────────────┘
```

## Registering Event Listeners: `addEventListener`

The standard and most robust method for binding event handlers is `element.addEventListener(eventType, handlerFunction, options)`.

Unlike legacy inline HTML attributes (`onclick="..."`) or DOM property assignments (`element.onclick = fn`), `addEventListener` allows attaching multiple independent handlers to the same event on a single element, supports passive scroll optimization, and provides cleanup capabilities via `removeEventListener`.

```javascript
const downloadButton = document.querySelector("#download-btn");

function handleDownload(event) {
  console.log("Preparing file download...", event);
}

// Binding event listener
downloadButton.addEventListener("click", handleDownload);

// Cleanup / Unbinding listener (requires named function reference)
// downloadButton.removeEventListener("click", handleDownload);
```

## Core UI Event Types

1. **Mouse & Pointer Events**:
   - `click`: Triggered when a pointer button is clicked and released on an element.
   - `dblclick`: Fired on rapid double-clicking.
   - `mouseenter` / `mouseleave`: Fired when the cursor enters or leaves an element (does not bubble).
2. **Form Events**:
   - `submit`: Emitted by `<form>` elements when submitted.
   - `input`: Emitted synchronously every time the value of an `<input>`, `<textarea>`, or `<select>` element changes.
   - `change`: Emitted when the element loses focus (`blur`) after its value has changed.
3. **Keyboard Events**:
   - `keydown`: Fired the millisecond a key is pressed down. Supports repeat when held.
   - `keyup`: Fired when the key is released.

```javascript
const searchInput = document.querySelector("#search-field");
const filterForm = document.querySelector("#filter-form");

// input event: live keystroke feedback
searchInput.addEventListener("input", (e) => {
  console.log("Current query:", e.target.value);
});

// submit event: intercept form submission
filterForm.addEventListener("submit", (e) => {
  e.preventDefault(); // Prevents full page reload
  console.log("Form submitted via AJAX");
});

// keyboard shortcuts
window.addEventListener("keydown", (e) => {
  if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
    e.preventDefault();
    searchInput.focus();
  }
});
```

## The Event Object and `preventDefault()`

When an event fires, the browser automatically passes an `Event` (or specialized sub-interface like `MouseEvent`, `KeyboardEvent`) object as the first argument to the handler callback.

Key properties on the event object include:
- **`e.target`**: The actual DOM element where the event originated (the innermost clicked element).
- **`e.currentTarget`**: The DOM element to which the event handler is currently attached.
- **`e.type`**: The string identifier of the event (e.g., `"click"`).
- **`e.preventDefault()`**: Prevents the browser's default native action (such as navigating a hyperlink, submitting a form, or scrolling the page).

```javascript
const termsLink = document.querySelector("a.terms-link");

termsLink.addEventListener("click", (e) => {
  e.preventDefault(); // Cancels navigation to href
  openTermsModal();
});
```

## Event Propagation: Bubbling and Capturing

When an event occurs on a DOM element, it does not execute in isolation. The browser dispatches the event through three distinct phases:

1. **Capturing Phase (Trickling)**: The event travels downward from the `window` through ancestors to the target element.
2. **Target Phase**: The event reaches the target element.
3. **Bubbling Phase**: The event bubbles back upward from the target element through ancestors to `window`.

By default, all `addEventListener` handlers listen during the **Bubbling Phase**. To listen during the Capturing Phase, pass `{ capture: true }` as the third argument.

To stop an event from continuing its journey up or down the DOM tree, invoke `e.stopPropagation()`.

```javascript
const outerContainer = document.querySelector("#outer");
const innerButton = document.querySelector("#inner-btn");

outerContainer.addEventListener("click", () => {
  console.log("Outer container handler fired (Bubbled)");
});

innerButton.addEventListener("click", (e) => {
  console.log("Inner button clicked");
  // Uncommenting the next line stops outerContainer from hearing the event:
  // e.stopPropagation();
});
```

## High-Performance Pattern: Event Delegation

In dynamic applications where hundreds of list items, table rows, or buttons are rendered or frequently replaced, attaching individual event listeners to every single element wastes system memory and requires continuous rebinding.

**Event Delegation** is a pattern that exploits event bubbling. Instead of binding 1,000 listeners to 1,000 buttons, you attach a single listener to their common parent container. When any button is clicked, the event bubbles up to the parent, where you inspect `e.target` using `.closest()` to identify the clicked item.

```javascript
// Single listener on the parent <ul> container managing thousands of items
const todoList = document.querySelector("#todo-list");

todoList.addEventListener("click", (e) => {
  // Find if click was on or inside a delete button
  const deleteBtn = e.target.closest("button.delete-btn");
  if (deleteBtn) {
    const todoItem = deleteBtn.closest("li.todo-item");
    todoItem?.remove();
    return;
  }

  // Find if click was on a toggle checkbox
  const checkbox = e.target.closest("input.toggle-complete");
  if (checkbox) {
    const todoItem = checkbox.closest("li.todo-item");
    todoItem?.classList.toggle("completed", checkbox.checked);
  }
});
```

## Summary

JavaScript events provide an asynchronous, interactive interface for browser applications. Register listeners using `addEventListener`. The `Event` object provides access to the originating element (`target`), the listening element (`currentTarget`), and enables canceling native behavior with `preventDefault()`. Understand the three-phase propagation lifecycle (capturing, target, bubbling). Use **Event Delegation** on parent containers to handle dynamic lists efficiently with minimal memory footprint.

## Best Practices

1. **Always Use Event Delegation for Dynamic Lists**: Never bind listeners in a loop over dynamic elements; attach a single delegated listener to the parent container.
2. **Always Call `e.preventDefault()` on Form Submissions**: Prevent unwanted full-page browser refreshes when handling forms via JavaScript/AJAX.
3. **Use `{ once: true }` for One-Time Events**: Pass `{ once: true }` in options for listeners that should automatically clean themselves up after a single execution.
4. **Use `{ passive: true }` on Scroll/Touch Listeners**: Improves mobile scrolling performance by telling the browser the listener will not call `preventDefault()`.
5. **Clean Up Global Listeners**: Always remove window/document listeners in component teardown/unmount hooks to prevent memory leaks.
