---
title: 'Beginner Projects & GitHub Portfolio Labs'
description: 'Consolidate Level 1 Git & GitHub skills with hands-on practical labs: personal repository initialization, multi-branch feature workflows, Pull Requests, issue management, and building a professional portfolio.'
order: 10
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 50
prerequisites: ['/learn/git/09-basic-collaboration']
---

# Beginner Projects & GitHub Portfolio Labs

To transition from conceptual knowledge to muscle memory, you must actively create repositories, manage branching workflows, resolve issues, open and review Pull Requests, and showcase your work publicly on GitHub.

In this capstone module for Level 1, you will execute 8 practical, real-world labs designed to establish your personal GitHub development environment and build a professional developer portfolio.

```text
┌─────────────────────────────────────────────────────────────┐
│                   Level 1 Practical Labs Matrix             │
├────┬─────────────────────────────┬──────────────────────────┤
│ #  │ Project Lab                 │ Core Capabilities Tested │
├────┼─────────────────────────────┼──────────────────────────┤
│ 1  │ Local Repo Initialization   │ git init, .gitignore     │
│ 2  │ GitHub Remote Publishing    │ git remote, SSH, push -u │
│ 3  │ Feature Branching Workflow  │ git switch -c, atomic cm │
│ 4  │ Pull Request & Self-Review  │ PR diffs, GFM templates  │
│ 5  │ Issue Tracking & Milestones │ Labels, Closes #ID auto  │
│ 6  │ Tagging & GitHub Releases   │ git tag -a, SemVer notes │
│ 7  │ GitHub Profile README       │ Stats badges, GFM layout │
│ 8  │ Developer Portfolio Repo    │ Clean commits, README    │
└────┴─────────────────────────────┴──────────────────────────┘
```

## Lab 1: End-to-End Feature Branch Workflow

### Step-by-Step Execution:

1. **Create an Issue**: On GitHub, create Issue #1: `feat: add responsive navigation bar`.
2. **Create Local Branch**:
   ```bash
   git switch main
   git pull origin main
   git switch -c feature/1-responsive-nav
   ```
3. **Make Atomic Commits**:
   ```bash
   # Make your HTML edits
   git add src/index.html
   git commit -m "feat(nav): add semantic header and nav links"

   # Make your CSS edits
   git add src/styles.css
   git commit -m "style(nav): add mobile flex layout and hamburger toggle"
   ```
4. **Push Branch to Remote**:
   ```bash
   git push -u origin feature/1-responsive-nav
   ```
5. **Open Pull Request**: Navigate to GitHub, open a PR with title `feat(nav): add responsive navigation bar`, include `Closes #1` in description, review your diff, and merge!

## Lab 2: Building Your Public GitHub Profile README

Create a repository with your exact GitHub username (e.g. `https://github.com/<username>/<username>`).

```markdown
# Hi there, I'm Hesam 👋

🚀 **Frontend Engineer & Open Source Enthusiast**
Passionate about building scalable, high-performance web applications with modern Angular, TypeScript, and Vue.

---

### 🛠️ Tech Stack & Tooling
- **Languages**: TypeScript, JavaScript (ESNext), HTML5, Modern CSS/SCSS
- **Frameworks**: Angular 19, Vue 3, Nuxt, React
- **Tools**: Git, GitHub Actions, Vite, esbuild, Playwright, Vitest

---

### 📈 GitHub Statistics
![GitHub Stats](https://github-readme-stats.vercel.app/api?username=HesamPourabbasian&show_icons=true&theme=radical)
```

## Summary & Key Takeaways

- Practical execution turns command memorization into intuitive developer habits.
- Following disciplined feature-branch workflows guarantees a clean, reversible Git history.
- A well-crafted GitHub Profile README acts as your modern digital resume.

## Best Practices & Senior Guidance

1. **Keep Commit Histories Clean**: Never commit broken build code or temporary test logs to public repositories.
2. **Maintain a Daily Commit Rhythm**: Consistent, meaningful open-source contributions build confidence and demonstrate dedication to employers.
