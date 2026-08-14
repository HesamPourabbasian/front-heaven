---
title: Remote repositories and GitHub
description: Share your code with the world, collaborate across distances and keep your work safe off your machine — the GitHub essentials.
order: 5
difficulty: beginner
category: Collaboration
estimatedMinutes: 30
prerequisites:
  - learn/git/branches-and-merging
---

## Introduction

So far, everything you have done with Git has been local — your repository lives on your machine, and only you can see it. But the real power of Git is collaboration: sharing code with teammates, contributing to open-source projects, and backing up your work on a server. **GitHub** is the platform where most of this happens. It hosts Git repositories online, adds collaboration features like pull requests and issues, and connects to deployment tools.

This lesson teaches you how to connect your local Git repository to GitHub, push your commits to the cloud, pull changes from others, and manage remote repositories. By the end, your code will live in two places — your machine and GitHub — and you will be able to share it with anyone.

## What is a remote?

A **remote** is a version of your repository that lives on another machine — typically a server like GitHub. Your local repository can connect to multiple remotes, but the most common is called `origin`, which points to the GitHub repository you cloned from or pushed to.

When you clone a repository from GitHub with `git clone`, Git automatically sets up `origin` as a remote pointing back to that URL. When you create a new repository locally and want to connect it to GitHub, you add the remote manually.

## Creating a repository on GitHub

Go to [github.com](https://github.com), sign in, and click the **+** icon in the top right → **New repository**. Choose a name (matching your local project name is conventional), add a description if you want, and select whether it should be public or private. **Do not** initialise it with a README, `.gitignore`, or licence — your local repository already has history, and initialising on GitHub creates a commit that conflicts with yours.

After creating the repository, GitHub shows you the URL — copy the HTTPS URL (like `https://github.com/username/repo-name.git`). You will need it in the next step.

## Connecting a local repository to GitHub

If you already have a local repository, add the remote:

```bash
git remote add origin https://github.com/username/repo-name.git
```

Verify it was added:

```bash
git remote -v
```

Output:

```
origin  https://github.com/username/repo-name.git (fetch)
origin  https://github.com/username/repo-name.git (push)
```

`origin` is the name; the URL is where Git sends and receives data. You can add more remotes with different names (e.g., `upstream` for the original repo when forking an open-source project), but `origin` is the convention for your main remote.

## Pushing to GitHub

**Pushing** sends your local commits to the remote:

```bash
git push origin main
```

This uploads the `main` branch and all its commits to GitHub. If this is the first push, Git may ask you to set the upstream branch:

```bash
git push -u origin main
```

The `-u` flag sets `origin main` as the default upstream, so future pushes can use just `git push`. After this, your code is on GitHub — anyone with access can see it, clone it, and contribute to it.

For feature branches, push them too:

```bash
git push -u origin feature-contact-form
```

This creates the branch on GitHub so others can see it, and you can create a pull request from it.

## Cloning a repository

**Cloning** downloads a complete copy of a remote repository — all files, all history, all branches — to your machine:

```bash
git clone https://github.com/username/repo-name.git
```

Git creates a folder called `repo-name`, sets up `origin` as a remote, checks out the `main` branch, and links it to the remote. You are ready to work immediately. Cloning is how you start working on any existing project: open-source libraries, team projects, or your own repository on a new machine.

## Pulling changes

**Pulling** downloads commits from the remote and integrates them into your local branch:

```bash
git pull origin main
```

This fetches the latest commits from `origin/main` and merges them into your local `main`. If you have local changes, Git will try to merge automatically. If there are conflicts, you resolve them the same way as branch merges.

A safer workflow separates fetching and merging:

```bash
git fetch origin
git log origin/main --oneline   # review what changed
git merge origin/main           # merge when ready
```

`git fetch` downloads changes without applying them — you can inspect what changed before deciding to merge. This is the preferred approach when working with a team, because it gives you a chance to review before integrating.

## Fetching vs pulling

The difference matters:

- **`git fetch`** — downloads new data from the remote but does not change your working tree. It is always safe.
- **`git pull`** — fetches *and* merges in one step. Convenient but can cause unexpected conflicts if you have local changes.

Use `fetch` when you want to see what is new before integrating. Use `pull` when you are confident your local branch is clean and up to date. Many professionals default to `fetch` + `merge` for the control it provides.

## Pushing branches and tracking

When you push a branch for the first time with `-u`, Git sets up **tracking** — it remembers that your local `feature-contact-form` corresponds to `origin/feature-contact-form`. After that, you can simply type:

```bash
git push
git pull
```

Git knows which remote and branch to use. Without tracking, you must specify the remote and branch name every time.

Check which branches are tracking with:

```bash
git branch -vv
```

The output shows each branch and its upstream:

```
* feature-contact-form a1b2c3d [origin/feature-contact-form] Add contact form
  main                 b7c8d9e [origin/main] Initial commit
```

## Viewing remote branches

To see what branches exist on the remote:

```bash
git branch -r
```

To see all branches (local and remote):

```bash
git branch -a
```

Remote branches are prefixed with `origin/`. They are read-only snapshots — you cannot edit them directly; you work on a local branch that tracks the remote one.

## SSH vs HTTPS

GitHub supports two authentication methods for Git operations:

- **HTTPS** — simpler to set up, works through firewalls, but requires a personal access token (PAT) instead of a password for command-line operations.
- **SSH** — uses a public/private key pair, does not require re-entering credentials, and is the preferred method for frequent use.

To set up SSH:

```bash
ssh-keygen -t ed25519 -C "your.email@example.com"
```

This creates a key pair in `~/.ssh/`. Add the public key to your GitHub account under Settings → SSH and GPG keys. Then change your remote URL:

```bash
git remote set-url origin git@github.com:username/repo-name.git
```

After this, Git uses SSH authentication automatically — no tokens, no passwords, no browser prompts.

## The .gitignore and GitHub

Your `.gitignore` file is tracked by Git and shared with anyone who clones your repository. When you push to GitHub, the `.gitignore` rules apply to everyone who clones or forks your project. This is how team-wide ignore rules work — one file, enforced everywhere.

Make sure sensitive files (`.env`, API keys, credentials) are in `.gitignore` *before* your first commit. Once a secret is committed and pushed, it is in the history and accessible to anyone with repository access. Rotate the secret immediately if this happens.

## Common mistakes

Pushing to `main` directly instead of using branches and pull requests — this bypasses code review and risks breaking the main branch. Forgetting to push feature branches — you work locally for days and the backup does not exist on GitHub. Not tracking branches — pushing without `-u` means you must specify the remote and branch every time.

Another mistake is pulling when you have uncommitted changes — Git will refuse or create a messy merge. Always commit or stash before pulling. And using HTTPS without setting up credential caching — you will be prompted for your token on every push, which becomes tedious. Set up SSH or configure a credential helper.

## Best practices

- Create the GitHub repository *after* your first local commit — not before.
- Push every branch you care about — it is your off-machine backup.
- Use `git fetch` + `git merge` instead of `git pull` for more control.
- Set up SSH authentication to avoid repeated token entry.
- Keep `.gitignore` comprehensive — add it before your first commit.
- Never commit secrets; rotate immediately if you accidentally do.
- Use descriptive branch names on GitHub so collaborators understand the work.
- Check `git remote -v` to confirm you are pushing to the right repository.

## Summary

A remote is a version of your repository hosted elsewhere, typically GitHub. `git remote add` connects a local repo to GitHub; `git push` sends commits; `git pull` fetches and merges; `git fetch` downloads without merging. Cloning downloads a complete repository. Branches can be pushed independently and tracked for convenient `git push`/`git pull` commands. SSH provides passwordless authentication; HTTPS uses tokens. The `.gitignore` file is shared across all clones, enforcing consistent ignore rules.

## Practice

Create a new repository on GitHub (public, no README). In your terminal, create a new folder called `github-practice`, initialise Git, create an HTML file, commit it, and push it to GitHub. Verify the code appears on GitHub. Then clone a public repository (any open-source project you find interesting) to a different folder and explore its commit history with `git log --oneline`. Check its `.gitignore` to see what it excludes. Finally, make a change to your `github-practice` repository, push it, and confirm the change appears on GitHub.
