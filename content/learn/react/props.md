---
title: "Props in React"
technology: "react"
difficulty: "beginner"
estimatedMinutes: 25
order: 6
description: "Passing and reading props, destructuring, default values, passing functions, and the special children prop."
---

# Props in React

React components communicate with each other through **props** (short for *properties*). Props allow a parent component to pass data, callbacks, configuration flags, and even other components down to its child components.

In this lesson, you will learn how to pass and read props, destructure them cleanly, assign default fallback values, pass callback functions, and utilize the special `children` prop for component composition.

## What are Props?

Props are the inputs to a React component. Every parent component can pass information to its children by giving them attributes in JSX, exactly like HTML attributes:

```jsx
function App() {
  return <Badge text="New" variant="success" count={5} isVisible={true} />;
}
```

In the child component, React gathers all passed attributes into a single JavaScript object called `props`:
```jsx
function Badge(props) {
  if (!props.isVisible) return null;
  return (
    <span className={`badge badge-${props.variant}`}>
      {props.text} ({props.count})
    </span>
  );
}
```

## Destructuring Props

Instead of writing `props.name` repeatedly throughout your component, standard React convention destructures props directly inside the function signature:

```jsx
function Badge({ text, variant, count, isVisible = true }) {
  if (!isVisible) return null;
  return (
    <span className={`badge badge-${variant}`}>
      {text} ({count})
    </span>
  );
}
```
This makes it immediately apparent to anyone reading the component what parameters it accepts.

## Default Prop Values

You can provide default fallback values directly in the destructuring assignment. If the parent does not pass that prop (or passes `undefined`), the default value is used:

```jsx
function Avatar({ src, alt = 'User avatar', size = 48 }) {
  return (
    <img
      src={src || '/default-avatar.png'}
      alt={alt}
      width={size}
      height={size}
      className="avatar rounded-full"
    />
  );
}
```

## Passing Different Data Types as Props

You can pass any valid JavaScript data type through props:
- **Strings**: `<Card title="Dashboard" />`
- **Numbers**: `<ProgressBar progress={75} />`
- **Booleans**: `<Modal isOpen={true} />` (or shorthand `<Modal isOpen />`)
- **Arrays**: `<TagList tags={['react', 'typescript', 'frontend']} />`
- **Objects**: `<UserProfile user={{ id: 1, name: 'Hesam' }} />`
- **Functions**: `<Button onClick={handleSave} />`

## Passing Functions as Props (Callbacks)

Data in React flows **downwards** from parent to child (unidirectional data flow). However, when a child needs to communicate an event back up to its parent, the parent passes a callback function as a prop:

```jsx
function Parent() {
  const [selectedId, setSelectedId] = useState(null);

  function handleSelect(id) {
    setSelectedId(id);
    console.log('Selected item:', id);
  }

  return <ItemCard id="item-42" title="Laptop" onSelect={handleSelect} />;
}

function ItemCard({ id, title, onSelect }) {
  return (
    <div className="card">
      <h4>{title}</h4>
      <button onClick={() => onSelect(id)}>Choose</button>
    </div>
  );
}
```

## The Special `children` Prop

When you nest content inside opening and closing JSX tags, React automatically passes that content into the child component as a special prop called `children`:

```jsx
function Modal({ title, children }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>{title}</h3>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

// Usage:
function App() {
  return (
    <Modal title="Delete Confirmation">
      <p>Are you sure you want to permanently delete this project?</p>
      <button>Confirm</button>
    </Modal>
  );
}
```
The `children` prop is the primary mechanism for building layout wrappers, dialogs, cards, and design system components.

## Props are Read-Only (Immutable)

A component must **never mutate its own props**. If a component needs to change a value in response to user interaction, it should use state (`useState`) or trigger a parent callback function.

React's functional model requires components to behave like pure functions with respect to their props: given the same props, they should return the same JSX.

## Best Practices

- **Destructure Props in Signature**: Keep prop requirements explicit and readable at the top of the function.
- **Never Mutate Props**: Treat props as strictly read-only snapshots of parent data.
- **Use `children` for Flexible Wrappers**: Prefer composition using `children` over passing dozens of complex configuration strings.

## Summary

Props enable parent components to pass data and callbacks downward to child components. By destructuring props, providing default values, passing callbacks for upward communication, and leveraging the `children` prop, you can build flexible, reusable component APIs.
