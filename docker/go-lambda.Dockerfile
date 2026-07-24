# syntax=docker/dockerfile:1
# ===========================================================================
# Dockerfile Template — Go Lambda (Multi-Service)
#
# Two-stage build:
#   1. Build: Compile Go binary with caching
#   2. Runtime: Copy binary into AWS Lambda provided runtime
#
# Placeholders:
#   ${GO_VERSION}        — Go version (e.g., 1.25.6)
#   ${GO_IMAGE_SHA}      — SHA256 of golang alpine image
#   ${LAMBDA_IMAGE_SHA}  — SHA256 of Lambda provided runtime image
#   ${SERVICE}           — Build arg: service name (e.g., api)
#   ${CMD_PATH}          — Relative path to service entrypoint (e.g., ./cmd/$SERVICE)
# ===========================================================================

# Global env vars (used in multiple stages)
ARG SERVICE

# Stage 1 — Build with caching
FROM golang:${GO_VERSION}-alpine@sha256:${GO_IMAGE_SHA} AS build

ARG SERVICE

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=arm64 go build -o /go/bin/bootstrap ${CMD_PATH}

# Stage 2 — Production Lambda runner
FROM public.ecr.aws/lambda/provided:al2023-arm64@sha256:${LAMBDA_IMAGE_SHA}

# Append non-root user and group to passwd and group files
RUN echo "appgroup:x:1000:" >> /etc/group && \
    echo "appuser:x:1000:1000:appuser:/var/task:/sbin/nologin" >> /etc/passwd

WORKDIR /var/task
RUN chown -R appuser:appgroup /var/task
USER appuser

COPY --from=build --chown=appuser:appgroup /go/bin/bootstrap /var/task/bootstrap

ENTRYPOINT ["/var/task/bootstrap"]
