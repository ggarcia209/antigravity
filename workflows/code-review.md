---
description: This workflow reviews a Pull Request and recommends changes to the PR before merging.
---

# Code Review

This workflow reviews a Pull Request and recommends changes to the PR before merging.

## Role:

Senior Engineer -- your job is to review each Pull Request before it is merged to main and make sure it is upheld to the highest standards in code quality, maintainability, and security.

## Context:

Reviewing code written by both human and LLM authors before merging to main.

## Prerequisites:

- You must follow all rules defined in `.agent/rules/`.
- You must follow the rules defined in `.agent/rules/dev_tools.md` and `.agent/rules/jira.md` when making actions involving GitHub MCP Server, `gh` cli, or Atlassian MCP Server.

## Constraints:

- You must not proceed if the workflow encounters a critical failure that can't be resolved (ex: authentication failures, bad gateway errors).
- Leave the JIRA ticket in "Code Review" status.
- Don't perform code review on generated files.

## Step 0: Code Review Conventions and Requirements

- Adhere to all of the following conventions and requirements when performing your code review:
- Code quality, security, and maintainability are of highest importance.
- Code should follow existing conventions within the project and software construction best practices. If existing conventions are poor, make note of what can be improved in a future JIRA ticket.
- New code must modular, future proof, and re-usable by other components within the application.
- Code must not be tightly coupled.
- New logic must not duplicate existing logic. The existing logic should be extracted to common package if necessary for re-use.
- Individual logical components must not be overly complex. Overly complex logic should be broken down into smaller logical components. For example, an extremely complex function should be composed of many smaller functions that may or may not be re-used in other parts of the package or application. Or, a complex React page should be simplified by extracting the logic into smaller component files that are imported into the page file.
- Bloat must be minimized under all circumstances.
- All new code must have sufficient unit test coverage.
- Code must be easily readable and maintable by human engineers.
- Code should be properly documented, both in-line and in docs files if necessary for major changes.
- All errors returning up the call stack must be wrapped with their caller's name. Ex:

```go
data, err := someFunc()
if err != nil {
    return fmt.Errorf("someFunc: %w", err)
}
```

## Step 1: Analyze PR

- Use the GitHub MCP server to get the PR under review.
- Read the PR description for context. Use the Atlassian MCP server to get the associated Jira ticket for additional context if needed.
- Analyze the PR diffs for code quality, formatting, logic errors, maintainability, and security.
- Ensure the code meets the requirements of the Jira ticket.

## Step 2: Create PR Comments

- For each change, add an inline comment describing the necessary or recommended fixes with justification. Tag @gilbertobot209 in the comment.

## Step 3: Create Summary

- Generate code review summary to read in Agent Manager UI
