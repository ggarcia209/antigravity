# syntax=docker/dockerfile:1
# ===========================================================================
# Dockerfile Template — React SSR Lambda (Node.js)
#
# Two-stage build:
#   1. Build: Install deps via pnpm, prune devDependencies
#   2. Runtime: Copy artifacts into AWS Lambda Node.js runtime
#
# Expects dist/ to be pre-built and present in the build context
# (uploaded as a GitHub Actions artifact and downloaded before docker build).
#
# Placeholders:
#   ${NODE_ALPINE_IMAGE_SHA} — SHA256 of node:XX-alpine image
#   ${LAMBDA_NODE_IMAGE_SHA} — SHA256 of Lambda Node.js runtime image
#   ${PNPM_VERSION}          — pnpm version (e.g., 10.28.2)
#   ${LAMBDA_HANDLER}        — Lambda handler entrypoint (e.g., dist/lambda.handler)
# ===========================================================================

# Stage 1: Build & Prune
FROM node:24-alpine@sha256:${NODE_ALPINE_IMAGE_SHA} AS build

WORKDIR /app

# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate

# Copy package config and .npmrc first
COPY package.json pnpm-lock.yaml .npmrc ./

# Install dependencies using secret mount for authentication
RUN --mount=type=secret,id=NODE_AUTH_TOKEN,env=NODE_AUTH_TOKEN \
    pnpm install --frozen-lockfile

# Prune devDependencies to keep the production node_modules minimal
RUN --mount=type=secret,id=NODE_AUTH_TOKEN,env=NODE_AUTH_TOKEN \
    CI=true pnpm prune --prod

# Copy the pre-compiled dist folder from the build context
COPY dist ./dist

# Stage 2: Production Lambda Runner
FROM public.ecr.aws/lambda/nodejs:24@sha256:${LAMBDA_NODE_IMAGE_SHA} AS runner

# Append non-root user and group to passwd and group files for security
RUN echo "appgroup:x:1000:" >> /etc/group && \
    echo "appuser:x:1000:1000:appuser:/var/task:/sbin/nologin" >> /etc/passwd

WORKDIR /var/task

# Copy build artifacts, pruned node_modules, and package config
COPY --from=build --chown=appuser:appgroup /app/package.json ./package.json
COPY --from=build --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=build --chown=appuser:appgroup /app/dist ./dist

USER appuser

# Set AWS Lambda handler endpoint
CMD ["${LAMBDA_HANDLER}"]
