---
description: This workflow retries a failed task.
---

# Code Review

This workflow retries a failed task.

## Context:

Retrying tasks that failed due to an agent error. Many times this occurs when trying to write large files or artifacts at one time. Tasks should be retried using an incremental, "buffered" approach.

## Prerequisites:

- You must follow all rules defined in `.agent/rules/`.
- You must follow the rules defined in `.agent/rules/dev_tools.md` and `.agent/rules/jira.md` when making actions involving GitHub MCP Server, `gh` cli, or Atlassian MCP Server.

## Constraints:

- You must not proceed if the workflow encounters a critical failure that can't be resolved (ex: authentication failures, bad gateway errors).

## Step 1: Break up the current task into smaller steps

- Files: if writing a new file, start by creating an empty file, then write to the file incrementally.
- Artifacts: as with files, initialize the artifact and incrementally update it one section at a time. Write the data incrementally to a temporary file in the local repository then copy to the artifact if necessary.
