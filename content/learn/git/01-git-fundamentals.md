---
title: 'Git Fundamentals & Identity'
description: 'Master core Git foundations: what version control is, Git vs GitHub, distributed architecture, installation, git config identity, aliases, and built-in help systems.'
order: 1
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 35
prerequisites: []
---

# Git Fundamentals & Identity

In modern software engineering, tracking the evolution of source code is as critical as writing the code itself. **Git** is a free, open-source, distributed version control system (DVCS) designed to handle everything from small hobby projects to massive enterprise codebases with speed, data integrity, and support for non-linear distributed workflows.

Created by Linus Torvalds in 2005 to manage the development of the Linux kernel, Git replaced older centralized systems like CVS and Subversion (SVN). Unlike centralized version control systems where developers connect to a single central server to view history or commit changes, Git is fully distributed: every developer's local machine holds a complete clone of the entire repository history, including every commit, branch, and tag ever created.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Centralized vs Distributed VCS              │
├──────────────────────────────┬──────────────────────────────┤
│ Centralized VCS (SVN, CVS)   │ Distributed VCS (Git)        │
├──────────────────────────────┼──────────────────────────────┤
│ ┌──────────────────────────┐ │ ┌──────────────────────────┐ │
│ │  Central Server History  │ │ │ GitHub / GitLab Remote   │ │
│ └──────────────────────────┘ │ └──────────────────────────┘ │
│      ▲      ▲      ▲         │        ▲     ▲      ▲        │
│      │      │      │         │   Push │     │ Pull │ Clone  │
│      ▼      ▼      ▼         │        ▼     ▼      ▼        │
│  [Dev 1] [Dev 2] [Dev 3]     │ ┌──────┐  ┌──────┐  ┌──────┐ │
│ (Working copies only. Offline│ │Dev 1 │  │Dev 2 │  │Dev 3 │ │
│  commits impossible.)        │ │(Full)│  │(Full)│  │(Full)│ │
│                              │ └──────┘  └──────┘  └──────┘ │
│                              │ (Complete offline history)   │
└──────────────────────────────┴──────────────────────────────┘
```

## Git vs GitHub: Clarifying the Distinction

A universal point of confusion for beginners is the difference between Git and GitHub:
- **Git** is a command-line tool and version control engine installed on your operating system. It tracks file changes locally on your machine without requiring internet access.
- **GitHub** is a cloud-based hosting platform and collaboration portal for Git repositories. It provides remote cloud backup, Pull Request workflows, issue tracking, continuous integration (GitHub Actions), and code review tools.

Alternative Git hosting platforms include GitLab, Bitbucket, and self-hosted instances like Gitea. Git remains completely independent of which cloud platform you choose.

## Installing Git

Git is available natively across macOS, Linux, and Windows:

```bash
# macOS (using Homebrew)
brew install git

# Linux (Debian / Ubuntu)
sudo apt update && sudo apt install git -y

# Verify installation and active version
git --version
```

## Configuring Git Identity (`git config`)

Before creating your first commit, Git requires your author name and email address. Every commit you create records this metadata permanently in the history log.

Git configuration operates across three distinct scopes:
1. **System (`--system`)**: Applies to all users and repositories on the entire operating system (`/etc/gitconfig`).
2. **Global (`--global`)**: Applies to all repositories under your user account (`~/.gitconfig`).
3. **Local (`--local`)**: Applies strictly to the current repository (`.git/config`).

```bash
# Set your global commit author name and email
git config --global user.name "Hesam Pourabbasian"
git config --global user.email "hesam@front-heaven.com"

# Configure modern default branch name to 'main'
git config --global init.defaultBranch main

# Configure line ending normalization (input for Mac/Linux, true for Windows)
git config --global core.autocrlf input

# Verify current global configuration values
git config --global --list
```

## Creating Time-Saving Git Aliases

Git allows you to configure shell shortcuts called aliases to speed up your daily terminal workflow:

```bash
# Create helpful shortcuts
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.cm "commit -m"
git config --global alias.lg "log --oneline --graph --decorate --all"
```

Now typing `git st` executes `git status`, and `git lg` displays a color-coded ASCII graph of your entire repository commit history.

## Built-In Help & Documentation

Git comes bundled with comprehensive manual pages accessible offline directly in your terminal:

```bash
# General help overview
git help

# Detailed manual page for a specific command
git help commit
# or:
git commit --help
```

## Summary & Key Takeaways

- Git is a distributed version control system; every local repository possesses the complete commit history.
- Git is the local CLI engine; GitHub is a cloud hosting and collaboration platform for Git repositories.
- `git config` sets author metadata (`user.name`, `user.email`) across system, global, and local scopes.
- Setting `init.defaultBranch main` ensures all newly created repositories adhere to modern naming conventions.
- Built-in aliases (`git config --global alias.<name> <cmd>`) dramatically accelerate daily developer workflows.

## Best Practices & Senior Guidance

1. **Use Your Real Work / GitHub Email**: Ensure `user.email` matches the verified email address in your GitHub account so commits link to your profile and contribute to your activity graph.
2. **Never Commit with Generic Names**: Avoid setting `user.name "admin"` or `user.email "root@localhost"`, which destroys traceability in team codebases.
3. **Set Default Editor Explicitly**: Configure your preferred terminal editor (e.g. `git config --global core.editor "code --wait"` or `nano`) to prevent terminal freezing during interactive commit editing.
