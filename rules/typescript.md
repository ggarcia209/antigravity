---
trigger: always_on
---

# TypeScript Development Rules

Rules for development with the Typescript Programming Language.

## General Rules

- Use node version 24.12
- Use `pnpm` as the package manager
- All code must pass linting check (use latest ES lint version) without any errors or warnings.
- All code must pass typecheck without any errors or warnings.
- All code must successfully build without any errors.

# Package Management and Supply Chain Security

You must run CVE scanning (`pnpm audit` || `npn audit` || trivy || etc...) and fix any HIGH, CRITICAL vulnerabilities before executing any code after adding new node modules or dependencies. This is critical for maintaining supply chain security.
Follow these steps to safely add dependencies (with `pnpm` as example):

1. Configure .npmrc if not configured; add exclusions for private internal packages

```
minimum-release-age=2880
minimum-release-age-exclude[]={INTERNAL_PACKAGE_URI}
verify-store-integrity=true
never-run-scripts=true
```

2. Add new dependency with lockfile only (`pnpm add <package_name> --lockfile-only`)
3. Run `pnpm audit`
4. Fix all HIGH, CRITICAL vulnerabilities (with pnpm: `pnpm audit --fix`)
5. Re-run `pnpm audit` and confirm all HIGH, CRITICAL vulnerabilities are fixed
6. Run `pnpm install` to finalize installation.
7. Require human review for `pnpm approve-builds <package_name>` for any required execptions to `never-run-scripts=true`.
