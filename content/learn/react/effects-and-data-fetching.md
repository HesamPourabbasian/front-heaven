---
title: 'Data Fetching & Context API'
description: 'Fetch data in React components, handle loading and error states, and share global state with React Context.'
order: 5
difficulty: 'intermediate'
category: 'Advanced Patterns'
estimatedMinutes: 25
prerequisites:
  - /learn/react/hooks-and-lifecycle
---

## Data Fetching Pattern

```jsx
import { useState, useEffect } from 'react';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading users...</p>;
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
```

---

## Summary & Key Takeaways

- Track `loading`, `data`, and `error` states explicitly.
- Use React Context for cross-cutting state like themes or auth.
