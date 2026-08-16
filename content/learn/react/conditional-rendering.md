---
title: "Conditional Rendering"
technology: "react"
difficulty: "beginner"
estimatedMinutes: 20
order: 7
description: "Rendering UI conditionally using if statements, ternary operators, logical AND (&&), loading, error, and empty states."
---

# Conditional Rendering

In real-world applications, user interfaces change dynamically based on state, authentication status, API loading states, and user permissions. React gives you the power of standard JavaScript control flow to render different JSX elements conditionally.

In this lesson, you will learn the four primary techniques for conditional rendering in React, how to manage loading, error, and empty states, and how to avoid common pitfalls with logical operators.

## 1. Using Standard `if / else` Statements

When an entire component or large section of UI should be rendered differently based on a condition, using a standard JavaScript `if` statement with an early return is the cleanest approach:

```jsx
function UserDashboard({ user, isLoading, error }) {
  if (isLoading) {
    return <LoadingSpinner message="Fetching user profile..." />;
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  if (!user) {
    return <EmptyState message="No user found." />;
  }

  return (
    <main>
      <h1>Welcome back, {user.name}!</h1>
      <UserProfile user={user} />
    </main>
  );
}
```

## 2. Ternary Operator (`condition ? true : false`)

When you want to switch between two different JSX elements inline inside a larger markup structure, the ternary operator is ideal:

```jsx
function AuthButton({ isLoggedIn, onLogin, onLogout }) {
  return (
    <header className="navbar">
      <span>Front-Heaven</span>
      {isLoggedIn ? (
        <button onClick={onLogout} className="btn-secondary">Log Out</button>
      ) : (
        <button onClick={onLogin} className="btn-primary">Log In</button>
      )}
    </header>
  );
}
```

## 3. Logical AND Operator (`condition && <JSX />`)

When you want to render an element *only* when a condition is true (and render nothing if false), the JavaScript logical `&&` operator provides concise inline syntax:

```jsx
function NotificationBanner({ unreadCount }) {
  return (
    <div className="inbox-header">
      <h2>Inbox</h2>
      {unreadCount > 0 && (
        <span className="badge badge-unread">{unreadCount} New Messages</span>
      )}
    </div>
  );
}
```

### ⚠️ Pitfall with `&&` and Number `0`
If the left side of `&&` evaluates to the number `0`, JavaScript considers it falsy and returns the value `0` itself—causing React to render the number `0` directly on the screen!
```jsx
// ❌ Bug: If messages.length is 0, renders "0" to the screen:
{messages.length && <MessageList messages={messages} />}

// ✅ Fix 1: Use explicit boolean comparison:
{messages.length > 0 && <MessageList messages={messages} />}

// ✅ Fix 2: Convert to boolean with Boolean() or !!:
{Boolean(messages.length) && <MessageList messages={messages} />}
```

## 4. Returning `null` to Prevent Rendering

If a component should render nothing at all under certain conditions, return `null`. React will simply omit it from the DOM:

```jsx
function WarningModal({ isOpen, message, onClose }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal">
      <p>{message}</p>
      <button onClick={onClose}>Dismiss</button>
    </div>
  );
}
```

## Managing the 3 Essential UI States

Every production data-driven React component must account for three asynchronous states:
1. **Loading State**: Show skeleton loaders, progress bars, or spinners while data is fetching.
2. **Error State**: Inform the user gracefully when requests fail, providing a retry button.
3. **Empty State**: Guide the user on what to do next when an API returns an empty array (`[]`).

## Best Practices

- **Use Early Returns for Clean Code**: Place guard clauses (loading, error, unauthorized) at the top of your component function.
- **Avoid Number `0` with `&&`**: Always use explicit boolean conditions (`count > 0 && <Badge />`).
- **Do Not Nest Ternaries**: Deeply nested ternary expressions (`a ? b : c ? d : e`) hurt readability. Extract them into helper functions.

## Summary

Conditional rendering in React leverages standard JavaScript expressions—`if` statements, ternary operators, and logical `&&` checks. By handling loading, error, and empty states cleanly, you provide a resilient, polished user experience.
