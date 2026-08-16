---
title: "React Components"
technology: "react"
difficulty: "beginner"
estimatedMinutes: 25
order: 5
description: "Mastering functional components, component naming, composition, hierarchy, and container vs presentational patterns."
---

# React Components

Components are the fundamental building blocks of any React application. A React component is a self-contained, reusable piece of user interface that encapsulates its own markup (JSX), logic, and styling.

In this lesson, you will learn how to write clean functional components, name and organize them effectively, compose complex component hierarchies, and apply container vs presentational design patterns.

## What is a React Component?

Conceptually, React components behave like JavaScript functions. They accept inputs (called **props**) and return React elements describing what should appear on the screen.

In modern React, all components are written as **Functional Components**. A functional component is simply a JavaScript function whose name starts with a capital letter and returns JSX:

```jsx
function ProfileCard() {
  return (
    <article className="card">
      <img src="/avatar.jpg" alt="Hesam" />
      <h3>Hesam Pourabbasian</h3>
      <p>Frontend Software Engineer</p>
    </article>
  );
}

export default ProfileCard;
```

## Component Naming Conventions

React relies on capital letters to differentiate custom React components from standard HTML elements:
- `<profileCard />`: Treated as an unknown custom HTML tag.
- `<ProfileCard />`: Treated as a React component and executed as a function.

Always use **PascalCase** for component filenames and function declarations (e.g. `UserProfile.tsx`, `Navbar.tsx`, `ProductList.tsx`).

## Component Composition & Hierarchy

Complex applications are built by composing smaller, focused components into a tree hierarchy. For instance, an e-commerce page might be decomposed as follows:

```text
App
├── Navbar
│   ├── Logo
│   ├── SearchInput
│   └── CartIcon
├── HeroBanner
├── ProductGrid
│   ├── ProductCard
│   ├── ProductCard
│   └── ProductCard
└── Footer
```

Here is how you compose these components in code:
```jsx
function ProductGrid() {
  return (
    <section className="product-grid">
      <h2>Featured Products</h2>
      <div className="grid">
        <ProductCard id="1" title="Mechanical Keyboard" price={120} />
        <ProductCard id="2" title="Ergonomic Mouse" price={85} />
      </div>
    </section>
  );
}
```

## Splitting Large Components

A common beginner mistake is writing massive, monolithic components spanning hundreds of lines of code. When a component handles multiple unrelated UI responsibilities or contains nested sections, split it into smaller sub-components.

Guidelines for splitting:
1. **Single Responsibility**: Each component should do one thing well (e.g. render a button, display a card, manage a modal).
2. **Reusability**: If a UI pattern appears in more than one place, extract it into a standalone component.
3. **Readability**: Breaking a 300-line file into three 100-line components makes code easier to test and maintain.

## Container vs Presentational Components

A proven architectural pattern in component design is separating stateful logic from stateless UI presentation:

### 1. Presentational Components (Dumb Components)
Focus exclusively on *how things look*. They receive data via props and render UI. They rarely hold internal state (other than transient UI state like tooltip toggles):
```jsx
function Button({ label, onClick, variant = 'primary' }) {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {label}
    </button>
  );
}
```

### 2. Container Components (Smart Components)
Focus on *how things work*. They fetch data, subscribe to state stores, handle business logic, and pass raw data down to presentational components:
```jsx
function UserListContainer() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers().then(data => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Spinner />;
  return <UserListView users={users} />;
}
```

## Best Practices

- **Keep Components Pure**: Never mutate external variables or perform side effects during the render phase.
- **One Component per File**: Place major components in their own dedicated files for clean imports and module boundaries.
- **Favor Composition Over Inheritance**: React does not use class inheritance; compose components together using child elements and props.

## Summary

Components are the core abstractions in React. By building small, pure, and composable functional components and cleanly separating container logic from presentational rendering, you create scalable and maintainable UI architectures.
