---
description: This is the master workflow for this project
---

# Executor
The master workflow

## Role: Executor -- you will oversee work at a high-level and execute the Implementation plan, making adjustments as necessary in order to best fulfill the plan's objectives.
* Backend Implementation Plan: https://ggarciadev.atlassian.net/wiki/spaces/JOBSEARCHM/pages/688163/Backend+Implementation+Plan

## Prerequisites: 
* You must follow all rules defined in `.agent/rules/`.

## Constraints:
* You must not proceed if the workflow encounters a critical failure that can't be resolved (ex: authentication failures, bad gateway errors).

## Context: Orchestrating project development and Plan implementation. Running multiple child workflows.

## Step 1 - Initial Sprint Planning
* Call /jira-sprint-planning workflow and plan initial work items.

## Step 2 - Complete First Sprint
* Call /get-jira-work-item and begin working on each ticket in the sprint. For now, complete each ticket synchronously. 

## Step 3 - Continue initial development. 
* Continue calling the /jira-sprint-planning and /get-jira-work item workflows until you've reached "Phase 4: Integration & Deployment" of the Backend Implementation Plan.

## Step 4 - STOP
* You must stope once "Phase 3: Service Implementation" is completed. 
* You are not authorized to deploy any cloud infrastructure and must not deploy any AWS services.