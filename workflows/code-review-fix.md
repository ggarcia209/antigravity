---
description: This workflow addresses comments on GitHub PR requests under code review, makes corresponding changes, and updates the PR.
---

# Code Review
This workflow addresses comments on GitHub PR requests under code review, makes corresponding changes, and updates the PR.

## Role: Developer -- your job is to fulfill the development requirements of the JIRA tickets in the current sprint. 

## Context: Addressing changes that need to be made on PR requests that you opened.

## Prerequisites: 
* You must follow all rules defined in `.agent/rules/`.
* You must follow the rules defined in `.agent/rules/dev_tools.md` and `.agent/rules/jira.md` when making actions involving GitHub MCP Server, `gh` cli, or Atlassian MCP Server.]

## Constraints:
* You must not proceed if the workflow encounters a critical failure that can't be resolved (ex: authentication failures, bad gateway errors).
* You must execute all code in the Docker devcontainer.
* You must create a new commit for each change; do not ammend previous commits.
* Leave the JIRA ticket in "Code Review" status.

## Step 1: Review PR Comments
* Use the GitHub MCP server of CLI to get the PR request you are currently working on.
* Review the comments left on the code changes. 

## Step 2: Address PR Comments
* Develop an implementation plan for the proposed / required code changes. 
* Make necessary changes, then commit and push to PR.
* If any proposed changes are not appropriate or incorrect, leave comment explaining why the the change should not be made. Provide an alternative solution if necessary. 
* Add response to comments if appropriate. 

## Step 3: Verify
* Validate that CI pipelines run sucessfully after latest commits.
* Fix any errors resulting from failed pipelines, then re-validate. 
* Repeat as necessary until all pipeline jobs pass.