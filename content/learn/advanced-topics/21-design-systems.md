---
title: 'Design Systems, Tokens & Component Architecture'
description: 'Master enterprise design systems: W3C Design Tokens, Style Dictionary compilation, Polymorphic component APIs, Compound Components, Theming with CSS Variables, and Storybook Chromatic testing.'
order: 21
difficulty: 'advanced'
category: 'Senior Front-End Engineering'
estimatedMinutes: 45
prerequisites:
  - /learn/advanced-topics/20-offline-and-pwa
---

# Design Systems, Tokens & Component Architecture

A **Design System** is not merely a collection of UI buttons in Figma; it is an integrated product platform bridging designers and software engineers through a shared language of **Design Tokens**, strictly typed component APIs, accessible component primitives, and automated visual regression testing.

In this lesson, we explore compiling design tokens with **Style Dictionary**, designing resilient component APIs (**Compound Components**, **Polymorphic `as` props**), multi-brand theming via CSS variables, and **Storybook** documentation with **Chromatic**.

```text
┌────────────────────────────────────────────────────────────┐
│               Design System Token Compilation              │
├────────────────────────────────────────────────────────────┤
│ Figma Design Tokens (JSON - W3C DTCG Format)               │
│       │                                                    │
│       ▼ (Style Dictionary Compiler Engine)                 │
│ Transforms into:                                           │
│ ├── `tokens.css`        (CSS Custom Properties :root)      │
│ ├── `tokens.ts`         (Strictly Typed TypeScript Objects)│
│ ├── `tailwind.theme.js` (Tailwind CSS v4 Configuration)    │
│ └── `tokens.json`       (iOS / Android Native Tokens)      │
└────────────────────────────────────────────────────────────┘
```

## 1. Design Tokens: W3C Format & Style Dictionary

**Design Tokens** are the atomic visual attributes (colors, typography scales, spacing, elevation shadows, border radii) stored as platform-agnostic JSON:

```json
// tokens/color.json (W3C Design Token Community Group Format)
{
  "color": {
    "brand": {
      "primary": {
        "$value": "#2563eb",
        "$type": "color"
      },
      "surface": {
        "$value": "{color.neutral.50}",
        "$type": "color"
      }
    }
  }
}
```

Compiling tokens through **Style Dictionary** outputs CSS custom properties and typed TypeScript constants automatically:

```css
/* dist/tokens.css */
:root {
  --color-brand-primary: #2563eb;
  --color-brand-surface: #f8fafc;
}
```

## 2. Advanced Component Architecture: Compound Components

For complex widgets (Selects, Accordions, Tabs, Modals), avoid passing 20 distinct boolean props into a single monolithic component. **Compound Components** allow consumers to compose subcomponents declaratively while sharing internal context:

```vue
<!-- Usage of Compound Accordion -->
<Accordion default-value="billing">
  <AccordionItem value="general">
    <AccordionTrigger>General Information</AccordionTrigger>
    <AccordionContent>Account preferences and settings...</AccordionContent>
  </AccordionItem>

  <AccordionItem value="billing">
    <AccordionTrigger>Billing & Plans</AccordionTrigger>
    <AccordionContent>Invoices, credit cards, and tier quotas...</AccordionContent>
  </AccordionItem>
</Accordion>
```

```typescript
// AccordionContext.ts (Dependency Injection via provide / inject)
export interface AccordionContext {
  activeItem: Ref<string>;
  toggleItem: (val: string) => void;
}
export const ACCORDION_KEY: InjectionKey<AccordionContext> = Symbol("AccordionContext");
```

## 3. Polymorphic Component APIs (`as` / `asChild`)

A senior design system allows consumers to change the underlying HTML element or framework router link (`as="a"`, `as="button"`, `as="NuxtLink"`) without losing consistent visual styling and keyboard accessibility:

```typescript
export interface ButtonProps {
  as?: string | Component;
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
}
```

## 4. Multi-Brand Theming & Dark Mode Architecture

Leverage CSS Custom Properties on the root `<html>` element to toggle themes without re-rendering the Virtual DOM:

```css
:root {
  --bg-surface: #ffffff;
  --text-ink: #0f172a;
  --color-primary: #3b82f6;
  color-scheme: light;
}

[data-theme="dark"] {
  --bg-surface: #0b0f19;
  --text-ink: #f8fafc;
  --color-primary: #60a5fa;
  color-scheme: dark;
}
```

## 5. Storybook & Chromatic Visual Regression

Document all component states (Default, Hover, Disabled, Error, Loading, Overflowing Text) in **Storybook** stories:

```typescript
// Button.stories.ts
import type { Meta, StoryObj } from "@storybook/vue3";
import Button from "./Button.vue";

const meta: Meta<typeof Button> = {
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["primary", "secondary", "danger"] },
  },
};
export default meta;

export const Primary: StoryObj<typeof Button> = {
  args: { label: "Save Changes", variant: "primary" },
};
```

Connecting Storybook to **Chromatic** in CI captures pixel-by-pixel visual diffs on every pull request, preventing inadvertent CSS regressions across thousands of screens.

## Summary

- Design Tokens encode raw visual styles into platform-agnostic JSON compiled via Style Dictionary.
- Compound Components compose modular subcomponents sharing internal state via Context.
- Polymorphic components allow consumers to swap underlying HTML tags while maintaining styles.
- Theming is achieved through CSS Custom Properties on the root document without re-rendering.
- Storybook and Chromatic provide live documentation and automated visual regression testing.

## Best Practices

1. **Never Hardcode Hex Values in Component CSS**: Always reference semantic design tokens (`var(--color-primary)`).
2. **Build on Headless Accessible Primitives**: Base component logic on battle-tested headless primitives (Radix UI, Headless UI, Ark UI).
3. **Enforce Strict SemVer for Design Systems**: Avoid breaking changes across consumer apps by treating prop deletions as Major releases.
4. **Automate Visual Diff Testing in CI**: Run Chromatic on PRs to catch visual bugs before code merges.
