---
title: 'GitHub Authentication: SSH Keys & Access Tokens'
description: 'Master GitHub authentication: SSH key generation (ssh-keygen), Ed25519 cryptography, adding SSH keys to GitHub, Personal Access Tokens (PAT), and credential helpers.'
order: 8
difficulty: 'beginner'
category: 'Level 1 — Beginner'
estimatedMinutes: 35
prerequisites: ['/learn/git/07-github-basics']
---

# GitHub Authentication: SSH Keys & Access Tokens

In August 2021, GitHub permanently deprecated account password authentication for all Git operations in favor of cryptographic authentication. Today, developers must authenticate using either **SSH Keys** (Secure Shell) or **Personal Access Tokens (PAT)** over HTTPS.

Mastering cryptographic authentication using modern **Ed25519** SSH keys allows you to push and pull code securely without ever typing your password or token in terminal prompts.

```text
┌─────────────────────────────────────────────────────────────┐
│                 SSH Asymmetric Cryptography                 │
│                                                             │
│  Local Developer Machine             GitHub Cloud Server    │
│  ┌─────────────────────────┐         ┌────────────────────┐ │
│  │ Private Key (id_ed25519)│         │ Public Key (.pub)  │ │
│  │ (STRICTLY CONFIDENTIAL) │         │ (Uploaded to       │ │
│  │ Encrypted on your disk  │         │  GitHub Settings)  │ │
│  └─────────────────────────┘         └────────────────────┘ │
│               │                                │            │
│               └────────── Cryptographic ───────┘            │
│                            Handshake                        │
│               (Proves identity without transmitting key)    │
└─────────────────────────────────────────────────────────────┘
```

## 1. Generating Modern SSH Keys (`Ed25519`)

The **Ed25519** algorithm is the current gold standard in asymmetric cryptography, providing superior security and performance compared to legacy RSA keys:

```bash
# Generate a new Ed25519 SSH key pair with your GitHub email as a comment
ssh-keygen -t ed25519 -C "hesam@front-heaven.com"

# Press Enter to accept default file location (~/.ssh/id_ed25519)
# Enter a secure passphrase for key encryption
```

This creates two files in `~/.ssh/`:
- `id_ed25519`: Your **Private Key**. NEVER share, upload, or email this file!
- `id_ed25519.pub`: Your **Public Key**. This is the key you safely upload to GitHub.

## 2. Adding the SSH Key to the SSH Agent

The SSH Agent caches your decrypted private key in memory so you do not have to enter your passphrase on every single `git push`:

```bash
# Start the SSH agent in the background
eval "$(ssh-agent -s)"

# Add your private key to the agent
ssh-add ~/.ssh/id_ed25519
```

## 3. Adding Public Key to GitHub

Copy the contents of your public key file to your clipboard:

```bash
# macOS
pbcopy < ~/.ssh/id_ed25519.pub

# Linux (with xclip)
xclip -selection clipboard < ~/.ssh/id_ed25519.pub

# Windows (Git Bash)
clip < ~/.ssh/id_ed25519.pub
```

1. Navigate to **GitHub Settings -> SSH and GPG keys**.
2. Click **New SSH Key**.
3. Set Title (e.g. `MacBook Pro Work M3`) and paste the public key string starting with `ssh-ed25519`.
4. Click **Add SSH Key**.

### Testing the SSH Connection

```bash
ssh -T git@github.com
# Expected response: "Hi username! You've successfully authenticated, but GitHub does not provide shell access."
```

## 4. Personal Access Tokens (Fine-Grained PATs)

When interacting with GitHub over HTTPS (or inside CI/CD automation and scripts), use **Fine-Grained Personal Access Tokens**:
1. Navigate to **GitHub Settings -> Developer Settings -> Personal Access Tokens -> Fine-grained tokens**.
2. Set token name, expiration (e.g. 90 days), and select specific repository access.
3. Grant minimal required permissions (e.g. `Contents: Read and write`).
4. Copy the generated token (`github_pat_...`) and store it in your password manager.

## Summary & Key Takeaways

- Passwords are deprecated for Git CLI operations; use SSH keys or Personal Access Tokens.
- Ed25519 (`ssh-keygen -t ed25519`) is the industry standard for SSH keys.
- Private keys stay securely on your machine; public keys are uploaded to GitHub.
- `ssh -T git@github.com` tests and confirms active SSH authentication.

## Best Practices & Senior Guidance

1. **Always Set a Passphrase on SSH Keys**: A passphrase encrypts your private key on disk, preventing unauthorized access if your laptop is lost or stolen.
2. **Never Commit SSH Keys or Tokens to Repositories**: If a token is committed accidentally, GitHub's Secret Scanning will detect it and revoke it immediately.
3. **Use Fine-Grained PATs with Expiration**: Avoid classic tokens with infinite lifespans and full account permissions; enforce least-privilege access.
