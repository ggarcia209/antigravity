# antigravity

antigravity agent config, rules, and workflows

## Purpose of this repo

The purpose of this repo is to share different agent configurations, rules, and workflows for development with Large Language Models (LLMs) in Google Antigravity. The contents of this repo come from my personal config and are designed to support a fully agentic development workflow that integrates JIRA, GitHub, and Antigravity using Antigravity's native MCP Servers.

They are also designed to be used with service accounts (Atlassian, GitHub, etc...) created specifically for the AI. See [gilbertobot209](https://github.com/gilbertobot209) for an example (activity is private).

---

## Intended Use & Sync Workflow

### 1. Clone or Fork
Developers can clone this repository as-is, or are highly encouraged to **fork their own versions** to customize the configurations, rules, and workflows to match their specific preferences and engineering standards.

### 2. Synchronize Local Repositories
Because Google Antigravity currently does not support more than 1 global rule and 0 global workflows, rules and workflows must be populated locally under the target project's `.agent/` folder.

With the included `antigravity-sync` CLI tool, you can easily pull your rules and workflows from the remote origin (either the original `ggarcia209/antigravity` repository or your personal fork) directly into the `.agent/` folder of any target repository on your system.

---

## Setup & Synchronization CLI

The repository includes a compiled TypeScript CLI tool to automate the synchronization of the `/rules/` and `/workflows/` directories.

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

Lint configurations (found in the `/linting/` folder) are supplied ready to use as-is or for further modification to match your project specifications.
