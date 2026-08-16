---
title: "Testing React Applications"
technology: "react"
difficulty: "intermediate"
estimatedMinutes: 25
order: 27
description: "Unit and integration testing with Vitest and React Testing Library, user event simulation, and Playwright E2E."
---

# Testing React Applications

Testing is essential for building scalable, reliable React applications. Automated test suites give engineering teams the confidence to refactor code, upgrade dependencies, and ship features without breaking existing functionality.

In this lesson, you will learn the modern testing stack: **Vitest** for fast unit testing, **React Testing Library (RTL)** for component behavior tests, and **Playwright** for End-to-End (E2E) browser verification.

## The Testing Pyramid in Modern React

```text
         /\
        /  \      E2E Tests (Playwright / Cypress)
       /────\     Verify full user journeys across real browsers
      /      \
     /────────\   Integration Tests (React Testing Library)
    /          \  Verify component interactions, forms, and state
   /────────────\ Unit Tests (Vitest)
  /              \ Test pure helper functions, custom hooks, reducers
```

## Component Testing with React Testing Library

React Testing Library encourages testing components the way users interact with them—querying by visible text, accessible roles, and labels rather than implementation details (like internal state or class names):

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Counter } from './Counter';

describe('Counter Component', () => {
  it('renders initial count and increments on button click', async () => {
    const user = userEvent.setup();
    render(<Counter initialCount={5} />);

    // Check visible heading:
    expect(screen.getByRole('heading', { name: /current count: 5/i })).toBeInTheDocument();

    // Simulate clicking the increment button:
    const incrementButton = screen.getByRole('button', { name: /increment/i });
    await user.click(incrementButton);

    // Verify updated count in UI:
    expect(screen.getByRole('heading', { name: /current count: 6/i })).toBeInTheDocument();
  });
});
```

## Testing Custom Hooks with `renderHook`

```tsx
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

it('increments counter through custom hook', () => {
  const { result } = renderHook(() => useCounter(0));

  expect(result.current.count).toBe(0);

  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(1);
});
```

## Best Practices

- **Query by Accessible Role First**: Use `getByRole('button', { name: 'Submit' })` to ensure your components are accessible to assistive technologies.
- **Avoid Testing Implementation Details**: Do not test internal component state or private methods; test what the user sees and does.
- **Use Mock Service Worker (MSW)**: Mock API requests at the network level rather than manually mocking fetch functions.

## Summary

A comprehensive testing strategy combines unit tests for business logic, React Testing Library for user-centric component verification, and Playwright for cross-browser E2E testing.
