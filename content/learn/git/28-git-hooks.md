---
title: 'Git Hooks, Husky & Commit Validation'
description: 'Master Git hooks: client-side hooks (pre-commit, commit-msg, pre-push), server-side hooks, Husky setup, lint-staged integration, and commit message enforcement.'
order: 28
difficulty: 'advanced'
category: 'Level 3 — Advanced'
estimatedMinutes: 45
prerequisites: ['/learn/git/04-commits']
---

# Git Hooks, Husky & Commit Validation

**Git Hooks** are custom scripts that Git triggers automatically at key lifecycle events (e.g. before committing, while verifying commit messages, or before pushing to a remote). Hooks allow development teams to enforce code quality gates, run linters and formatting checks, prevent secret leaks, and enforce Conventional Commit message rules locally on developers' machines before code ever reaches remote CI/CD pipelines.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Client-Side Git Hook Pipeline               │
│                                                             │
│  Developer runs `git commit -m "..."`                       │
│             │                                               │
│             ▼                                               │
│  [pre-commit Hook] (Husky + lint-staged)                    │
│  ├── Runs ESLint & Prettier on STAGED files only            │
│  └── Passes -> Continue / Fails -> Aborts commit immediately│
│             │                                               │
│             ▼                                               │
│  [commit-msg Hook] (@commitlint/cli)                        │
│  ├── Verifies Conventional Commit format (feat:, fix:)      │
│  └── Passes -> Records commit / Fails -> Aborts commit      │
│             │                                               │
│             ▼                                               │
│  Developer runs `git push origin main`                      │
│             │                                               │
│             ▼                                               │
│  [pre-push Hook] (Runs fast unit test suite)                │
└─────────────────────────────────────────────────────────────┘
```

## 1. Native Git Hooks (`.git/hooks/`)

By default, every Git repository contains sample hook scripts inside `.git/hooks/` (e.g. `pre-commit.sample`). However, files inside `.git/hooks/` are local and cannot be committed to version control.

## 2. Managing Team Hooks with Husky & lint-staged

In modern JavaScript/TypeScript projects, **Husky** configures Git hooks stored inside a committed `.husky/` directory, ensuring all team members automatically share identical hook rules upon running `npm install`.

### Installing Husky & lint-staged:

```bash
# Install packages
npm install -D husky lint-staged @commitlint/cli @commitlint/config-conventional

# Initialize Husky configuration
npx husky init
```

### Configuring `pre-commit` Hook (`.husky/pre-commit`):

```bash
# .husky/pre-commit
npx lint-staged
```

### Configuring `lint-staged` in `package.json`:

`lint-staged` runs linters and formatters **exclusively on staged files**, executing in seconds rather than linting the entire repository:

```json
"lint-staged": {
  "*.{ts,js}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{scss,css,html,md,json}": [
    "prettier --write"
  ]
}
```

### Enforcing Conventional Commits with `commit-msg`:

```bash
# Add commit-msg hook
echo "npx --no -- commitlint --edit \$1" > .husky/commit-msg
```

If a developer attempts to commit `"fixed stuff"`, commitlint blocks the commit and outputs:
`✖   subject may not be empty [subject-empty]`
`✖   type may not be empty [type-empty]`

## Summary & Key Takeaways

- Git hooks automate scripts during commit and push lifecycles.
- Husky enables sharing and committing Git hooks across team members.
- `lint-staged` lints and formats only staged files for instant pre-commit validation.
- `commitlint` enforces the Conventional Commits specification automatically.

## Best Practices & Senior Guidance

1. **Keep `pre-commit` Hooks Blazing Fast (<2s)**: If a pre-commit hook takes 30 seconds, developers will bypass it with `--no-verify`. Run heavy test suites in CI, not in pre-commit.
2. **Never Rely Solely on Client Hooks for Security**: Developers can bypass local hooks with `git commit -n` (`--no-verify`). Always enforce mandatory checks in GitHub Actions CI as your final gate.
