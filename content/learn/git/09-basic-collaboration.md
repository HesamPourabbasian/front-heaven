---
title: 'Basic GitHub Collaboration: PRs, Issues & Reviews'
description: 'Master GitHub collaboration workflows: forks vs branch clones, creating Pull Requests, issue tracking, labels, milestones, inline code reviews, and resolving feedback.'
order: 9
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 40
prerequisites: ['/learn/git/06-remote-repositories']
---

# Basic GitHub Collaboration: PRs, Issues & Reviews

Software engineering is fundamentally a team sport. Whether contributing to major open-source libraries or collaborating in an enterprise product squad, development follows structured collaboration models mediated through **GitHub Issues**, **Forks**, **Branches**, and **Pull Requests (PRs)**.

A Pull Request is not merely a request to merge code—it is an interactive code review discussion, automated testing arena, and architectural quality checkpoint where teammates review changes, suggest improvements, and verify readiness before code reaches production.

```text
┌─────────────────────────────────────────────────────────────┐
│                 GitHub Team Collaboration Flow              │
│                                                             │
│  1. Create Issue (#42: "Fix cart subtotal bug")             │
│             │                                               │
│             ▼                                               │
│  2. Create Feature Branch (git switch -c fix/cart-subtotal) │
│             │                                               │
│             ▼                                               │
│  3. Push Commits to Remote (git push -u origin fix/cart...) │
│             │                                               │
│             ▼                                               │
│  4. Open Pull Request on GitHub (Closes #42)                │
│     ├── Automated CI Tests Run (GitHub Actions)             │
│     └── Teammates Perform Code Review & Inline Comments     │
│             │                                               │
│             ▼                                               │
│  5. Address Review Feedback & Push Updates                  │
│             │                                               │
│             ▼                                               │
│  6. PR Approved & Merged into main -> Issue Closes          │
└─────────────────────────────────────────────────────────────┘
```

## 1. Forks vs Direct Branching

- **Branch Collaboration (Internal Teams)**: Developers have direct write access to the company repository. They create feature branches (`feature/checkout`) directly inside the repository and open Pull Requests against `main`.
- **Fork Collaboration (Open Source)**: External contributors cannot push branches to repositories they do not own. They create a personal server-side copy (**Fork**), push changes to their fork, and open a Pull Request from their fork back to the upstream repository.

## 2. Opening a Professional Pull Request

A great Pull Request contains:
- **Concise, Descriptive Title**: Formatted with Conventional Commits (`feat(auth): add OAuth2 PKCE login`).
- **Context & Motivation**: Why is this change necessary?
- **Issue Linkage**: Include `Closes #42` or `Fixes #108` in the description. GitHub will automatically close the linked issue when the PR merges.
- **Screenshots / Visual Evidence**: For UI changes, attach before/after screenshots or screen recordings.
- **Testing Checklist**: Bullet points detailing how the author tested the changes.

## 3. GitHub Issues, Labels & Milestones

- **Issues**: Track bug reports, feature requests, tasks, and technical debt.
- **Labels**: Categorize issues by priority (`p1`, `p2`), type (`bug`, `enhancement`, `documentation`), or status (`good first issue`, `help wanted`).
- **Milestones**: Group issues and Pull Requests toward a specific release deadline or sprint goal (e.g. `v1.2.0 Release` or `Q3 Sprint 4`).

## 4. The Code Review Process

During a code review:
- **Inline Comments**: Reviewers click specific lines in the PR diff to comment or suggest improvements.
- **Suggested Changes**: Reviewers can propose exact code replacements using GitHub's suggestion markdown block (````suggestion`). The author can accept and commit the suggestion with a single click.
- **Review Verdicts**:
  - **Comment**: General feedback without formal approval or rejection.
  - **Approve**: Code is reviewed, tested, and ready to merge.
  - **Request Changes**: Crucial bugs or architectural flaws must be addressed before merging.

## Summary & Key Takeaways

- Pull Requests are collaborative review arenas for code quality, automated testing, and discussion.
- Link PRs to issues using `Closes #<id>` to automate issue resolution upon merge.
- Use GitHub Forks for open-source contributions and direct feature branches for internal team projects.
- Reviewers provide constructive inline feedback and actionable code suggestions.

## Best Practices & Senior Guidance

1. **Keep Pull Requests Small (<400 Lines)**: Studies consistently prove that PRs under 400 lines are reviewed faster and have significantly higher bug detection rates.
2. **Review Your Own Diff First**: Always read through your own PR diff on GitHub before requesting teammate reviews to catch leftover console logs, typos, or accidental file edits.
3. **Be Constructive and Respectful**: Code reviews evaluate the code, not the person. Use phrases like *"Could we consider..."* or *"What do you think about..."* rather than demanding language.
