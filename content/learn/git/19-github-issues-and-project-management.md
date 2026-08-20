---
title: 'GitHub Issues, Projects & Agile Kanban'
description: 'Master GitHub project management: issue forms, custom labels, milestones, GitHub Projects (v2), custom fields, interactive Kanban boards, and workflow automation.'
order: 19
difficulty: 'intermediate'
category: 'Level 2 — Intermediate'
estimatedMinutes: 40
prerequisites: ['/learn/git/09-basic-collaboration']
---

# GitHub Issues, Projects & Agile Kanban

Modern software teams coordinate product roadmaps, sprint backlogs, bug tracking, and feature delivery directly inside GitHub using **GitHub Issues** and **GitHub Projects (v2)**.

GitHub Projects provides a spreadsheet-fast, highly customizable project management platform with interactive **Kanban boards**, **Table views**, **Roadmap Gantt charts**, custom metadata fields, and built-in automation rules.

```text
┌─────────────────────────────────────────────────────────────┐
│                 GitHub Agile Project Management             │
│                                                             │
│  Sprint Backlog Kanban Board                                │
│  ┌───────────────┐ ┌───────────────┐ ┌────────────────────┐ │
│  │ Todo (3)      │ │ In Progress(2)│ │ Done (5)           │ │
│  ├───────────────┤ ├───────────────┤ ├────────────────────┤ │
│  │ #102 Cart UI  │ │ #98 Auth PKCE │ │ #95 Setup Vitest   │ │
│  │ #105 Dark Mode│ │ #100 API Retry│ │ #94 ESLint Config  │ │
│  └───────────────┘ └───────────────┘ └────────────────────┘ │
│                                                             │
│  Automation Rules:                                          │
│  - When PR is opened  ──> Move linked issue to In Progress │
│  - When PR is merged  ──> Move linked issue to Done        │
└─────────────────────────────────────────────────────────────┘
```

## 1. Creating Structured Issue Forms (`.github/ISSUE_TEMPLATE/`)

Instead of plain markdown, GitHub supports YAML-based **Issue Forms** with dropdowns, validations, and checkboxes:

```yaml
# .github/ISSUE_TEMPLATE/bug_report.yml
name: 🐛 Bug Report
description: File a reproducible bug report to help us improve.
labels: ["bug", "needs-triage"]
body:
  - type: markdown
    attributes:
      value: Thanks for taking the time to report this bug!
  - type: input
    id: version
    attributes:
      label: Angular / Front-Heaven Version
      placeholder: e.g. 19.0.2
    validations:
      required: true
  - type: textarea
    id: repro
    attributes:
      label: Steps to Reproduce
      placeholder: 1. Go to '/products' ...
    validations:
      required: true
```

## 2. GitHub Projects Custom Views & Automation

- **Table View**: Spreadsheet-like view for bulk editing priorities, estimates, and assignees.
- **Kanban Board**: Drag-and-drop workflow visualizer (Todo -> In Progress -> In Review -> Done).
- **Roadmap View**: Timeline view mapping milestones across quarterly deadlines.

Built-in automations automatically transition cards across columns when Pull Requests are opened, approved, or merged.

## Summary & Key Takeaways

- GitHub Issues track bugs and feature proposals using structured YAML issue forms.
- GitHub Projects (v2) provides customizable Kanban, Table, and Roadmap timeline views.
- Automation workflows synchronize card status with Pull Request lifecycle events.

## Best Practices & Senior Guidance

1. **Use Issue Forms Over Markdown Templates**: YAML issue forms enforce mandatory fields (version, reproduction steps) to eliminate incomplete bug reports.
2. **Tie Sprints to Milestones**: Create GitHub Milestones for every 2-week sprint to track velocity and completion burndown.
