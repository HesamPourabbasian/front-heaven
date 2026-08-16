---
title: "Event Handling in React"
technology: "react"
difficulty: "beginner"
estimatedMinutes: 20
order: 9
description: "Handling clicks, form submits, inputs, passing arguments, SyntheticEvent system, and event delegation."
---

# Event Handling in React

Interactive web applications rely on responding to user actions—such as clicks, keystrokes, form submissions, and mouse movements. React provides an intuitive, cross-browser event handling system that looks very similar to standard HTML event attributes while integrating seamlessly with JavaScript.

In this lesson, you will learn how to attach event handlers in JSX, understand React's SyntheticEvent wrapper, pass arguments to handlers, and prevent default browser behaviors.

## Attaching Event Handlers

In React, event names are written in **camelCase** (e.g. `onClick`, `onChange`, `onSubmit`, `onKeyDown`), and you pass a function reference directly rather than a string:

```jsx
function Button() {
  function handleClick() {
    alert('Button clicked!');
  }

  return <button onClick={handleClick}>Click Me</button>;
}
```

### ⚠️ Common Mistake: Calling the Function Instead of Passing It
You must pass the function *definition*, not the result of executing the function:
```jsx
// ❌ Incorrect: Calls handleClick immediately on render!
<button onClick={handleClick()}>Click Me</button>

// ✅ Correct: Passes the function reference to be called on click:
<button onClick={handleClick}>Click Me</button>

// ✅ Correct: Inline arrow function:
<button onClick={() => console.log('Clicked')}>Click Me</button>
```

## The SyntheticEvent Object

When an event fires, React passes a **SyntheticEvent** object to your handler function. The SyntheticEvent is a cross-browser wrapper around the browser's native event, ensuring identical behavior across Chrome, Safari, Firefox, and Edge.

You can access standard event properties and methods on this object:
```jsx
function SearchBar() {
  function handleInputChange(event) {
    console.log('Current input value:', event.target.value);
  }

  return (
    <input
      type="text"
      placeholder="Search lessons..."
      onChange={handleInputChange}
    />
  );
}
```

## Preventing Default Behavior

Some browser events have default actions—for example, clicking a form submit button refreshes the entire page, and clicking a link navigates to a new URL. In React, you prevent these actions by calling `event.preventDefault()`:

```jsx
function ContactForm() {
  function handleSubmit(event) {
    event.preventDefault(); // Prevents page reload!
    console.log('Form submitted safely via JavaScript.');
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" placeholder="Your email" required />
      <button type="submit">Subscribe</button>
    </form>
  );
}
```

## Passing Arguments to Event Handlers

Often, you need to pass specific data (such as an item ID) along with an event. You can achieve this using an arrow function:

```jsx
function UserList({ users }) {
  function handleDeleteUser(userId, userName) {
    if (confirm(`Delete ${userName}?`)) {
      console.log('Deleting user ID:', userId);
    }
  }

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          <span>{user.name}</span>
          <button onClick={() => handleDeleteUser(user.id, user.name)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
```

## Common React Events

You will frequently use these core events:
- **Mouse**: `onClick`, `onDoubleClick`, `onMouseEnter`, `onMouseLeave`
- **Form / Input**: `onChange`, `onInput`, `onSubmit`, `onFocus`, `onBlur`
- **Keyboard**: `onKeyDown`, `onKeyUp`, `onKeyPress`
- **Touch**: `onTouchStart`, `onTouchMove`, `onTouchEnd`

## Best Practices

- **Use Descriptive Handler Names**: Prefix handlers with `handle` (e.g. `handleSubmit`, `handleFilterChange`) and props with `on` (e.g. `onClick`, `onSelect`).
- **Never Invoke Handlers in JSX**: Pass function references (`onClick={handleClick}`) rather than executing them (`onClick={handleClick()}`).
- **Prevent Default Form Submissions**: Always call `event.preventDefault()` in `onSubmit` handlers to preserve client state and prevent page reloads.

## Summary

React's event handling system provides consistent cross-browser interactions using camelCase event props and SyntheticEvent wrappers. By passing function references, handling form submissions cleanly, and passing arguments with arrow functions, you can build responsive, dynamic user interfaces.
