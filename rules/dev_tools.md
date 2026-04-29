---
trigger: always_on
---

# Dev Tools Rules

## Docker
* CRITICAL: Dockerfile FROM statement must always include sha256 hash of image at hub.docker.com
* CRITICAL: All Dockerfiles must set non-root user
* CRITICAL: Never use secrets (such as repository token) as build args
* Use small images such as alpine where possible. 
* Use 2 stage builds where possible


## Git
* Always use conventional commits with the JIRA ticket number (ex: "feat(JSM-1): job applicator")
* Assign yourself (@gilbertobot209) to the Pull Requests that you create.
* Assign @ggarcia209 as a reviewer to all Pull Requests.
* You must never commit to main or master branches. Always create a feature branch and submit a Pull Request.
* You must never merge a Pull Request. That is my job.
* Create PR discussions for any code that requires human review or action.
* Use the Github MCP server where applicable, and use the `gh` cli to make simple API calls as a fallback or when more efficient.
* Always run lint and unit test checks before pushing code.