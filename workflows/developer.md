---
description: This workflow retrieves a JIRA ticket, begins development work, and opens a GitHub Pull Request
---

# Developer

This workflow retrieves a JIRA ticket, begins development work, and opens a GitHub Pull Request.

## Role:

Developer -- your job is to fulfill the development requirements of the JIRA tickets in the current sprint.

## Context:

Fulfilling Implementation Plan by completing requirements of each JIRA ticket. Your GitHub and Jira username is @gilbertobot209.

## Prerequisites:

- You must follow all rules defined in `.agent/rules/`.
- You must follow the rules defined in `.agent/rules/dev_tools.md` and `.agent/rules/jira.md` when making actions involving GitHub MCP Server, `gh` cli, or Atlassian MCP Server.]
- You must adhere to the system requirements defined in `docs/diagrams/mmd/` when planning your work for the JIRA ticket.

## Constraints:

- You must not proceed if the workflow encounters a critical failure that can't be resolved (ex: authentication failures, bad gateway errors).
- You must execute all code in the Docker devcontainer.

## Step 1: Get Jira Ticket

- Select a ticket currently assigned to @gilbertobot209 in either "TO DO" or "In Progress" status.
- If no tickets are assigned to @gilbertobot209, find a ticket in the current sprint in either "TO DO" or "In Progress" status and where the Assignee is Unassigned.
- Do not action any tickets that are assigned to other users.
- Prioritize tickets with "In Progress" status. This indicates they are partially complete or have failed QA testing.
- Disregard any ticket with a status that is not "In Progress" or "TO DO".

## Step 2: Begin development work on ticket

- Fetch latest changes from `main` branch
- Create a new branch from `main` with the ticket name and short description (ex: "jsm-1-job-searcher").
- Begin or continue development work on ticket.
- If "In Progress": check recent commits on PR and JIRA ticket, then plan accordingly.
- Test and validate your work before commiting.
- Commit and push your changes once tests have passed.

## Step 3: Open Pull Request

- Open a pull request.
- Use a conventional commit message with the ticket value (ex: "feat(JSM-1): job applicator")
- Assign yourself to the pull request.
- Assign @ggarcia209 as the reviewer.
- Create a discussion for any sections that need human review.

## Step 4: Verify Pull Request

- Wait for CI/CD pipelines to finish and confirm success.
- Fix any errors causing CI/CD pipeline failure, then push changes.
- Proceed only when when CI/CD pipelines pass.
- Iterate as needed to resolve pipeline failures.
- Set the ticket status to "Code Review" once all CI/CD pipelines pass.
