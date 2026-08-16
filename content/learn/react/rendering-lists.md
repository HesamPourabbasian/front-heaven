---
title: "Rendering Lists & Keys"
technology: "react"
difficulty: "beginner"
estimatedMinutes: 20
order: 8
description: "Rendering collections with map(), understanding why keys matter, stable unique IDs, and avoiding index as key."
---

# Rendering Lists & Keys

Displaying collections of data—such as product lists, comments, search results, or navigation links—is one of the most common tasks in web development. In React, you transform arrays of data into arrays of JSX elements using standard JavaScript array methods like `map()`.

In this lesson, you will learn how to render dynamic lists, why the `key` prop is essential for React's reconciliation algorithm, and how to avoid the dangerous anti-pattern of using array indices as keys.

## Transforming Arrays with `.map()`

To render an array of items, call `.map()` inside curly braces `{ }` in your JSX. For each element in the data array, return a corresponding JSX element:

```jsx
function TechList() {
  const technologies = [
    { id: 't1', name: 'React', category: 'Frontend' },
    { id: 't2', name: 'TypeScript', category: 'Language' },
    { id: 't3', name: 'Tailwind CSS', category: 'Styling' },
  ];

  return (
    <ul className="tech-list">
      {technologies.map(tech => (
        <li key={tech.id} className="tech-item">
          <strong>{tech.name}</strong> — <span>{tech.category}</span>
        </li>
      ))}
    </ul>
  );
}
```

## Why Keys Matter in React

Notice the `key={tech.id}` prop passed to each `<li>`. The `key` prop is a special string attribute that gives elements a stable identity between renders.

When state changes and an array is re-rendered, React uses keys to match existing elements in the Virtual DOM tree with elements in the newly generated tree. This allows React to:
- Determine which items have been **inserted**, **deleted**, or **reordered**.
- Reuse existing real DOM nodes instead of destroying and recreating the entire list.
- Preserve component-level internal state (such as input values or toggle switches) across reorders.

## Rules of Keys

1. **Keys must be unique among siblings**: Two items in the same list must never share the same key. (Keys do not need to be globally unique across the entire app).
2. **Keys must be stable**: Keys should not change randomly across renders. Never generate keys on the fly using `key={Math.random()}` or `key={Date.now()}`, as this forces React to recreate the entire DOM subtree on every single render.

## The Anti-Pattern: Using Array Index as Key

React will use the array index as a default key if you do not provide one, but you should avoid this whenever items in your list can be reordered, sorted, filtered, inserted, or deleted.

When you use array indices (`key={index}`), reordering or deleting an item changes the index of every subsequent item. This causes React to associate old component state with new data items, leading to severe visual bugs in form inputs and broken animations.

```jsx
// ❌ Dangerous if items can be sorted, deleted, or inserted:
{items.map((item, index) => (
  <TodoItem key={index} todo={item} />
))}

// ✅ Correct: Use stable database IDs or unique entity slugs:
{items.map((item) => (
  <TodoItem key={item.id} todo={item} />
))}
```

## Filtering and Transforming Lists

You can combine JavaScript array methods like `.filter()` and `.map()` to display filtered sub-collections cleanly:

```jsx
function ActiveUsers({ users }) {
  const activeUsers = users.filter(user => user.isActive);

  return (
    <section>
      <h3>Active Team Members ({activeUsers.length})</h3>
      {activeUsers.length === 0 ? (
        <p>No active users right now.</p>
      ) : (
        <div className="user-grid">
          {activeUsers.map(user => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      )}
    </section>
  );
}
```

## Best Practices

- **Always Use Stable Unique IDs**: Use database primary keys (`item.id`) or unique slugs as list keys.
- **Key Belongs on the Outermost Element**: The `key` prop must be placed on the root element returned directly inside the `.map()` callback.
- **Use Fragment with Key**: When mapping elements that return multiple siblings without a wrapper div, use explicit `<Fragment key={item.id}>`.

## Summary

Rendering dynamic lists in React is accomplished using JavaScript's native `.map()` method. Providing stable, unique `key` props for every list item is critical for performance and state preservation during DOM reconciliation.
