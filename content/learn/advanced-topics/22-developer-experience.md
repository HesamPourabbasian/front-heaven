---
title: 'Developer Experience (DX), Tooling & Code Generation'
description: 'Master enterprise Developer Experience (DX): ESLint Flat Config, Prettier, Husky git hooks, lint-staged, Commitlint, Changesets release automation, Plop.js generators, and Dev Containers.'
order: 22
difficulty: 'advanced'
category: 'Senior Front-End Engineering'
estimatedMinutes: 45
prerequisites:
  - /learn/advanced-topics/21-design-systems
---

# Developer Experience (DX), Tooling & Code Generation

High-performing engineering teams treat **Developer Experience (DX)** as a first-class product feature. When local builds are instant, linting is automated on commit, scaffolding components takes a single CLI command, and releases are managed without manual toil, developer velocity and code quality skyrocket.

In this lesson, we explore modern **ESLint Flat Config**, automated pre-commit verification with **Husky** and **lint-staged**, **Commitlint**, release management with **Changesets**, custom code generators with **Plop.js**, and reproducible **Dev Containers**.

```text
┌────────────────────────────────────────────────────────────┐
│               The Automated DX Verification Loop           │
├────────────────────────────────────────────────────────────┤
│ Developer executes `git commit -m "feat(auth): login"`     │
│       │                                                    │
│       ▼ (Husky pre-commit hook)                            │
│ `lint-staged`:                                             │
│ ├── 1. ESLint (`--fix` on staged `.ts`/`.vue` files only)  │
│ ├── 2. Prettier (`--write` staged files)                   │
│ └── 3. Vitest (Runs tests related to staged files only)    │
│       │                                                    │
│       ▼ (Husky commit-msg hook)                            │
│ `commitlint`: Verifies Conventional Commit format          │
└────────────────────────────────────────────────────────────┘
```

## 1. ESLint 9+ Flat Configuration Architecture

Modern ESLint uses the simplified, composable **Flat Config (`eslint.config.js`)** format:

```javascript
// eslint.config.js
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import prettierConfig from "eslint-config-prettier";

export default [
  {
    ignores: ["dist/**", ".output/**", "coverage/**"],
  },
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.vue"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
  prettierConfig, // Disables conflicting ESLint formatting rules in favor of Prettier
];
```

## 2. Git Hooks Automation with Husky & `lint-staged`

Instead of running slow whole-project linters, **`lint-staged`** runs linters and formatters *only on files staged for the current commit*, finishing in under 500 milliseconds:

```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx,vue,js}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,css,md}": [
      "prettier --write"
    ]
  }
}
```

Configure `.husky/pre-commit`:
```bash
npx lint-staged
```

Configure `.husky/commit-msg` with Commitlint:
```bash
npx --no -- commitlint --edit "$1"
```

## 3. Automated Monorepo Versioning with Changesets

In multi-package monorepos, managing version bumps and changelogs manually causes release friction. **Changesets** allows developers to declare intent when authoring pull requests:

```bash
npx changeset
```

The interactive CLI prompts:
- *Which packages are affected?* (`@myorg/ui`, `@myorg/api-client`)
- *What is the bump type?* (`patch`, `minor`, `major`)
- *Summary of changes:* Added disabled state to Button component.

In CI, the Changesets GitHub Action automatically bundles all pending changesets, bumps `package.json` versions, generates `CHANGELOG.md` files, and opens a release PR automatically.

## 4. Rapid Scaffolding with Plop.js Code Generators

Standardize component architectures across large teams using **Plop.js** scaffolding templates:

```javascript
// plopfile.js
export default function (plop) {
  plop.setGenerator("component", {
    description: "Scaffold a production-ready UI component",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Component name (e.g. UserCard):",
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/components/{{pascalCase name}}/{{pascalCase name}}.vue",
        templateFile: "templates/Component.vue.hbs",
      },
      {
        type: "add",
        path: "src/components/{{pascalCase name}}/{{pascalCase name}}.spec.ts",
        templateFile: "templates/Component.spec.ts.hbs",
      },
      {
        type: "add",
        path: "src/components/{{pascalCase name}}/{{pascalCase name}}.stories.ts",
        templateFile: "templates/Component.stories.ts.hbs",
      },
    ],
  });
}
```

Running `npx plop component` instantly generates the component file, unit test, and Storybook documentation file following company standards in 2 seconds.

## 5. Reproducible Environments with Dev Containers

Eliminate "it works on my machine" issues by configuring **VS Code Dev Containers (`.devcontainer/devcontainer.json`)**:

```json
{
  "name": "Front-End Monorepo Container",
  "image": "mcr.microsoft.com/devcontainers/javascript-node:22",
  "features": {
    "ghcr.io/devcontainers-contrib/features/pnpm:2": {}
  },
  "customizations": {
    "vscode": {
      "extensions": [
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode",
        "Vue.volar"
      ]
    }
  },
  "postCreateCommand": "pnpm install"
}
```

Every engineer and open-source contributor boots up with the exact same Node version, pnpm binary, and editor extensions inside Docker.

## Summary

- Developer Experience (DX) drives team velocity, code consistency, and automated quality assurance.
- ESLint Flat Config provides composable, modern linting configurations.
- Husky and `lint-staged` execute fast linters, formatters, and tests only on staged Git files.
- Changesets automates monorepo version bumping, changelog generation, and npm publishing.
- Plop.js scaffolds standardized components, unit tests, and stories with interactive CLI prompts.
- Dev Containers provide identical, isolated Dockerized development environments for all engineers.

## Best Practices

1. **Keep Pre-Commit Hooks Sub-Second**: Only run `lint-staged` on staged files; save heavy full-suite E2E tests for CI.
2. **Standardize Component Scaffolding**: Use Plop.js generators so new components always include tests and stories.
3. **Use Changesets for Monorepo Releases**: Avoid manual changelog editing and version tag conflicts.
4. **Separate Formatting (Prettier) from Linting (ESLint)**: Use `eslint-config-prettier` to prevent formatting fights.
