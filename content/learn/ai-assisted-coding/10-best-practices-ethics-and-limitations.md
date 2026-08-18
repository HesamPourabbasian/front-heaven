---
title: 'AI Best Practices, Ethics & Limitations'
description: 'Master professional guidelines for AI coding: Mitigating hallucinations, intellectual property and open-source licenses, privacy protection, and preserving human engineering fundamentals.'
order: 10
difficulty: 'intermediate'
category: 'AI-Assisted Coding'
estimatedMinutes: 25
prerequisites:
  - /learn/ai-assisted-coding/09-agentic-coding-and-mcp-workflows
---

# AI Best Practices, Ethics & Limitations

While AI-assisted coding provides unprecedented productivity gains, responsible software engineering requires a clear understanding of its inherent limitations, security risks, ethical implications, and legal boundaries. An AI model has no genuine understanding of business context, liability, or long-term system maintainability; the human software engineer remains solely accountable for the code deployed to production.

In this capstone lesson, we explore strategies to mitigate **AI hallucinations**, navigate **intellectual property and licensing**, protect proprietary data privacy, and preserve critical engineering problem-solving intuition.

```text
┌────────────────────────────────────────────────────────────┐
│              The Professional AI Developer Contract        │
├────────────────────────────────────────────────────────────┤
│ 1. Complete Accountability: You own every line of code.    │
│ 2. Rigorous Verification: Everything is tested & audited.  │
│ 3. Privacy Preservation: Zero customer data sent to LLMs.  │
│ 4. Foundational Mastery: AI augments, not replaces, skill. │
└────────────────────────────────────────────────────────────┘
```

## 1. Mitigating and Detecting AI Hallucinations

An **AI Hallucination** occurs when a model generates code that appears syntactically plausible but relies on non-existent APIs, invented framework methods, or incorrect architectural assumptions:

```typescript
// ❌ Example of Hallucinated Framework API:
// The AI imagines a method that does not exist in the Vue 3 router:
import { useRouter } from 'vue-router';
const router = useRouter();
router.replaceStateAndReload({ path: '/dashboard' }); // Method does not exist!

// ✅ Verified Native API:
router.replace({ path: '/dashboard' });
```

### Defense Against Hallucinations:
- **Strict TypeScript Type Checking**: Running `tsc --noEmit` immediately flags non-existent methods and invalid property access.
- **Consult Official Documentation**: Verify new or unfamiliar API signatures directly against official framework documentation.

## 2. Intellectual Property & Open-Source Licensing Compliance

Code LLMs are trained on massive corpora of public source code with varying license restrictions (MIT, Apache 2.0, GPL, AGPL):
- **Copyleft Contamination**: If an AI model reproduces a non-trivial snippet from a GPL-licensed project into your proprietary closed-source codebase, it could introduce legal licensing complications.
- **Code Reference Filters**: Enable code attribution and public code matching filters in tools like GitHub Copilot to detect and attribute code matches against public repositories.

## 3. Privacy, Data Confidentiality & Secrets Protection

Never send sensitive corporate or customer data to public AI endpoints:
- **API Keys & Secrets**: Never include `.env` values, private SSH keys, AWS credentials, or OAuth tokens in AI prompts.
- **Personally Identifiable Information (PII)**: Scrub real customer names, emails, credit card numbers, and production database dumps.
- **Enterprise Opt-Out**: Ensure your enterprise accounts configure data opt-out policies so that your proprietary code is not retained or used for future model training.

## 4. Preserving Human Problem-Solving and Engineering Intuition

Relying entirely on AI to solve every problem can lead to cognitive atrophy—a decline in your ability to reason through algorithms, debug complex systems without assistance, or architect scalable applications.

### The Balanced Developer Mindset:
- **Use AI for Acceleration, Not as a Crutch**: Use AI to draft boilerplate, explore alternatives, and speed up testing, but regularly practice writing algorithms, reading specification docs, and designing architectures manually.
- **Deeply Understand Every Line**: If you do not understand why an AI-suggested line of code works, take the time to research it before merging.

## Summary

- Developers retain full legal, ethical, and technical responsibility for all AI-generated code committed to production.
- TypeScript compiler checks and automated tests protect against AI hallucinations and non-existent APIs.
- Code attribution filters and license awareness prevent open-source license contamination.
- Proprietary corporate secrets, API keys, and customer PII must never be shared with public AI models.
- True engineering mastery comes from pairing AI productivity with strong foundational knowledge of computer science and browser internals.

## Best Practices

1. **Verify Before You Commit**: Read, understand, and test every proposed line of code before merging into the main branch.
2. **Scrub All Private Credentials**: Keep `.env` files and sensitive API tokens out of prompts.
3. **Run Automated CI Checks on All AI Output**: Ensure linters, type checks, and test suites pass automatically in CI.
4. **Never Stop Learning Fundamentals**: Continue studying core JavaScript runtime mechanics, browser rendering pipelines, and software design patterns.
