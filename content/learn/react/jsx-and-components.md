---
title: 'JSX & Component Composition'
description: 'Master JSX syntax rules, embedding JavaScript expressions, conditional rendering, and list mapping with keys.'
order: 2
difficulty: 'intermediate'
category: 'React Fundamentals'
estimatedMinutes: 20
prerequisites:
  - /learn/react/introduction-to-react
---

## Understanding JSX

**JSX** is a syntax extension for JavaScript that looks like HTML:

```jsx
const user = { name: 'Hesam', role: 'Frontend Engineer' };

function ProfileCard() {
  return (
    <div className="card">
      <h2 className="title">{user.name}</h2>
      <p className="role">{user.role}</p>
    </div>
  );
}
```

---

## Conditional Rendering & List Keys

```jsx
function FeatureList({ features, isPremium }) {
  return (
    <div>
      {isPremium && <span className="badge">PRO Plan</span>}
      <ul>
        {features.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Summary & Key Takeaways

- JSX compiles to standard `React.createElement()` JavaScript calls.
- Always provide unique `key` props when mapping arrays in JSX.
