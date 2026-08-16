---
title: "Advanced Component Architecture"
technology: "react"
difficulty: "intermediate"
estimatedMinutes: 25
order: 15
description: "Mastering compound components, render props, controlled vs uncontrolled abstractions, and feature-based UI patterns."
---

# Advanced Component Architecture

As applications scale from simple prototypes into complex enterprise systems, the way you structure and compose React components determines codebase maintainability. Poor component architecture leads to prop drilling, tight coupling, and brittle UI changes.

In this lesson, you will master advanced component design patterns including **Compound Components**, flexible container/presentational boundaries, and clean custom component APIs.

## The Compound Component Pattern

Compound components are a collection of related components that work together to form a cohesive UI unit while sharing implicit state behind the scenes. Think of HTML's native `<select>` and `<option>` tags—they work together seamlessly without you passing active values to each individual option.

In React, compound components are implemented using React Context to share state across a group of child sub-components:

```jsx
import React, { useState, createContext, useContext } from 'react';

const AccordionContext = createContext(null);

function Accordion({ children, defaultOpenId = null }) {
  const [openId, setOpenId] = useState(defaultOpenId);

  const toggle = (id) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  return (
    <AccordionContext.Provider value={{ openId, toggle }}>
      <div className="accordion-root">{children}</div>
    </AccordionContext.Provider>
  );
}

function AccordionItem({ id, children }) {
  return <div className="accordion-item" data-item-id={id}>{children}</div>;
}

function AccordionTrigger({ id, children }) {
  const { openId, toggle } = useContext(AccordionContext);
  const isOpen = openId === id;

  return (
    <button
      className="accordion-trigger"
      onClick={() => toggle(id)}
      aria-expanded={isOpen}
    >
      {children}
      <span>{isOpen ? '▲' : '▼'}</span>
    </button>
  );
}

function AccordionContent({ id, children }) {
  const { openId } = useContext(AccordionContext);
  if (openId !== id) return null;
  return <div className="accordion-content">{children}</div>;
}

// Attach sub-components:
Accordion.Item = AccordionItem;
Accordion.Trigger = AccordionTrigger;
Accordion.Content = AccordionContent;

export default Accordion;
```

### Consuming Compound Components
Consumers have complete flexibility over markup order and layout without managing active state manually:
```jsx
<Accordion defaultOpenId="faq-1">
  <Accordion.Item id="faq-1">
    <Accordion.Trigger id="faq-1">What is React?</Accordion.Trigger>
    <Accordion.Content id="faq-1">
      React is a declarative library for building user interfaces.
    </Accordion.Content>
  </Accordion.Item>
</Accordion>
```

## Flexible Controlled & Uncontrolled APIs

High-quality design system components provide flexible APIs that can operate in either an **uncontrolled mode** (managing internal state with defaults) or a **controlled mode** (driven externally by the consumer's state).

By inspecting whether a `value` prop was provided, the component delegates control appropriately:
```jsx
function ToggleSwitch({ checked: controlledChecked, defaultChecked = false, onChange }) {
  const isControlled = controlledChecked !== undefined;
  const [internalChecked, setInternalChecked] = useState(defaultChecked);

  const isChecked = isControlled ? controlledChecked : internalChecked;

  function handleToggle() {
    if (!isControlled) {
      setInternalChecked(!isChecked);
    }
    onChange?.(!isChecked);
  }

  return (
    <button
      role="switch"
      aria-checked={isChecked}
      onClick={handleToggle}
      className={`switch ${isChecked ? 'bg-primary' : 'bg-slate-300'}`}
    >
      <span className="thumb" />
    </button>
  );
}
```

## Feature-Based vs Layer-Based Architecture

In large projects, avoid organizing files strictly by technical role (e.g. putting all components in one folder, all hooks in another, and all API calls in a third). Instead, organize code by **feature domain**:

```text
src/
├── features/
│   ├── authentication/
│   │   ├── components/LoginForm.tsx
│   │   ├── hooks/useAuth.ts
│   │   ├── services/authApi.ts
│   │   └── types/auth.ts
│   ├── products/
│   │   ├── components/ProductCard.tsx
│   │   ├── hooks/useProducts.ts
│   │   └── services/productsApi.ts
└── shared/
    ├── components/Button.tsx
    └── hooks/useDebounce.ts
```

## Best Practices

- **Use Compound Components for Complex UI Controls**: Accordions, tabs, dropdown menus, and dialogs benefit enormously from compound patterns.
- **Support Controlled and Uncontrolled Modes**: Make reusable UI components versatile by accepting optional `value` and `defaultValue` props.
- **Group Code by Feature Domain**: Keep components, hooks, and API services close to where they are used.

## Summary

Advanced component architecture allows you to create flexible, composable component APIs using compound patterns and flexible control mechanisms. Organizing applications into domain-driven feature modules ensures long-term scalability and team productivity.
