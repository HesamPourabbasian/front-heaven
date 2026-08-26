---
title: 'Enterprise Component Libraries & Storybook'
description: 'Master building enterprise reusable component libraries with Bootstrap 5: component API contracts, variant props, Storybook documentation, automated visual regression testing, unit testing with Vitest/Testing Library, and npm packaging.'
order: 36
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 45
prerequisites:
  - /learn/bootstrap/26-framework-integration
  - /learn/bootstrap/31-design-systems
---

# Enterprise Component Libraries & Storybook

Large engineering organizations standardize UI development by maintaining a private or open-source **Enterprise Component Library**. By wrapping customized Bootstrap 5 markup and SCSS tokens inside strongly-typed React or Vue components, teams achieve guaranteed accessibility, type-safety, and visual consistency across all customer-facing applications.

In this lesson, you will master component API design, Storybook documentation, visual regression testing, unit testing, and publishing to npm.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Enterprise Component Library Workflow                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  Bootstrap SCSS Design Tokens                                               │
│         │                                                                   │
│         ▼                                                                   │
│  Strongly-Typed Component Wrapper (React / TypeScript / CVA)                │
│         │                                                                   │
│         ▼                                                                   │
│  Storybook Interactive Documentation & Accessibility Auditing               │
│         │                                                                   │
│         ▼                                                                   │
│  Playwright Visual Regression Testing & Vitest Unit Tests                   │
│         │                                                                   │
│         ▼                                                                   │
│  Automated Semantic Versioning & Private npm Registry Publishing           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Designing Component APIs & TypeScript Contracts

Define clear props contracts using TypeScript and class variance utilities:

```tsx
// src/components/Button/Button.tsx
import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  className = '',
  disabled,
  ...props
}) => {
  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
  const variantClass = variant === 'ghost' ? 'btn-ghost' : `btn-${variant}`;

  return (
    <button
      className={`btn ${variantClass} ${sizeClass} d-inline-flex align-items-center gap-2 ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
    </button>
  );
};
```

---

## 2. Storybook Documentation & Interactive Controls

Document component variations in Storybook (`Button.stories.tsx`):

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Design System/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'danger', 'ghost'],
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
    isLoading: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Action',
  },
};

export const LoadingState: Story = {
  args: {
    variant: 'primary',
    isLoading: true,
    children: 'Saving Data...',
  },
};
```

---

## 3. Unit Testing with Vitest & React Testing Library

Ensure accessibility, click handlers, and disabled states function properly:

```tsx
// src/components/Button/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders children correctly', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('triggers onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Submit</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disables button when isLoading is true', () => {
    render(<Button isLoading>Save</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
```

---

## 4. Packaging and Publishing to npm

Configure `package.json` for ESM and CommonJS dual distribution:

```json
{
  "name": "@enterprise/bootstrap-ui",
  "version": "1.0.0",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts",
    "test": "vitest run",
    "storybook": "storybook dev -p 6006"
  },
  "peerDependencies": {
    "bootstrap": "^5.3.3",
    "react": "^18.0.0 || ^19.0.0"
  }
}
```

---

## Summary & Key Takeaways

- Component libraries encapsulate Bootstrap class names inside strongly-typed props APIs.
- Storybook provides living documentation and interactive controls for designers and engineers.
- Unit tests with Vitest verify accessibility roles, loading spinners, and event propagation.
- Dual ESM/CJS packaging with `tsup` enables compatibility across modern build pipelines.

## Best Practices & Senior Guidance

1. **Declare Bootstrap as a Peer Dependency**: Marking Bootstrap as a `peerDependency` prevents duplicate CSS versions from being bundled in consumer applications.
2. **Run Automated a11y Audits in Storybook**: Use `@storybook/addon-a11y` to catch contrast errors and missing ARIA attributes before code reviews.
