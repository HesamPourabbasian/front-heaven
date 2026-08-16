---
title: 'Formatting'
description: 'Maintain clean, consistent, and automated TypeScript code style using Prettier, Biome, and modern formatting best practices.'
order: 33
difficulty: 'beginner'
category: 'Level 10 - Tooling & Ecosystem'
estimatedMinutes: 15
prerequisites:
  - /learn/typescript/ambient-declarations
---

## Why Automated Code Formatting Matters

In a team codebase, debates over semicolons, trailing commas, indentation, and quote styles waste engineering time. **Automated Code Formatting** standardizes code style automatically on save or before commits, ensuring consistent readability across the entire repository.

---

## 1. Formatting with Prettier

**Prettier** is the most widely adopted opinionated code formatter for TypeScript, JavaScript, CSS, HTML, and JSON.

### Installation
```bash
npm install -D prettier
```

### Configuration (`.prettierrc`)
Create a `.prettierrc.json` file in your project root:

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "tabWidth": 2,
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "always"
}
```

### Running Prettier
```bash
# Check formatting
npx prettier --check "src/**/*.{ts,tsx,vue}"

# Format and write fixes
npx prettier --write "src/**/*.{ts,tsx,vue}"
```

---

## 2. Next-Gen Fast Formatters: Biome & dprint

Modern Rust-based tools offer sub-millisecond formatting speeds for massive TypeScript repositories:

### Biome
**Biome** is a unified, lightning-fast formatter and linter written in Rust that is 20-30x faster than Prettier:

```bash
npm install -D --save-exact @biomejs/biome
npx @biomejs/biome init
npx @biomejs/biome format --write ./src
```

---

## 3. Editor Integration (VS Code / Cursor)

To format automatically whenever you press save (`Cmd+S` / `Ctrl+S`), add a `.vscode/settings.json` file:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports": "always",
    "source.fixAll": "always"
  }
}
```

---

## Summary

- Automated formatters eliminate subjective styling debates and keep team code clean.
- Prettier is the industry standard with extensive ecosystem plugins.
- Biome and dprint provide ultra-fast Rust-based formatting alternatives.
- Enable `formatOnSave` and `organizeImports` in your editor configuration for seamless developer ergonomics.

## Practice

1. Install `prettier` as a dev dependency.
2. Create a `.prettierrc` file specifying `"semi": false` and `"singleQuote": true`.
3. Format your TypeScript project using `npx prettier --write "src/**/*.ts"`.
