---
trigger: always_on
---

# Atlassian JIRA and Confluence Rules

## Sprint Planning

- Assign a reasonable amount of tasks to each sprint. It is better to add more tasks to the current sprint upon completion of the existing tasks, than to move unfinished tasks to the next sprint.
- Assign priority accordingly. Critical bugs that break application functionality and security vulnerabilities are highest priority.

## Ticket creation

### General

- Add a clear, concise title for each ticket you create
- Add context, requirements, and precise instructions for each ticket's description.
- Leave the ticket as Unassigned
- Set the team to "Dev"
- Tickets should be created for work items that can be completed independently of eachother. However, link any tickets acting as dependencies or blockers when necessary.

### Epics

- Each Epic must have an Implementation Plan page in the project's Confluence space.
- Each Epic must have a corresponding Epic Overview Confluence page.
- Epics involving backend services or application infrastructure must have corresponding archtitecture diagrams and flow charts.
- Epics involving user interfaces must have design documentation.

### Stories

- Add user perspective to ticket context and requirements. For example, "As a user, I want <feature> so that I can do <action>".

### Tasks

- Tasks that represent large work items must contain smaller subtasks.

### Bugs

- Security vulnerabilities should be raised as bugs with the highest priority.

## Using JIRA for Development

- Follow the specifications and acceptance criteria outlined in the ticket while developing.
- Never begin development work on a new branch without referencing a JIRA ticket in the current sprint from the Atlassian MCP server.
