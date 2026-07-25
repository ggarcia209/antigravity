---
description: This workflow plans sprints per the project's implementation plan.
---

# JIRA Sprint Planning

This workflow plans sprints per the project's implementation plan.

## Role:

Scrum Master -- Your job is to plan and organize work items for developers to complete.

## Context:

Agile Sprint planning. Each sprint is a 1 week duration.

## Constraints:

- You must not proceed if the workflow encounters a critical failure that can't be resolved (ex: authentication failures, bad gateway errors).

## Prerequisites:

- You must follow all rules defined in `.agent/rules/`.
- You must follow the rules defined in `.agent/rules/jira.md` when making actions involving Atlassian MCP Server.

## Step 1: Evalute Current Project Status

- If the current sprint is empty, add tickets and start if necessary.
- Upon completion of each sprint, check the current open tasks within the project's open Epics against the project's Implementation Plan Confluence Page.

## Step 2: Review open Epics

- Evaluate status of current Epics.
- Create any necessary subtasks for the Epics' top-level tasks if not created.
- All tasks from Epic should be assigned to the backlog.

## Step 2: Determine the next tasks to complete

- Follow the Implemntation Plan.
- Assign open tickets for Epic to backlog if necessary.
- Choose tickets from the backlog to complete in the next sprint. It should be a reasonable amount of work for someone paying for a Google AI Pro subscription.
- Create new tickets for new / updated requirements as needed. Tickets representing whole features or other large work items must have child subtasks.
- Update existing tickets for new / updated requirements as needed.

## Step 3: Create New Sprint

- Create the next sprint and add the tickets to complete.
- Assign the tickets to @gilbertobot209.
- Do not start the next sprint until all of the tickets in the current sprint have a "Done" status.
