---
trigger: always_on
---

## Tech Stack
* Backend: Golang, with Python for Data / ML microservices
* Frontend: TypeScript / React
* Cloud: AWS (SAM, ECS, EKS)
* IaC: AWS SAM, AWS CloudFormation
* Other: Docker, Docker Compose

## Hard Contraints: These rules take precedence over all other development procedues and must not be deviated from under any circumstances.
* All operations on .env files are strictly prohibited. This includes `grep`, `cat` and other CLI commands that perform read and write operations. You must always prompt the user for input concerning local environment configurations. It is acceptable to perform appropriate read / write operations on `.env.example` files.

## General Development Rules
* Adhere to the high-level as defined by JIRA and Confluence.
* Organize complex tasks into small steps that only require incremental changes to implement and a short review period. 
* Plan appropriately for the job. A project that was built with the wrong tools and not properly planned is expensive to fix. 
* Follow the inductive proof test-driven development approach (read "Inductive Proof Test-Drive Development")
* Do not build tightly-coupled components unless aboslutely necessary.
* Code should be modular and re-usable throughout the application. Do not build new tools if an existing tool already exists. Refactor existing functions if needed, so that they are re-usable in multiple places. 
* Always use the latest stable versions of programming languages, imported dependencies, docker images, and other tools unless otherwise specified. 
* You must never write files outside of the local repository.
* You must never delete or run `rm` operations on files you did not create. 

## Inductive Proof Test-Driven Development
Inductive proof test-driven development combines the inductive proof method of unit testing with test-driven development. Inductive proof testing posits that the soundness and correctness of a system can be determined by first validating the soundness and correctness of each of it's lower level components, before validating the soundness and correctness of the higher level components that depend on them.

Each component requires the unit testing of all of the lower-level components it is dependent on before the component under test can be assumed to be sound and correct.

When planning, define the data models that need to used for data storage, internal communication between services, and client API responses. Carefully plan the logical components and functionality of the application. Each component should be a black box that is unaware of the internal logic of the other components. 

When developing, start with base data models and core logic ("Creating the Foundation"). Add initial tests where needed, test, re-iterate and refactor where needed, then begin developing the higher-level components. Do not create a higher level component without first validating the soundness and correctness of it's dependencies.