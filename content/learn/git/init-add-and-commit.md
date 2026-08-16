---
title: 'Init, add, and commit'
description: 'The three commands that form the core of every Git workflow. Learn how to create a repository, stage changes, and record snapshots of your work.'
order: 3
difficulty: 'beginner'
category: 'Fundamentals'
estimatedMinutes: 25
prerequisites:
  - learn/git/installing-and-configuring-git
---

## Introduction

Every Git workflow begins with three commands: `git init`, `git add`, and `git commit`. Together they form the cycle that records your work: create a repository, choose which changes to record, and create a snapshot. These three commands are the foundation that everything else builds on — branching, merging, pushing, pulling — and understanding them deeply makes everything else easier.

This lesson teaches each command in detail, explains what happens under the hood, and introduces the mental model that makes Git predictable rather than mysterious.

## Creating a repository: git init

A **repository** (or **repo**) is a project folder that Git is tracking. To start one, navigate to your project folder and run:

```bash
cd my-project
git init
```

Git creates a hidden `.git` directory inside `my-project`. This folder contains the entire history database — every commit, every branch, every configuration override. Your project files are untouched: Git has not modified them, copied them, or changed them in any way. It has simply prepared a tracking structure.

To confirm it worked:

```bash
git status
```

You will see something like:

```
On branch main

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        index.html
        style.css

nothing added to commit but untracked files present
```

`git status` is the most important command in Git. It tells you three things: which branch you are on, whether you have staged changes, and whether you have unstaged changes. Get into the habit of running it frequently — it is your compass.

## The three zones

Before we stage and commit, let's solidify the three-zone model from the previous lesson:

1. **Working tree** — the files you edit in your code editor. This is the live, current state.
2. **Staging area** — a preparation zone. You move changes here when you are ready to include them in the next commit.
3. **Repository** (`.git`) — the permanent history. Once committed, snapshots live here.

The flow is: edit files → stage changes → commit. Git does not record anything until you explicitly commit, and it does not include anything in the commit unless you explicitly stage it. This two-step process (stage, then commit) is deliberate — it gives you precise control over what goes into each snapshot.

## Staging changes: git add

When you have made changes and want to record them, you first tell Git which files to include:

```bash
git add index.html
```

This moves the current version of `index.html` into the staging area. The file itself is not changed — Git simply marks it as "ready to commit." You can stage multiple files:

```bash
git add index.html style.css script.js
```

Or stage everything in the current directory:

```bash
git add .
```

The dot means "all changed and new files in the current directory and subdirectories." Use it when you want to commit everything at once. For precise commits, stage specific files — this is one of Git's superpowers. You might fix a bug and add a feature in the same editing session, but you can stage them separately and create two commits: one for the fix, one for the feature.

Check what is staged with:

```bash
git status
```

Staged files appear under "Changes to be committed." Unstaged changes appear under "Changes not staged for commit."

## Committing: git commit

A **commit** is a snapshot of your staged changes. Create one with:

```bash
git commit -m "Add initial HTML structure"
```

The `-m` flag passes the message directly on the command line. Git creates a new commit, assigns it a unique hash (like `a1b2c3d4e5f6`), points it to the previous commit (or nothing if this is the first), and stores the snapshot in the `.git` folder.

Without `-m`, Git opens your configured text editor for you to write a longer message. This is preferred for complex changes that need explanation.

After committing, check the status:

```bash
git status
```

It will say "nothing to commit, working tree clean" — your working tree, staging area, and latest commit are all in sync.

## Viewing history: git log

To see the commits you have made:

```bash
git log
```

This shows a list of commits, newest first, with the hash, author, date, and message. The output looks like:

```
commit a1b2c3d4e5f6 (HEAD -> main)
Author: Your Name <your.email@example.com>
Date:   Mon Aug 14 10:30:00 2026 +0000

    Add initial HTML structure

commit b7c8d9e0f1a2
Author: Your Name <your.email@example.com>
Date:   Mon Aug 14 10:00:00 2026 +0000

    Initial commit
```

For a compact view:

```bash
git log --oneline
```

This shows one line per commit — the hash prefix and the message. Useful for scanning history quickly.

## What happens when you commit

Under the hood, Git does something elegant. Each commit stores:

- A pointer to the previous commit (forming a chain)
- The complete snapshot of every tracked file at that moment
- Metadata: author, date, message, and a unique hash

The hash is derived from the file contents, so identical content always produces the same hash. If a file has not changed between commits, Git does not duplicate it — it reuses the same object. This makes Git fast and storage-efficient even for projects with thousands of commits.

The chain of commits forms a timeline. Each commit knows its parent, so Git can walk backwards through history, compare any two commits, and reconstruct the state of your project at any point in time.

## The .gitignore file

Not everything in your project should be tracked. Dependencies (`node_modules/`), environment files (`.env` with API keys), build outputs (`dist/`), and operating system files (`.DS_Store` on macOS) should be ignored. Create a `.gitignore` file in your project root:

```
# Dependencies
node_modules/

# Environment
.env
.env.local

# Build output
dist/
build/

# OS files
.DS_Store
Thumbs.db

# Editor
.vscode/
.idea/
```

Git skips these files entirely — they will not appear in `git status`, and `git add .` will not stage them. The `.gitignore` file itself is tracked, so it is shared with anyone who clones your repository.

A common mistake is committing sensitive files (like `.env`) before adding them to `.gitignore`. Once a file is committed, it is in the history — adding it to `.gitignore` only prevents *future* tracking. You would need to remove it from history with `git rm --cached` to truly untrack it.

## Writing good commit messages

A commit message answers two questions: *what* changed and *why*. The first line is a short summary (50 characters or fewer, imperative mood: "Add", "Fix", "Update", not "Added" or "Fixes"). If more detail is needed, leave a blank line after the first line and write a paragraph explaining the context.

```
Add contact form validation

Validate email and phone fields on submit. Uses regex for email
and a minimum length check for phone. Error messages appear
below each field in red.
```

Good messages help you and your team understand the project's history without reading the code. Bad messages ("fixed bug", "update", "asdf") are worse than useless — they are noise.

## Common mistakes

Forgetting `git add` before committing — Git only commits what is staged, so your changes remain in the working tree, unstaged and unrecorded. Running `git add .` too aggressively — staging everything means you cannot create focused, single-purpose commits. Committing without a message — Git requires one; omitting `-m` opens the editor, which surprises beginners who expected an automatic message.

Another classic: committing `.env` files, API keys or passwords. These should never be tracked. Use `.gitignore` from the start and double-check with `git status` before every commit. A final mistake is treating commits as saves — they are *intentional snapshots*, not automatic checkpoints. Commit when you have completed a logical unit of work, not after every keystroke.

## Best practices

- Run `git status` before every `add` and every `commit` — know what you are staging.
- Stage specific files for focused commits: `git add file1 file2`.
- Use `git add .` only when you genuinely want to commit everything.
- Write commit messages in imperative mood: "Add feature" not "Added feature".
- Keep the first line under 50 characters; explain in the body if needed.
- Create a `.gitignore` at the start of every project, before any commits.
- Never commit secrets, keys, passwords, or `.env` files.
- Commit after completing a logical unit of work — not too frequently, not too rarely.

## Summary

`git init` creates a repository by adding a `.git` folder to your project. `git add` moves changes from the working tree to the staging area. `git commit` creates a snapshot of the staged changes and stores it permanently in the repository's history. The `.gitignore` file tells Git which files to skip. Good commit messages explain what changed and why. These three commands — init, add, commit — form the core loop of every Git workflow, and mastering them makes every subsequent command more intuitive.

## Practice

Create a new folder called `git-playground`, run `git init`, and create three files: `index.html`, `style.css`, and `app.js`. Add a heading to `index.html` and a basic rule to `style.css`. Stage both files and commit with the message "Add initial HTML and CSS". Then add a script to `app.js`, stage only that file, and commit with "Add JavaScript entry point". Run `git log --oneline` to see your two commits. Now modify `index.html` and run `git status` — notice the change appears under "not staged." Stage and commit it. You now have three commits forming a clean history.
