---
title: 'Installing and configuring Git'
description: 'Get Git running on your machine and set up your identity, editor and defaults — the essential first step before any real work.'
order: 2
difficulty: 'beginner'
category: 'Fundamentals'
estimatedMinutes: 20
prerequisites:
  - learn/git/what-is-version-control
---

## Introduction

Before you can use Git, you need to install it on your computer and tell it a few things about you. Git is a command-line tool — you type commands in a terminal, and Git responds. It runs on every operating system: macOS, Windows and Linux. The installation is quick, and the configuration takes five minutes, but skipping it creates annoying problems later: commits without a name, the wrong text editor opening when you try to write a message, and confusing line-ending differences between operating systems.

This lesson walks you through installing Git, verifying it works, and configuring the settings every developer needs before writing their first commit.

## Installing Git

### macOS

The simplest way to install Git on macOS is through the terminal. Open **Terminal** (found in Applications → Utilities) and type:

```bash
git --version
```

If Git is already installed (common on modern macOS), you will see a version number like `git version 2.44.0`. If it is not installed, macOS will prompt you to install the Xcode Command Line Tools — follow the dialog, and Git will be included. Alternatively, if you use Homebrew, you can install it directly:

```bash
brew install git
```

### Windows

Download the installer from [git-scm.com](https://git-scm.com/download/win). Run it and accept the defaults — the installer includes Git Bash, a terminal that provides a Unix-like environment on Windows, which is where you should run Git commands. Avoid using Git from PowerShell or Command Prompt until you are comfortable, because path handling and line endings behave differently there.

### Linux

Most Linux distributions include Git or have it in the package manager:

```bash
# Ubuntu / Debian
sudo apt-get install git

# Fedora
sudo dnf install git

# Arch
sudo pacman -S git
```

After installation, verify it worked:

```bash
git --version
```

## Setting your identity

Git embeds your name and email in every commit you make. This is not optional — Git will refuse to commit without it. Set these globally (for all projects on your machine) with:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

Use the name you want associated with your commits — your real name or a consistent handle. The email should match your GitHub account email if you plan to push to GitHub, because GitHub uses it to link commits to your profile. Check your current settings with:

```bash
git config --global user.name
git config --global user.email
```

## Choosing your text editor

Git opens a text editor when you write commit messages, resolve merges, and perform other tasks. The default varies by system — it might be Vim (confusing for beginners), Nano, or something else. If you use VS Code, set it as your Git editor:

```bash
git config --global core.editor "code --wait"
```

For other editors:

```bash
# Nano
git config --global core.editor "nano"

# Vim
git config --global core.editor "vim"

# Sublime Text
git config --global core.editor "subl -n -w"
```

This setting saves frustration: when Git opens an editor, it will be the one you already know.

## Setting the default branch name

When you create a new repository, Git creates an initial branch. Historically, this was called `main` (or `master` on older systems). To ensure consistency, set the default branch name to `main`:

```bash
git config --global init.defaultBranch main
```

This small setting prevents confusion when switching between projects or following tutorials that assume the `main` branch.

## Configuring line endings

Windows and macOS/Linux handle line endings differently. Windows uses `\r\n` (carriage return + line feed); Unix uses `\n` (just line feed). Git can automatically convert between them, which prevents diffs that show every line changed when only one actually did.

On macOS or Linux:

```bash
git config --global core.autocrlf input
```

On Windows:

```bash
git config --global core.autocrlf true
```

This setting tells Git to convert line endings on checkout (when you switch branches or pull) and convert them back on commit, keeping the repository consistent regardless of which operating system committed the change.

## Enabling colour

Git output is easier to read with colour. Most modern terminals support it, and Git enables it by default — but if it is off, turn it on:

```bash
git config --global color.ui auto
```

## The global configuration file

All `--global` settings are stored in a single file, usually at `~/.gitconfig`. You can edit it directly:

```bash
git config --global --list
```

This shows every global setting. A typical file looks like:

```
[user]
    name = Your Name
    email = your.email@example.com
[core]
    editor = code --wait
    autocrlf = input
[init]
    defaultBranch = main
[color]
    ui = auto
```

You can edit this file in any text editor, but using `git config` is safer because it validates the syntax.

## Per-project configuration

Some settings should differ between projects. Git supports local (per-repository) configuration that overrides global settings:

```bash
# Set a different email for a work project
git config user.email "work@company.com"
```

Without `--global`, this setting applies only to the current repository. Common uses: different email addresses for personal and work projects, different merge tools, or project-specific aliases.

## Verifying your setup

Run this quick check to confirm everything is configured:

```bash
git config --global --list
```

You should see your name, email, editor, default branch, and line-ending settings. If anything is missing or wrong, re-run the relevant `git config` command — it overwrites the previous value.

## Common mistakes

The most common mistake is skipping configuration and getting confusing errors later. If you see `Author identity unknown` when you try to commit, it means your name or email is not set. Another mistake is using a different email for Git than for your GitHub account — your commits will not link to your GitHub profile, and contribution graphs will be empty. A third mistake is forgetting `--global` and having to re-run the command in every new repository.

Beginners also sometimes set `core.editor` to a command that does not exist on their system, causing Git to hang or error when trying to open an editor. If that happens, verify the command works in your terminal before setting it.

## Best practices

- Install Git from the official source or your system package manager — avoid random download sites.
- Set your name and email immediately after installation; do not wait until Git complains.
- Use the same email as your GitHub account so commits link to your profile.
- Set your preferred text editor so commit messages are not a struggle.
- Use `init.defaultBranch main` to stay consistent with modern conventions.
- Configure line endings once and never think about it again.
- Check your global config periodically: `git config --global --list`.
- On shared or work computers, use per-project email settings if needed.

## Summary

Git is installed through your operating system's package manager or the official installer. After installation, four global settings are essential: your name and email (for commit identity), your text editor (for commit messages), the default branch name (`main`), and line-ending handling (`autocrlf`). These settings live in `~/.gitconfig` and can be overridden per project. With Git installed and configured, you are ready to create your first repository.

## Practice

Install Git if you have not already, then open a terminal and configure your identity, editor, default branch and line endings. Verify with `git config --global --list`. Then create a temporary folder called `git-practice`, navigate into it, and run `git init` — just to confirm that Git is working. You will learn exactly what `git init` does in the next lesson. For now, the goal is simple: confirm that typing `git --version` returns a version number, and that `git config --global user.name` returns your name.
