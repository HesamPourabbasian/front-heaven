---
title: Pull requests and collaboration
description: The workflow that powers every team on GitHub — propose changes, review code, discuss improvements and merge with confidence.
order: 6
difficulty: beginner
category: Collaboration
estimatedMinutes: 30
prerequisites:
  - learn/git/remote-repositories-and-github
---

## Introduction

Pushing code directly to the `main` branch works for solo projects, but teams need a process to review changes before they become part of the shared codebase. A **pull request** (PR) is that process. It is a proposal: "I made these changes on a branch — please review them before we merge." Pull requests are the core collaboration mechanism on GitHub, and they are used by virtually every professional team.

This lesson teaches the full pull request workflow: creating a branch, pushing it, opening a PR, requesting reviews, discussing feedback, making changes, and merging. By the end, you will understand how code gets reviewed and integrated in a professional team.

## What a pull request is

A pull request is not a Git feature — it is a GitHub (and similar platform) feature. It takes a branch you have pushed and wraps it in a discussion interface: reviewers can see every commit, every file changed, and every line of code. They can leave comments on specific lines, suggest changes, ask questions, and approve or request revisions. When everyone is satisfied, the PR is merged — the branch's commits are added to the target branch (usually `main`).

The name "pull request" comes from the idea that you are *requesting* the repository owner to *pull* your changes into their codebase. The workflow is: branch → commit → push → open PR → review → merge.

## The workflow

### 1. Create a feature branch

Always start from an up-to-date `main`:

```bash
git switch main
git pull origin main
git switch -c feature/newsletter-signup
```

### 2. Make changes and commit

Work on the feature, making focused commits:

```bash
# ... edit files ...
git add .
git commit -m "Add newsletter signup form HTML"
git add .
git commit -m "Style newsletter form with responsive layout"
git add .
git commit -m "Add email validation to newsletter form"
```

Each commit is a small, reviewable unit. The PR will show all three commits together.

### 3. Push the branch

```bash
git push -u origin feature/newsletter-signup
```

GitHub automatically detects the push and may display a prompt to create a pull request.

### 4. Open the pull request

Go to your repository on GitHub. Click **Pull requests** → **New pull request**. Select the base branch (`main`) and the compare branch (`feature/newsletter-signup`). GitHub shows a diff of all changes. Fill in:

- **Title** — concise summary (often matches the feature name)
- **Description** — explain what the PR does, why it exists, and anything reviewers should know. Reference related issues with `#issue-number`.

Click **Create pull request**. The PR is now visible to your team.

### 5. Code review

Reviewers examine the diff — every changed line — and leave comments:

- **General comments** — overall feedback on approach or design
- **Line comments** — specific feedback on individual lines
- **Suggested changes** — inline edits that the author can accept with one click

Reviewers can approve the PR, request changes, or leave comments without a formal verdict. The PR page tracks the status: changes requested, approved, or pending.

### 6. Make changes based on feedback

If reviewers request changes, make them on the same branch:

```bash
# ... fix the issues ...
git add .
git commit -m "Fix form validation edge case"
git push
```

The new commits automatically appear in the PR. There is no need to close and reopen it — the PR updates as you push.

### 7. Merge

When the PR is approved and all checks pass, click **Merge pull request** on GitHub. GitHub merges the branch into `main`. You can then delete the feature branch (GitHub offers this option automatically).

## Reviewing pull requests

As a reviewer, your job is to read the code and provide constructive feedback. Focus on:

- **Correctness** — does the code work as intended?
- **Readability** — is the code clear and consistent?
- **Edge cases** — does it handle errors, empty states, and unusual inputs?
- **Security** — does it expose secrets, accept unsanitised input, or create vulnerabilities?
- **Performance** — does it cause unnecessary re-renders, network calls, or DOM manipulation?

Leave comments that explain *why* something should change, not just *what* to change. "This should use `fetch` instead of `XMLHttpRequest` because..." is more helpful than "Use fetch."

## Forking vs branching

For personal or team projects you own, you **branch** within the same repository. For contributing to projects you do not own (open-source), you **fork** the repository — create your own copy on GitHub — make changes on a branch in your fork, and open a pull request from your fork to the original repository.

```bash
# Fork on GitHub, then clone your fork
git clone https://github.com/your-username/project.git
cd project
git remote add upstream https://github.com/original-owner/project.git
```

The `upstream` remote points to the original repository. You pull from `upstream` to stay current and push to `origin` (your fork) to share your changes.

## Pull request best practices

- **Keep PRs small** — large PRs are hard to review and easy to approve without catching bugs. Aim for under 400 lines changed.
- **Write descriptive titles and descriptions** — reviewers should understand the change before reading the code.
- **Link to issues** — "Closes #42" connects the PR to the issue it solves.
- **Ensure checks pass** — CI tests, linting, and type checks should be green before requesting review.
- **Respond to every comment** — even if you disagree, acknowledge the feedback.
- **Merge when approved** — do not leave approved PRs sitting; merge them promptly.
- **Delete merged branches** — clean up after merging.

## Common mistakes

Opening a PR before pushing — the PR shows no changes because the branch is only local. Opening huge PRs — 2,000-line changes are nearly impossible to review thoroughly. Ignoring review feedback — merging despite unresolved comments creates friction and bugs. Force-pushing during review — this rewrites history and breaks comment threads; avoid it unless necessary.

Another mistake is requesting review before the PR is ready — if tests are failing or the code is half-done, mark it as a draft. And merging without approval — even if you are the owner, getting a second pair of eyes catches mistakes you will miss.

## Best practices

- Use the `main` branch as the stable, deployable baseline — never commit directly to it.
- Create feature branches for every piece of work.
- Open PRs early, even as drafts, to get early feedback.
- Review your own PR before requesting review — fix obvious issues first.
- Use GitHub's "Suggest changes" feature for small edits — it is faster than writing comments.
- Set up branch protection rules to require approvals before merging.
- Use meaningful commit messages — they appear in the PR and become part of the history.
- Squash commits when the history is messy — use "Squash and merge" on GitHub.

## Summary

Pull requests are the collaboration layer on top of Git. The workflow: branch, commit, push, open PR, review, revise, merge. PRs enable code review, discussion, and quality control before changes reach `main`. Small, focused PRs with clear descriptions are easier to review and less likely to introduce bugs. Forking is used for contributing to projects you do not own; branching is used for projects you do. The PR process is how every professional team ensures code quality.

## Practice

Create a feature branch called `feature/footer`, add a footer to your HTML page with navigation links and copyright text, commit it in two focused commits (structure, then styling), and push it to GitHub. Open a pull request with a clear title and description. If you have a collaborator, request their review. If not, review the PR yourself — read through the diff, leave a comment about something you would improve, then merge it. Check that `main` now contains the footer.
