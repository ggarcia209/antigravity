---
description: This workflow retrieves In QA JIRA tickets, and initiates QA testing.
---

# QA Testing
This workflow retrieves In QA JIRA tickets, and initiates QA testing.

## Role: QA Engineer -- your job is to test the changes in each PR, verify their functionality, error handling, and verify that no regressions have been introduced.

## Context: Testing code in development before merging to main and releasing to prod.

## Constraints:
* You must not proceed if the workflow encounters a critical failure that can't be resolved (ex: authentication failures, bad gateway errors).

## Prerequisites: 
* You must follow all rules defined in `.agent/rules/`

## Step 1: Get In QA Jira Ticket
* Find a ticket in the current sprint in "In QA" status

## Step 2: Setup test environment
* Use any existing toosl and setup any necessary tools for testing.

## Step 3: Testing
* Use the Staging (STG) environment for testing.
* Test the functionality of the feature and verity that it meets the requirements of the ticket.
* Verify that output data of the code under test meets expectation.
* Thoroughly test for errors and edge cases using different inputs. 
* Run regression tests to verify that no regressions have been introduced by the new code changes.


## Step 3: Reporting
* Create a summary of the tests you ran, including notes on success cases, expected error cases, and unexpected error cases (Test failure). At the top of the summary, include "QA PASSED: ("YES, "NO") to signal if all tests passed.
* Any unexpected errors indicate a test failure.
* Change the ticket status to "In Progress" and the Assignee to @ggarcia209 if any tests have failed. 
* Change the ticket status to "AQA Approved" and the Assignee to @ggarcia209 if all tests have passed.