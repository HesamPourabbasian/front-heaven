---
title: 'AI Code Review, Security Auditing & PR Summaries'
description: 'Use AI as an automated security auditor: Detecting Cross-Site Scripting (XSS), Regular Expression Denial of Service (ReDoS), secret leaks, automated PR summaries, and catching hallucinated packages.'
order: 8
difficulty: 'intermediate'
category: 'AI-Assisted Coding'
estimatedMinutes: 25
prerequisites:
  - /learn/ai-assisted-coding/07-code-refactoring-and-modernization
---

# AI Code Review, Security Auditing & PR Summaries

Peer code reviews are essential for maintaining engineering standards, but busy developers can miss subtle edge-case security vulnerabilities, unhandled error states, and accidental secret leaks. AI tools can act as an automated first-line reviewer, analyzing pull request diffs, auditing security vulnerabilities, and drafting clear pull request summaries.

In this lesson, we explore how to use AI to detect **XSS vulnerabilities**, **ReDoS attacks**, leaked environment credentials, and how to verify third-party package authenticity.

```text
┌────────────────────────────────────────────────────────────┐
│              The AI Code Review & Security Gate            │
├────────────────────────────────────────────────────────────┤
│ Pull Request Diff Submitted                                │
│       │                                                    │
│       ▼ (AI Reviewer Prompt / CI Action)                   │
│ ├── 1. Security Scan (XSS, ReDoS, Secret Exposure)         │
│ ├── 2. Accessibility Scan (Missing alt, ARIA traps)        │
│ ├── 3. Package Verification (Hallucinated package check)   │
│ └── 4. Formatted PR Summary & Review Comments Drafted      │
└────────────────────────────────────────────────────────────┘
```

## 1. Catching Front-End Security Vulnerabilities

Prompt AI to perform dedicated security reviews on new pull request diffs:

```vue
<!-- Vulnerable Code Example -->
<template>
  <div v-html="userComment"></div>
</template>

<script setup>
defineProps({ userComment: String });
</script>
```

### AI Security Audit Finding:
> **[Critical Security Finding: Stored / DOM XSS]**
> `v-html="userComment"` renders untrusted user input directly into the DOM without sanitization. An attacker can inject `<img src=x onerror="stealSessionCookie()">` to compromise user accounts.
>
> **Remediation**:
> Sanitize the HTML string using `DOMPurify.sanitize(userComment)` or render plain text using standard `{{ userComment }}` interpolation.

## 2. Detecting Regular Expression Denial of Service (ReDoS)

Insecure regular expressions with nested quantifiers (e.g., `(a+)+$`) can cause exponential backtracking, freezing the browser main thread and crashing user tabs when fed maliciously crafted strings:

```typescript
// ❌ Dangerous ReDoS Regex: (a+)+$ on input "aaaaaaaaaaaaaaaaaaaaa!" locks CPU
const BAD_REGEX = /^([a-zA-Z0-9]+)+$/;

// ✅ AI Remediation: Linear time regex without ambiguous catastrophic backtracking
const SAFE_REGEX = /^[a-zA-Z0-9]+$/;
```

## 3. Detecting Hallucinated npm Packages (Slopsquatting Defense)

LLMs can occasionally suggest non-existent npm packages (e.g., `npm install vue-use-awesome-carousel`). Attackers take advantage of this by registering these hallucinated package names on npm with malicious payloads (**Package Hallucination / Slopsquatting**).

### Security Verification Checklist:
1. Check the package on `https://www.npmjs.com` before installing.
2. Verify weekly download volume, maintainer reputation, and GitHub repository activity.
3. Use well-established community utilities (`@vueuse/core`, `date-fns`, `lodash-es`) rather than obscure single-purpose packages.

## 4. Automated Pull Request Summaries

Generate concise, professional PR descriptions from git diffs:

```markdown
### Summary of Changes:
- **feat(checkout)**: Added support for discount coupon codes with real-time Zod validation.
- **fix(cart)**: Resolved item count race condition by introducing an `AbortController` in `useCart`.
- **test**: Added Vitest unit tests achieving 95% coverage on pricing calculations.

### Breaking Changes:
- None. All public interfaces maintain backward compatibility.
```

## Summary

- AI performs automated first-pass code reviews to catch vulnerabilities, missing error handlers, and a11y issues.
- Security audits detect DOM XSS vulnerabilities, catastrophic ReDoS regex patterns, and hardcoded API tokens.
- Developers must verify that proposed npm packages are real and trustworthy to prevent package hallucination exploits.
- AI generates structured, professional Pull Request summaries that improve team communication.

## Best Practices

1. **Perform Dedicated Security-Focused Prompts**: Ask specifically: *"Review this code exclusively for security vulnerabilities, memory leaks, and injection vectors."*
2. **Never Paste Proprietary Production Secrets**: Ensure `.env` tokens, AWS keys, and private customer data are scrubbed before prompt submission.
3. **Verify Every Suggested npm Package**: Check npm download statistics and source repositories before running `npm install`.
4. **Treat AI as a Pre-Reviewer, Not a Replacement for Humans**: Human engineering approval remains mandatory for every production merge.
