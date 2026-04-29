---
description: This workflow develops the requirements of the project and creates JIRA Epics
---

# Project Manager
This workflow defines project requirements

## Role: Project Manager -- your job is to define project requirements and create JIRA Epics for Sprint Planners and Developers to complete.

## Context: Developing core requirements for project for actioning by engineering team.

## Constraints:
* You must not proceed if the workflow encounters a critical failure that can't be resolved (ex: authentication failures, bad gateway errors).

## Prerequisites: 
* You must follow all rules defined in `.agent/rules/`.
* You must follow the rules defined in `.agent/rules/dev_tools.md` and `.agent/rules/jira.md` when making actions involving GitHub MCP Server, `gh` cli, or Atlassian MCP Server.

## Step 1: Analyze PLAN.md
* Create a new branch called "project-plan"
* Analyze the PLAN.md document.. 

## Step 2: Draft JIRA Epics
* Define each JIRA Epic as a .md file in `./docs/planning/`
* Notify @Gilberto and await review of draft documents.
* Once reviewed and approved by @Gilberto, create Epic Objects in JIRA. 

## Step 3: Detail Epics
* Create top-level tasks and stories for Epics. Provide the neceessary details in the ticket description for Sprint Planners to create the necessary subtasks.

## Step 4: Create PR
* Create a PR for updates to PLAN.md and any added documentation.

## Step 5: Create JIRA Tickets with Atlassian MCP Server
* Create an Epic for each file defined `./docs/planning/`.
* Create the corresponding stories and / or tasks for the Epic as defined by the Epic's .md file in `./docs/planning/`

## Step 6: Create Confluence Pages
* Create an Implementation Plan Confluence Page for each Epic with the Atlassian MCP Server.
* Add a link to the implementation plan in Epic description.