# Vibe Code Toolkit

A production-grade toolkit for **agent-driven software development**. Provides the guardrails, quality checks, and deployment automation that turn AI code generation ("vibe coding") into secure, reliable, and maintainable software.

## Overview

Vibe coding — letting an AI agent generate code from natural-language prompts — is fast but unconstrained. Speed without structure leads to drift: inconsistent patterns, unvetted dependencies, silent vulnerabilities, and deployment gaps. This toolkit closes those gaps by wrapping every agent session in a set of **rules**, **scanners**, **linters**, and **pipelines** that enforce the same standards a senior engineering team would.

The toolkit is designed to be cloned or synced into any repository, giving every project the same baseline from day one.

## Why Each Tool Matters

### 1. Agent Configuration — Rules & Workflows

**What it provides:** LLM agent rules and reusable workflows for Google Antigravity, with integrations for JIRA, GitHub, and Antigravity's native MCP Servers.

**Why it matters for vibe coding:** AI agents operate within whatever constraints you give them. Without explicit rules, every session starts from zero — the agent makes different architectural choices, naming conventions, and error-handling decisions each time. Agent rules act as **institutional memory**: they encode your team's conventions, security posture, and design patterns so the agent produces code that reads like it was written by someone who's been on the team for years. Workflows extend this further by codifying multi-step processes (code review, retry logic, issue triage) so the agent follows the same playbook every time.

📁 [`rules/`](rules/) · [`workflows/`](workflows/)

### 2. Security Scanning — Trivy & Semgrep

**What it provides:** Trivy for dependency vulnerability scanning, container image auditing, IaC misconfiguration detection, and secret leak detection. Semgrep for pattern-based static analysis (SAST) that catches insecure code patterns.

**Why it matters for vibe coding:** AI agents optimize for functionality, not security. They will happily use a library with a known CVE, hardcode a connection string, or write an SQL query without parameterization — because the prompt said "make it work," not "make it safe." Security scanning is the **automated second opinion** that catches what the agent won't. In every CI pipeline in this toolkit, Trivy and Semgrep run as **gate jobs** — if they fail, nothing else runs. This ensures that no AI-generated code reaches any environment without passing a security review, even when there's no human in the loop.

📁 [`security/`](security/)

### 3. Linting — Go, TypeScript + React, Python

**What it provides:** Pre-configured linters and formatters: golangci-lint (Go), ESLint + Prettier (TypeScript/React), and Ruff (Python).

**Why it matters for vibe coding:** Without linting, AI-generated code accumulates style drift across sessions — inconsistent imports, mixed formatting, unused variables, and subtle anti-patterns that compound into maintenance burden. Linters enforce **mechanical consistency**: the same rules apply whether the code was written by a human, an agent, or both. They also catch real bugs (shadowed variables, unchecked errors, unsafe type assertions) that agents tend to produce when optimizing for speed. By running linters in CI, every merge to `main` guarantees a codebase that any engineer — or agent — can read and extend without surprises.

📁 [`linting/`](linting/)

### 4. Automated Deployment — CI/CD Pipelines & Docker

**What it provides:** Four GitHub Actions workflow templates covering npm publish, Go Lambda, React SPA, and React SSR deployments — plus Dockerfile templates for containerized Lambda builds. All action versions are SHA-pinned, all pipelines include security gates, and all support multi-environment promotion (dev → staging → production).

**Why it matters for vibe coding:** The last mile of vibe coding is deployment. An agent can generate a feature, but without a pipeline, that feature lives in a branch forever. These templates make deployment **automatic and safe**: every push triggers security scans, tests, builds, and staged rollouts. Docker templates ensure that the runtime environment is reproducible and minimal (multi-stage, non-root, SHA-pinned base images). The multi-environment promotion chain with manual approval gates on production means you can let agents ship to dev and staging autonomously while keeping a human checkpoint before production — the right balance between speed and control.

📁 [`ci-cd/`](ci-cd/) · [`docker/`](docker/)

---

## Service Account Setup

These configurations are designed to be used with **dedicated service accounts** created specifically for the AI agent. A service account gives the agent its own identity across GitHub, JIRA, and other platforms — keeping its activity auditable, permission-scoped, and separate from human developer accounts.

See [gilbertobot209](https://github.com/gilbertobot209) for an example (activity is private).

### Step 1: Create a Service Account Email

Create a dedicated email address for the agent bot (e.g., `mybot@example.com`). This email will be the identity anchor for all downstream accounts. Use a shared mailbox or alias that your team can access for account recovery.

### Step 2: Register GitHub & JIRA Accounts

Create new accounts on each platform using the service account email:

- **GitHub** — Register at [github.com/signup](https://github.com/signup). Choose a bot-style username (e.g., `mybot-209`).
- **JIRA / Atlassian** — Register at [id.atlassian.com/signup](https://id.atlassian.com/signup). Use the same service email.

### Step 3: Grant Access to Repos & Projects

Add the service account to the resources it needs:

- **GitHub** — Invite the bot account as a collaborator (or org member) to each private repository it will work with. Grant `write` access at minimum for push, PR creation, and issue management.
- **JIRA** — Add the bot account to the relevant JIRA projects. Assign a role with permissions to create/edit issues, transition statuses, and add comments.

### Step 4: Configure SSH Key (GitHub)

Generate an SSH key for the service account and configure it for Git CLI operations:

```bash
# Generate a new SSH key (use the service account email)
ssh-keygen -t ed25519 -C "mybot@example.com" -f ~/.ssh/id_ed25519_bot

# Add to macOS Keychain
ssh-add --apple-use-keychain ~/.ssh/id_ed25519_bot

# Add to SSH config (~/.ssh/config)
cat >> ~/.ssh/config << 'EOF'
Host github.com-bot
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_bot
  IdentitiesOnly yes
EOF
```

Then add the **public key** (`~/.ssh/id_ed25519_bot.pub`) to the service account's GitHub Settings → [SSH Keys](https://github.com/settings/keys).

📖 [GitHub Docs — Adding a new SSH key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)

### Step 5 (Recommended): Configure GPG Key (GitHub)

A GPG key enables **signed commits**, which appear as "Verified" on GitHub. This is recommended so that agent-authored commits are cryptographically attributable to the bot account.

```bash
# Generate a new GPG key (use the service account email when prompted)
gpg --full-generate-key
# Select: (1) RSA and RSA, 4096 bits, no expiration

# List the key to get the key ID
gpg --list-secret-keys --keyid-format=long
# Output: sec   rsa4096/<KEY_ID> ...

# Export the public key
gpg --armor --export <KEY_ID>
# Copy the output (including -----BEGIN/END PGP PUBLIC KEY BLOCK-----)

# Configure Git to use the GPG key
git config --global user.signingkey <KEY_ID>
git config --global commit.gpgsign true
git config --global gpg.program gpg

# (macOS) Store passphrase in Keychain via gpg-agent
echo "pinentry-program /opt/homebrew/bin/pinentry-mac" >> ~/.gnupg/gpg-agent.conf
gpgconf --kill gpg-agent
```

Then add the **public key** to the service account's GitHub Settings → [GPG Keys](https://github.com/settings/keys).

📖 [GitHub Docs — Managing commit signature verification](https://docs.github.com/en/authentication/managing-commit-signature-verification)

## Repository Structure

```
├── rules/                  # Agent rules (Antigravity)
├── workflows/              # Agent workflows (Antigravity)
├── linting/
│   ├── go/                 # golangci-lint config
│   ├── typescript-react/   # ESLint + Prettier config
│   └── python/             # Ruff config
├── security/
│   ├── trivy.yaml          # Trivy scanner config
│   └── .semgrep/           # Semgrep custom rules (stub)
├── ci-cd/                  # GitHub Actions workflow templates
├── docker/                 # Dockerfile templates for CI builds
└── src/                    # antigravity-sync CLI source
```

---

## Sync CLI

The repository includes a compiled TypeScript CLI tool to synchronize the `/rules/` and `/workflows/` directories into the `.agent/` folder of any target repository for use with Google Antigravity.

### Installation

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Compile the CLI tool:

   ```bash
   pnpm build
   ```

3. Install/link the CLI tool globally to run it from anywhere:
   ```bash
   pnpm link --global
   ```

### Running the Syncer

Navigate to the repository you want to sync rules into, and run:

```bash
# Sync using defaults (clones from main branch of ggarcia209/antigravity)
antigravity-sync

# Sync into a specific directory path
antigravity-sync /path/to/other/local/repo

# Sync from your custom fork and branch
antigravity-sync --repo git@github.com:your-username/antigravity.git --branch custom-rules-branch
```

---

## Lint Configurations

Lint configurations in the `/linting/` directory are supplied ready to use as-is or for further modification to match your project specifications. Copy the relevant config files into your project.

### Go — golangci-lint

**Config**: [`linting/go/.golangci.yml`](linting/go/.golangci.yml)

Install `golangci-lint`:

```bash
# macOS
brew install golangci-lint

# Go install
go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest
```

Run:

```bash
golangci-lint run
```

📖 [golangci-lint Documentation](https://golangci-lint.run/)

### TypeScript + React — ESLint & Prettier

**Config**: [`linting/typescript-react/`](linting/typescript-react/)

Install dependencies (from the config directory or merge into your project's `package.json`):

```bash
pnpm install
```

Run:

```bash
# Lint
pnpm run lint

# Format
pnpm run format

# Type check
pnpm run typecheck

# All checks
pnpm run precheck
```

📖 [ESLint Documentation](https://eslint.org/) · [Prettier Documentation](https://prettier.io/)

### Python — Ruff

**Config**: [`linting/python/ruff.toml`](linting/python/ruff.toml)

Install `ruff`:

```bash
# macOS
brew install ruff

# pip
pip install ruff
```

Run:

```bash
# Lint
ruff check --config linting/python/ruff.toml .

# Format
ruff format --config linting/python/ruff.toml .

# Lint + auto-fix
ruff check --config linting/python/ruff.toml --fix .
```

📖 [Ruff Documentation](https://docs.astral.sh/ruff/)

---

## Security Scanning

Security tool configurations and documentation are in the `/security/` directory. See [`security/README.md`](security/README.md) for full installation instructions, usage examples, and links to official documentation.

### Trivy

**Config**: [`security/trivy.yaml`](security/trivy.yaml)

A comprehensive vulnerability scanner for filesystem dependencies, container images, IaC misconfigurations, and exposed secrets.

```bash
# Quick start
brew install trivy
trivy fs --config security/trivy.yaml .
```

📖 [Trivy Documentation](https://aquasecurity.github.io/trivy/)

### Semgrep

**Config**: [`security/.semgrep/semgrep.yaml`](security/.semgrep/semgrep.yaml)

A pattern-based static analysis engine (SAST) for finding security vulnerabilities and enforcing code standards. The included config is a starter rules file — see [`security/README.md`](security/README.md) for usage instructions.

```bash
# Quick start
brew install semgrep
semgrep scan --config security/.semgrep/semgrep.yaml --config p/default
```

📖 [Semgrep Documentation](https://semgrep.dev/docs/)

---

## CI/CD Templates

GitHub Actions workflow templates are in the `/ci-cd/` directory. See [`ci-cd/README.md`](ci-cd/README.md) for the full placeholder reference table and usage instructions.

### Available Templates

| Template                                                           | Description                             |
| ------------------------------------------------------------------ | --------------------------------------- |
| [`npm-publish.yml`](ci-cd/npm-publish.yml)                         | Publish npm package to a registry       |
| [`go-lambda-deploy.yml`](ci-cd/go-lambda-deploy.yml)               | Deploy Go backend to AWS ECR + Lambda   |
| [`react-s3-deploy.yml`](ci-cd/react-s3-deploy.yml)                 | Deploy React SPA to AWS S3 + CloudFront |
| [`react-ssr-lambda-deploy.yml`](ci-cd/react-ssr-lambda-deploy.yml) | Deploy React SSR to AWS Lambda + S3     |

### Quick Start

1. Copy the desired template into `.github/workflows/`
2. Replace `${PLACEHOLDER}` values with your project-specific values
3. Configure AWS OIDC and GitHub Actions secrets
4. Commit and push

## TODO:

- Add custom MCP server template
- Add templates for local unit testing
- Add integration testing to CI/CD pipelines (grafana k6, playwright)
- Add parallelized, loop driven agentic workflows (develop -> code review -> code review fix)
- Add CI/CD template for AWS ECS Fargate deployment
- Add AWS Cloudformation infrastructure examples (GitHub OIDC, SAM, ECS Fargate, React SPA, etc...)

---

## License

See [LICENSE](LICENSE) for details.
