---
title: "TypeScript with React"
technology: "react"
difficulty: "intermediate"
estimatedMinutes: 25
order: 24
description: "Typing component props, events, hooks, generics, API payloads, and utility types in React applications."
---

# TypeScript with React

TypeScript has become the default language of modern React development. By introducing static types to component props, state variables, custom hooks, and event handlers, TypeScript eliminates runtime bugs, enables rich IDE auto-completion, and makes large-scale refactoring painless.

In this lesson, you will learn how to type component props, children, DOM and synthetic events, hooks, and generic components.

## Typing Component Props

Define an interface or type alias representing the props a component accepts:

```tsx
import React, { ReactNode } from 'react';

interface ButtonProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger'; // Optional union
  disabled?: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  icon?: ReactNode; // Any valid JSX renderable element
}

export function Button({
  label,
  variant = 'primary',
  disabled = false,
  onClick,
  icon,
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`btn btn-${variant}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </button>
  );
}
```

## Typing React Events

React provides typed wrappers for all browser events:

```tsx
function EventDemo() {
  // 1. Mouse Click Event:
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('Coordinates:', e.clientX, e.clientY);
  };

  // 2. Input Change Event:
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Value:', e.target.value);
  };

  // 3. Form Submit Event:
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  // 4. Keyboard Event:
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') console.log('Submitted via Enter key');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" onChange={handleInputChange} onKeyDown={handleKeyDown} />
      <button type="button" onClick={handleClick}>Click</button>
    </form>
  );
}
```

## Typing React Hooks

### 1. `useState`
TypeScript infers basic types automatically from initial values, but union or nullable state requires explicit generic annotations:
```tsx
interface User {
  id: string;
  name: string;
}

// Inferred as number:
const [count, setCount] = useState(0);

// Explicit generic for nullable object state:
const [user, setUser] = useState<User | null>(null);

// Explicit generic for array state:
const [tags, setTags] = useState<string[]>([]);
```

### 2. `useRef`
For DOM references, provide the HTML element type and initialize with `null`:
```tsx
const inputRef = useRef<HTMLInputElement>(null);

// For mutable non-DOM values:
const timerIdRef = useRef<number | null>(null);
```

## Generic React Components

When a component needs to operate over diverse data types while retaining strict type safety (such as a generic `DataTable` or `Dropdown`), use TypeScript generics:

```tsx
interface SelectProps<T> {
  options: T[];
  value: T;
  getLabel: (item: T) => string;
  getValue: (item: T) => string;
  onChange: (selected: T) => void;
}

export function Select<T>({
  options,
  value,
  getLabel,
  getValue,
  onChange,
}: SelectProps<T>) {
  return (
    <select
      value={getValue(value)}
      onChange={e => {
        const found = options.find(opt => getValue(opt) === e.target.value);
        if (found) onChange(found);
      }}
    >
      {options.map(opt => (
        <option key={getValue(opt)} value={getValue(opt)}>
          {getLabel(opt)}
        </option>
      ))}
    </select>
  );
}
```

## Best Practices

- **Avoid `any`**: Never use `any`. Use `unknown` if the type is truly dynamic, then narrow it with type guards.
- **Use `React.ComponentPropsWithoutRef<'button'>`**: When building custom wrapper elements, extend native HTML attribute types to inherit all standard props automatically.
- **Leverage Utility Types**: Use `Partial<T>`, `Pick<T, K>`, and `Omit<T, K>` to derive variations of interfaces without code duplication.

## Summary

Combining TypeScript with React provides static type verification for component props, hooks, event handlers, and API data models. Embracing TypeScript early produces self-documenting codebases that scale cleanly across large engineering teams.
