# CI/CD Workflow Templates

This directory contains GitHub Actions workflow templates derived from production pipelines. Each template mirrors the full CI/CD pipeline of its reference project with project-specific values replaced by `${PLACEHOLDER}` notation.

## Prerequisites

### AWS Account — GitHub Actions OIDC

All templates authenticate with AWS using [OpenID Connect (OIDC)](https://docs.github.com/en/actions/security-for-github-actions/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services) instead of long-lived access keys. This requires a one-time setup in your AWS account:

#### 1. Create an IAM OIDC Identity Provider

Add GitHub as a trusted identity provider in your AWS account:

- **Provider URL**: `https://token.actions.githubusercontent.com`
- **Audience**: `sts.amazonaws.com`

```bash
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com \
  --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1
```

> 📖 [AWS Docs — Creating an OIDC Identity Provider](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc.html)

#### 2. Create an IAM Role with Trust Policy

Create an IAM role that GitHub Actions can assume. The trust policy restricts access to your specific GitHub org/repo:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::<AWS_ACCOUNT_ID>:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:<GITHUB_ORG>/<GITHUB_REPO>:*"
        }
      }
    }
  ]
}
```

Attach the IAM policies your workflows need (e.g., ECR push, Lambda update, S3 sync, CloudFront invalidation).

> **Tip**: Use separate roles per environment (`dev`, `stg`, `prod`) with least-privilege policies scoped to each environment's resources.

> 📖 [AWS Docs — Creating a Role for OIDC](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-idp_oidc.html)
> 📖 [GitHub Docs — Configuring OIDC in AWS](https://docs.github.com/en/actions/security-for-github-actions/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services)

#### 3. Configure GitHub Environments

In your GitHub repository settings, create environments (`dev`, `stg`, `prod`) and add:

- **Secret** `AWS_ROLE_ARN` — the IAM role ARN from step 2 (per-environment)
- **Variable** `AWS_REGION` — your AWS region (e.g., `us-west-2`)
- **Variable** `PROJECT` — your project name used in resource naming
- **Protection rules** — require reviewers for `prod` (optional for `stg`)

> 📖 [GitHub Docs — Using Environments for Deployment](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)

## Usage

1. Copy the desired `.yml` template into your project's `.github/workflows/` directory.
2. Replace all `${PLACEHOLDER_NAME}` values with your project-specific values (see table below).
3. Configure [GitHub Environments](https://docs.github.com/en/actions/deployment/targeting-different-environments) (`dev`, `stg`, `prod`) with appropriate protection rules.
4. Store sensitive values in [GitHub Actions Secrets](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions) and non-sensitive config in [GitHub Actions Variables](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/store-information-in-variables).
5. Commit and push to trigger the workflow.

## Placeholder Reference

### Common Placeholders

| Placeholder              | Description               | Example                      |
| ------------------------ | ------------------------- | ---------------------------- |
| `${NODE_VERSION}`        | Node.js version           | `24.12`                      |
| `${PNPM_VERSION}`        | pnpm version              | `10.28.2`                    |
| `${NPM_REGISTRY}`        | npm registry URL          | `https://npm.pkg.github.com` |
| `${NPM_SCOPE}`           | npm scope for `.npmrc`    | `@ggarcia209`                |
| `${SEMGREP_CONFIG_PATH}` | Path to Semgrep config    | `.semgrep/semgrep.yml`       |
| `${SEMGREP_SCAN_PATH}`   | Path to scan with Semgrep | `src/`                       |

### Go Backend Placeholders

| Placeholder                    | Description                              | Example             |
| ------------------------------ | ---------------------------------------- | ------------------- |
| `${GO_VERSION}`                | Go version                               | `1.25.5`            |
| `${DOCKERFILE_PATH}`           | Path to Dockerfile                       | `cmd/Dockerfile`    |
| `${SERVICE_NAME}`              | Service name for matrix                  | `api`               |
| `${ECR_REPO_DEV}`              | Dev ECR repository name                  | `my-service-dev`    |
| `${ECR_REPO_RELEASE}`          | Release ECR repository name              | `my-service`        |
| `${MAKE_LAMBDA_UPDATE_TARGET}` | Makefile target prefix for Lambda update | `aws-lambda-update` |

### React SPA Placeholders

| Placeholder             | Description                             | Example               |
| ----------------------- | --------------------------------------- | --------------------- |
| `${AWS_REGION}`         | AWS region (hardcoded in this template) | `us-west-2`           |
| `${MAKE_DEPLOY_TARGET}` | Makefile target for deploy              | `redeploy-app-env`    |
| `${VITE_DEV_DOMAIN}`    | Dev domain for env config               | `dev.example.com`     |
| `${VITE_STG_DOMAIN}`    | Staging domain for env config           | `stg.example.com`     |
| `${VITE_PROD_DOMAIN}`   | Production domain for env config        | `app.example.com`     |
| `${VITE_DEV_API_URL}`   | Dev API URL                             | `api.dev.example.com` |
| `${VITE_STG_API_URL}`   | Staging API URL                         | `api.stg.example.com` |
| `${VITE_PROD_API_URL}`  | Production API URL                      | `api.example.com`     |

### React SSR Placeholders

| Placeholder                    | Description                                | Example                 |
| ------------------------------ | ------------------------------------------ | ----------------------- |
| `${PROJECT_NAME}`              | Default project name fallback              | `my-project`            |
| `${DOCKERFILE_PATH}`           | Path to Lambda Dockerfile                  | `Dockerfile.lambda`     |
| `${CFN_EXPORT_SUFFIX}`         | CloudFormation export suffix for S3 bucket | `AppBucketName`         |
| `${MAKE_S3_SYNC_TARGET}`       | Makefile target for S3 sync                | `aws-s3-sync`           |
| `${MAKE_LAMBDA_UPDATE_TARGET}` | Makefile target for Lambda update          | `aws-lambda-update-ssr` |

## Templates

All templates include **Trivy** and **Semgrep** security gates that block all downstream jobs on failure.

| Template                                                     | Pipeline                                                                                                                           |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| [`npm-publish.yml`](npm-publish.yml)                         | Trivy → Semgrep → Install → Lint/Typecheck/Test → Semantic Release → Publish (+ PR dev publish)                                    |
| [`go-lambda-deploy.yml`](go-lambda-deploy.yml)               | Trivy → Semgrep → Detect Changes → Go Lint → Test → Build → Docker (ECR) → Deploy Dev → Release → Tag Release → Stg → Prod        |
| [`react-s3-deploy.yml`](react-s3-deploy.yml)                 | Trivy → Semgrep → Lint → Test → Build → Deploy Dev → Deploy Stg → Release & Deploy Prod                                            |
| [`react-ssr-lambda-deploy.yml`](react-ssr-lambda-deploy.yml) | Trivy → Semgrep → Install → Lint/Typecheck/Test → Build → Docker (ECR) → Deploy Dev → Release → Deploy Stg → Deploy Prod           |

> **Note**: All action versions are pinned to commit SHAs for supply-chain security. Version tags are included as comments for readability (e.g., `actions/checkout@<sha> # v7`).

## Docker Templates

The [`docker/`](../docker/) directory contains Dockerfile templates for CI builds:

| Dockerfile                                                       | Description                                                                   |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| [`go-lambda.Dockerfile`](../docker/go-lambda.Dockerfile)         | Two-stage Go build → AWS Lambda `provided:al2023-arm64` runtime               |
| [`react-ssr-lambda.Dockerfile`](../docker/react-ssr-lambda.Dockerfile) | Two-stage Node.js build → AWS Lambda `nodejs:24` runtime with pnpm + corepack |

Both templates follow these security practices:
- Base images pinned to `@sha256:` digests
- Non-root `appuser` (UID 1000)
- Multi-stage builds to minimize attack surface
- `${PLACEHOLDER}` notation for project-specific values

## AWS Credentials

All templates use [GitHub OIDC](https://docs.github.com/en/actions/security-for-github-actions/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services) with `aws-actions/configure-aws-credentials` for short-lived credentials. Set `AWS_ROLE_ARN` as a secret in each GitHub Environment (`dev`, `stg`, `prod`). Avoid long-lived access keys.

## GitHub Secrets & Variables Used

| Name           | Type                       | Description                                     |
| -------------- | -------------------------- | ----------------------------------------------- |
| `AWS_ROLE_ARN` | Secret (per-environment)   | IAM role ARN for OIDC authentication            |
| `AWS_REGION`   | Variable (per-environment) | AWS region                                      |
| `PROJECT`      | Variable                   | Project name used in resource naming            |
| `NPM_TOKEN`    | Secret                     | npm auth token (for private registries)         |
| `GITHUB_TOKEN` | Secret (automatic)         | GitHub-provided token for releases and packages |
